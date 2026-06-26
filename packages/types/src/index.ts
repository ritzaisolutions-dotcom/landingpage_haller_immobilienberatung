export type InseratTyp = "miete" | "verkauf";
export type InseratStatus = "aktiv" | "inaktiv";
export type LeadStatus =
  | "neu"
  | "dm_gesendet"
  | "termin_gebucht"
  | "besichtigung_stattgefunden"
  | "selbstauskunft_angefordert"
  | "selbstauskunft_eingereicht"
  | "zugesagt"
  | "abgesagt"
  | "geloescht";

export type SlotStatus = "frei" | "reserviert" | "confirmed" | "abgelaufen";
export type Entscheidung = "zusage" | "absage" | null;

export type Inserat = {
  id: string;
  is24_inserat_id: string;
  titel: string;
  adresse: string;
  zimmer: number;
  flaeche_qm: number;
  kaltmiete_eur: number;
  kaufpreis_eur: number | null;
  typ: InseratTyp;
  status: InseratStatus | string;
  is24_url: string | null;
  foto_urls: string[] | null;
  created_at: string;
  updated_at: string;
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
  slot_status: SlotStatus | string;
  reserviert_lead_uuid: string | null;
  reserviert_bis: string | null;
  created_at: string;
};

export type BesichtigungsslotWithInserat = Besichtigungsslot & {
  inserate: Pick<Inserat, "titel" | "is24_inserat_id" | "adresse" | "typ"> | null;
};

export type Lead = {
  id: string;
  uuid: string;
  lp1_token: string | null;
  lp1_token_issued_at: string | null;
  lp2_token: string | null;
  lead_source: string | null;
  created_by_mitarbeiter: string | null;
  landing_page_url: string | null;
  name: string;
  email: string | null;
  telefon: string | null;
  inserat_id: string;
  is24_contact_id: string | null;
  nachricht_text: string | null;
  status: LeadStatus | string;
  termin_gebucht_at: string | null;
  besichtigung_stattgefunden: boolean;
  selbstauskunft_angefordert_at: string | null;
  zustaendiger_mitarbeiter: string | null;
  kalender_event_id: string | null;
  dsgvo_accepted: boolean;
  dsgvo_accepted_at: string | null;
  mitarbeiter_notiz: string | null;
  entscheidung_at: string | null;
  delete_after: string | null;
  last_activity_at?: string | null;
  archiviert_at?: string | null;
  liquiditaet_erwaehnt?: boolean | null;
  fehlende_dokumente?: string[] | null;
  mindestanforderung_ok?: boolean | null;
  dokumente_eingereicht_at?: string | null;
  mistral_score?: number | null;
  ablehnungsgrund?: string | null;
  created_at: string;
};

export type CrmFilterTab = "aktiv" | "frueh" | "pipeline" | "erledigt" | "archiv";

export type PipelineCounts = {
  neueBuchungen: number;
  neueSelbstauskuenfte: number;
  entscheidungenOffen: number;
  frueheAnfragen: number;
  total: number;
};

export type TodayAppointment = {
  slot: Besichtigungsslot;
  lead: Lead | null;
  inserat: Pick<Inserat, "id" | "titel" | "adresse" | "foto_urls" | "is24_inserat_id"> | null;
};

export type Buchungsfenster = {
  id: string;
  inserat_id: string;
  gueltig_von: string;
  gueltig_bis: string;
  buchbare_wochentage: number[];
  startzeit: string;
  endzeit: string;
  slot_dauer_minuten: number;
  max_kapazitaet: number;
  vorlaufzeit_stunden: number;
  aktiv: boolean;
  created_at: string;
};

export type InseratZustaendigkeit = {
  id: string;
  inserat_id: string;
  mitarbeiter_email: string;
  ist_hauptverantwortlich: boolean;
  created_at: string;
};

export type Selbstauskunft = {
  id: string;
  lead_id: string;
  inserat_id: string;
  nettoeinkommen_eur: number | null;
  beschaeftigung_status: string | null;
  arbeitgeber: string | null;
  angestellt_seit: string | null;
  arbeitsverhaeltnis: string | null;
  haushaltsgroesse: number | null;
  haustiere: boolean;
  haustiere_art: string | null;
  einzugstermin: string | null;
  warum_diese_wohnung: string | null;
  sonstige_angaben: string | null;
  aktuelle_adresse: string | null;
  insolvenzverfahren_laufend: boolean | null;
  raeumungstitel_5_jahre: boolean | null;
  kaufbudget_eur: number | null;
  eigenkapital_vorhanden: string | null;
  eigenkapital_hoehe_eur: number | null;
  finanzierung_typ: string | null;
  finanzierungsbestaetigung: string | null;
  kaufzeitraum: string | null;
  kaufgrund: string | null;
  in_laufendem_verkauf: boolean | null;
  dsgvo_accepted: boolean;
  dsgvo_accepted_at: string | null;
  angaben_wahrheitsgemaess: boolean;
  angaben_wahrheitsgemaess_at: string | null;
  mistral_score: number | null;
  mistral_begruendung: string | null;
  mistral_staerken: string | null;
  mistral_risiken: string | null;
  analysiert_at: string | null;
  entscheidung: Entscheidung;
  entscheidung_at: string | null;
  entscheidung_mitarbeiter: string | null;
  delete_after: string | null;
  created_at: string;
};

export type SelbstauskunftVergleich = Selbstauskunft & {
  lead_name: string;
  lead_email: string | null;
  lead_telefon: string | null;
  is24_contact_id: string | null;
  lead_status?: string | null;
  inserat_titel: string;
  inserat_adresse: string;
  kaltmiete_eur: number;
  kaufpreis_eur: number | null;
  inserat_typ: InseratTyp;
  einkommens_faktor: number | null;
};

export type LeadWithSlot = Lead & {
  slot?: Besichtigungsslot | null;
};

export type SlotStatusFilter = "all" | "frei" | "reserviert" | "confirmed";
export type TerminLeadFilter = "all" | "gebucht" | "stattgefunden" | "abgesagt";
export type BesichtigungFilter = "all" | "today" | "week" | "pending" | "done";
export type SelbstauskunftFilter = "all" | "pending" | "decided";
