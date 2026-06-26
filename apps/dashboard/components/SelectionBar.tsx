"use client";

type SelectionBarProps = {
  count: number;
  names: string[];
  onConfirm: () => void;
  onClear: () => void;
  loading?: boolean;
};

export function SelectionBar({ count, names, onConfirm, onClear, loading }: SelectionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-dash-accent/50 bg-dash-card px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div>
        <p className="text-sm font-medium text-dash-text">
          {count} Kandidat{count === 1 ? "" : "en"} ausgewählt
        </p>
        <p className="text-xs text-dash-muted">{names.join(", ")}</p>
      </div>
      <button type="button" onClick={onClear} className="dash-btn-ghost text-xs">
        Zurücksetzen
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={onConfirm}
        className="dash-btn-primary"
      >
        {loading ? "Wird gesendet…" : "Zusage an Auswahl senden"}
      </button>
    </div>
  );
}
