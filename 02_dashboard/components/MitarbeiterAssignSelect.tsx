"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { createClient } from "@/lib/supabase/client";
import type { InseratZustaendigkeit } from "@/lib/types";

type MitarbeiterAssignSelectProps = {
  leadId: string;
  inseratUuid: string | null;
  currentAssignee: string | null;
  zustaendigkeiten: InseratZustaendigkeit[];
  currentUserEmail?: string;
  onAssigned: () => void;
  className?: string;
};

export function MitarbeiterAssignSelect({
  leadId,
  inseratUuid,
  currentAssignee,
  zustaendigkeiten,
  currentUserEmail,
  onAssigned,
  className = "",
}: MitarbeiterAssignSelectProps) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState(currentAssignee ?? "");

  useEffect(() => {
    setValue(currentAssignee ?? "");
  }, [currentAssignee]);

  const pool = zustaendigkeiten.filter((z) => z.inserat_id === inseratUuid);
  const options = [...new Set(pool.map((z) => z.mitarbeiter_email))];

  async function assign(email: string) {
    setSaving(true);
    setValue(email);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({
        zustaendiger_mitarbeiter: email || null,
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    setSaving(false);
    if (error) {
      showToast(error.message, "error");
      setValue(currentAssignee ?? "");
      return;
    }
    showToast(email ? "Zuständigkeit zugewiesen" : "Zuweisung entfernt");
    onAssigned();
  }

  if (!leadId) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-xs text-dash-muted shrink-0">Zuständig:</label>
      <select
        value={value}
        disabled={saving || !inseratUuid}
        onChange={(e) => assign(e.target.value)}
        className="dash-input min-w-[160px] py-1 text-xs"
      >
        <option value="">— Nicht zugewiesen —</option>
        {currentUserEmail && !options.includes(currentUserEmail) ? (
          <option value={currentUserEmail}>Mir zuweisen ({currentUserEmail})</option>
        ) : null}
        {options.map((email) => (
          <option key={email} value={email}>
            {email === currentUserEmail ? `Mir (${email})` : email}
          </option>
        ))}
        {currentUserEmail && options.includes(currentUserEmail) ? (
          <option value={currentUserEmail}>Mir zuweisen</option>
        ) : null}
      </select>
    </div>
  );
}
