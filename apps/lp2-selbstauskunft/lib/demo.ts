import type { Lead } from "@haller/types";

export const DEMO_LP2_MIETE_TOKEN = "demo-lp2-token-haller-2026";
export const DEMO_LP2_KAUF_TOKEN = "demo-lp2-kauf-token-2026";

export const DEMO_LEAD: Lead = {
  id: "00000000-0000-0000-0000-000000000001",
  uuid: "demo",
  name: "Anna Müller",
  inserat_id: "IS24-DEMO-2048",
  email: "anna.mueller@beispiel.de",
  telefon: "+49 171 2345678",
  status: "selbstauskunft_angefordert",
  lp1_token: null,
  lp1_token_issued_at: null,
  lp2_token: DEMO_LP2_MIETE_TOKEN,
  lead_source: "demo",
  created_by_mitarbeiter: null,
  landing_page_url: `/auskunft?t=${DEMO_LP2_MIETE_TOKEN}`,
  is24_contact_id: null,
  nachricht_text:
    "Guten Tag, ich interessiere mich für die 3-Zimmer-Wohnung in der Koblenzer Straße.",
  termin_gebucht_at: null,
  besichtigung_stattgefunden: true,
  selbstauskunft_angefordert_at: new Date().toISOString(),
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
