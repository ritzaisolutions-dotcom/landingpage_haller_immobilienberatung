import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabaseAdmin";
import { isTokenExpired } from "@/lib/types";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, uuid, name, inserat_id, email, telefon, status, created_at, dsgvo_accepted, dsgvo_accepted_at, nachricht_text, liquiditaet_erwaehnt, landing_page_url",
      )
      .eq("uuid", token)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "invalid_token" }, { status: 404 });
    }

    if (isTokenExpired(data.created_at)) {
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    return NextResponse.json({ lead: data });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
