"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body className="flex min-h-screen items-center justify-center bg-[#07101E] text-[#E2EAF8]">
        <div className="text-center">
          <h2 className="mb-4 text-lg font-semibold">Ein Fehler ist aufgetreten</h2>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm text-white"
          >
            Erneut versuchen
          </button>
        </div>
      </body>
    </html>
  );
}
