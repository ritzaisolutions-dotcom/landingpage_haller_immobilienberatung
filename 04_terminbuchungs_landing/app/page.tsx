import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { LpShell } from "@/components/LpShell";
import { DEMO_LP1_TOKEN } from "@/lib/types";

export default function HomePage() {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <LpShell>
      <div className="lp-card text-center">
        <CalendarDays className="mx-auto mb-4 h-12 w-12 text-lp-primary" />
        <h1 className="mb-2 text-[28px] font-extrabold text-lp-text">Besichtigungstermin buchen</h1>
        <p className="text-sm text-lp-muted">
          Bitte öffnen Sie den persönlichen Link aus Ihrer Nachricht von Haller Immobilienberatung.
          Dort können Sie einen passenden Besichtigungstermin für Ihr Wunschobjekt auswählen.
        </p>
        <p className="mt-4 text-sm text-lp-muted">
          Der Link ist 72 Stunden gültig. Bei Fragen erreichen Sie uns unter{" "}
          <a href="tel:+49263294580" className="font-semibold text-lp-primary">
            02632 9458-0
          </a>
          .
        </p>
        {isDev ? (
          <div className="mt-6 rounded-card border border-dashed border-lp-border bg-lp-bg p-4 text-left text-sm">
            <p className="mb-2 font-semibold text-lp-text">Entwicklung</p>
            <p className="mb-3 text-lp-muted">Demo-Buchungsseite mit Testdaten:</p>
            <Link
              href={`/termin?t=${DEMO_LP1_TOKEN}`}
              className="text-lp-primary underline hover:opacity-90"
            >
              /termin?t={DEMO_LP1_TOKEN}
            </Link>
          </div>
        ) : null}
      </div>
    </LpShell>
  );
}
