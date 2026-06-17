import type { Metadata } from "next";
import Link from "next/link";
import { PortalHeader } from "@/components/PortalHeader";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Bewerbungsportal Haller",
  description:
    "Datenschutzerklärung für das sichere Bewerbungsportal der Haller Immobilienberatung GmbH",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-haller-bg px-4 py-10 text-haller-text">
      <div className="mx-auto max-w-3xl rounded-2xl border border-haller-border bg-haller-card p-8 sm:p-10">
        <PortalHeader />

        <h1 className="mb-2 text-2xl font-semibold text-white">
          Datenschutzerklärung
        </h1>
        <p className="mb-8 text-sm text-haller-muted">
          für das sichere Bewerbungsportal zur Einreichung von Unterlagen im
          Rahmen einer Mietanfrage
        </p>

        <div className="prose-haller space-y-8 text-sm leading-relaxed text-haller-muted">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlich für die Datenverarbeitung im Zusammenhang mit diesem
              Bewerbungsportal ist:
            </p>
            <p className="mt-2 text-haller-text">
              Haller Immobilienberatung GmbH
              <br />
              Kirchberg 42
              <br />
              56626 Andernach
              <br />
              Telefon: 02632 9458-0
              <br />
              E-Mail:{" "}
              <a
                href="mailto:info@haller-immobilien.de"
                className="text-haller-accent hover:underline"
              >
                info@haller-immobilien.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              2. Zweck der Verarbeitung
            </h2>
            <p>
              Dieses Portal dient der strukturierten Einreichung von Unterlagen
              für eine bestehende Mietanfrage. Sie erhalten einen persönlichen
              Link, über den Sie fehlende Dokumente sicher übermitteln können, damit
              die Haller Immobilienberatung GmbH Ihre Anfrage prüfen und
              bearbeiten kann.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              3. Verarbeitete Daten
            </h2>
            <p>Im Portal werden insbesondere folgende Daten verarbeitet:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Name (wird aus Ihrer bestehenden Anfrage übernommen)</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>
                hochgeladene PDF-Dokumente, insbesondere Schufa-Auskunft,
                Entgeltnachweise der letzten drei Monate sowie optional eine
                Bürgschaft der Eltern
              </li>
              <li>
                technische Metadaten zum Upload (z. B. Zeitpunkt der Einreichung)
              </li>
              <li>
                Nachweis Ihrer Einwilligung (Zeitpunkt und Bestätigung der
                Zustimmung)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              4. Rechtsgrundlage
            </h2>
            <p>
              Die Verarbeitung Ihrer Daten und Unterlagen erfolgt auf Grundlage
              Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Die Einwilligung
              erteilen Sie durch das aktive Setzen der Checkbox vor dem Absenden
              des Formulars. Ohne diese Zustimmung ist eine Nutzung des Portals
              nicht möglich.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              5. Speicherdauer und Löschung
            </h2>
            <p>
              Ihre hochgeladenen Unterlagen und die dazugehörigen Kontaktdaten
              werden ausschließlich zur Bearbeitung Ihrer Mietanfrage verwendet und
              nach Abschluss der Prüfung spätestens{" "}
              <strong className="text-haller-text">90 Tage</strong> nach
              Einreichung automatisch gelöscht, sofern keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              6. Empfänger und Weitergabe
            </h2>
            <p>
              Eine Weitergabe Ihrer Daten an Dritte zu Werbe- oder anderen
              Zwecken erfolgt nicht. Zugriff haben ausschließlich berechtigte
              Mitarbeitende der Haller Immobilienberatung GmbH im Rahmen der
              Bearbeitung Ihrer Mietanfrage.
            </p>
            <p className="mt-2">
              Zur technischen Bereitstellung des Portals können Auftragsverarbeiter
              eingesetzt werden (z. B. Hosting- und Speicherdienstleister in der
              Europäischen Union). Diese verarbeiten Daten nur nach Weisung des
              Verantwortlichen und unter angemessenen Schutzmaßnahmen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              7. Widerruf der Einwilligung
            </h2>
            <p>
              Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
              widerrufen. Senden Sie dazu eine E-Mail an{" "}
              <a
                href="mailto:info@haller-immobilien.de"
                className="text-haller-accent hover:underline"
              >
                info@haller-immobilien.de
              </a>
              . Im Falle eines Widerrufs können wir Ihre Mietanfrage ggf. nicht
              weiter bearbeiten, soweit uns die erforderlichen Unterlagen dann
              nicht mehr zur Verfügung stehen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              8. Ihre Rechte
            </h2>
            <p>Sie haben gegenüber dem Verantwortlichen insbesondere folgende Rechte:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-2">
              Zudem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">
              9. Datensicherheit
            </h2>
            <p>
              Die Übertragung erfolgt verschlüsselt (TLS). Hochgeladene Dokumente
              werden in einem geschützten Bereich gespeichert und sind nicht
              öffentlich abrufbar. Der Zugang zum Portal erfolgt über einen
              personalisierten, zeitlich begrenzten Link.
            </p>
          </section>

          <section className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <h2 className="mb-2 text-base font-semibold text-amber-200">
              Hinweis zur Demo-Version
            </h2>
            <p>
              In der öffentlichen Demo-Ansicht werden keine echten Daten an eine
              Datenbank übermittelt. Uploads werden nur simuliert, um den späteren
              Ablauf zu veranschaulichen.
            </p>
          </section>

          <p className="text-xs text-haller-muted">
            Stand: Juni 2026
          </p>
        </div>

        <p className="mt-8 text-center text-sm">
          <Link href="/upload?t=demo" className="text-haller-accent hover:underline">
            ← Zurück zum Bewerbungsportal
          </Link>
        </p>
      </div>
    </div>
  );
}
