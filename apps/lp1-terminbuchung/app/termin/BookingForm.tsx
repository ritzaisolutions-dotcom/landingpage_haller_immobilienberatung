"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { bookTermin } from "@/app/termin/actions";
import { InseratSummary } from "@/components/InseratSummary";
import { SlotPicker } from "@/components/SlotPicker";
import {
  hasFieldErrors,
  validateContact,
  type FieldErrors,
} from "@/lib/validation";
import type { Besichtigungsslot, Inserat, Lead } from "@/lib/types";

type BookingFormProps = {
  token: string;
  lead: Lead;
  inserat: Inserat;
  slots: Besichtigungsslot[];
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_token: "Ihr Buchungslink ist ungültig.",
  expired: "Ihr Buchungslink ist abgelaufen.",
  already_booked: "Sie haben bereits einen Termin gebucht.",
  slot_taken: "Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie einen anderen.",
  config: "Der Service ist vorübergehend nicht verfügbar.",
  unknown: "Die Buchung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
};

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lp-primary text-xs font-bold text-white">
        {step}
      </span>
      <h2 className="text-xl font-bold text-lp-text">{title}</h2>
    </div>
  );
}

export function BookingForm({ token, lead, inserat, slots }: BookingFormProps) {
  const [name, setName] = useState(lead.name ?? "");
  const [email, setEmail] = useState(lead.email ?? "");
  const [telefon, setTelefon] = useState(lead.telefon ?? "");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [dsgvo, setDsgvo] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canSubmit =
    slots.length > 0 &&
    selectedSlotId != null &&
    dsgvo &&
    name.trim() &&
    email.trim() &&
    telefon.trim() &&
    !hasFieldErrors(errors);

  function handleBlur(field: "name" | "email" | "telefon") {
    const next = validateContact(name, email, telefon);
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validateContact(name, email, telefon);
    setErrors(fieldErrors);
    if (hasFieldErrors(fieldErrors) || !selectedSlotId || !dsgvo) return;

    setSubmitError(null);
    startTransition(async () => {
      const result = await bookTermin(token, selectedSlotId, name, email, telefon, dsgvo);
      if (result && !result.ok) {
        setSubmitError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.unknown);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="lp-card">
        <StepLabel step={1} title="Ihr Wunschobjekt" />
        <InseratSummary inserat={inserat} embedded />
      </section>

      <section className="lp-card">
        <StepLabel step={2} title="Termin wählen" />
        <SlotPicker
          slots={slots}
          selectedId={selectedSlotId}
          onSelect={setSelectedSlotId}
        />
      </section>

      <section className="lp-card">
        <StepLabel step={3} title="Ihre Kontaktdaten" />
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-lp-text">
              Name *
            </label>
            <input
              id="name"
              type="text"
              className="lp-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              required
            />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-lp-text">
              E-Mail *
            </label>
            <input
              id="email"
              type="email"
              className="lp-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              required
            />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
          </div>
          <div>
            <label htmlFor="telefon" className="mb-1 block text-sm font-medium text-lp-text">
              Telefon *
            </label>
            <input
              id="telefon"
              type="tel"
              className="lp-input"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              onBlur={() => handleBlur("telefon")}
              required
            />
            {errors.telefon ? (
              <p className="mt-1 text-xs text-red-600">{errors.telefon}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="lp-card">
        <StepLabel step={4} title="Datenschutz" />
        <label className="flex cursor-pointer items-start gap-3 text-sm text-lp-text">
          <input
            type="checkbox"
            checked={dsgvo}
            onChange={(e) => setDsgvo(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-lp-border text-lp-primary focus:ring-lp-primary"
          />
          <span>
            Ich stimme der Verarbeitung meiner personenbezogenen Daten zur Terminverwaltung
            durch Haller Immobilienberatung GmbH gemäß{" "}
            <a
              href="https://haller-immobilien.de/datenschutz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lp-primary underline"
            >
              Datenschutzerklärung
            </a>{" "}
            zu. Meine Daten werden nach Abschluss des Prozesses automatisch gelöscht.
          </span>
        </label>
      </section>

      {submitError ? (
        <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <button type="submit" disabled={!canSubmit || pending} className="lp-btn-primary w-full">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buchung wird verarbeitet...
          </>
        ) : (
          "Termin verbindlich buchen"
        )}
      </button>
    </form>
  );
}
