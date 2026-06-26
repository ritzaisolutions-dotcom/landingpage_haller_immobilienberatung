"use client";

import Link from "next/link";

type DsgvoConsentProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  demoMode?: boolean;
};

export function DsgvoConsent({
  checked,
  onChange,
  id = "dsgvo-consent",
  demoMode: _demoMode = false,
}: DsgvoConsentProps) {
  return (
    <div className="rounded-haller border border-website-border bg-website-bg p-3">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-website-border accent-website-primary"
        />
        <span className="text-xs leading-relaxed text-website-muted">
          Ich willige ein, dass die von mir hochgeladenen Unterlagen (u. a.
          SCHUFA-Auskunft, Gehaltsnachweise) sowie meine Kontaktdaten zum Zweck
          der Bearbeitung meiner Mietanfrage verarbeitet werden, einschließlich
          einer automatisierten Vollständigkeitsprüfung. Ich habe die{" "}
          <Link
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-website-primary underline underline-offset-2 hover:text-[#0099b5]"
            onClick={(e) => e.stopPropagation()}
          >
            Datenschutzerklärung
          </Link>{" "}
          gelesen. <span className="text-red-500">*</span>
        </span>
      </label>
      {!checked ? (
        <p className="mt-2 pl-7 text-[11px] text-website-muted">
          Pflichtfeld — ohne Zustimmung ist eine Einreichung nicht möglich.
        </p>
      ) : null}
    </div>
  );
}
