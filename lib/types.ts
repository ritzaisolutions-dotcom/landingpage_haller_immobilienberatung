export type Lead = {
  id: string;
  uuid: string;
  name: string;
  inserat_id: string;
  email: string | null;
  telefon: string | null;
  status: string;
  created_at: string;
  dsgvo_accepted: boolean;
  dsgvo_accepted_at: string | null;
};

export const DSGVO_TEXT =
  "Ich stimme zu, dass meine hochgeladenen Unterlagen (Schufa-Auskunft, Einkommensnachweise) ausschließlich intern zur Bearbeitung meiner Mietanfrage durch die Immobilienverwaltung verarbeitet werden. Die Daten werden nach 90 Tagen automatisch gelöscht und nicht an Dritte weitergegeben. Diese Einwilligung kann ich jederzeit widerrufen.";

export const TOKEN_MAX_AGE_MS = 72 * 60 * 60 * 1000;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function isTokenExpired(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return true;
  return Date.now() - created > TOKEN_MAX_AGE_MS;
}
