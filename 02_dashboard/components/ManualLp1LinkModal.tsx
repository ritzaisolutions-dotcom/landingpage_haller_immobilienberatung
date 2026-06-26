"use client";

import { Copy, Link2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  createManualLp1Lead,
  type CreateManualLp1LeadResult,
} from "@/app/actions/create-manual-lp1-lead";
import { useToast } from "@/components/Toast";
import { createClient } from "@/lib/supabase/client";
import type { Inserat } from "@/lib/types";

type ManualLp1LinkModalProps = {
  open: boolean;
  onClose: () => void;
  fixedInserat?: Pick<Inserat, "is24_inserat_id" | "titel"> | null;
};

export function ManualLp1LinkModal({ open, onClose, fixedInserat }: ManualLp1LinkModalProps) {
  const { showToast } = useToast();
  const [inserate, setInserate] = useState<Inserat[]>([]);
  const [is24InseratId, setIs24InseratId] = useState(fixedInserat?.is24_inserat_id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [result, setResult] = useState<CreateManualLp1LeadResult | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setResult(null);
    if (fixedInserat) {
      setIs24InseratId(fixedInserat.is24_inserat_id);
      return;
    }
    const supabase = createClient();
    supabase
      .from("inserate")
      .select("*")
      .order("titel")
      .then(({ data }) => setInserate((data as Inserat[]) ?? []));
  }, [open, fixedInserat]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createManualLp1Lead({
        name,
        email,
        telefon,
        is24InseratId,
        nachrichtText: nachricht,
      });
      setResult(res);
      if (!res.ok) {
        showToast(res.error, "error");
      }
    });
  }

  async function copyLink() {
    if (!result || !result.ok) return;
    try {
      await navigator.clipboard.writeText(result.lp1Url);
      showToast("Link kopiert");
    } catch {
      showToast("Kopieren fehlgeschlagen", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-dash-border bg-dash-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-dash-text">
              <Link2 className="h-5 w-5 text-dash-accent" />
              LP1-Link manuell erstellen
            </h2>
            <p className="mt-1 text-xs text-dash-muted">
              Erstellt einen neuen Lead-Eintrag (Fallback wenn WF1 ausfällt). Link 72h gültig.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-dash-muted hover:text-dash-text"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {result?.ok ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-dash-success/30 bg-dash-success/10 p-4">
              <p className="mb-2 text-sm font-medium text-dash-success">Link erstellt</p>
              <p className="break-all text-xs text-dash-text">{result.lp1Url}</p>
              <p className="mt-2 text-xs text-dash-muted">
                Gültig bis{" "}
                {new Date(result.expiresAt).toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={copyLink} className="dash-btn-primary flex-1">
                <Copy className="mr-2 inline h-4 w-4" />
                Link kopieren
              </button>
              <button type="button" onClick={onClose} className="dash-btn-ghost">
                Schließen
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!fixedInserat ? (
              <div>
                <label className="mb-1 block text-xs text-dash-muted">Inserat *</label>
                <select
                  value={is24InseratId}
                  onChange={(e) => setIs24InseratId(e.target.value)}
                  className="dash-input w-full"
                  required
                >
                  <option value="">Bitte wählen…</option>
                  {inserate.map((i) => (
                    <option key={i.id} value={i.is24_inserat_id}>
                      {i.titel}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="rounded-lg border border-dash-border bg-dash-bg/50 px-3 py-2 text-sm text-dash-text">
                {fixedInserat.titel}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-dash-muted">Name *</label>
              <input
                className="dash-input w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-dash-muted">E-Mail *</label>
              <input
                type="email"
                className="dash-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-dash-muted">Telefon *</label>
              <input
                type="tel"
                className="dash-input w-full"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-dash-muted">Nachricht (optional)</label>
              <textarea
                className="dash-input w-full"
                rows={2}
                value={nachricht}
                onChange={(e) => setNachricht(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={pending} className="dash-btn-primary flex-1">
                {pending ? "Wird erstellt…" : "Link generieren"}
              </button>
              <button type="button" onClick={onClose} className="dash-btn-ghost">
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
