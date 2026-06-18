import { NextRequest, NextResponse } from "next/server";
import { notifyN8nWorkflow } from "@/lib/n8n";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabaseAdmin";
import { isTokenExpired, MAX_FILE_SIZE_BYTES } from "@/lib/types";

const ALLOWED_FILES = new Set([
  "schufa.pdf",
  "entgelt_1.pdf",
  "entgelt_2.pdf",
  "entgelt_3.pdf",
  "buergschaft.pdf",
]);

const REQUIRED_FILES = new Set(["schufa.pdf", "entgelt_1.pdf"]);

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export async function POST(request: NextRequest) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const token = formData.get("token");
  const email = formData.get("email");
  const telefon = formData.get("telefon");

  if (
    typeof token !== "string" ||
    typeof email !== "string" ||
    typeof telefon !== "string" ||
    !token.trim() ||
    !email.trim() ||
    !telefon.trim()
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("uuid, status, created_at")
    .eq("uuid", token)
    .maybeSingle();

  if (leadError || !lead) {
    return NextResponse.json({ error: "invalid_token" }, { status: 404 });
  }

  if (isTokenExpired(lead.created_at)) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  if (lead.status === "dokumente_eingereicht") {
    return NextResponse.json({ error: "already_submitted" }, { status: 409 });
  }

  const uploads = new Map<string, File>();
  for (const [key, value] of Array.from(formData.entries())) {
    if (key === "token" || key === "email" || key === "telefon") continue;
    if (!(value instanceof File) || value.size === 0) continue;
    if (!ALLOWED_FILES.has(key)) continue;
    uploads.set(key, value);
  }

  for (const required of Array.from(REQUIRED_FILES)) {
    if (!uploads.has(required)) {
      return NextResponse.json({ error: "missing_files" }, { status: 400 });
    }
  }

  for (const [name, file] of Array.from(uploads.entries())) {
    if (!isPdf(file)) {
      return NextResponse.json({ error: "invalid_file_type", file: name }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "file_too_large", file: name }, { status: 400 });
    }
  }

  for (const [storageName, file] of Array.from(uploads.entries())) {
    const path = `${token}/${storageName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("dokumente")
      .upload(path, buffer, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "upload_failed", file: storageName, message: uploadError.message },
        { status: 500 },
      );
    }
  }

  const { error: updateError } = await supabase
    .from("leads")
    .update({
      email: email.trim(),
      telefon: telefon.trim(),
      dsgvo_accepted: true,
      dsgvo_accepted_at: new Date().toISOString(),
      status: "dokumente_eingereicht",
    })
    .eq("uuid", token);

  if (updateError) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  await notifyN8nWorkflow(token, email.trim(), telefon.trim());

  return NextResponse.json({ success: true });
}
