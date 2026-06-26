"use client";

import type { LeadStatus } from "@/lib/types";

const CJ_STEPS: { status: LeadStatus | LeadStatus[]; label: string }[] = [
  { status: "neu", label: "Anfrage" },
  { status: "dm_gesendet", label: "Link" },
  { status: "termin_gebucht", label: "Termin" },
  { status: "besichtigung_stattgefunden", label: "Besichtigung" },
  { status: "selbstauskunft_angefordert", label: "SA angefordert" },
  { status: "selbstauskunft_eingereicht", label: "SA eingereicht" },
  { status: ["zugesagt", "abgesagt"], label: "Entscheidung" },
];

const STATUS_ORDER: LeadStatus[] = [
  "neu",
  "dm_gesendet",
  "termin_gebucht",
  "besichtigung_stattgefunden",
  "selbstauskunft_angefordert",
  "selbstauskunft_eingereicht",
  "zugesagt",
  "abgesagt",
];

function getStepIndex(status: string): number {
  if (status === "zugesagt" || status === "abgesagt") {
    return CJ_STEPS.length - 1;
  }
  const idx = STATUS_ORDER.indexOf(status as LeadStatus);
  return idx >= 0 ? idx : 0;
}

type LeadCjStepperProps = {
  status: string;
  compact?: boolean;
};

export function LeadCjStepper({ status, compact = false }: LeadCjStepperProps) {
  const currentIdx = getStepIndex(status);

  if (compact) {
    return (
      <div className="flex items-center gap-0.5">
        {CJ_STEPS.map((step, idx) => (
          <div
            key={step.label}
            title={step.label}
            className={`h-1.5 flex-1 rounded-full ${
              idx <= currentIdx ? "bg-dash-accent" : "bg-dash-border"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {CJ_STEPS.map((step, idx) => {
        const isActive = idx === currentIdx;
        const isDone = idx < currentIdx;
        return (
          <div key={step.label} className="flex items-center gap-1">
            <div
              title={step.label}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                isActive
                  ? "bg-dash-accent text-white"
                  : isDone
                    ? "bg-dash-accent/30 text-dash-accent"
                    : "bg-dash-border text-dash-muted"
              }`}
            >
              {idx + 1}
            </div>
            {idx < CJ_STEPS.length - 1 ? (
              <div
                className={`h-0.5 w-3 ${isDone ? "bg-dash-accent/50" : "bg-dash-border"}`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function getCjStepLabel(status: string): string {
  const idx = getStepIndex(status);
  return CJ_STEPS[idx]?.label ?? status;
}

export { CJ_STEPS, STATUS_ORDER as LEAD_STATUS_ORDER };
