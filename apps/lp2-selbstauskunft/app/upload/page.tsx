import { redirect } from "next/navigation";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabaseAdmin";

const DEMO_LP2_TOKEN = "demo-lp2-token-haller-2026";

type UploadPageProps = {
  searchParams: { t?: string };
};

async function resolveLp2Token(raw: string): Promise<string | null> {
  if (!isSupabaseServerConfigured()) return raw;

  const supabase = getSupabaseAdmin();

  const { data: byLp2Token } = await supabase
    .from("leads")
    .select("lp2_token")
    .eq("lp2_token", raw)
    .maybeSingle();

  if (byLp2Token?.lp2_token) return byLp2Token.lp2_token;

  const { data: byUuid } = await supabase
    .from("leads")
    .select("lp2_token")
    .eq("uuid", raw)
    .maybeSingle();

  if (byUuid?.lp2_token) return byUuid.lp2_token;

  return null;
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const raw = searchParams.t?.trim();

  if (!raw || raw === "demo") {
    redirect(`/auskunft?t=${DEMO_LP2_TOKEN}`);
  }

  const lp2Token = await resolveLp2Token(raw);
  if (lp2Token) {
    redirect(`/auskunft?t=${encodeURIComponent(lp2Token)}`);
  }

  redirect(`/auskunft?t=${encodeURIComponent(raw)}`);
}
