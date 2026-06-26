"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { MieteForm } from "@/app/auskunft/MieteForm";
import { KaufForm } from "@/app/auskunft/KaufForm";
import { submitSelbstauskunft } from "@/app/auskunft/actions";
import type { Inserat, InseratTyp, KaufFormData, MieteFormData } from "@/lib/types";
import { needsEmployedSince, needsEmployerFields } from "@/lib/types";
import { minEinzugISO } from "@/lib/format";

type SelbstauskunftFormProps = {
  lp2Token: string;
  leadName: string;
  inserat: Inserat;
  typ: InseratTyp;
};

const EMPTY_MIETE: MieteFormData = {
  beschaeftigung_status: "",
  arbeitgeber: "",
  angestellt_seit: "",
  nettoeinkommen_eur: "",
  haushaltsgroesse: "",
  haustiere: "",
  haustiere_art: "",
  einzugstermin: "",
  warum_diese_wohnung: "",
  sonstige_angaben: "",
  dsgvo_accepted: false,
};

const EMPTY_KAUF: KaufFormData = {
  kaufbudget_eur: "",
  eigenkapital_vorhanden: "",
  eigenkapital_hoehe_eur: "",
  finanzierung_typ: "",
  finanzierungsbestaetigung: "",
  kaufzeitraum: "",
  kaufgrund: "",
  in_laufendem_verkauf: "",
  sonstige_angaben: "",
  dsgvo_accepted: false,
};

function validateMieteStep(step: 1 | 2 | 3, data: MieteFormData): Partial<Record<keyof MieteFormData, string>> {
  const errors: Partial<Record<keyof MieteFormData, string>> = {};

  if (step === 1) {
    if (!data.beschaeftigung_status) errors.beschaeftigung_status = "Pflichtfeld";
    if (needsEmployerFields(data.beschaeftigung_status) && !data.arbeitgeber.trim()) {
      errors.arbeitgeber = "Pflichtfeld";
    }
    if (needsEmployedSince(data.beschaeftigung_status) && !data.angestellt_seit) {
      errors.angestellt_seit = "Pflichtfeld";
    }
    const netto = Number(data.nettoeinkommen_eur);
    if (!data.nettoeinkommen_eur || Number.isNaN(netto) || netto <= 0) {
      errors.nettoeinkommen_eur = "Bitte gültiges Nettoeinkommen angeben";
    }
  }

  if (step === 2) {
    if (!data.haushaltsgroesse) errors.haushaltsgroesse = "Pflichtfeld";
    if (!data.haustiere) errors.haustiere = "Pflichtfeld";
    if (data.haustiere === "ja" && !data.haustiere_art.trim()) {
      errors.haustiere_art = "Pflichtfeld";
    }
    if (!data.einzugstermin) {
      errors.einzugstermin = "Pflichtfeld";
    } else if (data.einzugstermin < minEinzugISO(14)) {
      errors.einzugstermin = "Einzug mindestens 14 Tage in der Zukunft";
    }
    const len = data.warum_diese_wohnung.trim().length;
    if (len < 50) errors.warum_diese_wohnung = "Mindestens 50 Zeichen";
    if (len > 500) errors.warum_diese_wohnung = "Maximal 500 Zeichen";
  }

  if (step === 3 && !data.dsgvo_accepted) {
    errors.dsgvo_accepted = "Bitte bestätigen Sie die Datenschutzerklärung";
  }

  return errors;
}

function validateKaufStep(step: 1 | 2 | 3, data: KaufFormData): Partial<Record<keyof KaufFormData, string>> {
  const errors: Partial<Record<keyof KaufFormData, string>> = {};

  if (step === 1) {
    const budget = Number(data.kaufbudget_eur);
    if (!data.kaufbudget_eur || Number.isNaN(budget) || budget <= 0) {
      errors.kaufbudget_eur = "Bitte gültiges Kaufbudget angeben";
    }
    if (!data.eigenkapital_vorhanden) errors.eigenkapital_vorhanden = "Pflichtfeld";
    if (!data.finanzierung_typ) errors.finanzierung_typ = "Pflichtfeld";
    if (!data.finanzierungsbestaetigung) errors.finanzierungsbestaetigung = "Pflichtfeld";
  }

  if (step === 2) {
    if (!data.kaufzeitraum) errors.kaufzeitraum = "Pflichtfeld";
    if (!data.kaufgrund) errors.kaufgrund = "Pflichtfeld";
    if (!data.in_laufendem_verkauf) errors.in_laufendem_verkauf = "Pflichtfeld";
  }

  if (step === 3 && !data.dsgvo_accepted) {
    errors.dsgvo_accepted = "Bitte bestätigen Sie die Datenschutzerklärung";
  }

  return errors;
}

export function SelbstauskunftForm({ lp2Token, leadName, inserat, typ }: SelbstauskunftFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mieteData, setMieteData] = useState<MieteFormData>(EMPTY_MIETE);
  const [kaufData, setKaufData] = useState<KaufFormData>(EMPTY_KAUF);
  const [mieteErrors, setMieteErrors] = useState<Partial<Record<keyof MieteFormData, string>>>({});
  const [kaufErrors, setKaufErrors] = useState<Partial<Record<keyof KaufFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const introText =
    typ === "miete"
      ? "Bitte füllen Sie die Mieterselbstauskunft vollständig aus."
      : "Bitte teilen Sie uns Ihre Kaufabsicht mit.";

  function handleNext() {
    if (typ === "miete") {
      const errs = validateMieteStep(step, mieteData);
      setMieteErrors(errs);
      if (Object.keys(errs).length > 0) return;
    } else {
      const errs = validateKaufStep(step, kaufData);
      setKaufErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (step < 3) setStep((s) => (s === 1 ? 2 : 3) as 1 | 2 | 3);
  }

  function handleBack() {
    if (step > 1) setStep((s) => (s === 3 ? 2 : 1) as 1 | 2 | 3);
  }

  function handleSubmit() {
    if (typ === "miete") {
      const errs = validateMieteStep(3, mieteData);
      setMieteErrors(errs);
      if (Object.keys(errs).length > 0) return;
    } else {
      const errs = validateKaufStep(3, kaufData);
      setKaufErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }

    setSubmitError(null);
    startTransition(async () => {
      const result = await submitSelbstauskunft({
        lp2Token,
        typ,
        miete: typ === "miete" ? mieteData : undefined,
        kauf: typ === "verkauf" ? kaufData : undefined,
      });
      if (result?.error) setSubmitError(result.error);
    });
  }

  const progress = (step / 3) * 100;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-lp-muted">Guten Tag {leadName.split(/\s+/)[0]},</p>
        <h1 className="mt-1 text-2xl font-extrabold text-lp-text">
          Vielen Dank für Ihr Interesse an {inserat.titel}
        </h1>
        <p className="mt-2 text-sm text-lp-muted">{introText}</p>
        <p className="mt-2 text-xs text-lp-muted">
          Ihre Angaben sind vertraulich und werden nach Abschluss des Auswahlverfahrens automatisch
          gelöscht.
        </p>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs font-semibold text-lp-muted">
          <span>Schritt {step} von 3</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-lp-border">
          <div
            className="h-full bg-lp-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="lp-card">
        {typ === "miete" ? (
          <MieteForm
            step={step}
            data={mieteData}
            errors={mieteErrors}
            kaltmieteEur={inserat.kaltmiete_eur}
            onChange={(patch) => setMieteData((d) => ({ ...d, ...patch }))}
          />
        ) : (
          <KaufForm
            step={step}
            data={kaufData}
            errors={kaufErrors}
            kaufpreisEur={inserat.kaufpreis_eur}
            onChange={(patch) => setKaufData((d) => ({ ...d, ...patch }))}
          />
        )}
      </div>

      {submitError ? <p className="lp-field-error text-center">{submitError}</p> : null}

      <div className="flex gap-3">
        {step > 1 ? (
          <button type="button" className="lp-btn-secondary flex-1" onClick={handleBack} disabled={isPending}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {step < 3 ? (
          <button type="button" className="lp-btn-primary flex-1" onClick={handleNext}>
            Weiter
          </button>
        ) : (
          <button
            type="button"
            className="lp-btn-primary flex-1"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gesendet…
              </>
            ) : (
              "Selbstauskunft einreichen"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
