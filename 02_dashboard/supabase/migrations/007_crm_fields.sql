-- CRM fields for dashboard V2.2: activity tracking and archiving

alter table public.leads
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists archiviert_at timestamptz;

-- Backfill last_activity_at from known timestamps
update public.leads
set last_activity_at = coalesce(
  entscheidung_at,
  selbstauskunft_angefordert_at,
  termin_gebucht_at,
  created_at
)
where last_activity_at = created_at or last_activity_at is null;

create index if not exists leads_last_activity_idx on public.leads (last_activity_at);
create index if not exists leads_archiviert_idx on public.leads (archiviert_at) where archiviert_at is not null;
create index if not exists leads_status_idx on public.leads (status);
