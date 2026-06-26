"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { notifySelbstauskunftEingereicht } from "@/lib/n8n";
import { isLp2TokenExpired } from "@/lib/token";
import type { InseratTyp, KaufFormData, MieteFormData } from "@/lib/types";
import {
  deriveArbeitsverhaeltnis,
  mapBeschaeftigungToDb,
} from "@/lib/types";

export type SubmitSelbstauskunftInput = {
  lp2Token: string;
  typ: InseratTyp;
  miete?: MieteFormData;
  kauf?: KaufFormData;
};

export type SubmitResult = { error: string } | void;

const ALLOWED_STATUSES = new Set([
  "besichtigung_stattgefunden",
  "selbstauskunft_angefordert",
]);

export async function submitSelbstauskunft(
  input: SubmitSelbstauskunftInput,
): Promise<SubmitResult> {
  const token = input.lp2Token?.trim();
  if (!token) return { error: "Ungültiger Link." };

  const supabase = getSupabaseAdmin();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("lp2_token", token)
    .maybeSingle();

  if (leadError || !lead) return { error: "Link ungültig oder abgelaufen." };

  if (isLp2TokenExpired(lead)) {
    return { error: "Link abgelaufen. Bitte kontaktieren Sie uns." };
  }

  if (lead.status === "selbstauskunft_eingereicht") {
    return { error: "Selbstauskunft wurde bereits eingereicht." };
  }

  if (!ALLOWED_STATUSES.has(lead.status)) {
    return { error: "Dieser Link ist derzeit nicht aktiv." };
  }

  const { data: existing } = await supabase
    .from("selbstauskuenfte")
    .select("id")
    .eq("lead_id", lead.id)
    .maybeSingle();

  if (existing) return { error: "Selbstauskunft wurde bereits eingereicht." };

  const { data: inserat, error: inseratError } = await supabase
    .from("inserate")
    .select("*")
    .eq("is24_inserat_id", lead.inserat_id)
    .maybeSingle();

  if (inseratError || !inserat) {
    return { error: "Inserat konnte nicht geladen werden." };
  }

  if (inserat.typ !== input.typ) {
    return { error: "Formulartyp stimmt nicht mit dem Inserat überein." };
  }

  const now = new Date().toISOString();
  let insertRow: Record<string, unknown>;

  if (input.typ === "miete") {
    const m = input.miete;
    if (!m) return { error: "Formulardaten fehlen." };

    const haushalt = m.haushaltsgroesse === "8+" ? 8 : Number(m.haushaltsgroesse);

    insertRow = {
      lead_id: lead.id,
      inserat_id: inserat.id,
      nettoeinkommen_eur: Number(m.nettoeinkommen_eur),
      beschaeftigung_status: mapBeschaeftigungToDb(m.beschaeftigung_status),
      arbeitgeber: m.arbeitgeber || null,
      angestellt_seit: m.angestellt_seit || null,
      arbeitsverhaeltnis: deriveArbeitsverhaeltnis(m.beschaeftigung_status),
      haushaltsgroesse: haushalt,
      haustiere: m.haustiere === "ja",
      haustiere_art: m.haustiere === "ja" ? m.haustiere_art : null,
      einzugstermin: m.einzugstermin,
      warum_diese_wohnung: m.warum_diese_wohnung.trim(),
      sonstige_angaben: m.sonstige_angaben.trim() || null,
      dsgvo_accepted: true,
      dsgvo_accepted_at: now,
    };
  } else {
    const k = input.kauf;
    if (!k) return { error: "Formulardaten fehlen." };

    insertRow = {
      lead_id: lead.id,
      inserat_id: inserat.id,
      kaufbudget_eur: Number(k.kaufbudget_eur),
      eigenkapital_vorhanden: k.eigenkapital_vorhanden,
      eigenkapital_hoehe_eur: k.eigenkapital_hoehe_eur
        ? Number(k.eigenkapital_hoehe_eur)
        : null,
      finanzierung_typ: k.finanzierung_typ,
      finanzierungsbestaetigung: k.finanzierungsbestaetigung,
      kaufzeitraum: k.kaufzeitraum,
      kaufgrund: k.kaufgrund,
      in_laufendem_verkauf: k.in_laufendem_verkauf === "ja",
      sonstige_angaben: k.sonstige_angaben.trim() || null,
      dsgvo_accepted: true,
      dsgvo_accepted_at: now,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("selbstauskuenfte")
    .insert(insertRow)
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("selbstauskuenfte insert failed:", insertError);
    return { error: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  const { error: updateError } = await supabase
    .from("leads")
    .update({ status: "selbstauskunft_eingereicht" })
    .eq("id", lead.id);

  if (updateError) {
    console.error("lead update failed:", updateError);
    await supabase.from("selbstauskuenfte").delete().eq("id", inserted.id);
    return { error: "Aktualisierung fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  const webhook = await notifySelbstauskunftEingereicht({
    leadUuid: lead.uuid,
    selbstauskunftId: inserted.id,
    inseratId: lead.inserat_id,
    inseratUuid: inserat.id,
    typ: input.typ,
    persistedByLp2: true,
  });

  if (!webhook.ok) {
    console.error("n8n selbstauskunft-eingereicht webhook failed", webhook.status);
  }

  redirect(`/auskunft/success?name=${encodeURIComponent(lead.name)}`);
}
