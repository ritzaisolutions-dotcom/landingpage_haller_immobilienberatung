export function getLp2BaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_LP2_BASE_URL ??
    process.env.LP2_BASE_URL ??
    "http://localhost:3001";
  return base.replace(/\/$/, "");
}

export function buildLp2AuskunftUrl(lp2Token: string): string {
  return `${getLp2BaseUrl()}/auskunft?t=${encodeURIComponent(lp2Token)}`;
}
