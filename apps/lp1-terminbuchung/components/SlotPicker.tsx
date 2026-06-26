import { formatDateHeaderDE, formatTimeUhr } from "@/lib/format";
import type { Besichtigungsslot } from "@/lib/types";

type SlotPickerProps = {
  slots: Besichtigungsslot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function SlotPicker({ slots, selectedId, onSelect }: SlotPickerProps) {
  if (slots.length === 0) {
    return (
      <div className="rounded-card border border-lp-border bg-lp-surface p-6 text-center text-sm text-lp-muted">
        Derzeit sind keine Termine verfügbar. Wir melden uns in Kürze bei Ihnen.
      </div>
    );
  }

  const grouped = new Map<string, Besichtigungsslot[]>();
  for (const slot of slots) {
    const list = grouped.get(slot.datum) ?? [];
    list.push(slot);
    grouped.set(slot.datum, list);
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([datum, daySlots]) => (
        <div key={datum}>
          <h3 className="mb-3 text-sm font-semibold capitalize text-lp-text">
            {formatDateHeaderDE(datum)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => {
              const selected = selectedId === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelect(slot.id)}
                  className={`lp-btn-slot ${selected ? "lp-btn-slot-selected" : ""}`}
                >
                  {formatTimeUhr(slot.uhrzeit)} · {slot.dauer_minuten} Min.
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
