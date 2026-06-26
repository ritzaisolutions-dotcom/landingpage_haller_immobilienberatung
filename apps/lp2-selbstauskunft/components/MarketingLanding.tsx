import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ClipboardList, Lock, Shield, Smartphone } from "lucide-react";
import { PortalHeader } from "@/components/PortalHeader";

const DEMO_LP2_TOKEN = "demo-lp2-token-haller-2026";

const benefits = [
  {
    icon: Lock,
    title: "Sicher & DSGVO-konform",
    text: "Selbstauskunft-Daten werden verschlüsselt übertragen und nach Abschluss des Verfahrens automatisch gelöscht.",
  },
  {
    icon: Smartphone,
    title: "Mobil optimiert",
    text: "Mieter füllen die digitale Selbstauskunft direkt am Smartphone aus — ohne Unterlagen-Upload.",
  },
  {
    icon: ClipboardList,
    title: "Strukturierte Angaben",
    text: "Alle relevanten Felder einer Mieter-Selbstauskunft in klaren Schritten — auf Selbstauskunft.",
  },
  {
    icon: Shield,
    title: "Persönlicher Link",
    text: "Jeder Interessent erhält einen einmaligen, zeitlich begrenzten Zugangslink.",
  },
];

const steps = [
  "Interessent erhält Link nach der Besichtigung",
  "Digitale Mieter-Selbstauskunft in wenigen Schritten ausfüllen",
  "Datenschutz und Wahrheitsbestätigung per Checkbox",
  "Ihr Team prüft die Angaben und entscheidet",
];

export function MarketingLanding() {
  return (
    <div className="min-h-screen bg-website-bg text-website-text">
      <PortalHeader />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex justify-end">
          <span className="rounded-haller border border-website-border bg-white px-3 py-1 text-xs font-medium text-website-muted">
            RAIS Demo · Lead-Qualifizierung
          </span>
        </div>

        <section className="mb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-website-primary">
              Hausverwaltung Haller · Andernach
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-website-dark sm:text-4xl">
              Digitale Mieter-Selbstauskunft
            </h1>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-website-muted">
              Statt E-Mail-Anhängen und unvollständigen Unterlagen: eine strukturierte
              Selbstauskunft, die der Interessent online ausfüllt — personalisiert per Link,
              ohne Schufa-Upload und ohne Gehaltsnachweise.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/auskunft?t=${DEMO_LP2_TOKEN}`}
                className="inline-flex items-center justify-center rounded-haller bg-website-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0099b5]"
              >
                Interaktive Demo öffnen
              </Link>
              <a
                href="#ablauf"
                className="inline-flex items-center justify-center rounded-haller border border-website-border bg-white px-6 py-3 text-sm font-medium text-website-muted transition hover:border-website-primary"
              >
                Ablauf ansehen
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded border border-website-border bg-white shadow-sm">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="https://haller-immobilien.de/wp-content/uploads/2021/03/slide_start.jpg"
                alt="Immobilien Haller"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-website-muted">
                So sieht der Mieter das Formular
              </p>
              <div className="space-y-3 rounded-haller border border-website-border bg-website-bg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-website-muted">Schritt 1</span>
                  <span className="font-medium text-website-dark">Persönliche Angaben</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-website-muted">Schritt 2</span>
                  <span className="font-medium text-website-dark">Beruf & Einkommen</span>
                </div>
                <div className="rounded-haller border border-website-border bg-white px-3 py-2 text-xs text-website-muted">
                  Datenschutz · Wahrheitsbestätigung
                </div>
                <div className="rounded-haller bg-website-primary py-2.5 text-center text-sm font-semibold text-white">
                  Selbstauskunft einreichen
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 grid gap-4 sm:grid-cols-2">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="rounded border border-website-border bg-white p-5 shadow-sm"
            >
              <item.icon className="mb-3 h-5 w-5 text-website-primary" />
              <h2 className="mb-1 text-sm font-bold text-website-dark">{item.title}</h2>
              <p className="text-sm leading-relaxed text-website-muted">{item.text}</p>
            </div>
          ))}
        </section>

        <section
          id="ablauf"
          className="mb-16 rounded border border-website-border bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold text-website-dark">Ablauf in 4 Schritten</h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-website-primary/15 text-xs font-bold text-website-primary">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-website-muted">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded border border-website-primary/30 bg-white p-6 text-center shadow-sm sm:p-8">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-website-primary" />
          <h2 className="mb-2 text-lg font-bold text-website-dark">Bereit für die Live-Demo?</h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-website-muted">
            Testen Sie die digitale Mieter-Selbstauskunft mit Beispieldaten.
          </p>
          <Link
            href={`/auskunft?t=${DEMO_LP2_TOKEN}`}
            className="inline-flex items-center justify-center rounded-haller bg-website-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0099b5]"
          >
            Jetzt Demo starten
          </Link>
        </section>

        <footer className="mt-12 border-t border-website-border pt-6 text-center text-xs text-website-muted">
          Haller Immobilienberatung GmbH · Kirchberg 42 · 56626 Andernach · Demo by RAIS
        </footer>
      </div>
    </div>
  );
}
