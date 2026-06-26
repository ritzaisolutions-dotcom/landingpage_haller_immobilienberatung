export type InseratTyp = "miete" | "verkauf";

export type Lead = {
  id: string;
  uuid: string;
  name: string;
  inserat_id: string;
  email: string | null;
  telefon: string | null;
  status: string;
  lp2_token: string | null;
  created_at: string;
  selbstauskunft_angefordert_at: string | null;
  dsgvo_accepted?: boolean;
  dsgvo_accepted_at?: string | null;
  nachricht_text?: string | null;
  liquiditaet_erwaehnt?: boolean | null;
  is24_contact_id?: string | null;
  landing_page_url?: string | null;
  mistral_score?: number | null;
  fehlende_dokumente?: string[] | null;
  mindestanforderung_ok?: boolean | null;
  dokumente_eingereicht_at?: string | null;
};

export type Inserat = {
  id: string;
  is24_inserat_id: string;
  titel: string;
  adresse: string;
  typ: InseratTyp;
  zimmer: number;
  flaeche_qm: number;
  kaltmiete_eur: number;
  kaufpreis_eur: number | null;
};

export type MieteFormData = {
  beschaeftigung_status: string;
  arbeitgeber: string;
  angestellt_seit: string;
  nettoeinkommen_eur: string;
  haushaltsgroesse: string;
  haustiere: "ja" | "nein" | "";
  haustiere_art: string;
  einzugstermin: string;
  warum_diese_wohnung: string;
  sonstige_angaben: string;
  dsgvo_accepted: boolean;
};

export type KaufFormData = {
  kaufbudget_eur: string;
  eigenkapital_vorhanden: string;
  eigenkapital_hoehe_eur: string;
  finanzierung_typ: string;
  finanzierungsbestaetigung: string;
  kaufzeitraum: string;
  kaufgrund: string;
  in_laufendem_verkauf: "ja" | "nein" | "";
  sonstige_angaben: string;
  dsgvo_accepted: boolean;
};

export const BESCHAEFTIGUNG_OPTIONS = [
  "Angestellt (unbefristet)",
  "Angestellt (befristet)",
  "Angestellt (in Kündigung)",
  "Selbständig / Freiberuflich",
  "Beamter/Beamtin",
  "Rentner/Rentnerin",
  "Student/Studentin",
  "Derzeit arbeitssuchend",
] as const;

export const HAUSHALT_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8+"] as const;

export const EIGENKAPITAL_OPTIONS = ["Ja", "Nein", "Teilweise"] as const;

export const FINANZIERUNG_OPTIONS = [
  "Vollständige Eigenfinanzierung",
  "Bankfinanzierung bereits beantragt",
  "Bankfinanzierung geplant",
  "Noch offen",
] as const;

export const FINANZIERUNGSBESTAETIGUNG_OPTIONS = [
  "Vorhanden (Bank-Zusage liegt vor)",
  "In Bearbeitung",
  "Noch nicht vorhanden",
] as const;

export const KAUFZEITRAUM_OPTIONS = [
  "Sofortkauf (innerhalb 4 Wochen)",
  "Kurzfristig (1–3 Monate)",
  "Mittelfristig (3–6 Monate)",
  "Noch offen",
] as const;

export const KAUFGRUND_OPTIONS = ["Eigennutzung", "Kapitalanlage", "Beides"] as const;

export function deriveArbeitsverhaeltnis(status: string): string | null {
  if (status.includes("unbefristet")) return "unbefristet";
  if (status.includes("befristet")) return "befristet";
  if (status.includes("Kündigung")) return "in_kuendigung";
  return null;
}

export function needsEmployerFields(status: string): boolean {
  return !["Rentner/Rentnerin", "Student/Studentin", "Derzeit arbeitssuchend"].includes(
    status,
  );
}

export function needsEmployedSince(status: string): boolean {
  return (
    status.startsWith("Angestellt") ||
    status === "Selbständig / Freiberuflich" ||
    status === "Beamter/Beamtin"
  );
}

export function mapBeschaeftigungToDb(status: string): string {
  if (status.startsWith("Angestellt")) return "angestellt";
  if (status === "Selbständig / Freiberuflich") return "selbstaendig";
  if (status === "Beamter/Beamtin") return "beamter";
  if (status === "Rentner/Rentnerin") return "rentner";
  if (status === "Student/Studentin") return "student";
  return "arbeitssuchend";
}

export const TOKEN_MAX_AGE_MS = 72 * 60 * 60 * 1000;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function isTokenExpired(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return true;
  return Date.now() - created > TOKEN_MAX_AGE_MS;
}

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "Interessent";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}
