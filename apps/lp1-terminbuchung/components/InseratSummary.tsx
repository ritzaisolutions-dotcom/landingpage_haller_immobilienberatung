import Image from "next/image";
import { formatInseratMeta } from "@/lib/format";
import type { Inserat } from "@/lib/types";

type InseratSummaryProps = {
  inserat: Inserat;
  /** When true, renders without outer lp-card (parent provides card). */
  embedded?: boolean;
};

function getFirstPhotoUrl(inserat: Inserat): string | null {
  const urls = inserat.foto_urls;
  if (!urls || !Array.isArray(urls) || urls.length === 0) return null;
  const first = urls[0];
  return typeof first === "string" && first.trim() ? first.trim() : null;
}

export function InseratSummary({ inserat, embedded = false }: InseratSummaryProps) {
  const photoUrl = getFirstPhotoUrl(inserat);
  const content = (
    <div className={photoUrl ? "flex gap-4" : undefined}>
      {photoUrl ? (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-card border border-lp-border bg-lp-surface">
          <Image
            src={photoUrl}
            alt={inserat.titel}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <h2 className="mb-1 text-xl font-bold text-lp-text">{inserat.titel}</h2>
        <p className="mb-3 text-sm text-lp-muted">{inserat.adresse}</p>
        <p className="text-sm font-medium text-lp-primary">{formatInseratMeta(inserat)}</p>
      </div>
    </div>
  );

  if (embedded) return content;

  return <div className="lp-card">{content}</div>;
}
