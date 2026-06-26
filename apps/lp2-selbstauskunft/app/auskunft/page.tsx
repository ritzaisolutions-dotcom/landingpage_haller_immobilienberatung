import { StateScreen } from "@/components/StateScreen";
import { SelbstauskunftForm } from "@/app/auskunft/SelbstauskunftForm";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabaseAdmin";
import { isLp2TokenExpired } from "@/lib/token";
import type { Inserat, Lead } from "@/lib/types";

type AuskunftPageProps = {
  searchParams: { t?: string };
};

const ALLOWED_STATUSES = new Set([
  "besichtigung_stattgefunden",
  "selbstauskunft_angefordert",
]);

export default async function AuskunftPage({ searchParams }: AuskunftPageProps) {
  const token = searchParams.t?.trim();

  if (!token) {
    return (
      <StateScreen
        variant="invalid"
        title="Link ungültig"
        message="Bitte verwenden Sie den persönlichen Link aus Ihrer Nachricht."
      />
    );
  }

  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const supabase = getSupabaseAdmin();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("lp2_token", token)
    .maybeSingle();

  if (leadError || !lead) {
    return (
      <StateScreen
        variant="invalid"
        title="Link ungültig"
        message="Dieser Link ist nicht gültig. Bitte wenden Sie sich an Haller Immobilienberatung."
      />
    );
  }

  const typedLead = lead as Lead;

  if (isLp2TokenExpired(typedLead)) {
    return (
      <StateScreen
        variant="expired"
        title="Link abgelaufen"
        message="Ihr Link ist älter als 7 Tage. Bitte kontaktieren Sie uns für einen neuen Zugang."
      />
    );
  }

  if (typedLead.status === "selbstauskunft_eingereicht") {
    return <StateScreen variant="already_submitted" />;
  }

  const { data: existingSa } = await supabase
    .from("selbstauskuenfte")
    .select("id")
    .eq("lead_id", typedLead.id)
    .maybeSingle();

  if (existingSa) {
    return <StateScreen variant="already_submitted" />;
  }

  if (!ALLOWED_STATUSES.has(typedLead.status)) {
    return (
      <StateScreen
        variant="invalid"
        title="Link nicht aktiv"
        message="Diese Selbstauskunft kann derzeit nicht ausgefüllt werden. Bitte kontaktieren Sie uns."
      />
    );
  }

  const { data: inserat, error: inseratError } = await supabase
    .from("inserate")
    .select("*")
    .eq("is24_inserat_id", typedLead.inserat_id)
    .maybeSingle();

  if (inseratError || !inserat) {
    return (
      <StateScreen
        variant="invalid"
        title="Inserat nicht gefunden"
        message="Das zugehörige Inserat konnte nicht geladen werden."
      />
    );
  }

  const typedInserat = inserat as Inserat;
  const typ = typedInserat.typ === "verkauf" ? "verkauf" : "miete";

  return (
    <SelbstauskunftForm
      lp2Token={token}
      leadName={typedLead.name}
      leadEmail={typedLead.email ?? ""}
      leadTelefon={typedLead.telefon ?? ""}
      inserat={typedInserat}
      typ={typ}
    />
  );
}
