"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SlotForm } from "@/components/SlotForm";
import { SlotTable } from "@/components/SlotTable";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Besichtigungsslot, Inserat } from "@/lib/types";

export default function SlotsPage() {
  const params = useParams();
  const inseratId = params.id as string;

  const [inserat, setInserat] = useState<Inserat | null>(null);
  const [slots, setSlots] = useState<Besichtigungsslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [inseratRes, slotsRes] = await Promise.all([
      supabase.from("inserate").select("*").eq("id", inseratId).single(),
      supabase
        .from("besichtigungsslots")
        .select("*")
        .eq("inserat_id", inseratId)
        .order("datum", { ascending: true })
        .order("uhrzeit", { ascending: true }),
    ]);

    if (inseratRes.error) setError(inseratRes.error.message);
    else setInserat(inseratRes.data as Inserat);

    if (slotsRes.error) setError(slotsRes.error.message);
    else setSlots((slotsRes.data as Besichtigungsslot[]) ?? []);

    setLoading(false);
  }, [inseratId]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <ErrorCard message={error} />;
  if (!inserat) return null;

  return (
    <div className="dash-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Besichtigungsslots</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 dash-btn-ghost text-sm"
        >
          <Plus className="h-4 w-4" />
          Slot manuell hinzufügen
        </button>
      </div>

      {showForm ? (
        <SlotForm
          inserat={inserat}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : null}

      {loading ? <SkeletonList count={3} /> : <SlotTable slots={slots} onDeleted={load} />}
    </div>
  );
}
