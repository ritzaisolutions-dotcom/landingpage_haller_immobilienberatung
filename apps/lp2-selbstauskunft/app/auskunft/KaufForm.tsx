"use client";

import type { KaufFormData } from "@/lib/types";
import {
  EIGENKAPITAL_OPTIONS,
  FINANZIERUNG_OPTIONS,
  FINANZIERUNGSBESTAETIGUNG_OPTIONS,
  KAUFGRUND_OPTIONS,
  KAUFZEITRAUM_OPTIONS,
} from "@/lib/types";
import { formatCurrencyEUR } from "@/lib/format";

type KaufFormProps = {
  step: 1 | 2 | 3 | 4;
  data: KaufFormData;
  errors: Partial<Record<keyof KaufFormData, string>>;
  kaufpreisEur: number | null;
  onChange: (patch: Partial<KaufFormData>) => void;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-sm font-semibold text-lp-text">
      {children}
      {required ? <span className="text-lp-primary"> *</span> : null}
    </label>
  );
}

function showEigenkapitalHoehe(vorhanden: string): boolean {
  return vorhanden === "Ja" || vorhanden === "Teilweise";
}

export function KaufForm({ step, data, errors, kaufpreisEur, onChange }: KaufFormProps) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-lp-text">Ihre Kaufabsicht</h2>

        {kaufpreisEur ? (
          <p className="text-sm text-lp-muted">
            Kaufpreis des Objekts: {formatCurrencyEUR(kaufpreisEur)}
          </p>
        ) : null}

        <div>
          <FieldLabel required>Kaufbudget (€)</FieldLabel>
          <input
            className="lp-input"
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={data.kaufbudget_eur}
            onChange={(e) => onChange({ kaufbudget_eur: e.target.value })}
          />
          {errors.kaufbudget_eur ? <p className="lp-field-error">{errors.kaufbudget_eur}</p> : null}
        </div>

        <div>
          <FieldLabel required>Eigenkapital vorhanden</FieldLabel>
          <select
            className="lp-input"
            value={data.eigenkapital_vorhanden}
            onChange={(e) =>
              onChange({
                eigenkapital_vorhanden: e.target.value,
                eigenkapital_hoehe_eur: showEigenkapitalHoehe(e.target.value)
                  ? data.eigenkapital_hoehe_eur
                  : "",
              })
            }
          >
            <option value="">Bitte wählen…</option>
            {EIGENKAPITAL_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.eigenkapital_vorhanden ? (
            <p className="lp-field-error">{errors.eigenkapital_vorhanden}</p>
          ) : null}
        </div>

        <div
          className={`lp-conditional ${showEigenkapitalHoehe(data.eigenkapital_vorhanden) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <FieldLabel>Eigenkapitalhöhe (€)</FieldLabel>
          <input
            className="lp-input"
            type="number"
            min={0}
            step={1000}
            value={data.eigenkapital_hoehe_eur}
            onChange={(e) => onChange({ eigenkapital_hoehe_eur: e.target.value })}
          />
          {errors.eigenkapital_hoehe_eur ? (
            <p className="lp-field-error">{errors.eigenkapital_hoehe_eur}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel required>Finanzierung</FieldLabel>
          <select
            className="lp-input"
            value={data.finanzierung_typ}
            onChange={(e) => onChange({ finanzierung_typ: e.target.value })}
          >
            <option value="">Bitte wählen…</option>
            {FINANZIERUNG_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.finanzierung_typ ? (
            <p className="lp-field-error">{errors.finanzierung_typ}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel required>Finanzierungsbestätigung</FieldLabel>
          <select
            className="lp-input"
            value={data.finanzierungsbestaetigung}
            onChange={(e) => onChange({ finanzierungsbestaetigung: e.target.value })}
          >
            <option value="">Bitte wählen…</option>
            {FINANZIERUNGSBESTAETIGUNG_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.finanzierungsbestaetigung ? (
            <p className="lp-field-error">{errors.finanzierungsbestaetigung}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-lp-text">Kaufzeitraum & Ziel</h2>

        <div>
          <FieldLabel required>Angestrebter Kaufzeitraum</FieldLabel>
          <select
            className="lp-input"
            value={data.kaufzeitraum}
            onChange={(e) => onChange({ kaufzeitraum: e.target.value })}
          >
            <option value="">Bitte wählen…</option>
            {KAUFZEITRAUM_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.kaufzeitraum ? <p className="lp-field-error">{errors.kaufzeitraum}</p> : null}
        </div>

        <div>
          <FieldLabel required>Kaufgrund</FieldLabel>
          <select
            className="lp-input"
            value={data.kaufgrund}
            onChange={(e) => onChange({ kaufgrund: e.target.value })}
          >
            <option value="">Bitte wählen…</option>
            {KAUFGRUND_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.kaufgrund ? <p className="lp-field-error">{errors.kaufgrund}</p> : null}
        </div>

        <div>
          <FieldLabel required>Aktuell in laufendem Immobilienverkauf?</FieldLabel>
          <div className="flex gap-4">
            {(["ja", "nein"] as const).map((v) => (
              <label key={v} className="flex min-h-[48px] cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="in_laufendem_verkauf"
                  checked={data.in_laufendem_verkauf === v}
                  onChange={() => onChange({ in_laufendem_verkauf: v })}
                />
                <span className="text-sm capitalize">{v}</span>
              </label>
            ))}
          </div>
          {errors.in_laufendem_verkauf ? (
            <p className="lp-field-error">{errors.in_laufendem_verkauf}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel>Sonstige Anmerkungen</FieldLabel>
          <textarea
            className="lp-input min-h-[80px] resize-none"
            rows={3}
            value={data.sonstige_angaben}
            onChange={(e) => onChange({ sonstige_angaben: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-lp-text">Zusammenfassung</h2>

        <div className="lp-card space-y-2 bg-lp-bg text-sm">
          <p>
            <span className="font-semibold">Kaufbudget:</span>{" "}
            {formatCurrencyEUR(Number(data.kaufbudget_eur))}
          </p>
          <p>
            <span className="font-semibold">Eigenkapital:</span> {data.eigenkapital_vorhanden}
            {data.eigenkapital_hoehe_eur
              ? ` (${formatCurrencyEUR(Number(data.eigenkapital_hoehe_eur))})`
              : ""}
          </p>
          <p>
            <span className="font-semibold">Finanzierung:</span> {data.finanzierung_typ}
          </p>
          <p>
            <span className="font-semibold">Finanzierungsbestätigung:</span>{" "}
            {data.finanzierungsbestaetigung}
          </p>
          <p>
            <span className="font-semibold">Kaufzeitraum:</span> {data.kaufzeitraum}
          </p>
          <p>
            <span className="font-semibold">Kaufgrund:</span> {data.kaufgrund}
          </p>
          <p>
            <span className="font-semibold">Laufender Verkauf:</span>{" "}
            {data.in_laufendem_verkauf === "ja" ? "Ja" : "Nein"}
          </p>
        </div>

        <p className="text-xs text-lp-muted">
          Bitte prüfen Sie Ihre Angaben. Im nächsten Schritt bestätigen Sie die Einwilligungen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-lp-text">Bestätigung</h2>

      <p className="text-xs text-lp-muted">
        Es werden keine Unterlagen hochgeladen — Ihre Angaben erfolgen auf Selbstauskunft.
      </p>

      <label className="flex cursor-pointer gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0"
          checked={data.dsgvo_accepted}
          onChange={(e) => onChange({ dsgvo_accepted: e.target.checked })}
        />
        <span className="text-sm text-lp-muted">
          Ich stimme der Verarbeitung meiner personenbezogenen Daten durch die Haller
          Immobilienberatung GmbH zur Bearbeitung meiner Kaufanfrage zu. Bei Ablehnung werden meine
          Daten nach 30 Tagen automatisch gelöscht.{" "}
          <a
            href="https://haller-immobilien.de/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lp-primary underline"
          >
            Datenschutzerklärung
          </a>
        </span>
      </label>
      {errors.dsgvo_accepted ? <p className="lp-field-error">{errors.dsgvo_accepted}</p> : null}

      <label className="flex cursor-pointer gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0"
          checked={data.angaben_wahrheitsgemaess}
          onChange={(e) => onChange({ angaben_wahrheitsgemaess: e.target.checked })}
        />
        <span className="text-sm text-lp-muted">
          Ich versichere, dass alle Angaben nach bestem Wissen und Gewissen vollständig und wahr
          sind.
        </span>
      </label>
      {errors.angaben_wahrheitsgemaess ? (
        <p className="lp-field-error">{errors.angaben_wahrheitsgemaess}</p>
      ) : null}

      <p className="text-xs text-lp-muted">
        Nach dem Absenden werden Ihre Angaben von unserem Team geprüft.
      </p>
    </div>
  );
}
