import { scoreColor } from "@/lib/format";

type ScoreBadgeProps = {
  score: number | null;
  size?: "sm" | "lg";
};

const COLOR_MAP = {
  green: "border-dash-success text-dash-success bg-dash-success/10",
  amber: "border-dash-warning text-dash-warning bg-dash-warning/10",
  red: "border-dash-danger text-dash-danger bg-dash-danger/10",
  muted: "border-dash-muted text-dash-muted bg-dash-muted/10",
} as const;

const LABEL_MAP = {
  green: "Sehr geeignet",
  amber: "Geeignet",
  red: "Bedenken",
  muted: "Ausstehend",
} as const;

export function ScoreBadge({ score, size = "lg" }: ScoreBadgeProps) {
  const color = scoreColor(score);
  const dim = size === "lg" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex items-center justify-center rounded-full border-2 font-bold ${dim} ${COLOR_MAP[color]}`}
      >
        {score ?? "—"}
      </div>
      {size === "lg" ? (
        <span className={`text-[10px] font-medium uppercase ${COLOR_MAP[color].split(" ")[1]}`}>
          {LABEL_MAP[color]}
        </span>
      ) : null}
    </div>
  );
}
