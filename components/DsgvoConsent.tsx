"use client";

import Link from "next/link";

type DsgvoConsentProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
};

export function DsgvoConsent({
  checked,
  onChange,
  id = "dsgvo-consent",
}: DsgvoConsentProps) {
  return (
    <div className="rounded-lg border border-haller-border bg-haller-bg/40 p-3">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-haller-border accent-haller-accent"
        />
        <span className="text-xs leading-relaxed text-haller-muted">
          Ich habe die{" "}
          <Link
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-haller-accent underline underline-offset-2 hover:text-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            Datenschutzerklärung
          </Link>{" "}
          gelesen und akzeptiere die darin beschriebene Verarbeitung meiner
          personenbezogenen Daten und hochgeladenen Unterlagen zur Bearbeitung
          meiner Mietanfrage.{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>
      {!checked ? (
        <p className="mt-2 pl-7 text-[11px] text-haller-muted">
          Pflichtfeld — ohne Zustimmung ist eine Einreichung nicht möglich.
        </p>
      ) : null}
    </div>
  );
}
