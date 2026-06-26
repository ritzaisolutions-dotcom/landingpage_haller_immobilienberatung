"use client";

type StatusBadgeProps = {
  status: string;
  variant?: "slot" | "lead" | "inserat" | "default";
};

const SLOT_STYLES: Record<string, string> = {
  frei: "bg-dash-success/20 text-dash-success",
  reserviert: "bg-dash-warning/20 text-dash-warning",
  confirmed: "bg-dash-accent/20 text-dash-accent",
  abgelaufen: "bg-dash-muted/20 text-dash-muted",
};

const LEAD_STYLES: Record<string, string> = {
  neu: "bg-dash-muted/20 text-dash-muted",
  dm_gesendet: "bg-dash-muted/20 text-dash-muted",
  termin_gebucht: "bg-dash-accent/20 text-dash-accent",
  besichtigung_stattgefunden: "bg-dash-warning/20 text-dash-warning",
  selbstauskunft_angefordert: "bg-dash-warning/20 text-dash-warning",
  selbstauskunft_eingereicht: "bg-dash-success/20 text-dash-success",
  zugesagt: "bg-dash-success/20 text-dash-success",
  abgesagt: "bg-dash-danger/20 text-dash-danger",
  geloescht: "bg-dash-muted/20 text-dash-muted",
};

const INSERAT_STYLES: Record<string, string> = {
  aktiv: "bg-dash-success/20 text-dash-success",
  inaktiv: "bg-dash-muted/20 text-dash-muted",
  miete: "bg-dash-accent/20 text-dash-accent",
  verkauf: "bg-dash-warning/20 text-dash-warning",
};

const LABELS: Record<string, string> = {
  neu: "Neu",
  dm_gesendet: "Link gesendet",
  termin_gebucht: "Termin gebucht",
  besichtigung_stattgefunden: "Besichtigung",
  selbstauskunft_angefordert: "SA angefordert",
  selbstauskunft_eingereicht: "SA eingereicht",
  zugesagt: "Zugesagt",
  abgesagt: "Abgesagt",
  geloescht: "Gelöscht",
};

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const styles =
    variant === "slot"
      ? SLOT_STYLES
      : variant === "lead"
        ? LEAD_STYLES
        : variant === "inserat"
          ? INSERAT_STYLES
          : { ...SLOT_STYLES, ...LEAD_STYLES, ...INSERAT_STYLES };

  const label = LABELS[status] ?? status;

  return (
    <span
      className={`inline-block rounded-pill px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        styles[status] ?? "bg-dash-muted/20 text-dash-muted"
      }`}
    >
      {label}
    </span>
  );
}
