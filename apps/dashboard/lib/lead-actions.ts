import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadStatus } from "@/lib/types";

export async function assignLeadMitarbeiter(
  supabase: SupabaseClient,
  leadId: string,
  email: string | null,
) {
  return supabase
    .from("leads")
    .update({
      zustaendiger_mitarbeiter: email,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);
}

export async function archiveLead(supabase: SupabaseClient, leadId: string) {
  return supabase
    .from("leads")
    .update({
      archiviert_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);
}

export async function unarchiveLead(supabase: SupabaseClient, leadId: string) {
  return supabase
    .from("leads")
    .update({
      archiviert_at: null,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);
}

export async function updateLeadStatus(
  supabase: SupabaseClient,
  leadId: string,
  status: LeadStatus,
  extra?: Record<string, unknown>,
) {
  return supabase
    .from("leads")
    .update({
      status,
      last_activity_at: new Date().toISOString(),
      ...extra,
    })
    .eq("id", leadId);
}

export async function updateLeadNotiz(
  supabase: SupabaseClient,
  leadId: string,
  notiz: string,
) {
  return supabase
    .from("leads")
    .update({
      mitarbeiter_notiz: notiz,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);
}
