import { AlertCircle, CalendarCheck, Clock } from "lucide-react";
import { formatDateDE, formatDateTimeDE, formatTimeUhr } from "@/lib/format";
import type { Besichtigungsslot } from "@/lib/types";

type StateScreenProps =
  | {
      variant: "invalid";
      title: string;
      message: string;
    }
  | {
      variant: "expired";
      title: string;
      message: string;
    }
  | {
      variant: "already_booked";
      slot?: Besichtigungsslot;
      terminGebuchtAt?: string | null;
    };

export function StateScreen(props: StateScreenProps) {
  if (props.variant === "already_booked") {
    const { slot, terminGebuchtAt } = props;
    return (
      <div className="lp-card text-center">
        <CalendarCheck className="mx-auto mb-4 h-12 w-12 text-lp-primary" />
        <h1 className="mb-2 text-[28px] font-extrabold text-lp-text">Termin bereits gebucht</h1>
        <p className="mb-6 text-sm text-lp-muted">
          Sie haben bereits einen Besichtigungstermin für dieses Objekt gebucht.
        </p>
        {slot ? (
          <div className="mx-auto max-w-sm space-y-2 rounded-card border border-lp-border bg-lp-bg p-4 text-left text-sm">
            <p>
              <span className="font-semibold">Datum:</span> {formatDateDE(slot.datum)}
            </p>
            <p>
              <span className="font-semibold">Uhrzeit:</span> {formatTimeUhr(slot.uhrzeit)}
            </p>
            <p>
              <span className="font-semibold">Adresse:</span> {slot.adresse}
            </p>
          </div>
        ) : terminGebuchtAt ? (
          <p className="text-sm text-lp-muted">
            Gebucht am {formatDateTimeDE(terminGebuchtAt)}
          </p>
        ) : null}
      </div>
    );
  }
  const Icon = props.variant === "expired" ? Clock : AlertCircle;

  return (
    <div className="lp-card text-center">
      <Icon className="mx-auto mb-4 h-12 w-12 text-lp-muted" />
      <h1 className="mb-2 text-[28px] font-extrabold text-lp-text">{props.title}</h1>
      <p className="text-sm text-lp-muted">{props.message}</p>
    </div>
  );
}
