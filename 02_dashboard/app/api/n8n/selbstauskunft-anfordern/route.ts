import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { callN8nWebhook } from "@/lib/n8n";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const leadId = request.nextUrl.searchParams.get("leadId");
  if (!leadId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await callN8nWebhook(
    `/webhook/selbstauskunft-anfordern?leadId=${encodeURIComponent(leadId)}`,
  );

  if (!result.ok) {
    Sentry.captureMessage(`n8n selbstauskunft-anfordern failed: ${result.error}`);
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
