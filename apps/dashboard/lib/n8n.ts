const N8N_BASE =
  process.env.N8N_WEBHOOK_BASE ??
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE ??
  process.env.NEXT_PUBLIC_N8N_BASE ??
  "https://n8n.ritz-ai.solutions";

export type N8nResult = { ok: true } | { ok: false; error: string };

export function buildEntscheidungPath(ids: string, entscheidung: string): string {
  const parts = ids.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 1) {
    return `/webhook/entscheidung?selfId=${encodeURIComponent(parts[0])}&entscheidung=${encodeURIComponent(entscheidung)}`;
  }
  return `/webhook/entscheidung?ids=${encodeURIComponent(parts.join(","))}&entscheidung=${encodeURIComponent(entscheidung)}`;
}

export async function callN8nWebhook(path: string): Promise<N8nResult> {
  const url = `${N8N_BASE}${path}`;
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) {
      return { ok: false, error: `webhook_failed_${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "webhook_error" };
  }
}

export async function callN8nPost(path: string, body: unknown): Promise<N8nResult> {
  const url = `${N8N_BASE}${path}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `webhook_failed_${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "webhook_error" };
  }
}
