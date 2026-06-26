export function formatDateHeaderDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTimeUhr(timeStr: string): string {
  return `${timeStr.slice(0, 5)} Uhr`;
}

export function formatCurrencyEUR(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInseratMeta(inserat: {
  typ: string;
  zimmer: number;
  flaeche_qm: number;
  kaltmiete_eur: number;
  kaufpreis_eur?: number | null;
}): string {
  if (inserat.typ === "verkauf") {
    return `Kaufobjekt · ${inserat.zimmer} Zimmer · ${inserat.flaeche_qm} m² · Kaufpreis: ${formatCurrencyEUR(inserat.kaufpreis_eur)}`;
  }
  return `Mietwohnung · ${inserat.zimmer} Zimmer · ${inserat.flaeche_qm} m² · ${formatCurrencyEUR(inserat.kaltmiete_eur)}/Monat`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateTimeDE(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
