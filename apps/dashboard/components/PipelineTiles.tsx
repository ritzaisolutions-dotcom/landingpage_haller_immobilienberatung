"use client";

import Link from "next/link";
import { Calendar, ClipboardList, FileText, Inbox } from "lucide-react";
import type { PipelineCounts } from "@/lib/types";

type PipelineTilesProps = {
  counts: PipelineCounts;
};

const TILES = [
  {
    key: "neueBuchungen" as const,
    label: "Neue Buchungen",
    sub: "Letzte 48h",
    icon: Calendar,
    href: "/anfragen?status=termin_gebucht",
    accent: "text-dash-accent",
  },
  {
    key: "neueSelbstauskuenfte" as const,
    label: "Neue Selbstauskünfte",
    sub: "Unentschieden",
    icon: FileText,
    href: "/anfragen?tab=pipeline&status=selbstauskunft_eingereicht",
    accent: "text-dash-success",
  },
  {
    key: "entscheidungenOffen" as const,
    label: "Entscheidungen offen",
    sub: "KI bewertet",
    icon: ClipboardList,
    href: "/anfragen?tab=pipeline&status=selbstauskunft_eingereicht",
    accent: "text-dash-warning",
  },
  {
    key: "frueheAnfragen" as const,
    label: "Frühe Anfragen",
    sub: "Neu / Link gesendet",
    icon: Inbox,
    href: "/anfragen?tab=frueh",
    accent: "text-dash-muted",
  },
];

export function PipelineTiles({ counts }: PipelineTilesProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {TILES.map(({ key, label, sub, icon: Icon, href, accent }) => {
        const count = counts[key];
        return (
          <Link
            key={key}
            href={href}
            className="dash-card flex items-center gap-4 p-4 transition-colors hover:border-dash-accent/40"
          >
            <div className={`rounded-lg bg-dash-card-alt p-3 ${accent}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dash-text">{count}</p>
              <p className="text-sm font-medium text-dash-text">{label}</p>
              <p className="text-xs text-dash-muted">{sub}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
