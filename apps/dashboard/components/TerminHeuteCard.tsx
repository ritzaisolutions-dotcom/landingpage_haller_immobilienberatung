"use client";

import Link from "next/link";
import { BesichtigungCard } from "@/components/BesichtigungCard";
import { MitarbeiterAssignSelect } from "@/components/MitarbeiterAssignSelect";
import { StatusBadge } from "@/components/StatusBadge";
import { formatTime } from "@/lib/format";
import type { InseratZustaendigkeit, TodayAppointment } from "@/lib/types";

type TerminHeuteCardProps = {
  appointment: TodayAppointment;
  zustaendigkeiten: InseratZustaendigkeit[];
  currentUserEmail?: string;
  onUpdated: () => void;
};

function InseratThumbnail({ url, titel }: { url: string | null; titel: string }) {
  if (url) {
    return (
      <div
        className="h-16 w-16 shrink-0 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${url})` }}
        title={titel}
      />
    );
  }
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-dash-border bg-dash-card-alt text-[10px] text-dash-muted">
      Kein Foto
    </div>
  );
}

export function TerminHeuteCard({
  appointment,
  zustaendigkeiten,
  currentUserEmail,
  onUpdated,
}: TerminHeuteCardProps) {
  const { slot, lead, inserat } = appointment;
  const foto = inserat?.foto_urls?.[0] ?? null;

  return (
    <div className="dash-card overflow-hidden p-0">
      <div className="flex gap-4 p-4">
        <InseratThumbnail url={foto} titel={inserat?.titel ?? "Inserat"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-lg font-semibold text-dash-accent">
                {formatTime(slot.uhrzeit)} Uhr · {slot.dauer_minuten} Min.
              </p>
              <p className="font-semibold text-dash-text">{inserat?.titel ?? "—"}</p>
              <p className="text-xs text-dash-muted">{slot.adresse}</p>
            </div>
            {lead ? <StatusBadge status={lead.status} variant="lead" /> : null}
          </div>

          {lead ? (
            <div className="mt-3">
              <MitarbeiterAssignSelect
                leadId={lead.id}
                inseratUuid={inserat?.id ?? slot.inserat_id}
                currentAssignee={lead.zustaendiger_mitarbeiter}
                zustaendigkeiten={zustaendigkeiten}
                currentUserEmail={currentUserEmail}
                onAssigned={onUpdated}
              />
            </div>
          ) : (
            <p className="mt-2 text-sm text-dash-muted">Kein Lead zugeordnet</p>
          )}

          {inserat?.id ? (
            <Link
              href={`/inserate/${inserat.id}/besichtigungen`}
              className="mt-2 inline-block text-xs text-dash-accent hover:underline"
            >
              Inserat öffnen →
            </Link>
          ) : null}
        </div>
      </div>

      {lead ? (
        <div className="border-t border-dash-border px-4 pb-4 pt-2">
          <BesichtigungCard
            lead={lead}
            slotDatum={slot.datum}
            slotUhrzeit={slot.uhrzeit}
            inseratAdresse={slot.adresse}
            onUpdated={onUpdated}
            embedded
          />
        </div>
      ) : null}
    </div>
  );
}
