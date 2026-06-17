import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  Lock,
  Shield,
  Smartphone,
} from "lucide-react";

const benefits = [
  {
    icon: Lock,
    title: "Sicher & DSGVO-konform",
    text: "Unterlagen werden verschlüsselt übertragen und nach 90 Tagen automatisch gelöscht.",
  },
  {
    icon: Smartphone,
    title: "Mobil optimiert",
    text: "Mieter können Schufa und Gehaltsnachweise direkt vom Smartphone hochladen.",
  },
  {
    icon: FileCheck,
    title: "Weniger Rückfragen",
    text: "Pflichtfelder und PDF-Validierung sorgen für vollständige Bewerbungen.",
  },
  {
    icon: Shield,
    title: "Persönlicher Link",
    text: "Jeder Interessent erhält einen einmaligen, zeitlich begrenzten Zugangslink.",
  },
];

const steps = [
  "Interessent erhält Link aus ImmoScout24",
  "Name ist bereits hinterlegt — nur Kontakt & PDFs ergänzen",
  "Ein Klick: Unterlagen sicher einreichen",
  "Ihr Team prüft und antwortet über ImmoScout24",
];

export function MarketingLanding() {
  return (
    <div className="min-h-screen bg-haller-bg text-haller-text">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <Image
            src="/logo_haller.png"
            alt="Haller Immobilienberatung GmbH"
            width={200}
            height={48}
            className="h-10 w-auto"
            priority
          />
          <span className="rounded-full border border-haller-border bg-haller-card px-3 py-1 text-xs font-medium text-haller-muted">
            RAIS Demo · Lead-Qualifizierung
          </span>
        </header>

        <section className="mb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-haller-accent">
              Hausverwaltung Haller · Andernach
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Bewerbungsportal für vorgeprüfte Mietinteressenten
            </h1>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-haller-muted">
              Statt E-Mail-Anhängen und unvollständigen Unterlagen: ein sicheres
              Portal, in dem Mieter Schufa und Entgeltnachweise strukturiert
              einreichen — personalisiert per Link, ohne Login.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/upload?t=demo"
                className="inline-flex items-center justify-center rounded-lg bg-haller-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Interaktive Demo öffnen
              </Link>
              <a
                href="#ablauf"
                className="inline-flex items-center justify-center rounded-lg border border-haller-border px-6 py-3 text-sm font-medium text-haller-text transition hover:border-haller-accent/50"
              >
                Ablauf ansehen
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-haller-border bg-haller-card p-6 shadow-2xl shadow-black/20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-haller-muted">
              So sieht der Mieter das Portal
            </p>
            <div className="space-y-3 rounded-xl border border-haller-border bg-haller-bg/80 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-haller-muted">Name</span>
                <span className="font-medium text-white">Anna Müller</span>
              </div>
              <div className="rounded-lg border border-dashed border-haller-border p-4 text-center">
                <p className="text-sm text-haller-text">Schufa-Auskunft (PDF)</p>
                <p className="mt-1 text-xs text-haller-muted">hochladen oder ablegen</p>
              </div>
              <div className="rounded-lg border border-haller-border bg-haller-card/50 px-3 py-2 text-xs text-haller-muted">
                DSGVO-Einwilligung · 90-Tage-Löschung
              </div>
              <div className="rounded-lg bg-haller-accent py-2.5 text-center text-sm font-semibold text-white">
                Unterlagen sicher einreichen
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 grid gap-4 sm:grid-cols-2">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-haller-border bg-haller-card p-5"
            >
              <item.icon className="mb-3 h-5 w-5 text-haller-accent" />
              <h2 className="mb-1 text-sm font-semibold text-white">{item.title}</h2>
              <p className="text-sm leading-relaxed text-haller-muted">{item.text}</p>
            </div>
          ))}
        </section>

        <section id="ablauf" className="mb-16 rounded-2xl border border-haller-border bg-haller-card p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Ablauf in 4 Schritten</h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-haller-accent/20 text-xs font-bold text-haller-accent">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-haller-muted">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-haller-success/30 bg-haller-success/5 p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-haller-success" />
          <h2 className="mb-2 text-lg font-semibold text-white">Bereit für die Live-Demo?</h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-haller-muted">
            Testen Sie den kompletten Upload-Flow mit Beispieldaten — ohne Datenbank,
            ohne Vertrag, ohne Risiko.
          </p>
          <Link
            href="/upload?t=demo"
            className="inline-flex items-center justify-center rounded-lg bg-haller-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Jetzt Demo starten
          </Link>
        </section>

        <footer className="mt-12 border-t border-haller-border pt-6 text-center text-xs text-haller-muted">
          Haller Immobilienberatung GmbH · Kirchberg 42 · 56626 Andernach · Demo by RAIS
        </footer>
      </div>
    </div>
  );
}
