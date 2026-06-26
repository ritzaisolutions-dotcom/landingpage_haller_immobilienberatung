"use client";

import { ChevronDown, ChevronUp, Link2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BesichtigungCard } from "@/components/BesichtigungCard";
import { ManualLp1LinkModal } from "@/components/ManualLp1LinkModal";
import { MitarbeiterAssignSelect } from "@/components/MitarbeiterAssignSelect";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import {
  addDaysISO,
  formatDateHeaderDE,
  formatTime,
  slotUrgencyLabel,
  todayISO,
} from "@/lib/format";
import { fetchZustaendigkeitenForInserate } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import type {
  BesichtigungsslotWithInserat,
  Inserat,
  InseratZustaendigkeit,
  Lead,
  TerminLeadFilter,
} from "@/lib/types";

function matchesLeadFilter(lead: Lead | undefined, filter: TerminLeadFilter): boolean {
  if (filter === "all") return true;
  if (!lead) return false;
  switch (filter) {
    case "gebucht":
      return lead.status === "termin_gebucht";
    case "stattgefunden":
      return (
        lead.besichtigung_stattgefunden ||
        ["besichtigung_stattgefunden", "selbstauskunft_angefordert", "selbstauskunft_eingereicht"].includes(
          lead.status,
        )
      );
    case "abgesagt":
      return lead.status === "abgesagt";
    default: {
      const _exhaustive: never = filter;
      return _exhaustive;
    }
  }
}

export default function TermineContent() {
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get("from") ?? todayISO();
  const initialTo = searchParams.get("to") ?? addDaysISO(30);

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [statusFilter, setStatusFilter] = useState<TerminLeadFilter>("all");
  const [inseratFilter, setInseratFilter] = useState("all");
  const [inserate, setInserate] = useState<Inserat[]>([]);
  const [slots, setSlots] = useState<BesichtigungsslotWithInserat[]>([]);
  const [leadsByUuid, setLeadsByUuid] = useState<Record<string, Lead>>({});
  const [zustaendigkeiten, setZustaendigkeiten] = useState<InseratZustaendigkeit[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [leadsBySlot, setLeadsBySlot] = useState<Record<string, Lead[]>>({});
  const [lp1ModalOpen, setLp1ModalOpen] = useState(false);

  useEffect(() => {
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    if (urlFrom) setFrom(urlFrom);
    if (urlTo) setTo(urlTo);
  }, [searchParams]);

  const loadInserate = useCallback(async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    setCurrentUserEmail(userData.user?.email ?? "");

    const { data } = await supabase.from("inserate").select("*").order("titel");
    setInserate((data as Inserat[]) ?? []);
  }, []);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    let query = supabase
      .from("besichtigungsslots")
      .select("*, inserate(titel, is24_inserat_id, adresse, typ)")
      .gte("datum", from)
      .lte("datum", to)
      .order("datum", { ascending: true })
      .order("uhrzeit", { ascending: true });

    if (inseratFilter !== "all") {
      query = query.eq("inserat_id", inseratFilter);
    }

    const { data, error: err } = await query;

    if (err) {
      setError(err.message);
      setSlots([]);
      setLeadsByUuid({});
      setZustaendigkeiten([]);
    } else {
      const slotData = (data as BesichtigungsslotWithInserat[]) ?? [];
      setSlots(slotData);

      const is24Ids = [
        ...new Set(
          slotData.map((s) => s.inserate?.is24_inserat_id).filter(Boolean) as string[],
        ),
      ];
      if (is24Ids.length > 0) {
        const { data: leadsData } = await supabase
          .from("leads")
          .select("*")
          .in("inserat_id", is24Ids);
        const map: Record<string, Lead> = {};
        for (const lead of (leadsData as Lead[]) ?? []) {
          map[lead.uuid] = lead;
        }
        setLeadsByUuid(map);
      } else {
        setLeadsByUuid({});
      }

      const inseratIds = [...new Set(slotData.map((s) => s.inserat_id))];
      const { data: zustData } = await fetchZustaendigkeitenForInserate(supabase, inseratIds);
      setZustaendigkeiten((zustData as InseratZustaendigkeit[]) ?? []);
    }
    setLoading(false);
  }, [from, to, inseratFilter]);

  useEffect(() => {
    loadInserate();
  }, [loadInserate]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const filtered = useMemo(() => {
    return slots.filter((slot) => {
      const lead = slot.reserviert_lead_uuid
        ? leadsByUuid[slot.reserviert_lead_uuid]
        : undefined;
      return matchesLeadFilter(lead, statusFilter);
    });
  }, [slots, leadsByUuid, statusFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, BesichtigungsslotWithInserat[]>();
    for (const slot of filtered) {
      const list = map.get(slot.datum) ?? [];
      list.push(slot);
      map.set(slot.datum, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  async function toggleExpand(slot: BesichtigungsslotWithInserat) {
    if (expanded[slot.id]) {
      setExpanded((prev) => ({ ...prev, [slot.id]: false }));
      return;
    }

    if (!leadsBySlot[slot.id]) {
      const lead = slot.reserviert_lead_uuid
        ? leadsByUuid[slot.reserviert_lead_uuid]
        : undefined;
      setLeadsBySlot((prev) => ({
        ...prev,
        [slot.id]: lead ? [lead] : [],
      }));
    }

    setExpanded((prev) => ({ ...prev, [slot.id]: true }));
  }

  function refreshLeads(slotId: string) {
    setLeadsBySlot((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    loadSlots();
  }

  function setTodayPreset() {
    const t = todayISO();
    setFrom(t);
    setTo(t);
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-dash-text">Termine</h1>

      <div className="sticky top-0 z-10 mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-dash-border bg-dash-card p-4">
        <div>
          <label className="mb-1 block text-xs text-dash-muted">Von</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="dash-input" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-dash-muted">Bis</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="dash-input" />
        </div>
        <button type="button" onClick={setTodayPreset} className="dash-btn-secondary px-3 py-2 text-sm">
          Heute
        </button>
        <div>
          <label className="mb-1 block text-xs text-dash-muted">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TerminLeadFilter)}
            className="dash-input"
          >
            <option value="all">Alle</option>
            <option value="gebucht">Gebucht</option>
            <option value="stattgefunden">Stattgefunden</option>
            <option value="abgesagt">Abgesagt</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-dash-muted">Inserat</label>
          <select
            value={inseratFilter}
            onChange={(e) => setInseratFilter(e.target.value)}
            className="dash-input min-w-[200px]"
          >
            <option value="all">Alle Inserate</option>
            {inserate.map((i) => (
              <option key={i.id} value={i.id}>
                {i.titel}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto self-end">
          <button
            type="button"
            onClick={() => setLp1ModalOpen(true)}
            className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Link2 className="h-4 w-4" />
            LP1-Link manuell erstellen
          </button>
        </div>
      </div>

      <ManualLp1LinkModal open={lp1ModalOpen} onClose={() => setLp1ModalOpen(false)} />

      {loading ? (
        <SkeletonList count={5} />
      ) : error ? (
        <ErrorCard message={error} />
      ) : grouped.length === 0 ? (
        <p className="text-sm text-dash-muted">Keine Termine im gewählten Zeitraum.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(([datum, daySlots]) => (
            <section key={datum}>
              <h2 className="mb-3 text-sm font-medium capitalize text-dash-muted">
                {formatDateHeaderDE(datum)}
              </h2>
              <div className="space-y-3">
                {daySlots.map((slot) => {
                  const lead = slot.reserviert_lead_uuid
                    ? leadsByUuid[slot.reserviert_lead_uuid]
                    : undefined;
                  const urgency = slotUrgencyLabel(slot.datum, slot.uhrzeit);
                  const leads = leadsBySlot[slot.id] ?? [];

                  return (
                    <div
                      key={slot.id}
                      className={`dash-card p-4 ${urgency ? "border-l-4 border-l-dash-warning" : ""}`}
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="rounded-pill bg-dash-accent/20 px-4 py-1.5 text-sm font-medium text-dash-accent">
                          {formatTime(slot.uhrzeit)} Uhr · {slot.dauer_minuten} Min.
                        </div>
                        <div className="min-w-0 flex-1 text-sm">
                          {lead ? (
                            <p className="font-semibold text-dash-text">{lead.name}</p>
                          ) : (
                            <p className="text-dash-muted">Frei</p>
                          )}
                          <p className="font-medium text-dash-text">
                            {slot.inserate?.titel ?? "—"}
                          </p>
                          <p className="text-xs text-dash-muted">{slot.adresse}</p>
                          {lead ? (
                            <MitarbeiterAssignSelect
                              leadId={lead.id}
                              inseratUuid={slot.inserat_id}
                              currentAssignee={lead.zustaendiger_mitarbeiter}
                              zustaendigkeiten={zustaendigkeiten}
                              currentUserEmail={currentUserEmail}
                              onAssigned={loadSlots}
                              className="mt-2"
                            />
                          ) : null}
                        </div>
                        <StatusBadge status={slot.slot_status} variant="slot" />
                        {urgency ? (
                          <span className="rounded bg-dash-warning/20 px-2 py-0.5 text-xs text-dash-warning">
                            ⚠ {urgency}
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleExpand(slot)}
                          className="rounded p-1 text-dash-muted hover:text-dash-text"
                        >
                          {expanded[slot.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {expanded[slot.id] ? (
                        <div className="mt-4 space-y-3 border-t border-dash-border pt-4">
                          {leads.length === 0 ? (
                            <p className="text-xs text-dash-muted">Keine Leads für diesen Slot</p>
                          ) : (
                            leads.map((l) => (
                              <BesichtigungCard
                                key={l.id}
                                lead={l}
                                slotDatum={slot.datum}
                                slotUhrzeit={slot.uhrzeit}
                                inseratAdresse={slot.adresse}
                                onUpdated={() => refreshLeads(slot.id)}
                              />
                            ))
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
