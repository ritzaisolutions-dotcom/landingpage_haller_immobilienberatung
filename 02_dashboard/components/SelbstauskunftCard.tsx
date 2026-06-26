"use client";

import { ChevronDown, ChevronUp, Phone, Star } from "lucide-react";
import { useState } from "react";
import { ScoreBadge } from "@/components/ScoreBadge";
import { useToast } from "@/components/Toast";
import {
  einkommensFaktorColor,
  formatCurrencyEUR,
  formatDateDE,
  getInitials,
  parseBulletList,
} from "@/lib/format";
import type { SelbstauskunftVergleich } from "@/lib/types";

type SelbstauskunftCardProps = {
  item: SelbstauskunftVergleich;
  isFavorit: boolean;
  onToggleFavorit: () => void;
  onAbsage: (id: string) => void;
  loading?: boolean;
};

const FACTOR_COLOR_CLASS = {
  green: "text-dash-success",
  amber: "text-dash-warning",
  red: "text-dash-danger",
  muted: "text-dash-muted",
} as const;

export function SelbstauskunftCard({
  item,
  isFavorit,
  onToggleFavorit,
  onAbsage,
  loading,
}: SelbstauskunftCardProps) {
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const decided = item.entscheidung != null;
  const isMiete = item.inserat_typ === "miete";
  const faktorColor = einkommensFaktorColor(item.einkommens_faktor);
  const staerken = parseBulletList(item.mistral_staerken);
  const risiken = parseBulletList(item.mistral_risiken);

  function handleContact() {
    if (item.lead_telefon) {
      window.open(`tel:${item.lead_telefon}`, "_self");
    } else if (item.lead_email) {
      window.open(`mailto:${item.lead_email}`, "_self");
    } else {
      showToast("Keine Kontaktdaten vorhanden", "error");
    }
  }

  return (
    <div
      className={`flex min-w-[280px] max-w-[300px] shrink-0 flex-col rounded-xl border p-4 transition-colors ${
        decided
          ? "border-dash-border-subtle bg-dash-card-alt opacity-70"
          : isFavorit
            ? "border-dash-accent bg-dash-accent/5 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]"
            : "border-dash-border bg-dash-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dash-accent/20 text-xs font-bold text-dash-accent">
            {getInitials(item.lead_name)}
          </div>
          <div>
            <p className="font-semibold text-dash-text">{item.lead_name}</p>
            <p className="text-xs text-dash-muted">{item.lead_email}</p>
          </div>
        </div>
        <ScoreBadge score={item.mistral_score} size="sm" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {isMiete ? (
          <>
            <Metric
              label="Einkommen"
              value={`${formatCurrencyEUR(item.nettoeinkommen_eur)}`}
              sub={
                item.einkommens_faktor != null
                  ? `${item.einkommens_faktor}x`
                  : undefined
              }
              subColor={FACTOR_COLOR_CLASS[faktorColor]}
            />
            <Metric label="Haushalt" value={`${item.haushaltsgroesse ?? "—"} Personen`} />
            <Metric
              label="Beschäftigung"
              value={item.beschaeftigung_status ?? "—"}
              sub={item.arbeitsverhaeltnis ?? undefined}
              subColor={
                item.arbeitsverhaeltnis === "unbefristet"
                  ? "text-dash-success"
                  : item.arbeitsverhaeltnis === "befristet"
                    ? "text-dash-warning"
                    : undefined
              }
            />
            <Metric
              label="Einzug"
              value={item.einzugstermin ? formatDateDE(item.einzugstermin) : "—"}
            />
          </>
        ) : (
          <>
            <Metric label="Budget" value={formatCurrencyEUR(item.kaufbudget_eur)} />
            <Metric label="Finanzierung" value={item.finanzierung_typ ?? "—"} />
            <Metric label="Kaufzeitraum" value={item.kaufzeitraum ?? "—"} />
            <Metric label="Eigenkapital" value={item.eigenkapital_vorhanden ?? "—"} />
          </>
        )}
      </div>

      {item.haustiere ? (
        <p className="mt-2 text-xs text-dash-warning">Haustiere: {item.haustiere_art ?? "Ja"}</p>
      ) : null}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 text-xs text-dash-muted hover:text-dash-text"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        Begründung
      </button>

      {expanded ? (
        <div className="mt-2 space-y-2 text-xs">
          {item.mistral_begruendung ? (
            <p className="italic text-dash-muted">{item.mistral_begruendung}</p>
          ) : null}
          {staerken.length > 0 ? (
            <ul className="space-y-0.5 text-dash-success">
              {staerken.map((s) => (
                <li key={s}>+ {s}</li>
              ))}
            </ul>
          ) : null}
          {risiken.length > 0 ? (
            <ul className="space-y-0.5 text-dash-danger">
              {risiken.map((r) => (
                <li key={r}>− {r}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {decided ? (
          <span className="text-sm font-medium text-dash-muted">
            {item.entscheidung === "zusage" ? "Zugesagt ✓" : "Abgesagt"}
            {item.entscheidung_at
              ? ` · ${new Date(item.entscheidung_at).toLocaleDateString("de-DE")}`
              : ""}
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggleFavorit}
              className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs ${
                isFavorit
                  ? "border-dash-accent bg-dash-accent/10 text-dash-accent"
                  : "border-dash-border text-dash-muted hover:text-dash-text"
              }`}
            >
              <Star className={`h-3 w-3 ${isFavorit ? "fill-current" : ""}`} />
              Favorit
            </button>
            <button
              type="button"
              onClick={handleContact}
              className="flex items-center gap-1 rounded-lg border border-dash-border px-3 py-1.5 text-xs text-dash-muted hover:text-dash-text"
            >
              <Phone className="h-3 w-3" />
              Kontakt
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => onAbsage(item.id)}
              className="dash-btn-danger px-3 py-1.5 text-xs"
            >
              Absagen
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="rounded-lg bg-dash-bg/50 p-2">
      <p className="text-[10px] uppercase text-dash-muted">{label}</p>
      <p className="font-medium text-dash-text">{value}</p>
      {sub ? <p className={`text-[10px] ${subColor ?? "text-dash-muted"}`}>{sub}</p> : null}
    </div>
  );
}
