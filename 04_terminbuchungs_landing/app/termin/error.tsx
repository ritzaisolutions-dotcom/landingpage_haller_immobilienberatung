"use client";

import { AlertCircle } from "lucide-react";
import { LpShell } from "@/components/LpShell";

export default function TerminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <LpShell>
      <div className="lp-card text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold text-lp-text">Ein Fehler ist aufgetreten</h1>
        <p className="mb-6 text-sm text-lp-muted">
          {error.message || "Die Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut."}
        </p>
        <button type="button" onClick={reset} className="lp-btn-primary">
          Erneut versuchen
        </button>
      </div>
    </LpShell>
  );
}
