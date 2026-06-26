import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { callN8nPost } from "@/lib/n8n";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = await callN8nPost("/webhook/slots-generieren", body);

  if (!result.ok) {
    Sentry.captureMessage(`n8n slots-generieren failed: ${result.error}`);
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
