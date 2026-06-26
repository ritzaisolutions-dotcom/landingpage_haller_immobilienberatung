import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Besichtigungsslot,
  CrmFilterTab,
  Inserat,
  InseratZustaendigkeit,
  Lead,
  PipelineCounts,
  TodayAppointment,
} from "@/lib/types";

const PAGE_SIZE = 50;

const PIPELINE_STATUSES = [
  "termin_gebucht",
  "besichtigung_stattgefunden",
  "selbstauskunft_angefordert",
  "selbstauskunft_eingereicht",
] as const;

const ERLEDIGT_STATUSES = ["zugesagt", "abgesagt"] as const;

export async function fetchInserate(supabase: SupabaseClient) {
  return supabase.from("inserate").select("*").order("created_at", { ascending: false });
}

export async function fetchInseratById(supabase: SupabaseClient, id: string) {
  return supabase.from("inserate").select("*").eq("id", id).single();
}

export async function fetchSlotsForInserat(supabase: SupabaseClient, inseratId: string) {
  return supabase
    .from("besichtigungsslots")
    .select("*")
    .eq("inserat_id", inseratId)
    .order("datum", { ascending: true })
    .order("uhrzeit", { ascending: true });
}

export async function fetchBuchungsfenster(supabase: SupabaseClient, inseratId: string) {
  return supabase
    .from("buchungsfenster")
    .select("*")
    .eq("inserat_id", inseratId)
    .order("created_at", { ascending: false });
}

export async function fetchZustaendigkeiten(supabase: SupabaseClient, inseratId: string) {
  return supabase
    .from("inserat_zustaendigkeiten")
    .select("*")
    .eq("inserat_id", inseratId)
    .order("ist_hauptverantwortlich", { ascending: false });
}

export async function fetchZustaendigkeitenForInserate(
  supabase: SupabaseClient,
  inseratIds: string[],
) {
  if (inseratIds.length === 0) {
    return { data: [] as InseratZustaendigkeit[], error: null };
  }
  return supabase
    .from("inserat_zustaendigkeiten")
    .select("*")
    .in("inserat_id", inseratIds)
    .order("ist_hauptverantwortlich", { ascending: false });
}

export async function fetchLeadsForInserat(
  supabase: SupabaseClient,
  is24InseratId: string,
) {
  return supabase
    .from("leads")
    .select("*")
    .eq("inserat_id", is24InseratId)
    .in("status", [
      "termin_gebucht",
      "besichtigung_stattgefunden",
      "selbstauskunft_angefordert",
      "selbstauskunft_eingereicht",
    ])
    .order("termin_gebucht_at", { ascending: false });
}

export async function fetchSelbstauskuenfte(
  supabase: SupabaseClient,
  inseratId: string,
) {
  return supabase
    .from("selbstauskunft_vergleich")
    .select("*")
    .eq("inserat_id", inseratId)
    .order("mistral_score", { ascending: false, nullsFirst: false });
}

export async function fetchSlotsInRange(
  supabase: SupabaseClient,
  von: string,
  bis: string,
) {
  return supabase
    .from("besichtigungsslots")
    .select("*, inserate(titel, is24_inserat_id, adresse, typ)")
    .gte("datum", von)
    .lte("datum", bis)
    .order("datum", { ascending: true })
    .order("uhrzeit", { ascending: true });
}

export async function fetchTodayAppointments(
  supabase: SupabaseClient,
  date: string,
): Promise<{ data: TodayAppointment[]; error: Error | null }> {
  const { data: slots, error: slotsError } = await supabase
    .from("besichtigungsslots")
    .select("*")
    .eq("datum", date)
    .eq("belegt", 1)
    .order("uhrzeit", { ascending: true });

  if (slotsError) {
    return { data: [], error: new Error(slotsError.message) };
  }

  const slotList = (slots as Besichtigungsslot[]) ?? [];
  if (slotList.length === 0) {
    return { data: [], error: null };
  }

  const leadUuids = [
    ...new Set(slotList.map((s) => s.reserviert_lead_uuid).filter(Boolean) as string[]),
  ];
  const inseratUuids = [...new Set(slotList.map((s) => s.inserat_id))];

  const [leadsRes, inserateRes] = await Promise.all([
    leadUuids.length > 0
      ? supabase.from("leads").select("*").in("uuid", leadUuids)
      : Promise.resolve({ data: [] as Lead[], error: null }),
    supabase
      .from("inserate")
      .select("id, titel, adresse, foto_urls, is24_inserat_id")
      .in("id", inseratUuids),
  ]);

  if (leadsRes.error) {
    return { data: [], error: new Error(leadsRes.error.message) };
  }
  if (inserateRes.error) {
    return { data: [], error: new Error(inserateRes.error.message) };
  }

  const leadsByUuid = new Map<string, Lead>();
  for (const lead of (leadsRes.data as Lead[]) ?? []) {
    leadsByUuid.set(lead.uuid, lead);
  }

  const inserateById = new Map<string, TodayAppointment["inserat"]>();
  for (const ins of (inserateRes.data as TodayAppointment["inserat"][]) ?? []) {
    if (ins) inserateById.set(ins.id, ins);
  }

  const appointments: TodayAppointment[] = slotList.map((slot) => ({
    slot,
    lead: slot.reserviert_lead_uuid
      ? (leadsByUuid.get(slot.reserviert_lead_uuid) ?? null)
      : null,
    inserat: inserateById.get(slot.inserat_id) ?? null,
  }));

  return { data: appointments, error: null };
}

export async function fetchPipelineCounts(supabase: SupabaseClient): Promise<PipelineCounts> {
  const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const [bookings, disclosures, entscheidungen, frueh] = await Promise.all([
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "termin_gebucht")
      .gte("termin_gebucht_at", since48h),
    supabase
      .from("selbstauskuenfte")
      .select("id, leads!inner(status)", { count: "exact", head: true })
      .eq("leads.status", "selbstauskunft_eingereicht")
      .is("entscheidung", null),
    supabase
      .from("selbstauskuenfte")
      .select("*", { count: "exact", head: true })
      .is("entscheidung", null)
      .not("mistral_score", "is", null),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .in("status", ["neu", "dm_gesendet"])
      .is("archiviert_at", null),
  ]);

  const counts: PipelineCounts = {
    neueBuchungen: bookings.count ?? 0,
    neueSelbstauskuenfte: disclosures.count ?? 0,
    entscheidungenOffen: entscheidungen.count ?? 0,
    frueheAnfragen: frueh.count ?? 0,
    total: 0,
  };
  counts.total =
    counts.neueBuchungen +
    counts.neueSelbstauskuenfte +
    counts.entscheidungenOffen +
    counts.frueheAnfragen;

  return counts;
}

export type FetchLeadsCrmParams = {
  tab: CrmFilterTab;
  page: number;
  search?: string;
  inseratIs24Id?: string;
  statusFilter?: string;
};

export type FetchLeadsCrmResult = {
  leads: Lead[];
  total: number;
  inserateMap: Map<string, Pick<Inserat, "id" | "titel" | "foto_urls" | "adresse">>;
};

const AKTIV_STATUSES = [
  "neu",
  "dm_gesendet",
  "termin_gebucht",
  "besichtigung_stattgefunden",
  "selbstauskunft_angefordert",
  "selbstauskunft_eingereicht",
] as const;

function applyCrmTabFilter<T extends { in: (col: string, vals: readonly string[]) => T; is: (col: string, val: null) => T; not: (col: string, op: string, val: null) => T; neq: (col: string, val: string) => T }>(
  query: T,
  tab: CrmFilterTab,
): T {
  switch (tab) {
    case "aktiv":
      return query.in("status", [...AKTIV_STATUSES]).is("archiviert_at", null);
    case "frueh":
      return query.in("status", ["neu", "dm_gesendet"]).is("archiviert_at", null);
    case "pipeline":
      return query.in("status", [...PIPELINE_STATUSES]).is("archiviert_at", null);
    case "erledigt":
      return query.in("status", [...ERLEDIGT_STATUSES]);
    case "archiv":
      return query.not("archiviert_at", "is", null);
    default: {
      const _exhaustive: never = tab;
      return _exhaustive;
    }
  }
}

export async function fetchLeadsCrm(
  supabase: SupabaseClient,
  params: FetchLeadsCrmParams,
): Promise<FetchLeadsCrmResult> {
  const { tab, page, search, inseratIs24Id, statusFilter } = params;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("last_activity_at", { ascending: false });

  query = applyCrmTabFilter(query, tab);

  if (inseratIs24Id) {
    query = query.eq("inserat_id", inseratIs24Id);
  }

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  if (search?.trim()) {
    const q = `%${search.trim()}%`;
    query = query.or(`name.ilike.${q},email.ilike.${q},telefon.ilike.${q}`);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const leads = (data as Lead[]) ?? [];
  const is24Ids = [...new Set(leads.map((l) => l.inserat_id))];

  const inserateMap = new Map<string, Pick<Inserat, "id" | "titel" | "foto_urls" | "adresse">>();
  if (is24Ids.length > 0) {
    const { data: inserateData } = await supabase
      .from("inserate")
      .select("id, is24_inserat_id, titel, foto_urls, adresse")
      .in("is24_inserat_id", is24Ids);

    for (const ins of (inserateData as Inserat[]) ?? []) {
      inserateMap.set(ins.is24_inserat_id, {
        id: ins.id,
        titel: ins.titel,
        foto_urls: ins.foto_urls,
        adresse: ins.adresse,
      });
    }
  }

  return { leads, total: count ?? 0, inserateMap };
}

export async function fetchNotificationCount(supabase: SupabaseClient) {
  const counts = await fetchPipelineCounts(supabase);
  return counts.total;
}

export type {
  Inserat,
  Besichtigungsslot,
  Buchungsfenster,
  InseratZustaendigkeit,
  Lead,
  SelbstauskunftVergleich,
} from "@/lib/types";

export { PAGE_SIZE as CRM_PAGE_SIZE };
