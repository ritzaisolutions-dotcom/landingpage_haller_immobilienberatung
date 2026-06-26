import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { formatInseratMeta } from "@/lib/format";
import type { Inserat } from "@/lib/types";

type InseratProfileHeaderProps = {
  inserat: Inserat;
};

export function InseratProfileHeader({ inserat }: InseratProfileHeaderProps) {
  const fotos = inserat.foto_urls ?? [];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dash-text">{inserat.titel}</h1>
          <p className="mt-1 text-dash-muted">{inserat.adresse}</p>
          <p className="mt-1 text-sm text-dash-muted">{formatInseratMeta(inserat)}</p>
          <div className="mt-2 flex gap-2">
            <StatusBadge status={inserat.typ} variant="inserat" />
            <StatusBadge status={inserat.status} variant="inserat" />
          </div>
        </div>
        {inserat.is24_url ? (
          <a
            href={inserat.is24_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-dash-border px-3 py-2 text-sm text-dash-muted hover:text-dash-text"
          >
            <ExternalLink className="h-4 w-4" />
            IS24 öffnen
          </a>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {fotos.length > 0 ? (
          fotos.slice(0, 4).map((url) => (
            <div
              key={url}
              className="aspect-video rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            />
          ))
        ) : (
          <div className="col-span-2 flex aspect-video items-center justify-center rounded-lg border border-dashed border-dash-border bg-dash-card-alt text-sm text-dash-muted sm:col-span-4">
            Keine Fotos verfügbar
          </div>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { href: "buchungsfenster", label: "Buchungsfenster" },
  { href: "zustaendigkeiten", label: "Zuständigkeit" },
  { href: "slots", label: "Slots" },
  { href: "besichtigungen", label: "Besichtigungen" },
  { href: "selbstauskuenfte", label: "Selbstauskünfte" },
] as const;

export function InseratTabNav({ inseratId, active }: { inseratId: string; active: string }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b border-dash-border">
      {TABS.map((tab) => {
        const isActive = active === tab.href;
        return (
          <Link
            key={tab.href}
            href={`/inserate/${inseratId}/${tab.href}`}
            className={`border-b-2 px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? "border-dash-accent text-dash-accent"
                : "border-transparent text-dash-muted hover:text-dash-text"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
