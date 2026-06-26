"use client";

import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/Toast";
import {
  formatDateDE,
  formatTime,
  getInitials,
  isSlotPast,
  isToday,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";

type BesichtigungCardProps = {
  lead: Lead;
  slotDatum?: string;
  slotUhrzeit?: string;
  inseratAdresse?: string;
  onUpdated: () => void;
  embedded?: boolean;
};

async function callApi(path: string) {
  const res = await fetch(path);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Aktion fehlgeschlagen");
  }
}

export function BesichtigungCard({
  lead,
  slotDatum,
  slotUhrzeit,
  inseratAdresse,
  onUpdated,
  embedded = false,
}: BesichtigungCardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const slotPast =
    slotDatum != null && slotUhrzeit != null && isSlotPast(slotDatum, slotUhrzeit);

  async function markAttended() {
    setLoading("attended");
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({
        besichtigung_stattgefunden: true,
        status: "besichtigung_stattgefunden",
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    setLoading(null);
    if (error) {
      showToast(error.message, "error");
      return;
    }
    showToast("Besichtigung als stattgefunden markiert");
    onUpdated();
  }

  async function handleAbsage(reason: "no_show" | "not_qualified") {
    const label = reason === "no_show" ? "nicht erschienen" : "nicht qualifiziert";
    if (!confirm(`Lead als ${label} absagen?`)) return;

    setLoading(reason);
    try {
      await callApi(`/api/n8n/absage?leadId=${encodeURIComponent(lead.id)}`);
      const supabase = createClient();
      await supabase
        .from("leads")
        .update({
          status: "abgesagt",
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", lead.id);
      showToast("Absage wurde ausgelöst");
      onUpdated();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fehler", "error");
    }
    setLoading(null);
  }

  async function requestSelbstauskunft() {
    setLoading("sa");
    try {
      await callApi(
        `/api/n8n/selbstauskunft-anfordern?leadId=${encodeURIComponent(lead.id)}`,
      );
      const supabase = createClient();
      await supabase
        .from("leads")
        .update({
          status: "selbstauskunft_angefordert",
          selbstauskunft_angefordert_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", lead.id);
      showToast("Selbstauskunft angefordert");
      onUpdated();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fehler", "error");
    }
    setLoading(null);
  }

  const showPostViewing =
    lead.besichtigung_stattgefunden || lead.status === "besichtigung_stattgefunden";
  const saRequested =
    lead.status === "selbstauskunft_angefordert" ||
    lead.status === "selbstauskunft_eingereicht" ||
    lead.selbstauskunft_angefordert_at != null;

  return (
    <div className={embedded ? "p-0" : "dash-card p-4"}>
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dash-accent/20 text-sm font-bold text-dash-accent">
          {getInitials(lead.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-dash-text">{lead.name}</h3>
            <StatusBadge status={lead.status} variant="lead" />
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-dash-muted">
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-dash-text">
                <Mail className="h-3 w-3" />
                {lead.email}
              </a>
            ) : null}
            {lead.telefon ? (
              <a href={`tel:${lead.telefon}`} className="flex items-center gap-1 hover:text-dash-text">
                <Phone className="h-3 w-3" />
                {lead.telefon}
              </a>
            ) : null}
          </div>
          {slotDatum && slotUhrzeit ? (
            <p className="mt-2 text-lg font-semibold text-dash-text">
              {formatDateDE(slotDatum)} · {formatTime(slotUhrzeit)} Uhr
            </p>
          ) : lead.termin_gebucht_at ? (
            <p className="mt-2 text-sm text-dash-muted">
              Gebucht: {new Date(lead.termin_gebucht_at).toLocaleString("de-DE")}
            </p>
          ) : null}
          {inseratAdresse ? (
            <p className="mt-1 text-xs text-dash-muted">{inseratAdresse}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!lead.besichtigung_stattgefunden &&
        lead.status === "termin_gebucht" &&
        slotPast ? (
          <>
            <button
              type="button"
              disabled={loading != null}
              onClick={markAttended}
              className="dash-btn-success"
            >
              {loading === "attended" ? "…" : "Besichtigung hat stattgefunden"}
            </button>
            <button
              type="button"
              disabled={loading != null}
              onClick={() => handleAbsage("no_show")}
              className="dash-btn-danger"
            >
              {loading === "no_show" ? "…" : "Nicht erschienen → Absagen"}
            </button>
          </>
        ) : null}

        {showPostViewing && !saRequested ? (
          <>
            <button
              type="button"
              disabled={loading != null}
              onClick={() => handleAbsage("not_qualified")}
              className="dash-btn-danger"
            >
              {loading === "not_qualified" ? "…" : "Nicht qualifiziert → Absagen"}
            </button>
            <button
              type="button"
              disabled={loading != null}
              onClick={requestSelbstauskunft}
              className="dash-btn-primary"
            >
              {loading === "sa" ? "…" : "Selbstauskunft anfordern"}
            </button>
          </>
        ) : null}

        {saRequested ? (
          <span className="rounded-lg bg-dash-success/10 px-3 py-2 text-sm text-dash-success">
            Selbstauskunft angefordert ✓
          </span>
        ) : null}

        {slotDatum && isToday(slotDatum) && !lead.besichtigung_stattgefunden ? (
          <span className="rounded-lg bg-dash-warning/10 px-3 py-2 text-xs text-dash-warning">
            Heute
          </span>
        ) : null}
      </div>
    </div>
  );
}
