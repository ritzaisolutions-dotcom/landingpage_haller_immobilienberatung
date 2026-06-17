"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { PortalHeader } from "@/components/PortalHeader";
import { SubmitSpinner, UploadZone } from "@/components/UploadZone";
import { SuccessScreen } from "@/components/SuccessScreen";
import { simulateDemoUpload } from "@/lib/demo";
import { DSGVO_TEXT, Lead } from "@/lib/types";
import { submitLeadDocuments, uploadFiles, UploadTarget } from "@/lib/uploadFiles";

type UploadFormProps = {
  lead: Lead;
  demoMode?: boolean;
};

function fileKey(file: File): string {
  return `${file.name}-${file.size}`;
}

export function UploadForm({ lead, demoMode = false }: UploadFormProps) {
  const [email, setEmail] = useState(demoMode ? "anna.mueller@beispiel.de" : "");
  const [telefon, setTelefon] = useState(demoMode ? "+49 171 2345678" : "");
  const [schufa, setSchufa] = useState<File[]>([]);
  const [entgelt, setEntgelt] = useState<File[]>([]);
  const [buergschaft, setBuergschaft] = useState<File[]>([]);
  const [dsgvo, setDsgvo] = useState(demoMode);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      telefon.trim().length > 0 &&
      schufa.length === 1 &&
      entgelt.length >= 1 &&
      dsgvo &&
      !submitting
    );
  }, [dsgvo, email, entgelt.length, schufa.length, submitting, telefon]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);
    setProgress({});

    const targets: UploadTarget[] = [
      { file: schufa[0], storagePath: "schufa.pdf" },
      ...entgelt.map((file, index) => ({
        file,
        storagePath: `entgelt_${index + 1}.pdf`,
      })),
    ];

    if (buergschaft[0]) {
      targets.push({ file: buergschaft[0], storagePath: "buergschaft.pdf" });
    }

    try {
      if (demoMode) {
        await simulateDemoUpload(
          targets.map((t) => ({ key: fileKey(t.file) })),
          (key, value) => {
            setProgress((prev) => ({ ...prev, [key]: value }));
          },
        );
      } else {
        await uploadFiles(lead.uuid, targets, (storagePath, value) => {
          const target = targets.find((t) => t.storagePath === storagePath);
          if (target) {
            setProgress((prev) => ({
              ...prev,
              [fileKey(target.file)]: value,
            }));
          }
        });

        await submitLeadDocuments(lead.uuid, email.trim(), telefon.trim());
      }

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Einreichung fehlgeschlagen. Bitte erneut versuchen.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <SuccessScreen name={lead.name} demoMode={demoMode} />;
  }

  return (
    <div className="min-h-screen bg-haller-bg px-4 py-10 text-haller-text">
      <div className="mx-auto max-w-[580px] rounded-2xl border border-haller-border bg-haller-card p-8">
        <PortalHeader />

        {demoMode ? <DemoBanner className="mb-5" /> : null}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Unterlagen einreichen</h1>
          <p className="mt-2 text-sm text-haller-muted">
            Bitte vervollständigen Sie Ihre Bewerbung mit den erforderlichen
            Dokumenten.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-haller-text">
              Name
            </label>
            <input
              type="text"
              value={lead.name}
              readOnly
              className="w-full rounded-lg border border-haller-border bg-haller-bg/60 px-3 py-2.5 text-sm text-haller-muted"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-haller-text">
              E-Mail <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              className="w-full rounded-lg border border-haller-border bg-haller-bg px-3 py-2.5 text-sm text-haller-text outline-none focus:border-haller-accent"
            />
          </div>

          <div>
            <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium text-haller-text">
              Telefon <span className="text-red-400">*</span>
            </label>
            <input
              id="telefon"
              type="tel"
              required
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder="+49 171 ..."
              className="w-full rounded-lg border border-haller-border bg-haller-bg px-3 py-2.5 text-sm text-haller-text outline-none focus:border-haller-accent"
            />
          </div>

          <UploadZone
            id="schufa"
            label="Schufa-Auskunft"
            required
            files={schufa}
            onChange={setSchufa}
            progress={progress}
          />

          <UploadZone
            id="entgelt"
            label="Entgeltnachweis"
            hint="letzte 3 Monate"
            required
            multiple
            maxFiles={3}
            files={entgelt}
            onChange={setEntgelt}
            progress={progress}
          />

          <UploadZone
            id="buergschaft"
            label="Bürgschaft der Eltern"
            hint="Optional — nur für Studenten"
            files={buergschaft}
            onChange={setBuergschaft}
            progress={progress}
          />

          <label className="flex items-start gap-3 rounded-lg border border-haller-border bg-haller-bg/40 p-3">
            <input
              type="checkbox"
              checked={dsgvo}
              onChange={(e) => setDsgvo(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-haller-border accent-haller-accent"
            />
            <span className="text-xs leading-relaxed text-haller-muted">{DSGVO_TEXT}</span>
          </label>

          {submitError ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {submitError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-haller-accent px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-haller-border disabled:text-haller-muted"
          >
            {submitting ? <SubmitSpinner /> : null}
            Unterlagen sicher einreichen
          </button>
        </form>

        {demoMode ? (
          <p className="mt-6 text-center text-xs text-haller-muted">
            <Link href="/" className="text-haller-accent hover:underline">
              ← Zurück zur Demo-Übersicht
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
