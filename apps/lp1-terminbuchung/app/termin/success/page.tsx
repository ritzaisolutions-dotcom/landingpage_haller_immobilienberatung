import { CheckCircle2 } from "lucide-react";
import { LpShell } from "@/components/LpShell";
import { formatDateDE, formatTimeUhr } from "@/lib/format";

type SuccessPageProps = {
  searchParams: { datum?: string; uhrzeit?: string; adresse?: string };
};

export default function TerminSuccessPage({ searchParams }: SuccessPageProps) {
  const datum = searchParams.datum ?? "";
  const uhrzeit = searchParams.uhrzeit ?? "";
  const adresse = searchParams.adresse ?? "";

  return (
    <LpShell>
      <div className="lp-card text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-lp-success" />
        <h1 className="mb-2 text-[28px] font-extrabold text-lp-text">
          Ihr Besichtigungstermin ist bestätigt!
        </h1>
        <p className="mb-8 text-sm text-lp-muted">
          Sie erhalten in Kürze eine Bestätigung per Nachricht.
        </p>

        {datum ? (
          <div className="mx-auto mb-8 max-w-sm space-y-2 rounded-card border border-lp-border bg-lp-bg p-4 text-left text-sm">
            <p>
              <span className="font-semibold">Datum:</span> {formatDateDE(datum)}
            </p>
            {uhrzeit ? (
              <p>
                <span className="font-semibold">Uhrzeit:</span> {formatTimeUhr(uhrzeit)}
              </p>
            ) : null}
            {adresse ? (
              <p>
                <span className="font-semibold">Adresse:</span> {adresse}
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="text-sm text-lp-muted">
          Bei Fragen erreichen Sie uns unter{" "}
          <a href="tel:+49263294580" className="font-semibold text-lp-primary">
            02632 9458-0
          </a>
        </p>
      </div>
    </LpShell>
  );
}
