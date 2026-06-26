import type { Metadata } from "next";
import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalToc } from "@/components/legal/LegalToc";
import { PortalShell } from "@/components/PortalShell";
import {
  DATENSCHUTZ_PORTAL_SECTIONS,
  DEMO_HINWEIS,
  HALLER_MAIN_DATENSCHUTZ_URL,
  LAST_UPDATED,
} from "@/lib/legal/datenschutz-portal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Bewerbungsportal Haller",
  description:
    "Ausführliche Datenschutzerklärung für das sichere Bewerbungsportal der Haller Immobilienberatung GmbH",
};

export default function DatenschutzPage() {
  return (
    <PortalShell>
      <div className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl rounded border border-website-border bg-white p-8 shadow-sm sm:p-10">
          <h1 className="mb-2 text-2xl font-bold text-website-dark">
            Datenschutzerklärung
          </h1>
          <p className="mb-2 text-sm text-website-muted">
            für das sichere Bewerbungsportal zur Einreichung von Unterlagen im
            Rahmen einer Mietanfrage
          </p>
          <p className="mb-8 text-xs text-website-muted">
            Stand: {LAST_UPDATED}
          </p>

          <LegalToc sections={DATENSCHUTZ_PORTAL_SECTIONS} />

          <div className="space-y-8 text-sm leading-relaxed text-website-muted">
            {DATENSCHUTZ_PORTAL_SECTIONS.map((section, index) => (
              <LegalSection key={section.id} section={section} index={index} />
            ))}

            <section className="rounded-haller border border-amber-200 bg-amber-50 p-4">
              <h2 className="mb-2 text-base font-bold text-amber-900">
                {DEMO_HINWEIS.title}
              </h2>
              <p className="text-amber-900">{DEMO_HINWEIS.text}</p>
            </section>

            <section className="rounded-haller border border-website-border bg-website-bg p-4">
              <h2 className="mb-2 text-base font-bold text-website-dark">
                Allgemeine Datenschutzerklärung
              </h2>
              <p>
                Für die Datenverarbeitung auf der Unternehmenswebsite{" "}
                <a
                  href={HALLER_MAIN_DATENSCHUTZ_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-website-primary hover:underline"
                >
                  haller-immobilien.de
                </a>{" "}
                gelten die dort veröffentlichten Datenschutzhinweise.
              </p>
            </section>
          </div>

          <p className="mt-8 text-center text-sm">
            <Link
              href="/upload?t=demo"
              className="text-website-primary hover:underline"
            >
              ← Zurück zum Bewerbungsportal
            </Link>
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
