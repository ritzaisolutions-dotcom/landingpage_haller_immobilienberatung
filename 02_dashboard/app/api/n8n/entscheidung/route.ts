import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { buildEntscheidungPath, callN8nWebhook } from "@/lib/n8n";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const ids = request.nextUrl.searchParams.get("ids");
  const entscheidung = request.nextUrl.searchParams.get("entscheidung");
  const selfId = request.nextUrl.searchParams.get("selfId");

  const idParam = ids ?? selfId;
  if (!idParam || !entscheidung || !["zusage", "absage"].includes(entscheidung)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await callN8nWebhook(buildEntscheidungPath(idParam, entscheidung));

  if (!result.ok) {
    Sentry.captureMessage(`n8n entscheidung failed: ${result.error}`);
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
