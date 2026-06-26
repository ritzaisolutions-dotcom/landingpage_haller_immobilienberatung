"use server";

import { randomUUID } from "crypto";
import { requireAuthUser } from "@/lib/api-auth";
import { buildLp1TerminUrl } from "@/lib/lp1-url";
import { createClient } from "@/lib/supabase/server";

const LP1_TOKEN_TTL_MS = 72 * 60 * 60 * 1000;

export type CreateManualLp1LeadInput = {
  name: string;
  email: string;
  telefon: string;
  is24InseratId: string;
  nachrichtText?: string;
};

export type CreateManualLp1LeadResult =
  | {
      ok: true;
      lp1Url: string;
      leadUuid: string;
      expiresAt: string;
    }
  | {
      ok: false;
      error: string;
    };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 6;
}

export async function createManualLp1Lead(
  input: CreateManualLp1LeadInput,
): Promise<CreateManualLp1LeadResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const telefon = input.telefon.trim();
  const is24InseratId = input.is24InseratId.trim();

  if (name.length < 2) {
    return { ok: false, error: "Bitte einen gültigen Namen angeben." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." };
  }
  if (!isValidPhone(telefon)) {
    return { ok: false, error: "Bitte eine gültige Telefonnummer angeben." };
  }
  if (!is24InseratId) {
    return { ok: false, error: "Bitte ein Inserat auswählen." };
  }

  let userEmail: string;
  try {
    const user = await requireAuthUser();
    userEmail = user.email ?? "unbekannt";
  } catch {
    return { ok: false, error: "Nicht angemeldet." };
  }

  const supabase = createClient();

  const { data: inserat, error: inseratError } = await supabase
    .from("inserate")
    .select("id, is24_inserat_id")
    .eq("is24_inserat_id", is24InseratId)
    .maybeSingle();

  if (inseratError || !inserat) {
    return { ok: false, error: "Inserat nicht gefunden." };
  }

  const leadUuid = randomUUID();
  const lp1Token = randomUUID();
  const now = new Date();
  const nowIso = now.toISOString();
  const lp1Url = buildLp1TerminUrl(lp1Token);

  const { error: insertError } = await supabase.from("leads").insert({
    uuid: leadUuid,
    lp1_token: lp1Token,
    lp1_token_issued_at: nowIso,
    lead_source: "manual",
    created_by_mitarbeiter: userEmail,
    name,
    email,
    telefon,
    inserat_id: is24InseratId,
    status: "neu",
    nachricht_text: input.nachrichtText?.trim() || null,
    landing_page_url: lp1Url,
    dsgvo_accepted: false,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return {
    ok: true,
    lp1Url,
    leadUuid,
    expiresAt: new Date(now.getTime() + LP1_TOKEN_TTL_MS).toISOString(),
  };
}
