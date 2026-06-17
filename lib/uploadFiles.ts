import { getSupabase } from "./supabase";

export type UploadTarget = {
  file: File;
  storagePath: string;
};

function tickProgress(
  onProgress: (progress: number) => void,
  stopAt = 90,
): () => void {
  let value = 5;
  onProgress(value);
  const id = window.setInterval(() => {
    value = Math.min(value + 8, stopAt);
    onProgress(value);
  }, 150);
  return () => window.clearInterval(id);
}

export async function uploadFileWithProgress(
  uuid: string,
  file: File,
  storageFileName: string,
  onProgress: (progress: number) => void,
): Promise<void> {
  const supabase = getSupabase();
  const path = `${uuid}/${storageFileName}`;
  const stopTick = tickProgress(onProgress);

  try {
    const { error } = await supabase.storage
      .from("dokumente")
      .upload(path, file, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) {
      throw new Error(error.message);
    }

    onProgress(100);
  } finally {
    stopTick();
  }
}

export async function uploadFiles(
  uuid: string,
  targets: UploadTarget[],
  onFileProgress: (storagePath: string, progress: number) => void,
): Promise<void> {
  for (const target of targets) {
    await uploadFileWithProgress(
      uuid,
      target.file,
      target.storagePath,
      (progress) => onFileProgress(target.storagePath, progress),
    );
  }
}

export async function submitLeadDocuments(
  uuid: string,
  email: string,
  telefon: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("leads")
    .update({
      email,
      telefon,
      dsgvo_accepted: true,
      dsgvo_accepted_at: new Date().toISOString(),
      status: "dokumente_eingereicht",
    })
    .eq("uuid", uuid);

  if (error) {
    throw new Error("Daten konnten nicht gespeichert werden.");
  }
}
