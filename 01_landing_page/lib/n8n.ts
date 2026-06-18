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
