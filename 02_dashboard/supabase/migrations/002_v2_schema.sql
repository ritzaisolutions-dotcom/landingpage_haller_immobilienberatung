-- Dashboard V2.1 schema: extend tables, add buchungsfenster, zustaendigkeiten, selbstauskuenfte

-- 1. Extend inserate
alter table public.inserate
  add column if not exists typ text not null default 'miete',
  add column if not exists kaufpreis_eur numeric,
  add column if not exists foto_urls jsonb default '[]'::jsonb;

alter table public.inserate
  drop constraint if exists inserate_typ_check;

alter table public.inserate
  add constraint inserate_typ_check check (typ in ('miete', 'verkauf'));

-- 2. Extend leads (V2 lifecycle fields)
alter table public.leads
  add column if not exists lp1_token text,
  add column if not exists lp2_token text,
  add column if not exists termin_gebucht_at timestamptz,
  add column if not exists besichtigung_stattgefunden boolean default false,
  add column if not exists selbstauskunft_angefordert_at timestamptz,
  add column if not exists zustaendiger_mitarbeiter text,
  add column if not exists kalender_event_id text,
  add column if not exists dsgvo_accepted boolean default false,
  add column if not exists dsgvo_accepted_at timestamptz,
  add column if not exists delete_after timestamptz;

-- 3. buchungsfenster
create table if not exists public.buchungsfenster (
  id uuid primary key default gen_random_uuid(),
  inserat_id uuid not null references public.inserate(id) on delete cascade,
  gueltig_von date not null,
  gueltig_bis date not null,
  buchbare_wochentage integer[] not null default '{1,2,3,4,5}',
  startzeit time not null default '09:00',
  endzeit time not null default '17:00',
  slot_dauer_minuten integer not null default 30,
  max_kapazitaet integer not null default 1,
  vorlaufzeit_stunden integer not null default 2,
  aktiv boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists buchungsfenster_inserat_idx on public.buchungsfenster (inserat_id);

-- 4. inserat_zustaendigkeiten
create table if not exists public.inserat_zustaendigkeiten (
  id uuid primary key default gen_random_uuid(),
  inserat_id uuid not null references public.inserate(id) on delete cascade,
  mitarbeiter_email text not null,
  ist_hauptverantwortlich boolean not null default false,
  created_at timestamptz not null default now(),
  unique (inserat_id, mitarbeiter_email)
);

create index if not exists inserat_zustaendigkeiten_inserat_idx
  on public.inserat_zustaendigkeiten (inserat_id);

-- 5. selbstauskuenfte
create table if not exists public.selbstauskuenfte (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  inserat_id uuid not null references public.inserate(id) on delete cascade,
  nettoeinkommen_eur numeric,
  beschaeftigung_status text,
  arbeitgeber text,
  angestellt_seit text,
  arbeitsverhaeltnis text,
  haushaltsgroesse integer,
  haustiere boolean default false,
  haustiere_art text,
  einzugstermin date,
  warum_diese_wohnung text,
  sonstige_angaben text,
  kaufbudget_eur numeric,
  eigenkapital_vorhanden text,
  finanzierung_typ text,
  finanzierungsbestaetigung text,
  kaufzeitraum text,
  kaufgrund text,
  dsgvo_accepted boolean default false,
  dsgvo_accepted_at timestamptz,
  mistral_score integer,
  mistral_begruendung text,
  mistral_staerken text,
  mistral_risiken text,
  analysiert_at timestamptz,
  entscheidung text check (entscheidung is null or entscheidung in ('zusage', 'absage')),
  entscheidung_at timestamptz,
  entscheidung_mitarbeiter text,
  delete_after timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists selbstauskuenfte_lead_idx on public.selbstauskuenfte (lead_id);
create index if not exists selbstauskuenfte_inserat_idx on public.selbstauskuenfte (inserat_id);

-- Ensure V2.1 kauf columns exist if table predates this migration
alter table public.selbstauskuenfte
  add column if not exists kaufbudget_eur numeric,
  add column if not exists eigenkapital_vorhanden text,
  add column if not exists finanzierung_typ text,
  add column if not exists finanzierungsbestaetigung text,
  add column if not exists kaufzeitraum text,
  add column if not exists kaufgrund text;

-- 6. View for comparison
-- Must DROP first: CREATE OR REPLACE cannot change column names/order when sa.* gains columns.
drop view if exists public.selbstauskunft_vergleich;

create view public.selbstauskunft_vergleich as
select
  sa.id,
  sa.lead_id,
  sa.inserat_id,
  sa.nettoeinkommen_eur,
  sa.beschaeftigung_status,
  sa.arbeitgeber,
  sa.angestellt_seit,
  sa.arbeitsverhaeltnis,
  sa.haushaltsgroesse,
  sa.haustiere,
  sa.haustiere_art,
  sa.einzugstermin,
  sa.warum_diese_wohnung,
  sa.sonstige_angaben,
  sa.kaufbudget_eur,
  sa.eigenkapital_vorhanden,
  sa.finanzierung_typ,
  sa.finanzierungsbestaetigung,
  sa.kaufzeitraum,
  sa.kaufgrund,
  sa.dsgvo_accepted,
  sa.dsgvo_accepted_at,
  sa.mistral_score,
  sa.mistral_begruendung,
  sa.mistral_staerken,
  sa.mistral_risiken,
  sa.analysiert_at,
  sa.entscheidung,
  sa.entscheidung_at,
  sa.entscheidung_mitarbeiter,
  sa.delete_after,
  sa.created_at,
  l.name as lead_name,
  l.email as lead_email,
  l.telefon as lead_telefon,
  l.is24_contact_id,
  i.titel as inserat_titel,
  i.adresse as inserat_adresse,
  i.kaltmiete_eur,
  i.kaufpreis_eur,
  i.typ as inserat_typ,
  case
    when i.kaltmiete_eur > 0 and sa.nettoeinkommen_eur is not null
    then round(sa.nettoeinkommen_eur / i.kaltmiete_eur, 2)
    else null
  end as einkommens_faktor
from public.selbstauskuenfte sa
join public.leads l on l.id = sa.lead_id
join public.inserate i on i.id = sa.inserat_id;

grant select on public.selbstauskunft_vergleich to authenticated;

-- 7. RLS
alter table public.buchungsfenster enable row level security;
alter table public.inserat_zustaendigkeiten enable row level security;
alter table public.selbstauskuenfte enable row level security;

-- buchungsfenster policies
drop policy if exists "staff_select_buchungsfenster" on public.buchungsfenster;
create policy "staff_select_buchungsfenster" on public.buchungsfenster
  for select to authenticated using (true);

drop policy if exists "staff_insert_buchungsfenster" on public.buchungsfenster;
create policy "staff_insert_buchungsfenster" on public.buchungsfenster
  for insert to authenticated with check (true);

drop policy if exists "staff_update_buchungsfenster" on public.buchungsfenster;
create policy "staff_update_buchungsfenster" on public.buchungsfenster
  for update to authenticated using (true);

drop policy if exists "staff_delete_buchungsfenster" on public.buchungsfenster;
create policy "staff_delete_buchungsfenster" on public.buchungsfenster
  for delete to authenticated using (true);

-- inserat_zustaendigkeiten policies
drop policy if exists "staff_select_zustaendigkeiten" on public.inserat_zustaendigkeiten;
create policy "staff_select_zustaendigkeiten" on public.inserat_zustaendigkeiten
  for select to authenticated using (true);

drop policy if exists "staff_insert_zustaendigkeiten" on public.inserat_zustaendigkeiten;
create policy "staff_insert_zustaendigkeiten" on public.inserat_zustaendigkeiten
  for insert to authenticated with check (true);

drop policy if exists "staff_update_zustaendigkeiten" on public.inserat_zustaendigkeiten;
create policy "staff_update_zustaendigkeiten" on public.inserat_zustaendigkeiten
  for update to authenticated using (true);

drop policy if exists "staff_delete_zustaendigkeiten" on public.inserat_zustaendigkeiten;
create policy "staff_delete_zustaendigkeiten" on public.inserat_zustaendigkeiten
  for delete to authenticated using (true);

-- selbstauskuenfte policies
drop policy if exists "staff_select_selbstauskuenfte" on public.selbstauskuenfte;
create policy "staff_select_selbstauskuenfte" on public.selbstauskuenfte
  for select to authenticated using (true);

drop policy if exists "staff_insert_selbstauskuenfte" on public.selbstauskuenfte;
create policy "staff_insert_selbstauskuenfte" on public.selbstauskuenfte
  for insert to authenticated with check (true);

drop policy if exists "staff_update_selbstauskuenfte" on public.selbstauskuenfte;
create policy "staff_update_selbstauskuenfte" on public.selbstauskuenfte
  for update to authenticated using (true);

drop policy if exists "staff_delete_selbstauskuenfte" on public.selbstauskuenfte;
create policy "staff_delete_selbstauskuenfte" on public.selbstauskuenfte
  for delete to authenticated using (true);

-- leads insert policy (for completeness)
drop policy if exists "staff_insert_leads" on public.leads;
create policy "staff_insert_leads" on public.leads
  for insert to authenticated with check (true);
