"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InsertCard } from "@/components/InsertCard";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Inserat } from "@/lib/types";

type InserateSidebarProps = {
  selectedId?: string | null;
};

export function InserateSidebar({ selectedId }: InserateSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [inserate, setInserate] = useState<Inserat[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeId = useMemo(() => {
    if (selectedId) return selectedId;
    const match = pathname.match(/^\/inserate\/([^/]+)/);
    return match?.[1] ?? null;
  }, [selectedId, pathname]);

  const loadInserate = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("inserate")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
      setInserate([]);
    } else {
      setInserate((data as Inserat[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInserate();
  }, [loadInserate]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inserate;
    return inserate.filter(
      (i) =>
        i.titel.toLowerCase().includes(q) ||
        i.adresse.toLowerCase().includes(q) ||
        i.is24_inserat_id.toLowerCase().includes(q),
    );
  }, [inserate, search]);

  function selectInserat(id: string) {
    router.push(`/inserate/${id}/buchungsfenster`);
  }

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-dash-border pr-4">
      <h1 className="mb-4 text-xl font-bold text-dash-text">Inserate</h1>
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-dash-muted" />
        <input
          type="search"
          placeholder="Suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dash-input pl-9"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <SkeletonList count={4} />
        ) : error ? (
          <ErrorCard message={error} />
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-dash-muted">
            Keine Inserate. Werden automatisch von ImmoScout24 importiert.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((inserat) => (
              <InsertCard
                key={inserat.id}
                inserat={inserat}
                selected={inserat.id === activeId}
                onClick={() => selectInserat(inserat.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
