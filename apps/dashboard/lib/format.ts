export function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export function formatDateHeaderDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRelativeDE(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Std.`;
  const diffD = Math.floor(diffH / 24);
  return `vor ${diffD} Tag${diffD === 1 ? "" : "en"}`;
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

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isWithin24Hours(datum: string, uhrzeit: string): boolean {
  const slotTime = new Date(`${datum}T${formatTime(uhrzeit)}:00`).getTime();
  const now = Date.now();
  const diff = slotTime - now;
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}

export function isTomorrow(datum: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return datum === tomorrow.toISOString().slice(0, 10);
}

export const TIME_OPTIONS: string[] = [];
for (let h = 8; h <= 18; h++) {
  for (const m of [0, 30]) {
    if (h === 18 && m > 0) break;
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

export const DURATION_OPTIONS = [30, 45, 60, 90] as const;

export const VORLAUF_OPTIONS = [
  { value: 1, label: "1 Stunde" },
  { value: 2, label: "2 Stunden" },
  { value: 4, label: "4 Stunden" },
  { value: 24, label: "24 Stunden" },
] as const;

export const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
  { value: 7, label: "So" },
] as const;

export function formatCurrencyEUR(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInseratPrice(inserat: {
  typ: string;
  kaltmiete_eur: number;
  kaufpreis_eur?: number | null;
}): string {
  if (inserat.typ === "verkauf") {
    return `Kaufpreis: ${formatCurrencyEUR(inserat.kaufpreis_eur)}`;
  }
  return `${formatCurrencyEUR(inserat.kaltmiete_eur)}/Mo`;
}

export function formatInseratMeta(inserat: {
  zimmer: number;
  flaeche_qm: number;
  typ: string;
  kaltmiete_eur: number;
  kaufpreis_eur?: number | null;
}): string {
  const base = `${inserat.zimmer} Zi · ${inserat.flaeche_qm}m²`;
  if (inserat.typ === "verkauf") {
    return `${base} · ${formatCurrencyEUR(inserat.kaufpreis_eur)}`;
  }
  return `${base} · ${formatCurrencyEUR(inserat.kaltmiete_eur)}/Mo`;
}

export function scoreColor(score: number | null): "green" | "amber" | "red" | "muted" {
  if (score == null) return "muted";
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
}

export function einkommensFaktorColor(faktor: number | null): "green" | "amber" | "red" | "muted" {
  if (faktor == null) return "muted";
  if (faktor >= 3) return "green";
  if (faktor >= 2) return "amber";
  return "red";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function parseBulletList(text: string | null): string[] {
  if (!text) return [];
  return text.split("|").map((s) => s.trim()).filter(Boolean);
}

export function isThisWeek(dateStr: string): boolean {
  const d = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return d >= start && d <= end;
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayISO();
}

export function isSlotPast(datum: string, uhrzeit: string): boolean {
  const slotTime = new Date(`${datum}T${formatTime(uhrzeit)}:00`).getTime();
  return slotTime <= Date.now();
}

export function slotUrgencyLabel(datum: string, uhrzeit: string): "Heute" | "Morgen" | null {
  if (isWithin24Hours(datum, uhrzeit) && isToday(datum)) return "Heute";
  if (isTomorrow(datum)) return "Morgen";
  return null;
}
