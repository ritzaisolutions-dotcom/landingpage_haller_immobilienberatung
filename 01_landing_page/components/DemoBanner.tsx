type DemoBannerProps = {
  className?: string;
};

export function DemoBanner({ className = "" }: DemoBannerProps) {
  return (
    <div
      className={`rounded-haller border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs leading-relaxed text-amber-900 ${className}`}
    >
      <strong className="font-semibold">Demo-Ansicht</strong> — Keine echten Daten
      werden übertragen. Nach Vertragsabschluss wird das Portal mit Ihrer Datenbank
      verbunden.
    </div>
  );
}
