"use client";

import type { MieteFormData } from "@/lib/types";
import {
  BESCHAEFTIGUNG_OPTIONS,
  HAUSHALT_OPTIONS,
  needsEmployedSince,
  needsEmployerFields,
} from "@/lib/types";
import { formatCurrencyEUR, formatDateDE, minEinzugISO, monthYearOptions } from "@/lib/format";

type MieteFormProps = {
  step: 1 | 2 | 3;
  data: MieteFormData;
  errors: Partial<Record<keyof MieteFormData, string>>;
  kaltmieteEur: number;
  onChange: (patch: Partial<MieteFormData>) => void;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-sm font-semibold text-lp-text">
      {children}
      {required ? <span className="text-lp-primary"> *</span> : null}
    </label>
  );
}

export function MieteForm({ step, data, errors, kaltmieteEur, onChange }: MieteFormProps) {
  const minNetto = kaltmieteEur * 3;
  const monthOptions = monthYearOptions();

  if (step === 1) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-lp-text">Berufliche Situation</h2>

        <div>
          <FieldLabel required>Beschäftigungsstatus</FieldLabel>
          <select
            className="lp-input"
            value={data.beschaeftigung_status}
            onChange={(e) => onChange({ beschaeftigung_status: e.target.value })}
          >
            <option value="">Bitte wählen…</option>
            {BESCHAEFTIGUNG_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.beschaeftigung_status ? (
            <p className="lp-field-error">{errors.beschaeftigung_status}</p>
          ) : null}
        </div>

        <div
          className={`lp-conditional ${needsEmployerFields(data.beschaeftigung_status) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <FieldLabel required>Arbeitgeber / Unternehmen</FieldLabel>
          <input
            className="lp-input"
            type="text"
            value={data.arbeitgeber}
            onChange={(e) => onChange({ arbeitgeber: e.target.value })}
          />
          {errors.arbeitgeber ? <p className="lp-field-error">{errors.arbeitgeber}</p> : null}
        </div>

        <div
          className={`lp-conditional ${needsEmployedSince(data.beschaeftigung_status) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <FieldLabel required>Beschäftigt seit</FieldLabel>
          <select
            className="lp-input"
            value={data.angestellt_seit}
            onChange={(e) => onChange({ angestellt_seit: e.target.value })}
          >
            <option value="">Monat / Jahr wählen…</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.angestellt_seit ? (
            <p className="lp-field-error">{errors.angestellt_seit}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel required>Monatliches Nettoeinkommen (€)</FieldLabel>
          <input
            className="lp-input"
            type="number"
            min={0}
            step={50}
            inputMode="decimal"
            value={data.nettoeinkommen_eur}
            onChange={(e) => onChange({ nettoeinkommen_eur: e.target.value })}
          />
          <p className="mt-1 text-xs text-lp-muted">
            Kaltmiete dieser Wohnung: {formatCurrencyEUR(kaltmieteEur)}/Monat (empfohlenes
            Mindest-Nettoeinkommen: {formatCurrencyEUR(minNetto)})
          </p>
          {errors.nettoeinkommen_eur ? (
            <p className="lp-field-error">{errors.nettoeinkommen_eur}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-lp-text">Haushalt & Wünsche</h2>

        <div>
          <FieldLabel required>Anzahl Personen im Haushalt inkl. Ihrer Person</FieldLabel>
          <select
            className="lp-input"
            value={data.haushaltsgroesse}
            onChange={(e) => onChange({ haushaltsgroesse: e.target.value })}
          >
            <option value="">Bitte wählen…</option>
            {HAUSHALT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === "8+" ? "8 oder mehr" : o}
              </option>
            ))}
          </select>
          {errors.haushaltsgroesse ? (
            <p className="lp-field-error">{errors.haushaltsgroesse}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel required>Haustiere vorhanden</FieldLabel>
          <div className="flex gap-4">
            {(["ja", "nein"] as const).map((v) => (
              <label key={v} className="flex min-h-[48px] cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="haustiere"
                  checked={data.haustiere === v}
                  onChange={() => onChange({ haustiere: v, haustiere_art: v === "nein" ? "" : data.haustiere_art })}
                />
                <span className="text-sm capitalize">{v}</span>
              </label>
            ))}
          </div>
          {errors.haustiere ? <p className="lp-field-error">{errors.haustiere}</p> : null}
        </div>

        <div
          className={`lp-conditional ${data.haustiere === "ja" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <FieldLabel required>Welche Haustiere?</FieldLabel>
          <input
            className="lp-input"
            type="text"
            value={data.haustiere_art}
            onChange={(e) => onChange({ haustiere_art: e.target.value })}
          />
          {errors.haustiere_art ? <p className="lp-field-error">{errors.haustiere_art}</p> : null}
        </div>

        <div>
          <FieldLabel required>Gewünschter Einzugstermin</FieldLabel>
          <input
            className="lp-input"
            type="date"
            min={minEinzugISO(14)}
            value={data.einzugstermin}
            onChange={(e) => onChange({ einzugstermin: e.target.value })}
          />
          {errors.einzugstermin ? (
            <p className="lp-field-error">{errors.einzugstermin}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel required>Warum möchten Sie in diese Wohnung?</FieldLabel>
          <textarea
            className="lp-input min-h-[100px] resize-none"
            rows={4}
            maxLength={500}
            placeholder="Bitte beschreiben Sie kurz Ihre Wohnsituation und warum diese Wohnung für Sie passt…"
            value={data.warum_diese_wohnung}
            onChange={(e) => onChange({ warum_diese_wohnung: e.target.value })}
          />
          <p className="mt-1 text-xs text-lp-muted">{data.warum_diese_wohnung.length}/500 Zeichen</p>
          {errors.warum_diese_wohnung ? (
            <p className="lp-field-error">{errors.warum_diese_wohnung}</p>
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-lp-text">Datenschutz & Abschluss</h2>

      <div className="lp-card space-y-2 bg-lp-bg text-sm">
        <p>
          <span className="font-semibold">Beschäftigung:</span> {data.beschaeftigung_status}
          {data.arbeitgeber ? ` bei ${data.arbeitgeber}` : ""}
        </p>
        <p>
          <span className="font-semibold">Nettoeinkommen:</span>{" "}
          {formatCurrencyEUR(Number(data.nettoeinkommen_eur))}/Monat
        </p>
        <p>
          <span className="font-semibold">Haushalt:</span> {data.haushaltsgroesse} Personen
          {data.haustiere === "ja" ? `, Haustiere: ${data.haustiere_art}` : ""}
        </p>
        <p>
          <span className="font-semibold">Einzugstermin:</span>{" "}
          {data.einzugstermin ? formatDateDE(data.einzugstermin) : "—"}
        </p>
      </div>

      <label className="flex cursor-pointer gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0"
          checked={data.dsgvo_accepted}
          onChange={(e) => onChange({ dsgvo_accepted: e.target.checked })}
        />
        <span className="text-sm text-lp-muted">
          Ich bestätige die Richtigkeit meiner Angaben und stimme der Verarbeitung meiner
          personenbezogenen Daten durch die Haller Immobilienberatung GmbH zur Bearbeitung meiner
          Mietbewerbung zu. Bei Ablehnung werden meine Daten nach 30 Tagen automatisch gelöscht.{" "}
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

      <p className="text-xs text-lp-muted">
        Nach dem Absenden werden Ihre Angaben von unserem Team geprüft.
      </p>
    </div>
  );
}
