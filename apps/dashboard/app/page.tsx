"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PipelineTiles } from "@/components/PipelineTiles";
import { TerminHeuteCard } from "@/components/TerminHeuteCard";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { formatDateHeaderDE, isSlotPast, todayISO } from "@/lib/format";
import {
  fetchPipelineCounts,
  fetchTodayAppointments,
  fetchZustaendigkeitenForInserate,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import type { InseratZustaendigkeit, PipelineCounts, TodayAppointment } from "@/lib/types";

export default function HomePage() {
  const today = todayISO();
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);
  const [zustaendigkeiten, setZustaendigkeiten] = useState<InseratZustaendigkeit[]>([]);
  const [pipeline, setPipeline] = useState<PipelineCounts>({
    neueBuchungen: 0,
    neueSelbstauskuenfte: 0,
    entscheidungenOffen: 0,
    frueheAnfragen: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    setEmail(userData.user?.email ?? "");

    const [apptRes, counts] = await Promise.all([
      fetchTodayAppointments(supabase, today),
      fetchPipelineCounts(supabase),
    ]);

    if (apptRes.error) {
      setError(apptRes.error.message);
      setLoading(false);
      return;
    }

    setAppointments(apptRes.data);
    setPipeline(counts);

    const inseratIds = [
      ...new Set(apptRes.data.map((a) => a.inserat?.id ?? a.slot.inserat_id)),
    ];
    const { data: zustData } = await fetchZustaendigkeitenForInserate(supabase, inseratIds);
    setZustaendigkeiten((zustData as InseratZustaendigkeit[]) ?? []);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    setLoading(true);
    loadData();
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const stats = useMemo(() => {
    const ohneZustaendigen = appointments.filter(
      (a) => a.lead && !a.lead.zustaendiger_mitarbeiter,
    ).length;
    const ueberfaellig = appointments.filter(
      (a) =>
        a.lead &&
        !a.lead.besichtigung_stattgefunden &&
        a.lead.status === "termin_gebucht" &&
        isSlotPast(a.slot.datum, a.slot.uhrzeit),
    ).length;
    return {
      total: appointments.length,
      ohneZustaendigen,
      ueberfaellig,
    };
  }, [appointments]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-dash-text">Guten Tag</h1>
        <p className="mt-1 text-sm text-dash-muted">
          {formatDateHeaderDE(today)}
          {email ? ` · ${email}` : ""}
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-medium text-dash-muted">Pipeline</h2>
        <PipelineTiles counts={pipeline} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-dash-text">Termine heute</h2>
            <p className="text-xs text-dash-muted">
              {stats.total} Termin{stats.total === 1 ? "" : "e"}
              {stats.ohneZustaendigen > 0
                ? ` · ${stats.ohneZustaendigen} ohne Zuständigen`
                : ""}
              {stats.ueberfaellig > 0 ? ` · ${stats.ueberfaellig} Aktion offen` : ""}
            </p>
          </div>
          <Link
            href={`/termine?from=${today}&to=${today}`}
            className="text-sm text-dash-accent hover:underline"
          >
            Alle Termine →
          </Link>
        </div>

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} />
        ) : appointments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-dash-border py-12 text-center text-sm text-dash-muted">
            Heute keine Besichtigungstermine.
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <TerminHeuteCard
                key={appt.slot.id}
                appointment={appt}
                zustaendigkeiten={zustaendigkeiten}
                currentUserEmail={email}
                onUpdated={loadData}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
