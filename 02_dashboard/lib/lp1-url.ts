export function getLp1BaseUrl(): string {
  const base =
    process.env.LP1_BASE_URL ??
    process.env.NEXT_PUBLIC_LP1_BASE_URL ??
    "http://localhost:3000";
  return base.replace(/\/$/, "");
}

export function buildLp1TerminUrl(lp1Token: string): string {
  return `${getLp1BaseUrl()}/termin?t=${encodeURIComponent(lp1Token)}`;
}
