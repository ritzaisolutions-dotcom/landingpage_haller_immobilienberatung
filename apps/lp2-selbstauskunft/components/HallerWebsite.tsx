import Image from "next/image";
import Link from "next/link";
import { Building2, Home, KeyRound, Layers } from "lucide-react";

const services = [
  {
    icon: KeyRound,
    title: "Immobilie verkaufen",
    claim: "KOMPETENT – KOMFORTABEL – ERFOLGREICH",
    text: "Von der Wertermittlung bis zum Notartermin — über 30 Jahre Erfahrung im Raum Andernach, Koblenz und Neuwied.",
    href: "https://haller-immobilien.de/immobilie-verkaufen/",
  },
  {
    icon: Home,
    title: "Immobilienangebote",
    claim: "Ihre Ideen werden bei uns Wirklichkeit",
    text: "Eigentumswohnungen, Häuser und Kapitalanlagen — persönliche Beratung und Suchprofil-Service.",
    href: "https://haller-immobilien.de/immobilienangebote/",
  },
  {
    icon: Building2,
    title: "Hausverwaltung",
    claim: "Jede Immobilie ein gewinnbringendes Investment",
    text: "WEG- und Mietverwaltung ab 3 Wohneinheiten — zertifizierter WEG-Verwalter IHK, Mitglied VDIV.",
    href: "https://haller-immobilien.de/hausverwaltung/",
  },
  {
    icon: Layers,
    title: "Projekte",
    claim: "Kompetent – Komfortabel – Erfolgreich",
    text: "Loftpark, Rheinpalais und weitere Neubauprojekte in Andernach — schlüsselfertig geplant.",
    href: "https://haller-immobilien.de/projekte/",
  },
];

const team = [
  {
    name: "Waldemar Haller",
    role: "Geschäftsführer",
    image:
      "https://haller-immobilien.de/wp-content/uploads/2024/05/WH-Profil--scaled-600x600.jpg",
  },
  {
    name: "Birgit Zerwas",
    role: "Büroleitung & Marketing",
    image:
      "https://haller-immobilien.de/wp-content/uploads/2021/03/Birgit-Pritzer_1440x1440.jpg",
  },
  {
    name: "Björn Jonas",
    role: "Technische Hausverwaltung",
    image:
      "https://haller-immobilien.de/wp-content/uploads/2021/03/Bjoern-Jonas_1440x1440.jpg",
  },
];

const partners = [
  {
    name: "VDIV RLP/Saarland",
    image: "https://haller-immobilien.de/wp-content/uploads/2020/05/vdiv.jpg",
  },
  {
    name: "immowelt Diamond Partner",
    image: "https://haller-immobilien.de/wp-content/uploads/2020/07/immowelt3.jpg",
  },
  {
    name: "MPLUS Architekten",
    image: "https://haller-immobilien.de/wp-content/uploads/2020/05/mplus.jpg",
  },
  {
    name: "RAHMIG Architekturbüro",
    image: "https://haller-immobilien.de/wp-content/uploads/2020/05/rahmig.jpg",
  },
];

const nav = [
  { label: "Verkauf", href: "#leistungen" },
  { label: "Kauf", href: "#leistungen" },
  { label: "Hausverwaltung", href: "#leistungen" },
  { label: "Team", href: "#team" },
  { label: "Kontakt", href: "#kontakt" },
];

export function HallerWebsite() {
  return (
    <div className="min-h-screen bg-website-bg text-website-text">
      <div className="h-1 bg-website-primary" />

      <header className="bg-website-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Image
            src="/logo_haller.png"
            alt="Haller Immobilienberatung GmbH"
            width={200}
            height={48}
            className="h-10 w-auto"
            priority
          />
          <nav className="flex flex-wrap gap-4 text-sm">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/80 transition hover:text-website-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-website-dark text-white">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://haller-immobilien.de/wp-content/uploads/2021/03/slide_start.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-3 text-sm italic text-white/70">
            „Ein Haus wird gebaut, aber ein Zuhause wird geformt." — Hazrat Inayat Khan
          </p>
          <h1 className="mb-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            Ihr Immobilienmakler in Andernach, Koblenz & Neuwied
          </h1>
          <p className="mb-2 text-lg font-semibold text-website-primary">
            Persönlich – Zuverlässig – Professionell
          </p>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-white/80">
            Seit über 30 Jahren begleiten wir Sie als „Allgemeinmediziner für
            Wohnraum" — vom Verkauf über den Kauf bis zur professionellen
            Hausverwaltung.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#kontakt"
              className="rounded bg-website-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0099b5]"
            >
              Beratungstermin anfragen
            </a>
            <a
              href="tel:+49263294580"
              className="rounded border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:border-website-primary"
            >
              02632 9458-0
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-website-dark">
              Herzlich willkommen bei der Haller Immobilienberatung GmbH
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-website-muted">
              Immobilien sind seit über 30 Jahren unsere Leidenschaft. Als
              inhabergeführtes Maklerunternehmen unterstützen wir Sie mit
              ehrlicher Freundlichkeit, persönlich und individuell auf dem Weg
              zu Ihrem Immobilienziel.
            </p>
            <p className="text-sm font-bold tracking-wide text-website-primary">
              H · Heim · A · Als · L · Langfristigen · L · Lebensmittelpunkt · E · Erfolgreich · R · Realisieren
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="https://haller-immobilien.de/wp-content/uploads/2024/05/WH-Profil--scaled-600x600.jpg"
              alt="Waldemar Haller, Geschäftsführer"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="leistungen" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-bold text-website-dark">
            Unsere Leistungen
          </h2>
          <p className="mb-10 text-center text-sm text-website-muted">
            Kompetent – Komfortabel – Erfolgreich
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <a
                key={service.title}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded border border-website-border bg-website-bg p-6 transition hover:border-website-primary/40 hover:shadow-md"
              >
                <service.icon className="mb-3 h-6 w-6 text-website-primary" />
                <h3 className="mb-1 font-bold text-website-dark">{service.title}</h3>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-website-primary">
                  {service.claim}
                </p>
                <p className="text-sm leading-relaxed text-website-muted">
                  {service.text}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-2 text-center text-2xl font-bold text-website-dark">
          Gemeinsam mehr erreichen
        </h2>
        <p className="mb-10 text-center text-sm text-website-muted">
          Ihr Team in Andernach
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="overflow-hidden rounded border border-website-border bg-white text-center"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[200px]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="font-bold text-website-dark">{member.name}</p>
                <p className="text-sm text-website-muted">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-website-border bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4 sm:px-6">
          {partners.map((partner) => (
            <Image
              key={partner.name}
              src={partner.image}
              alt={partner.name}
              width={120}
              height={48}
              className="h-10 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </section>

      <section id="kontakt" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-website-dark">
              Wir freuen uns über Ihre Anfrage
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-website-muted">
              Haller Immobilienberatung GmbH
              <br />
              Kirchberg 42, 56626 Andernach
              <br />
              Tel:{" "}
              <a href="tel:+49263294580" className="text-website-primary hover:underline">
                02632 9458-0
              </a>
              <br />
              E-Mail:{" "}
              <a
                href="mailto:info@haller-immobilien.de"
                className="text-website-primary hover:underline"
              >
                info@haller-immobilien.de
              </a>
            </p>
            <p className="text-xs text-website-muted">
              Büro: Mo–Fr 09:00–17:00 Uhr · Termine nach Vereinbarung
              <br />
              Zertifizierter WEG-Verwalter IHK
            </p>
          </div>
          <form className="space-y-4 rounded border border-website-border bg-white p-6">
            <p className="text-sm font-semibold text-website-dark">Kontaktformular (Demo)</p>
            <input
              type="text"
              placeholder="Ihr Name"
              className="w-full rounded border border-website-border px-3 py-2 text-sm outline-none focus:border-website-primary"
            />
            <input
              type="email"
              placeholder="Ihre E-Mail"
              className="w-full rounded border border-website-border px-3 py-2 text-sm outline-none focus:border-website-primary"
            />
            <select className="w-full rounded border border-website-border px-3 py-2 text-sm text-website-muted outline-none focus:border-website-primary">
              <option>Immobilie verkaufen</option>
              <option>Immobilie kaufen</option>
              <option>Vermietung / Hausverwaltung</option>
              <option>Allgemeine Frage</option>
            </select>
            <textarea
              rows={4}
              placeholder="Ihre Nachricht"
              className="w-full rounded border border-website-border px-3 py-2 text-sm outline-none focus:border-website-primary"
            />
            <button
              type="button"
              className="w-full rounded bg-website-primary py-3 text-sm font-semibold text-white transition hover:bg-[#0099b5]"
            >
              Nachricht senden (Demo)
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-website-dark px-4 py-8 text-center text-xs text-white/60 sm:px-6">
        <p className="mb-2">
          <a
            href="https://haller-immobilien.de/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-website-primary"
          >
            Impressum
          </a>
          {" · "}
          <a
            href="https://haller-immobilien.de/datenschutzerklaerung/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-website-primary"
          >
            Datenschutz
          </a>
          {" · "}
          <a
            href="https://haller-immobilien.de/agb/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-website-primary"
          >
            AGB
          </a>
        </p>
        <p>© Haller Immobilienberatung GmbH · Demo-Landingpage by RAIS</p>
        <p className="mt-2">
          <Link href="/" className="text-website-primary hover:underline">
            ← RAIS Produkt-Demo
          </Link>
        </p>
      </footer>
    </div>
  );
}
