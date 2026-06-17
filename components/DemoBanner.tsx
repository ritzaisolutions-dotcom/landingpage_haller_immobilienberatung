type DemoBannerProps = {
  className?: string;
};

export function DemoBanner({ className = "" }: DemoBannerProps) {
  return (
    <div
      className={`rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs leading-relaxed text-amber-200 ${className}`}
    >
      <strong className="font-semibold">Demo-Ansicht</strong> — Keine echten Daten
      werden übertragen. Nach Vertragsabschluss wird das Portal mit Ihrer Datenbank
      verbunden.
    </div>
  );
}
