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

export async function submitLeadDocuments(
  uuid: string,
  email: string,
  telefon: string,
  targets: UploadTarget[],
  onFileProgress: (storagePath: string, progress: number) => void,
): Promise<void> {
  const formData = new FormData();
  formData.append("token", uuid);
  formData.append("email", email);
  formData.append("telefon", telefon);

  for (const target of targets) {
    formData.append(target.storagePath, target.file);
    onFileProgress(target.storagePath, 5);
  }

  const stopTicks = targets.map((target) => {
    const stop = tickProgress((progress) =>
      onFileProgress(target.storagePath, progress),
    );
    return stop;
  });

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    for (const target of targets) {
      onFileProgress(target.storagePath, response.ok ? 100 : 0);
    }

    if (!response.ok) {
      let message = "Einreichung fehlgeschlagen. Bitte erneut versuchen.";
      try {
        const body = (await response.json()) as {
          message?: string;
          error?: string;
        };
        if (body.message) message = body.message;
        else if (body.error === "expired") {
          message = "Dieser Link ist nicht mehr gültig.";
        } else if (body.error === "already_submitted") {
          message = "Unterlagen wurden bereits eingereicht.";
        }
      } catch {
        // keep default message
      }
      throw new Error(message);
    }
  } finally {
    for (const stop of stopTicks) {
      stop();
    }
  }
}
