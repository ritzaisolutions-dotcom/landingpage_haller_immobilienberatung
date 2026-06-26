const N8N_BASE =
  process.env.N8N_WEBHOOK_BASE ??
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE ??
  "https://n8n.ritz-ai.solutions";

export type TerminGebuchtPayload = {
  /** WF2 loads lead by lp1_token per SYSTEM_ARCHITEKTUR_V2 §9 */
  lp1Token: string;
  leadUuid: string;
  slotId: string;
  name: string;
  email: string;
  telefon: string;
  /** IS24 inserat id (text) */
  inseratId: string;
  /** Supabase inserate.id (uuid) for staff pool / calendar */
  inseratUuid: string;
  datum: string;
  uhrzeit: string;
  /** LP1 already persisted slot+lead; WF2 should notify/calendar only */
  persistedByLp1: true;
};

export async function notifyTerminGebucht(
  payload: TerminGebuchtPayload,
): Promise<{ ok: boolean; status?: number }> {
  const url = `${N8N_BASE.replace(/\/$/, "")}/webhook/termin-gebucht`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
