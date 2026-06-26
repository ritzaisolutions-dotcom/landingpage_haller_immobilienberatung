import type { Besichtigungsslot } from "@/lib/types";

export function slotDateTime(datum: string, uhrzeit: string): Date {
  const time = uhrzeit.slice(0, 5);
  return new Date(`${datum}T${time}:00`);
}

/** Einzelbesichtigung: buchbar nur wenn frei und noch nicht belegt. */
export function isSlotBookable(
  slot: Besichtigungsslot,
  vorlaufzeitStunden = 2,
): boolean {
  if (slot.belegt > 0) return false;
  if (slot.slot_status !== "frei") return false;

  const slotTime = slotDateTime(slot.datum, slot.uhrzeit).getTime();
  const earliest = Date.now() + vorlaufzeitStunden * 60 * 60 * 1000;
  return slotTime >= earliest;
}

export function filterBookableSlots(
  slots: Besichtigungsslot[],
  vorlaufzeitStunden = 2,
): Besichtigungsslot[] {
  return slots.filter((slot) => isSlotBookable(slot, vorlaufzeitStunden));
}

export function slotStatusAfterBooking(): string {
  return "reserviert";
}
