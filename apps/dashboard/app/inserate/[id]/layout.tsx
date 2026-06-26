"use client";

import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { InseratProfileHeader, InseratTabNav } from "@/components/InseratProfile";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Inserat } from "@/lib/types";

export default function InseratLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;
  const activeTab = pathname.split("/").pop() ?? "buchungsfenster";

  const [inserat, setInserat] = useState<Inserat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.from("inserate").select("*").eq("id", id).single();
    if (err) {
      setError(err.message);
      setInserat(null);
    } else {
      setInserat(data as Inserat);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !inserat) {
    return <ErrorCard message={error || "Inserat nicht gefunden"} />;
  }

  return (
    <div>
      <InseratProfileHeader inserat={inserat} />
      <InseratTabNav inseratId={id} active={activeTab} />
      {children}
    </div>
  );
}
