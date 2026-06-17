import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { DemoBanner } from "./DemoBanner";
import { PortalHeader } from "./PortalHeader";

type SuccessScreenProps = {
  name: string;
  demoMode?: boolean;
};

export function SuccessScreen({ name, demoMode = false }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-haller-bg px-4 py-10 text-haller-text">
      <div className="mx-auto max-w-[580px] rounded-2xl border border-haller-border bg-haller-card p-8">
        <PortalHeader />
        {demoMode ? <DemoBanner className="mb-5" /> : null}
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="mb-5 h-16 w-16 text-haller-success" />
          <h1 className="mb-3 text-2xl font-semibold text-white">
            Vielen Dank, {name}!
          </h1>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-haller-text">
            Wir haben Ihre Unterlagen erhalten und werden diese in Kürze prüfen.
            Sie erhalten eine Nachricht über ImmoScout24, sobald wir Ihre Anfrage
            bearbeitet haben.
          </p>
          <p className="max-w-sm text-xs leading-relaxed text-haller-muted">
            Ihre Daten werden gemäß unserer Datenschutzerklärung nach 90 Tagen
            automatisch gelöscht.
          </p>
          {demoMode ? (
            <Link
              href="/"
              className="mt-8 text-sm font-medium text-haller-accent hover:underline"
            >
              Zurück zur Demo-Übersicht
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
