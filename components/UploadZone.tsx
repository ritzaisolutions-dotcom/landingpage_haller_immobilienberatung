"use client";

import { Check, FileUp, Loader2, X } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { MAX_FILE_SIZE_BYTES } from "@/lib/types";

type UploadZoneProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  files: File[];
  onChange: (files: File[]) => void;
  progress?: Record<string, number>;
  error?: string;
};

export function UploadZone({
  id,
  label,
  hint,
  required = false,
  multiple = false,
  maxFiles = 1,
  files,
  onChange,
  progress = {},
  error,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (multiple) {
        const merged = [...files, ...accepted].slice(0, maxFiles);
        onChange(merged);
        return;
      }
      onChange(accepted.slice(0, 1));
    },
    [files, maxFiles, multiple, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxSize: MAX_FILE_SIZE_BYTES,
      multiple,
      maxFiles: multiple ? maxFiles - files.length : 1,
      disabled: multiple ? files.length >= maxFiles : files.length >= 1,
    });

  const rejectionMessage = useMemo(() => {
    const rejection = fileRejections[0];
    if (!rejection) return null;
    const code = rejection.errors[0]?.code;
    if (code === "file-too-large") return "Datei zu groß (max. 10 MB).";
    if (code === "file-invalid-type") return "Nur PDF-Dateien erlaubt.";
    return "Datei konnte nicht hinzugefügt werden.";
  }, [fileRejections]);

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-sm font-medium text-haller-text">
          {label}
        </label>
        {required ? (
          <span className="rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
            Pflicht
          </span>
        ) : (
          <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
            Optional
          </span>
        )}
      </div>
      {hint ? <p className="text-xs text-haller-muted">{hint}</p> : null}

      {files.length === 0 || multiple ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border border-dashed p-5 transition ${
            isDragActive
              ? "border-haller-accent bg-haller-accent/5"
              : "border-haller-border bg-haller-bg/40 hover:border-haller-accent/60"
          } ${multiple && files.length >= maxFiles ? "pointer-events-none opacity-50" : ""}`}
        >
          <input {...getInputProps()} id={id} />
          <div className="flex flex-col items-center gap-2 text-center">
            <FileUp className="h-6 w-6 text-haller-accent" />
            <p className="text-sm text-haller-text">PDF hochladen oder hier ablegen</p>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        {files.map((file, index) => {
          const key = `${file.name}-${file.size}`;
          const fileProgress = progress[key];
          return (
            <div
              key={key}
              className="rounded-lg border border-haller-border bg-haller-bg/60 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-haller-success" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-haller-text">{file.name}</p>
                    {typeof fileProgress === "number" && fileProgress < 100 ? (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-haller-border">
                        <div
                          className="h-full rounded-full bg-haller-accent transition-all"
                          style={{ width: `${fileProgress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded p-1 text-haller-muted hover:bg-white/5 hover:text-white"
                  aria-label="Datei entfernen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {rejectionMessage ? (
        <p className="text-xs text-red-400">{rejectionMessage}</p>
      ) : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

export function SubmitSpinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
