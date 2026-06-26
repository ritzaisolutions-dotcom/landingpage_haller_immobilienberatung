export type LeadStatus =
  | "neu"
  | "termin_gebucht"
  | "besichtigung_stattgefunden"
  | "selbstauskunft_angefordert"
  | "selbstauskunft_eingereicht"
  | "abgesagt"
  | string;

export type Lead = {
  id: string;
  uuid: string;
  lp1_token: string | null;
  lp1_token_issued_at: string | null;
  name: string;
  email: string;
  telefon: string;
  inserat_id: string;
  status: LeadStatus;
  termin_gebucht_at: string | null;
  dsgvo_accepted: boolean | null;
  dsgvo_accepted_at: string | null;
  created_at: string;
};

export type Inserat = {
  id: string;
  is24_inserat_id: string;
  titel: string;
  adresse: string;
  zimmer: number;
  flaeche_qm: number;
  kaltmiete_eur: number;
  kaufpreis_eur: number | null;
  typ: "miete" | "verkauf";
  foto_urls?: string[] | null;
};

export type Besichtigungsslot = {
  id: string;
  inserat_id: string;
  adresse: string;
  datum: string;
  uhrzeit: string;
  dauer_minuten: number;
  kapazitaet: number;
  belegt: number;
  slot_status: string;
  reserviert_lead_uuid: string | null;
};

export type BookingContact = {
  name: string;
  email: string;
  telefon: string;
};

export type PageState =
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "already_booked"; slot: Besichtigungsslot; lead: Lead }
  | { kind: "ready"; lead: Lead; inserat: Inserat; slots: Besichtigungsslot[] };

export type BookTerminResult =
  | { ok: true }
  | { ok: false; error: "invalid_token" | "expired" | "already_booked" | "slot_taken" | "config" | "unknown" };

export const DEMO_LP1_TOKEN = "demo-lp1-token-haller-2026";
