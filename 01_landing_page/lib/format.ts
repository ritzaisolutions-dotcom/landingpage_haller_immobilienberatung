export function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatCurrencyEUR(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function minEinzugISO(daysFromNow = 14): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export function monthYearOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 480; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const label = d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
    options.push({ value, label });
  }
  return options;
}
