"use client";

import { Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateDE, formatTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Besichtigungsslot } from "@/lib/types";

type SlotTableProps = {
  slots: Besichtigungsslot[];
  onDeleted: () => void;
};

export function SlotTable({ slots, onDeleted }: SlotTableProps) {
  const { showToast } = useToast();

  async function handleDelete(slot: Besichtigungsslot) {
    if (slot.belegt > 0) return;
    if (!confirm("Termin wirklich löschen?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("besichtigungsslots")
      .delete()
      .eq("id", slot.id);

    if (error) {
      showToast(error.message, "error");
      return;
    }

    showToast("Termin gelöscht");
    onDeleted();
  }

  if (slots.length === 0) {
    return (
      <p className="py-4 text-sm text-dash-muted">Keine Besichtigungstermine angelegt.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dash-border text-left text-xs text-dash-muted">
            <th className="pb-2 pr-4">Datum</th>
            <th className="pb-2 pr-4">Uhrzeit</th>
            <th className="pb-2 pr-4">Dauer</th>
            <th className="pb-2 pr-4">Belegung</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id} className="border-b border-dash-border/50">
              <td className="py-2.5 pr-4">{formatDateDE(slot.datum)}</td>
              <td className="py-2.5 pr-4">{formatTime(slot.uhrzeit)}</td>
              <td className="py-2.5 pr-4">{slot.dauer_minuten} Min.</td>
              <td className="py-2.5 pr-4">
                {slot.belegt > 0 ? "Belegt" : "Frei"}
              </td>
              <td className="py-2.5 pr-4">
                <StatusBadge status={slot.slot_status} variant="slot" />
              </td>
              <td className="py-2.5">
                {slot.belegt === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(slot)}
                    className="rounded p-1.5 text-dash-muted hover:bg-dash-danger/20 hover:text-dash-danger"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-xs text-dash-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
