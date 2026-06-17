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

export const TOKEN_MAX_AGE_MS = 72 * 60 * 60 * 1000;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function isTokenExpired(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return true;
  return Date.now() - created > TOKEN_MAX_AGE_MS;
}
