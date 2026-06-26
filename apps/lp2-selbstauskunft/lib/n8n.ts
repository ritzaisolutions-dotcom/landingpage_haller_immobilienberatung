const N8N_BASE =
  process.env.N8N_WEBHOOK_BASE ??
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE ??
  "https://n8n.ritz-ai.solutions";

export type SelbstauskunftEingereichtPayload = {
  leadUuid: string;
  selbstauskunftId: string;
  inseratId: string;
  inseratUuid: string;
  typ: "miete" | "verkauf";
  persistedByLp2: true;
};

export async function notifyN8nWorkflow(
  leadUuid: string,
  email: string,
  telefon: string,
): Promise<void> {
  const webhookUrl = process.env.N8N_WF2_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadUuid, email, telefon }),
    });
  } catch (error) {
    console.error("n8n WF2 webhook failed:", error);
  }
}

export async function notifySelbstauskunftEingereicht(
  payload: SelbstauskunftEingereichtPayload,
): Promise<{ ok: boolean; status?: number }> {
  const url = `${N8N_BASE.replace(/\/$/, "")}/webhook/selbstauskunft-eingereicht`;

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
