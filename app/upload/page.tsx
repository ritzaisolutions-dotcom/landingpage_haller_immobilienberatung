import { Suspense } from "react";
import { UploadPageClient } from "@/components/UploadPageClient";

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-haller-bg text-haller-muted">
          Wird geladen…
        </div>
      }
    >
      <UploadPageClient />
    </Suspense>
  );
}
