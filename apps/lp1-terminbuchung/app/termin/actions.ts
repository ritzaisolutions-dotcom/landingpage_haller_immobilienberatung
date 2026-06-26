"use server";

import { redirect } from "next/navigation";
import { notifyTerminGebucht } from "@/lib/n8n";
import { slotStatusAfterBooking } from "@/lib/slots";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabase/admin";
import { isLp1TokenExpired } from "@/lib/token";
import type { BookTerminResult } from "@/lib/types";

export async function bookTermin(
  token: string,
  slotId: string,
  name: string,
  email: string,
  telefon: string,
  dsgvoAccepted: boolean,
): Promise<BookTerminResult> {
  if (!isSupabaseServerConfigured()) {
    return { ok: false, error: "config" };
  }

  if (!token.trim() || !slotId || !dsgvoAccepted) {
    return { ok: false, error: "invalid_token" };
  }

  const supabase = getSupabaseAdmin();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("lp1_token", token)
    .maybeSingle();

  if (leadError || !lead) {
    return { ok: false, error: "invalid_token" };
  }

  if (isLp1TokenExpired(lead)) {
    return { ok: false, error: "expired" };
  }

  if (lead.status === "termin_gebucht") {
    return { ok: false, error: "already_booked" };
  }

  const { data: inserat, error: inseratError } = await supabase
    .from("inserate")
    .select("id")
    .eq("is24_inserat_id", lead.inserat_id)
    .maybeSingle();

  if (inseratError || !inserat) {
    return { ok: false, error: "unknown" };
  }

  const { data: slot, error: slotError } = await supabase
    .from("besichtigungsslots")
    .select("*")
    .eq("id", slotId)
    .maybeSingle();

  if (slotError || !slot) {
    return { ok: false, error: "slot_taken" };
  }

  if (slot.inserat_id !== inserat.id) {
    return { ok: false, error: "slot_taken" };
  }

  if (slot.belegt > 0) {
    return { ok: false, error: "slot_taken" };
  }

  if (slot.slot_status !== "frei") {
    return { ok: false, error: "slot_taken" };
  }

  const { data: updatedSlot, error: updateSlotError } = await supabase
    .from("besichtigungsslots")
    .update({
      belegt: 1,
      slot_status: slotStatusAfterBooking(),
      reserviert_lead_uuid: lead.uuid,
    })
    .eq("id", slotId)
    .eq("slot_status", "frei")
    .eq("belegt", 0)
    .select()
    .maybeSingle();

  if (updateSlotError || !updatedSlot) {
    return { ok: false, error: "slot_taken" };
  }

  const now = new Date().toISOString();

  const { error: updateLeadError } = await supabase
    .from("leads")
    .update({
      status: "termin_gebucht",
      termin_gebucht_at: now,
      name: name.trim(),
      email: email.trim(),
      telefon: telefon.trim(),
      dsgvo_accepted: true,
      dsgvo_accepted_at: now,
    })
    .eq("id", lead.id);

  if (updateLeadError) {
    await supabase
      .from("besichtigungsslots")
      .update({
        belegt: 0,
        slot_status: "frei",
        reserviert_lead_uuid: null,
      })
      .eq("id", slotId)
      .eq("belegt", 1);

    return { ok: false, error: "unknown" };
  }

  await notifyTerminGebucht({
    lp1Token: token,
    leadUuid: lead.uuid,
    slotId: updatedSlot.id,
    name: name.trim(),
    email: email.trim(),
    telefon: telefon.trim(),
    inseratId: lead.inserat_id,
    inseratUuid: inserat.id,
    datum: updatedSlot.datum,
    uhrzeit: updatedSlot.uhrzeit,
    persistedByLp1: true,
  });

  const params = new URLSearchParams({
    datum: updatedSlot.datum,
    uhrzeit: updatedSlot.uhrzeit.slice(0, 5),
    adresse: updatedSlot.adresse,
  });

  redirect(`/termin/success?${params.toString()}`);
}
