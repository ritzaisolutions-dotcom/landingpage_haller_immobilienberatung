"use client";

import { FormEvent, useMemo, useState } from "react";
import { PortalFooter } from "@/components/PortalFooter";
import { DsgvoConsent } from "@/components/DsgvoConsent";
import { DemoBanner } from "@/components/DemoBanner";
import { LeadLandingHero } from "@/components/LeadLandingHero";
import { PortalShell } from "@/components/PortalShell";
import { SubmitSpinner, UploadZone } from "@/components/UploadZone";
import { SuccessScreen } from "@/components/SuccessScreen";
import { simulateDemoUpload } from "@/lib/demo";
import { Lead } from "@/lib/types";
import { submitLeadDocuments, UploadTarget } from "@/lib/uploadFiles";

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
  const [dsgvo, setDsgvo] = useState(false);
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
        await submitLeadDocuments(
          lead.uuid,
          email.trim(),
          telefon.trim(),
          targets,
          (storagePath, value) => {
            const target = targets.find((t) => t.storagePath === storagePath);
            if (target) {
              setProgress((prev) => ({
                ...prev,
                [fileKey(target.file)]: value,
              }));
            }
          },
        );
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
    <PortalShell>
      <LeadLandingHero
        name={lead.name}
        inseratId={lead.inserat_id}
        nachrichtText={lead.nachricht_text}
      />

      <div className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-[580px] rounded border border-website-border bg-white p-6 shadow-sm sm:p-8">
          {demoMode ? <DemoBanner className="mb-5" /> : null}

          <div className="mb-6">
            <h2 className="text-lg font-bold text-website-dark">
              Unterlagen einreichen
            </h2>
            <p className="mt-2 text-sm text-website-muted">
              Bitte ergänzen Sie Ihre Kontaktdaten und laden Sie die erforderlichen
              PDF-Dokumente hoch.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-website-dark">
                Name
              </label>
              <input
                type="text"
                value={lead.name}
                readOnly
                className="w-full rounded-haller border border-website-border bg-website-bg px-3 py-2.5 text-sm text-website-muted"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-website-dark"
              >
                E-Mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                className="w-full rounded-haller border border-website-border bg-white px-3 py-2.5 text-sm text-website-text outline-none focus:border-website-primary"
              />
            </div>

            <div>
              <label
                htmlFor="telefon"
                className="mb-1.5 block text-sm font-medium text-website-dark"
              >
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                id="telefon"
                type="tel"
                required
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+49 171 ..."
                className="w-full rounded-haller border border-website-border bg-white px-3 py-2.5 text-sm text-website-text outline-none focus:border-website-primary"
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

            <DsgvoConsent checked={dsgvo} onChange={setDsgvo} demoMode={demoMode} />

            {submitError ? (
              <div className="rounded-haller border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-haller bg-website-primary px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#0099b5] disabled:cursor-not-allowed disabled:bg-website-border disabled:text-website-muted"
            >
              {submitting ? <SubmitSpinner /> : null}
              Unterlagen sicher einreichen
            </button>
          </form>

          <PortalFooter demoMode={demoMode} />
        </div>
      </div>
    </PortalShell>
  );
}
