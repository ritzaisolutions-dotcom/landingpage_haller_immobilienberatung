import type { Lead } from "@/lib/types";

export const DEMO_TOKEN = "demo";

export const DEMO_LEAD: Lead = {
  id: "00000000-0000-0000-0000-000000000001",
  uuid: DEMO_TOKEN,
  name: "Anna Müller",
  inserat_id: "IS24-DEMO-2048",
  email: null,
  telefon: null,
  status: "neu",
  lp1_token: null,
  lp1_token_issued_at: null,
  lp2_token: null,
  lead_source: "demo",
  created_by_mitarbeiter: null,
  landing_page_url: "/upload?t=demo",
  is24_contact_id: null,
  nachricht_text:
    "Guten Tag, ich interessiere mich für die 3-Zimmer-Wohnung in der Koblenzer Straße.",
  termin_gebucht_at: null,
  besichtigung_stattgefunden: false,
  selbstauskunft_angefordert_at: null,
  zustaendiger_mitarbeiter: null,
  kalender_event_id: null,
  dsgvo_accepted: false,
  dsgvo_accepted_at: null,
  mitarbeiter_notiz: null,
  entscheidung_at: null,
  delete_after: null,
  liquiditaet_erwaehnt: false,
  created_at: new Date().toISOString(),
};

export function isDemoToken(token: string | null): boolean {
  return token === DEMO_TOKEN;
}

export async function simulateDemoUpload(
  files: { key: string }[],
  onProgress: (key: string, progress: number) => void,
): Promise<void> {
  for (const file of files) {
    for (const step of [20, 45, 70, 90, 100]) {
      await delay(180);
      onProgress(file.key, step);
    }
  }
  await delay(300);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
