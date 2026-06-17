import { AlertCircle } from "lucide-react";
import { PortalHeader } from "./PortalHeader";

type ErrorScreenProps = {
  title?: string;
  message: string;
};

export function ErrorScreen({
  title = "Link nicht gültig",
  message,
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-haller-bg px-4 py-10 text-haller-text">
      <div className="mx-auto max-w-[580px] rounded-2xl border border-haller-border bg-haller-card p-8">
        <PortalHeader />
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="mb-3 text-xl font-semibold text-white">{title}</h1>
          <p className="max-w-sm text-sm leading-relaxed text-haller-muted">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
