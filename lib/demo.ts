import { Lead } from "./types";

export const DEMO_TOKEN = "demo";

export const DEMO_LEAD: Lead = {
  id: "00000000-0000-0000-0000-000000000001",
  uuid: DEMO_TOKEN,
  name: "Anna Müller",
  inserat_id: "IS24-DEMO-2048",
  email: null,
  telefon: null,
  status: "neu",
  created_at: new Date().toISOString(),
  dsgvo_accepted: false,
  dsgvo_accepted_at: null,
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
