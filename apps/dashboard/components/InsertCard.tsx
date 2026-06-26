import { formatInseratMeta } from "@/lib/format";
import type { Inserat } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

type InsertCardProps = {
  inserat: Inserat;
  selected?: boolean;
  onClick: () => void;
};

export function InsertCard({ inserat, selected, onClick }: InsertCardProps) {
  const foto = inserat.foto_urls?.[0] ?? null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full gap-3 rounded-lg border p-3 text-left transition-colors ${
        selected
          ? "border-l-2 border-l-dash-accent border-dash-accent/50 bg-dash-accent/5"
          : "border-dash-border-subtle bg-dash-card-alt hover:border-dash-border"
      }`}
    >
      {foto ? (
        <div
          className="h-12 w-12 shrink-0 rounded-md bg-cover bg-center"
          style={{ backgroundImage: `url(${foto})` }}
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-dashed border-dash-border bg-dash-card text-[9px] text-dash-muted">
          Kein Foto
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-dash-text">{inserat.titel}</p>
        <p className="mt-0.5 truncate text-xs text-dash-muted">{inserat.adresse}</p>
        <p className="mt-1 text-xs text-dash-muted">{formatInseratMeta(inserat)}</p>
        <div className="mt-2 flex gap-1.5">
          <StatusBadge status={inserat.typ} variant="inserat" />
          <StatusBadge status={inserat.status} variant="inserat" />
        </div>
      </div>
    </button>
  );
}
