import { AlertCircle } from "lucide-react";
import { PortalShell } from "./PortalShell";

type ErrorScreenProps = {
  title?: string;
  message: string;
};

export function ErrorScreen({
  title = "Link nicht gültig",
  message,
}: ErrorScreenProps) {
  return (
    <PortalShell>
      <div className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-[580px] rounded border border-website-border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h1 className="mb-3 text-xl font-bold text-website-dark">{title}</h1>
            <p className="max-w-sm text-sm leading-relaxed text-website-muted">
              {message}
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
