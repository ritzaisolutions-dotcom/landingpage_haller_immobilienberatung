"use client";

import { Link2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BesichtigungCard } from "@/components/BesichtigungCard";
import { ManualLp1LinkModal } from "@/components/ManualLp1LinkModal";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { isThisWeek, isToday } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { BesichtigungFilter, Besichtigungsslot, Inserat, Lead } from "@/lib/types";

const FILTERS: { value: BesichtigungFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "today", label: "Heute" },
  { value: "week", label: "Diese Woche" },
  { value: "pending", label: "Ausstehend" },
  { value: "done", label: "Stattgefunden" },
];

export default function BesichtigungenPage() {
  const params = useParams();
  const inseratId = params.id as string;

  const [inserat, setInserat] = useState<Inserat | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [slots, setSlots] = useState<Besichtigungsslot[]>([]);
  const [filter, setFilter] = useState<BesichtigungFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lp1ModalOpen, setLp1ModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const inseratRes = await supabase.from("inserate").select("*").eq("id", inseratId).single();
    if (inseratRes.error) {
      setError(inseratRes.error.message);
      setLoading(false);
      return;
    }
    const ins = inseratRes.data as Inserat;
    setInserat(ins);

    const [leadsRes, slotsRes] = await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .eq("inserat_id", ins.is24_inserat_id)
        .in("status", [
          "termin_gebucht",
          "besichtigung_stattgefunden",
          "selbstauskunft_angefordert",
          "selbstauskunft_eingereicht",
        ])
        .order("termin_gebucht_at", { ascending: false }),
      supabase
        .from("besichtigungsslots")
        .select("*")
        .eq("inserat_id", inseratId)
        .order("datum", { ascending: true }),
    ]);

    if (leadsRes.error) setError(leadsRes.error.message);
    else setLeads((leadsRes.data as Lead[]) ?? []);

    if (slotsRes.error) setError(slotsRes.error.message);
    else setSlots((slotsRes.data as Besichtigungsslot[]) ?? []);

    setLoading(false);
  }, [inseratId]);

  useEffect(() => {
    load();
  }, [load]);

  const slotByLeadUuid = useMemo(() => {
    const map = new Map<string, Besichtigungsslot>();
    for (const slot of slots) {
      if (slot.reserviert_lead_uuid) {
        map.set(slot.reserviert_lead_uuid, slot);
      }
    }
    return map;
  }, [slots]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const slot = slotByLeadUuid.get(lead.uuid);
      const datum = slot?.datum;

      switch (filter) {
        case "today":
          return datum ? isToday(datum) : false;
        case "week":
          return datum ? isThisWeek(datum) : false;
        case "pending":
          return !lead.besichtigung_stattgefunden && lead.status === "termin_gebucht";
        case "done":
          return lead.besichtigung_stattgefunden;
        default:
          return true;
      }
    });
  }, [leads, filter, slotByLeadUuid]);

  if (error) return <ErrorCard message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-pill px-3 py-1 text-xs ${
              filter === f.value
                ? "bg-dash-accent text-white"
                : "border border-dash-border text-dash-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setLp1ModalOpen(true)}
          className="ml-auto flex items-center gap-1.5 rounded-pill border border-dash-accent px-3 py-1 text-xs text-dash-accent hover:bg-dash-accent/10"
        >
          <Link2 className="h-3.5 w-3.5" />
          LP1-Link manuell erstellen
        </button>
      </div>

      <ManualLp1LinkModal
        open={lp1ModalOpen}
        onClose={() => setLp1ModalOpen(false)}
        fixedInserat={
          inserat
            ? { is24_inserat_id: inserat.is24_inserat_id, titel: inserat.titel }
            : null
        }
      />

      {loading ? (
        <SkeletonList count={3} />
      ) : filteredLeads.length === 0 ? (
        <p className="py-8 text-center text-sm text-dash-muted">Keine Besichtigungen gefunden.</p>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const slot = slotByLeadUuid.get(lead.uuid);
            return (
              <BesichtigungCard
                key={lead.id}
                lead={lead}
                slotDatum={slot?.datum}
                slotUhrzeit={slot?.uhrzeit}
                inseratAdresse={inserat?.adresse}
                onUpdated={load}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
