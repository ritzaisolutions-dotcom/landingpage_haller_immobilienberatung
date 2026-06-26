"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { MieteForm } from "@/app/auskunft/MieteForm";
import { KaufForm } from "@/app/auskunft/KaufForm";
import { submitSelbstauskunft } from "@/app/auskunft/actions";
import type { Inserat, InseratTyp, KaufFormData, MieteFormData } from "@/lib/types";
import { needsEmployedSince, needsEmployerFields } from "@/lib/types";
import { minEinzugISO } from "@/lib/format";

type FormStep = 1 | 2 | 3 | 4;

type SelbstauskunftFormProps = {
  lp2Token: string;
  leadName: string;
  leadEmail: string;
  leadTelefon: string;
  inserat: Inserat;
  typ: InseratTyp;
};

function emptyMiete(leadName: string, leadEmail: string, leadTelefon: string): MieteFormData {
  return {
    name: leadName,
    email: leadEmail,
    telefon: leadTelefon,
    aktuelle_adresse: "",
    beschaeftigung_status: "",
    arbeitgeber: "",
    angestellt_seit: "",
    nettoeinkommen_eur: "",
    haushaltsgroesse: "",
    haustiere: "",
    haustiere_art: "",
    einzugstermin: "",
    insolvenzverfahren: "",
    raeumungstitel_5_jahre: "",
    warum_diese_wohnung: "",
    sonstige_angaben: "",
    dsgvo_accepted: false,
    angaben_wahrheitsgemaess: false,
  };
}

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
  angaben_wahrheitsgemaess: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateConsentStep(
  dsgvo: boolean,
  wahrheit: boolean,
): { dsgvo_accepted?: string; angaben_wahrheitsgemaess?: string } {
  const errors: { dsgvo_accepted?: string; angaben_wahrheitsgemaess?: string } = {};
  if (!dsgvo) errors.dsgvo_accepted = "Bitte bestätigen Sie die Datenschutzerklärung";
  if (!wahrheit) errors.angaben_wahrheitsgemaess = "Bitte bestätigen Sie die Richtigkeit Ihrer Angaben";
  return errors;
}

function validateMieteStep(
  step: FormStep,
  data: MieteFormData,
): Partial<Record<keyof MieteFormData, string>> {
  const errors: Partial<Record<keyof MieteFormData, string>> = {};

  if (step === 1) {
    if (!data.name.trim()) errors.name = "Pflichtfeld";
    if (!data.email.trim() || !EMAIL_RE.test(data.email.trim())) {
      errors.email = "Bitte gültige E-Mail angeben";
    }
    if (!data.telefon.trim()) errors.telefon = "Pflichtfeld";
    if (!data.aktuelle_adresse.trim()) errors.aktuelle_adresse = "Pflichtfeld";
  }

  if (step === 2) {
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

  if (step === 3) {
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
    if (!data.insolvenzverfahren) errors.insolvenzverfahren = "Pflichtfeld";
    if (!data.raeumungstitel_5_jahre) errors.raeumungstitel_5_jahre = "Pflichtfeld";
    const len = data.warum_diese_wohnung.trim().length;
    if (len < 50) errors.warum_diese_wohnung = "Mindestens 50 Zeichen";
    if (len > 500) errors.warum_diese_wohnung = "Maximal 500 Zeichen";
  }

  if (step === 4) {
    Object.assign(errors, validateConsentStep(data.dsgvo_accepted, data.angaben_wahrheitsgemaess));
  }

  return errors;
}

function validateKaufStep(
  step: FormStep,
  data: KaufFormData,
): Partial<Record<keyof KaufFormData, string>> {
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

  if (step === 4) {
    Object.assign(errors, validateConsentStep(data.dsgvo_accepted, data.angaben_wahrheitsgemaess));
  }

  return errors;
}

function nextStep(current: FormStep): FormStep {
  if (current === 1) return 2;
  if (current === 2) return 3;
  return 4;
}

function prevStep(current: FormStep): FormStep {
  if (current === 4) return 3;
  if (current === 3) return 2;
  return 1;
}

export function SelbstauskunftForm({
  lp2Token,
  leadName,
  leadEmail,
  leadTelefon,
  inserat,
  typ,
}: SelbstauskunftFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>(1);
  const [mieteData, setMieteData] = useState<MieteFormData>(() =>
    emptyMiete(leadName, leadEmail, leadTelefon),
  );
  const [kaufData, setKaufData] = useState<KaufFormData>(EMPTY_KAUF);
  const [mieteErrors, setMieteErrors] = useState<Partial<Record<keyof MieteFormData, string>>>({});
  const [kaufErrors, setKaufErrors] = useState<Partial<Record<keyof KaufFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pageTitle =
    typ === "miete" ? "Mieter-Selbstauskunft" : "Käufer-Selbstauskunft";

  const introText =
    typ === "miete"
      ? "Bitte füllen Sie die Mieter-Selbstauskunft vollständig aus."
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
    if (step < 4) setStep(nextStep(step));
  }

  function handleBack() {
    if (step > 1) setStep(prevStep(step));
  }

  function handleSubmit() {
    if (typ === "miete") {
      const errs = validateMieteStep(4, mieteData);
      setMieteErrors(errs);
      if (Object.keys(errs).length > 0) return;
    } else {
      const errs = validateKaufStep(4, kaufData);
      setKaufErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }

    setSubmitError(null);
    startTransition(async () => {
      try {
        const result = await submitSelbstauskunft({
          lp2Token,
          typ,
          miete: typ === "miete" ? mieteData : undefined,
          kauf: typ === "verkauf" ? kaufData : undefined,
        });
        if (!result.ok) {
          setSubmitError(result.error);
          return;
        }
        router.push(`/auskunft/success?name=${encodeURIComponent(result.success.name)}`);
      } catch {
        setSubmitError("Die Selbstauskunft konnte nicht gesendet werden. Bitte versuchen Sie es erneut.");
      }
    });
  }

  const progress = (step / 4) * 100;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-lp-muted">Guten Tag {leadName.split(/\s+/)[0]},</p>
        <h1 className="mt-1 text-2xl font-extrabold text-lp-text">{pageTitle}</h1>
        <p className="mt-1 text-sm font-medium text-lp-text">
          {inserat.titel}
        </p>
        <p className="mt-2 text-sm text-lp-muted">{introText}</p>
        <p className="mt-2 text-xs text-lp-muted">
          Ihre Angaben sind vertraulich und werden nach Abschluss des Auswahlverfahrens automatisch
          gelöscht.
        </p>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs font-semibold text-lp-muted">
          <span>Schritt {step} von 4</span>
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
          <button
            type="button"
            className="lp-btn-secondary flex-1"
            onClick={handleBack}
            disabled={isPending}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Zurück
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {step < 4 ? (
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
