"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ErrorScreen } from "@/components/ErrorScreen";
import { SuccessScreen } from "@/components/SuccessScreen";
import { UploadForm } from "@/components/UploadForm";
import { DEMO_LEAD, isDemoToken } from "@/lib/demo";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Lead } from "@/lib/types";

export function UploadPageClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t");

  const [lead, setLead] = useState<Lead | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoToken(token)) {
      setLead(DEMO_LEAD);
      setDemoMode(true);
      setLoading(false);
      return;
    }

    if (!token) {
      setError(
        "Dieser Link ist nicht mehr gültig. Bitte kontaktieren Sie uns direkt über ImmoScout24.",
      );
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Das Portal ist noch nicht live geschaltet. Nutzen Sie die Demo unter /upload?t=demo",
      );
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadLead() {
      try {
        const response = await fetch(
          `/api/lead?token=${encodeURIComponent(token!)}`,
        );

        if (cancelled) return;

        if (response.status === 410) {
          setError("Link abgelaufen");
          return;
        }

        if (!response.ok) {
          setError(
            "Dieser Link ist nicht mehr gültig. Bitte kontaktieren Sie uns direkt über ImmoScout24.",
          );
          return;
        }

        const body = (await response.json()) as { lead: Lead };
        setLead(body.lead);
      } catch {
        if (!cancelled) {
          setError(
            "Dieser Link ist nicht mehr gültig. Bitte kontaktieren Sie uns direkt über ImmoScout24.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLead();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-website-bg text-website-muted">
        Wird geladen…
      </div>
    );
  }

  if (error) {
    const message =
      error === "Link abgelaufen"
        ? "Dieser Link ist nicht mehr gültig. Bitte kontaktieren Sie uns direkt über ImmoScout24."
        : error;
    return <ErrorScreen message={message} />;
  }

  if (!lead) {
    return (
      <ErrorScreen message="Dieser Link ist nicht mehr gültig. Bitte kontaktieren Sie uns direkt über ImmoScout24." />
    );
  }

  if (lead.status === "dokumente_eingereicht" && !demoMode) {
    return <SuccessScreen name={lead.name} />;
  }

  return <UploadForm lead={lead} demoMode={demoMode} />;
}
