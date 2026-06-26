import { LpShell } from "@/components/LpShell";
import { StateScreen } from "@/components/StateScreen";
import { BookingForm } from "@/app/termin/BookingForm";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabase/admin";
import { filterBookableSlots } from "@/lib/slots";
import { todayISO } from "@/lib/format";
import { isLp1TokenExpired } from "@/lib/token";
import type { Besichtigungsslot, Inserat, Lead } from "@/lib/types";

type TerminPageProps = {
  searchParams: { t?: string };
};

export default async function TerminPage({ searchParams }: TerminPageProps) {
  const token = searchParams.t?.trim();

  if (!token) {
    return (
      <LpShell>
        <StateScreen
          variant="invalid"
          title="Link ungültig oder abgelaufen"
          message="Bitte verwenden Sie den persönlichen Link aus Ihrer Nachricht."
        />
      </LpShell>
    );
  }

  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const supabase = getSupabaseAdmin();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("lp1_token", token)
    .maybeSingle();

  if (leadError || !lead) {
    return (
      <LpShell>
        <StateScreen
          variant="invalid"
          title="Link ungültig oder abgelaufen"
          message="Dieser Buchungslink ist nicht gültig. Bitte wenden Sie sich an Haller Immobilienberatung."
        />
      </LpShell>
    );
  }

  const typedLead = lead as Lead;

  if (isLp1TokenExpired(typedLead)) {
    return (
      <LpShell>
        <StateScreen
          variant="expired"
          title="Link abgelaufen"
          message="Ihr Buchungslink ist älter als 72 Stunden. Bitte kontaktieren Sie uns für einen neuen Termin."
        />
      </LpShell>
    );
  }

  if (typedLead.status === "termin_gebucht") {
    const { data: bookedSlot } = await supabase
      .from("besichtigungsslots")
      .select("*")
      .eq("reserviert_lead_uuid", typedLead.uuid)
      .order("datum", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (
      <LpShell>
        <StateScreen
          variant="already_booked"
          slot={bookedSlot as Besichtigungsslot | undefined}
          terminGebuchtAt={typedLead.termin_gebucht_at}
        />
      </LpShell>
    );
  }

  const { data: inserat, error: inseratError } = await supabase
    .from("inserate")
    .select("*")
    .eq("is24_inserat_id", typedLead.inserat_id)
    .maybeSingle();

  if (inseratError || !inserat) {
    throw new Error("Inserat konnte nicht geladen werden.");
  }

  const { data: buchungsfenster } = await supabase
    .from("buchungsfenster")
    .select("vorlaufzeit_stunden")
    .eq("inserat_id", inserat.id)
    .eq("aktiv", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const vorlaufzeit = buchungsfenster?.vorlaufzeit_stunden ?? 2;

  const { data: slots, error: slotsError } = await supabase
    .from("besichtigungsslots")
    .select("*")
    .eq("inserat_id", inserat.id)
    .gte("datum", todayISO())
    .eq("slot_status", "frei")
    .eq("belegt", 0)
    .order("datum", { ascending: true })
    .order("uhrzeit", { ascending: true });

  if (slotsError) {
    throw new Error("Termine konnten nicht geladen werden.");
  }

  const availableSlots = filterBookableSlots(
    (slots as Besichtigungsslot[]) ?? [],
    vorlaufzeit,
  );

  return (
    <LpShell>
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold text-lp-text">Besichtigungstermin buchen</h1>
        <p className="mt-1 text-sm text-lp-muted">
          Wählen Sie einen passenden Termin für Ihre Besichtigung.
        </p>
      </div>
      <BookingForm
        token={token}
        lead={typedLead}
        inserat={inserat as Inserat}
        slots={availableSlots}
      />
    </LpShell>
  );
}
