import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { DemoBanner } from "./DemoBanner";
import { PortalFooter } from "./PortalFooter";
import { PortalShell } from "./PortalShell";

type SuccessScreenProps = {
  name: string;
  demoMode?: boolean;
};

export function SuccessScreen({ name, demoMode = false }: SuccessScreenProps) {
  return (
    <PortalShell>
      <div className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-[580px] rounded border border-website-border bg-white p-8 shadow-sm">
          {demoMode ? <DemoBanner className="mb-5" /> : null}
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="mb-5 h-16 w-16 text-website-primary" />
            <h1 className="mb-3 text-2xl font-bold text-website-dark">
              Vielen Dank, {name}!
            </h1>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-website-text">
              Wir haben Ihre Unterlagen erhalten und werden diese in Kürze prüfen.
              Sie erhalten eine Nachricht über ImmoScout24, sobald wir Ihre Anfrage
              bearbeitet haben.
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-website-muted">
              Ihre Daten werden gemäß unserer Datenschutzerklärung nach 90 Tagen
              automatisch gelöscht.
            </p>
            {demoMode ? (
              <Link
                href="/"
                className="mt-8 text-sm font-medium text-website-primary hover:underline"
              >
                Zurück zur Demo-Übersicht
              </Link>
            ) : null}
          </div>
          <PortalFooter demoMode={demoMode} />
        </div>
      </div>
    </PortalShell>
  );
}
