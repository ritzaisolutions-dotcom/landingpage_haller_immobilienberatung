"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SelbstauskunftCard } from "@/components/SelbstauskunftCard";
import { SelectionBar } from "@/components/SelectionBar";
import { useToast } from "@/components/Toast";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import type { SelbstauskunftFilter, SelbstauskunftVergleich } from "@/lib/types";

const FILTERS: { value: SelbstauskunftFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "pending", label: "Ausstehend" },
  { value: "decided", label: "Entschieden" },
];

export default function SelbstauskuenftePage() {
  const params = useParams();
  const inseratId = params.id as string;
  const { showToast } = useToast();

  const [items, setItems] = useState<SelbstauskunftVergleich[]>([]);
  const [filter, setFilter] = useState<SelbstauskunftFilter>("all");
  const [favoriten, setFavoriten] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("selbstauskunft_vergleich")
      .select("*")
      .eq("inserat_id", inseratId)
      .order("mistral_score", { ascending: false, nullsFirst: false });

    if (err) setError(err.message);
    else setItems((data as SelbstauskunftVergleich[]) ?? []);
    setLoading(false);
  }, [inseratId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === "pending") return item.entscheidung == null;
      if (filter === "decided") return item.entscheidung != null;
      return true;
    });
  }, [items, filter]);

  const favoritNames = useMemo(() => {
    return items.filter((i) => favoriten.has(i.id)).map((i) => i.lead_name);
  }, [items, favoriten]);

  function toggleFavorit(id: string) {
    setFavoriten((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 2) {
          showToast("Maximal 2 Favoriten auswählbar", "error");
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }

  async function handleAbsage(id: string) {
    if (!confirm("Absage an diesen Kandidaten senden?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/n8n/entscheidung?selfId=${encodeURIComponent(id)}&entscheidung=absage`,
      );
      if (!res.ok) throw new Error("Webhook fehlgeschlagen");
      showToast("Absage ausgelöst");
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fehler", "error");
    }
    setActionLoading(false);
  }

  async function handleBatchZusage() {
    const ids = Array.from(favoriten);
    if (ids.length === 0) return;
    const names = favoritNames.join(", ");
    if (!confirm(`Zusage an ${names} senden und alle anderen absagen?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/n8n/entscheidung?ids=${encodeURIComponent(ids.join(","))}&entscheidung=zusage`,
      );
      if (!res.ok) throw new Error("Webhook fehlgeschlagen");
      showToast("Zusage an Auswahl gesendet");
      setFavoriten(new Set());
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fehler", "error");
    }
    setActionLoading(false);
  }

  if (error) return <ErrorCard message={error} />;

  return (
    <div className="pb-24">
      <div className="mb-4 flex flex-wrap gap-2">
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
      </div>

      {loading ? (
        <SkeletonList count={3} />
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-dash-muted">
          Noch keine Selbstauskünfte für dieses Inserat.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filtered.map((item) => (
            <SelbstauskunftCard
              key={item.id}
              item={item}
              isFavorit={favoriten.has(item.id)}
              onToggleFavorit={() => toggleFavorit(item.id)}
              onAbsage={handleAbsage}
              loading={actionLoading}
            />
          ))}
        </div>
      )}

      <SelectionBar
        count={favoriten.size}
        names={favoritNames}
        onConfirm={handleBatchZusage}
        onClear={() => setFavoriten(new Set())}
        loading={actionLoading}
      />
    </div>
  );
}
