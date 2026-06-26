import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

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
      variant: "already_submitted";
      title?: string;
      message?: string;
    };

export function StateScreen(props: StateScreenProps) {
  if (props.variant === "already_submitted") {
    return (
      <div className="lp-card text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-lp-success" />
        <h1 className="mb-2 text-[28px] font-extrabold text-lp-text">
          {props.title ?? "Selbstauskunft bereits eingereicht"}
        </h1>
        <p className="text-sm text-lp-muted">
          {props.message ??
            "Sie haben Ihre Selbstauskunft bereits übermittelt. Wir melden uns bei Ihnen."}
        </p>
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
