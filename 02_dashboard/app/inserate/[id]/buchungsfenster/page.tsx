"use client";

import { Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/Toast";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import {
  DURATION_OPTIONS,
  formatDateDE,
  todayISO,
  VORLAUF_OPTIONS,
  WEEKDAYS,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Buchungsfenster } from "@/lib/types";

export default function BuchungsfensterPage() {
  const params = useParams();
  const inseratId = params.id as string;
  const { showToast } = useToast();

  const [fenster, setFenster] = useState<Buchungsfenster[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [gueltigVon, setGueltigVon] = useState(todayISO());
  const [gueltigBis, setGueltigBis] = useState("");
  const [wochentage, setWochentage] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startzeit, setStartzeit] = useState("09:00");
  const [endzeit, setEndzeit] = useState("17:00");
  const [dauer, setDauer] = useState(30);
  const [vorlauf, setVorlauf] = useState(2);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("buchungsfenster")
      .select("*")
      .eq("inserat_id", inseratId)
      .order("created_at", { ascending: false });

    if (err) setError(err.message);
    else setFenster((data as Buchungsfenster[]) ?? []);
    setLoading(false);
  }, [inseratId]);

  useEffect(() => {
    const bis = new Date();
    bis.setDate(bis.getDate() + 30);
    setGueltigBis(bis.toISOString().slice(0, 10));
    load();
  }, [load]);

  function toggleDay(day: number) {
    setWochentage((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (wochentage.length === 0) {
      showToast("Mindestens ein Wochentag auswählen", "error");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data, error: insertErr } = await supabase
      .from("buchungsfenster")
      .insert({
        inserat_id: inseratId,
        gueltig_von: gueltigVon,
        gueltig_bis: gueltigBis,
        buchbare_wochentage: wochentage,
        startzeit: `${startzeit}:00`,
        endzeit: `${endzeit}:00`,
        slot_dauer_minuten: dauer,
        max_kapazitaet: 1,
        vorlaufzeit_stunden: vorlauf,
      })
      .select()
      .single();

    if (insertErr) {
      setSaving(false);
      showToast(insertErr.message, "error");
      return;
    }

    try {
      const res = await fetch("/api/n8n/slots-generieren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buchungsfenster_id: data.id, inserat_id: inseratId }),
      });
      if (!res.ok) throw new Error("Webhook fehlgeschlagen");
      showToast("Zeitfenster gespeichert — Slots werden generiert");
    } catch {
      showToast("Gespeichert, aber Slot-Generierung fehlgeschlagen", "error");
    }

    setSaving(false);
    load();
  }

  async function handleDelete(f: Buchungsfenster) {
    const supabase = createClient();
    const { count } = await supabase
      .from("besichtigungsslots")
      .select("*", { count: "exact", head: true })
      .eq("inserat_id", inseratId)
      .gt("belegt", 0)
      .gte("datum", f.gueltig_von)
      .lte("datum", f.gueltig_bis);

    if ((count ?? 0) > 0) {
      showToast("Löschen nicht möglich — gebuchte Slots vorhanden", "error");
      return;
    }

    if (!confirm("Buchungsfenster löschen?")) return;
    const { error: delErr } = await supabase.from("buchungsfenster").delete().eq("id", f.id);
    if (delErr) showToast(delErr.message, "error");
    else {
      showToast("Buchungsfenster gelöscht");
      load();
    }
  }

  if (error) return <ErrorCard message={error} />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="dash-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Buchungsfenster einrichten</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-dash-muted">Gültig von</label>
            <input type="date" required value={gueltigVon} onChange={(e) => setGueltigVon(e.target.value)} className="dash-input" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-dash-muted">Gültig bis</label>
            <input type="date" required value={gueltigBis} onChange={(e) => setGueltigBis(e.target.value)} className="dash-input" />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-xs text-dash-muted">Buchbare Wochentage</label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  wochentage.includes(d.value)
                    ? "bg-dash-accent text-white"
                    : "border border-dash-border text-dash-muted"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-dash-muted">Startzeit</label>
            <input type="time" value={startzeit} onChange={(e) => setStartzeit(e.target.value)} className="dash-input" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-dash-muted">Endzeit</label>
            <input type="time" value={endzeit} onChange={(e) => setEndzeit(e.target.value)} className="dash-input" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-dash-muted">Dauer je Besichtigung</label>
            <select value={dauer} onChange={(e) => setDauer(Number(e.target.value))} className="dash-input">
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>{d} Min.</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-dash-muted">Vorlaufzeit</label>
            <select value={vorlauf} onChange={(e) => setVorlauf(Number(e.target.value))} className="dash-input">
              {VORLAUF_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className="dash-btn-primary mt-4">
          {saving ? "Speichern…" : "Zeitfenster speichern + Slots generieren"}
        </button>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-medium text-dash-muted">Bestehende Buchungsfenster</h3>
        {loading ? (
          <SkeletonList count={2} />
        ) : fenster.length === 0 ? (
          <p className="text-sm text-dash-muted">Noch keine Buchungsfenster angelegt.</p>
        ) : (
          <div className="space-y-2">
            {fenster.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border border-dash-border p-3">
                <div>
                  <p className="text-sm text-dash-text">
                    {formatDateDE(f.gueltig_von)} – {formatDateDE(f.gueltig_bis)}
                  </p>
                  <p className="text-xs text-dash-muted">
                    {f.startzeit.slice(0, 5)} – {f.endzeit.slice(0, 5)} · {f.slot_dauer_minuten} Min. · Einzelbesichtigung
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={f.aktiv ? "aktiv" : "inaktiv"} variant="inserat" />
                  <button type="button" onClick={() => handleDelete(f)} className="text-dash-muted hover:text-dash-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
