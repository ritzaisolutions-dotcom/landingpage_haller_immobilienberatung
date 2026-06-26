"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/Toast";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import type { InseratZustaendigkeit } from "@/lib/types";

export default function ZustaendigkeitenPage() {
  const params = useParams();
  const inseratId = params.id as string;
  const { showToast } = useToast();

  const [list, setList] = useState<InseratZustaendigkeit[]>([]);
  const [email, setEmail] = useState("");
  const [haupt, setHaupt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("inserat_zustaendigkeiten")
      .select("*")
      .eq("inserat_id", inseratId)
      .order("ist_hauptverantwortlich", { ascending: false });

    if (err) setError(err.message);
    else setList((data as InseratZustaendigkeit[]) ?? []);
    setLoading(false);
  }, [inseratId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const supabase = createClient();

    if (haupt) {
      await supabase
        .from("inserat_zustaendigkeiten")
        .update({ ist_hauptverantwortlich: false })
        .eq("inserat_id", inseratId);
    }

    const { error: insertErr } = await supabase.from("inserat_zustaendigkeiten").insert({
      inserat_id: inseratId,
      mitarbeiter_email: email.trim().toLowerCase(),
      ist_hauptverantwortlich: haupt,
    });

    if (insertErr) {
      showToast(insertErr.message, "error");
      return;
    }

    showToast("Mitarbeiter hinzugefügt");
    setEmail("");
    setHaupt(false);
    load();
  }

  async function toggleHaupt(row: InseratZustaendigkeit) {
    const supabase = createClient();
    if (!row.ist_hauptverantwortlich) {
      await supabase
        .from("inserat_zustaendigkeiten")
        .update({ ist_hauptverantwortlich: false })
        .eq("inserat_id", inseratId);
    }
    await supabase
      .from("inserat_zustaendigkeiten")
      .update({ ist_hauptverantwortlich: !row.ist_hauptverantwortlich })
      .eq("id", row.id);
    load();
  }

  async function remove(row: InseratZustaendigkeit) {
    if (!confirm(`${row.mitarbeiter_email} entfernen?`)) return;
    const supabase = createClient();
    const { error: delErr } = await supabase
      .from("inserat_zustaendigkeiten")
      .delete()
      .eq("id", row.id);
    if (delErr) showToast(delErr.message, "error");
    else load();
  }

  if (error) return <ErrorCard message={error} />;

  return (
    <div className="space-y-6">
      <div className="dash-card p-6">
        <h2 className="mb-1 text-lg font-semibold">Zuständigkeit</h2>
        <p className="mb-4 text-sm text-dash-muted">
          Wer ist für dieses Inserat verantwortlich? Kalender-Events gehen an den Hauptverantwortlichen.
        </p>

        {loading ? (
          <SkeletonList count={2} />
        ) : list.length === 0 ? (
          <p className="text-sm text-dash-muted">Noch keine Mitarbeiter zugewiesen.</p>
        ) : (
          <div className="space-y-2">
            {list.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-lg border border-dash-border px-4 py-3"
              >
                <span className="text-sm text-dash-text">{row.mitarbeiter_email}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-dash-muted">
                    <input
                      type="checkbox"
                      checked={row.ist_hauptverantwortlich}
                      onChange={() => toggleHaupt(row)}
                    />
                    Hauptverantwortlich
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(row)}
                    className="text-xs text-dash-danger hover:underline"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="dash-card p-6">
        <h3 className="mb-3 text-sm font-medium">Mitarbeiter hinzufügen</h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="email"
            required
            placeholder="email@haller-immobilien.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="dash-input max-w-xs"
          />
          <label className="flex items-center gap-2 text-sm text-dash-muted">
            <input type="checkbox" checked={haupt} onChange={(e) => setHaupt(e.target.checked)} />
            Hauptverantwortlich
          </label>
          <button type="submit" className="dash-btn-primary">
            Hinzufügen
          </button>
        </div>
      </form>
    </div>
  );
}
