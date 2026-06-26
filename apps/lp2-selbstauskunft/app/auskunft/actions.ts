"use server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { notifySelbstauskunftEingereicht } from "@/lib/n8n";
import { isLp2TokenExpired } from "@/lib/token";
import type { InseratTyp, KaufFormData, MieteFormData } from "@/lib/types";
import {
  deriveArbeitsverhaeltnis,
  jaNeinToBoolean,
  mapBeschaeftigungToDb,
} from "@/lib/types";

export type SubmitSelbstauskunftInput = {
  lp2Token: string;
  typ: InseratTyp;
  miete?: MieteFormData;
  kauf?: KaufFormData;
};

export type SubmitResult =
  | { ok: true; success: { name: string } }
  | { ok: false; error: string };

const ALLOWED_STATUSES = new Set([
  "besichtigung_stattgefunden",
  "selbstauskunft_angefordert",
]);

export async function submitSelbstauskunft(
  input: SubmitSelbstauskunftInput,
): Promise<SubmitResult> {
  const token = input.lp2Token?.trim();
  if (!token) return { ok: false, error: "Ungültiger Link." };

  const supabase = getSupabaseAdmin();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("lp2_token", token)
    .maybeSingle();

  if (leadError || !lead) return { ok: false, error: "Link ungültig oder abgelaufen." };

  if (isLp2TokenExpired(lead)) {
    return { ok: false, error: "Link abgelaufen. Bitte kontaktieren Sie uns." };
  }

  if (lead.status === "selbstauskunft_eingereicht") {
    return { ok: false, error: "Selbstauskunft wurde bereits eingereicht." };
  }

  if (!ALLOWED_STATUSES.has(lead.status)) {
    return { ok: false, error: "Dieser Link ist derzeit nicht aktiv." };
  }

  const { data: existing } = await supabase
    .from("selbstauskuenfte")
    .select("id")
    .eq("lead_id", lead.id)
    .maybeSingle();

  if (existing) return { ok: false, error: "Selbstauskunft wurde bereits eingereicht." };

  const { data: inserat, error: inseratError } = await supabase
    .from("inserate")
    .select("*")
    .eq("is24_inserat_id", lead.inserat_id)
    .maybeSingle();

  if (inseratError || !inserat) {
    return { ok: false, error: "Inserat konnte nicht geladen werden." };
  }

  if (inserat.typ !== input.typ) {
    return { ok: false, error: "Formulartyp stimmt nicht mit dem Inserat überein." };
  }

  const now = new Date().toISOString();
  let insertRow: Record<string, unknown>;
  let contactUpdate: { name: string; email: string; telefon: string } | null = null;

  if (input.typ === "miete") {
    const m = input.miete;
    if (!m) return { ok: false, error: "Formulardaten fehlen." };
    if (!m.dsgvo_accepted || !m.angaben_wahrheitsgemaess) {
      return { ok: false, error: "Bitte bestätigen Sie Datenschutz und Wahrheitsangaben." };
    }

    const haushalt = m.haushaltsgroesse === "8+" ? 8 : Number(m.haushaltsgroesse);

    contactUpdate = {
      name: m.name.trim(),
      email: m.email.trim(),
      telefon: m.telefon.trim(),
    };

    insertRow = {
      lead_id: lead.id,
      inserat_id: inserat.id,
      aktuelle_adresse: m.aktuelle_adresse.trim(),
      nettoeinkommen_eur: Number(m.nettoeinkommen_eur),
      beschaeftigung_status: mapBeschaeftigungToDb(m.beschaeftigung_status),
      arbeitgeber: m.arbeitgeber || null,
      angestellt_seit: m.angestellt_seit || null,
      arbeitsverhaeltnis: deriveArbeitsverhaeltnis(m.beschaeftigung_status),
      haushaltsgroesse: haushalt,
      haustiere: m.haustiere === "ja",
      haustiere_art: m.haustiere === "ja" ? m.haustiere_art : null,
      einzugstermin: m.einzugstermin,
      insolvenzverfahren_laufend: jaNeinToBoolean(m.insolvenzverfahren),
      raeumungstitel_5_jahre: jaNeinToBoolean(m.raeumungstitel_5_jahre),
      warum_diese_wohnung: m.warum_diese_wohnung.trim(),
      sonstige_angaben: m.sonstige_angaben.trim() || null,
      dsgvo_accepted: true,
      dsgvo_accepted_at: now,
      angaben_wahrheitsgemaess: true,
      angaben_wahrheitsgemaess_at: now,
    };
  } else {
    const k = input.kauf;
    if (!k) return { ok: false, error: "Formulardaten fehlen." };
    if (!k.dsgvo_accepted || !k.angaben_wahrheitsgemaess) {
      return { ok: false, error: "Bitte bestätigen Sie Datenschutz und Wahrheitsangaben." };
    }

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
      angaben_wahrheitsgemaess: true,
      angaben_wahrheitsgemaess_at: now,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("selbstauskuenfte")
    .insert(insertRow)
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("selbstauskuenfte insert failed:", insertError);
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }

  const leadPatch: Record<string, unknown> = { status: "selbstauskunft_eingereicht" };
  if (contactUpdate) {
    leadPatch.name = contactUpdate.name;
    leadPatch.email = contactUpdate.email;
    leadPatch.telefon = contactUpdate.telefon;
  }

  const { error: updateError } = await supabase
    .from("leads")
    .update(leadPatch)
    .eq("id", lead.id);

  if (updateError) {
    console.error("lead update failed:", updateError);
    await supabase.from("selbstauskuenfte").delete().eq("id", inserted.id);
    return { ok: false, error: "Aktualisierung fehlgeschlagen. Bitte versuchen Sie es erneut." };
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

  const displayName = contactUpdate?.name ?? lead.name;
  return { ok: true, success: { name: displayName } };
}
