"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCjStepLabel, LeadCjStepper, LEAD_STATUS_ORDER } from "@/components/LeadCjStepper";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/Toast";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { formatRelativeDE } from "@/lib/format";
import { buildLp1TerminUrl } from "@/lib/lp1-url";
import { buildLp2AuskunftUrl } from "@/lib/lp2-url";
import { CRM_PAGE_SIZE, fetchLeadsCrm } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import type { CrmFilterTab, Inserat, Lead, LeadStatus } from "@/lib/types";

const TABS: { id: CrmFilterTab; label: string }[] = [
  { id: "aktiv", label: "Aktiv" },
  { id: "frueh", label: "Frühphase" },
  { id: "pipeline", label: "Pipeline" },
  { id: "erledigt", label: "Erledigt" },
  { id: "archiv", label: "Archiv" },
];

function parseTab(value: string | null): CrmFilterTab {
  if (value && TABS.some((t) => t.id === value)) {
    return value as CrmFilterTab;
  }
  return "aktiv";
}

function InseratThumb({ url, titel }: { url: string | null | undefined; titel: string }) {
  if (url) {
    return (
      <div
        className="h-10 w-10 shrink-0 rounded bg-cover bg-center"
        style={{ backgroundImage: `url(${url})` }}
        title={titel}
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-dashed border-dash-border bg-dash-card-alt text-[8px] text-dash-muted">
      —
    </div>
  );
}

export default function AnfragenPage() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [tab, setTab] = useState<CrmFilterTab>(() => parseTab(searchParams.get("tab")));
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [search, setSearch] = useState("");
  const [inseratFilter, setInseratFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [inserateMap, setInserateMap] = useState<
    Map<string, { id: string; titel: string; foto_urls: string[] | null; adresse: string }>
  >(new Map());
  const [inserate, setInserate] = useState<Inserat[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setTab(parseTab(searchParams.get("tab")));
    setStatusFilter(searchParams.get("status") ?? "");
    setPage(1);
  }, [searchParams]);

  const loadInserate = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("inserate").select("*").order("titel");
    setInserate((data as Inserat[]) ?? []);
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const result = await fetchLeadsCrm(supabase, {
        tab,
        page,
        search: search || undefined,
        inseratIs24Id: inseratFilter !== "all" ? inseratFilter : undefined,
        statusFilter: statusFilter || undefined,
      });
      setLeads(result.leads);
      setTotal(result.total);
      setInserateMap(result.inserateMap);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Laden");
      setLeads([]);
    }
    setLoading(false);
  }, [tab, page, search, inseratFilter, statusFilter]);

  useEffect(() => {
    loadInserate();
  }, [loadInserate]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const totalPages = Math.max(1, Math.ceil(total / CRM_PAGE_SIZE));

  async function updateLeadStatus(leadId: string, status: LeadStatus) {
    setActionLoading(leadId);
    const supabase = createClient();
    const updates: Record<string, unknown> = {
      status,
      last_activity_at: new Date().toISOString(),
    };
    if (status === "besichtigung_stattgefunden") {
      updates.besichtigung_stattgefunden = true;
    }
    const { error: err } = await supabase.from("leads").update(updates).eq("id", leadId);
    setActionLoading(null);
    if (err) {
      showToast(err.message, "error");
      return;
    }
    showToast("Status aktualisiert");
    loadLeads();
  }

  async function archiveLead(leadId: string) {
    setActionLoading(leadId);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("leads")
      .update({
        archiviert_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", leadId);
    setActionLoading(null);
    if (err) {
      showToast(err.message, "error");
      return;
    }
    showToast("Lead archiviert");
    loadLeads();
  }

  async function saveNotiz(leadId: string, notiz: string) {
    const supabase = createClient();
    const { error: err } = await supabase
      .from("leads")
      .update({
        mitarbeiter_notiz: notiz,
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", leadId);
    if (err) {
      showToast(err.message, "error");
      return;
    }
    showToast("Notiz gespeichert");
    loadLeads();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    showToast("Link kopiert");
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-dash-text">Anfragen</h1>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-dash-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              tab === t.id
                ? "bg-dash-accent/15 text-dash-accent"
                : "text-dash-muted hover:bg-dash-border/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs text-dash-muted">Suche</label>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Name, E-Mail, Telefon…"
            className="dash-input w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-dash-muted">Inserat</label>
          <select
            value={inseratFilter}
            onChange={(e) => {
              setInseratFilter(e.target.value);
              setPage(1);
            }}
            className="dash-input min-w-[200px]"
          >
            <option value="all">Alle Inserate</option>
            {inserate.map((i) => (
              <option key={i.id} value={i.is24_inserat_id}>
                {i.titel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-dash-muted">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="dash-input min-w-[180px]"
          >
            <option value="">Alle Status</option>
            {LEAD_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonList count={6} />
      ) : error ? (
        <ErrorCard message={error} />
      ) : leads.length === 0 ? (
        <p className="py-12 text-center text-sm text-dash-muted">Keine Anfragen gefunden.</p>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => {
            const ins = inserateMap.get(lead.inserat_id);
            const expanded = expandedId === lead.id;
            const lp1Url = lead.lp1_token ? buildLp1TerminUrl(lead.lp1_token) : null;
            const lp2Url = lead.lp2_token ? buildLp2AuskunftUrl(lead.lp2_token) : null;

            return (
              <div key={lead.id} className="dash-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <InseratThumb url={ins?.foto_urls?.[0]} titel={ins?.titel ?? lead.inserat_id} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-dash-text">{lead.name}</p>
                      <StatusBadge status={lead.status} variant="lead" />
                    </div>
                    <p className="truncate text-xs text-dash-muted">
                      {ins?.titel ?? lead.inserat_id}
                      {lead.email ? ` · ${lead.email}` : ""}
                    </p>
                    <div className="mt-2 max-w-md">
                      <LeadCjStepper status={lead.status} compact />
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-xs text-dash-muted">{getCjStepLabel(lead.status)}</p>
                    <p className="text-xs text-dash-muted">
                      {formatRelativeDE(lead.last_activity_at ?? lead.created_at)}
                    </p>
                    {lead.zustaendiger_mitarbeiter ? (
                      <p className="mt-1 truncate text-[10px] text-dash-accent">
                        {lead.zustaendiger_mitarbeiter}
                      </p>
                    ) : null}
                  </div>
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-dash-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-dash-muted" />
                  )}
                </button>

                {expanded ? (
                  <div className="space-y-4 border-t border-dash-border bg-dash-card-alt/50 p-4">
                    <LeadCjStepper status={lead.status} />

                    {lead.nachricht_text ? (
                      <div>
                        <p className="mb-1 text-xs font-medium text-dash-muted">Originalnachricht</p>
                        <p className="rounded-lg bg-dash-card p-3 text-sm text-dash-text">
                          {lead.nachricht_text}
                        </p>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {lp1Url ? (
                        <button
                          type="button"
                          onClick={() => copyUrl(lp1Url)}
                          className="flex items-center gap-1 rounded-lg border border-dash-border px-3 py-1.5 text-xs hover:bg-dash-card"
                        >
                          <Copy className="h-3 w-3" />
                          LP1-Link kopieren
                        </button>
                      ) : null}
                      {lp2Url ? (
                        <button
                          type="button"
                          onClick={() => copyUrl(lp2Url)}
                          className="flex items-center gap-1 rounded-lg border border-dash-border px-3 py-1.5 text-xs hover:bg-dash-card"
                        >
                          <Copy className="h-3 w-3" />
                          LP2-Link kopieren
                        </button>
                      ) : null}
                      {ins?.id ? (
                        <Link
                          href={`/inserate/${ins.id}/besichtigungen`}
                          className="flex items-center gap-1 rounded-lg border border-dash-border px-3 py-1.5 text-xs hover:bg-dash-card"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Zum Inserat
                        </Link>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                      <div>
                        <label className="mb-1 block text-xs text-dash-muted">Status manuell</label>
                        <select
                          value={lead.status}
                          disabled={actionLoading === lead.id}
                          onChange={(e) =>
                            updateLeadStatus(lead.id, e.target.value as LeadStatus)
                          }
                          className="dash-input text-sm"
                        >
                          {LEAD_STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      {!lead.archiviert_at ? (
                        <button
                          type="button"
                          disabled={actionLoading === lead.id}
                          onClick={() => archiveLead(lead.id)}
                          className="dash-btn-danger text-sm"
                        >
                          Archivieren
                        </button>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-dash-muted">Interne Notiz</label>
                      <textarea
                        defaultValue={lead.mitarbeiter_notiz ?? ""}
                        rows={2}
                        className="dash-input w-full text-sm"
                        onBlur={(e) => {
                          if (e.target.value !== (lead.mitarbeiter_notiz ?? "")) {
                            saveNotiz(lead.id, e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-dash-muted">
            {total} Anfragen · Seite {page} von {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="dash-btn-secondary px-3 py-1 text-sm disabled:opacity-40"
            >
              Zurück
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="dash-btn-secondary px-3 py-1 text-sm disabled:opacity-40"
            >
              Weiter
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
