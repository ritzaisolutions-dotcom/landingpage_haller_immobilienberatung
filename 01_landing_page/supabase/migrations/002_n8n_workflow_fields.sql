-- n8n workflow fields (WF1–WF5) — additive only

-- WF1: ImmoScout lead metadata
alter table public.leads add column if not exists nachricht_text text;
alter table public.leads add column if not exists liquiditaet_erwaehnt boolean default false;
alter table public.leads add column if not exists is24_contact_id text;
alter table public.leads add column if not exists landing_page_url text;

-- WF2: Mistral document analysis
alter table public.leads add column if not exists mistral_score integer;
alter table public.leads add column if not exists fehlende_dokumente jsonb;
alter table public.leads add column if not exists mindestanforderung_ok boolean;
alter table public.leads add column if not exists dokumente_eingereicht_at timestamptz;

-- WF4: HITL employee decision
alter table public.leads add column if not exists mitarbeiter_notiz text;
alter table public.leads add column if not exists ablehnungsgrund text;
alter table public.leads add column if not exists entscheidung_at timestamptz;

-- WF5: Besichtigungsslots
create table if not exists public.besichtigungsslots (
  id uuid primary key default gen_random_uuid(),
  adresse text not null,
  datum date not null,
  uhrzeit time not null,
  kapazitaet integer not null default 1,
  belegt integer not null default 0,
  reserviert_lead_uuid text,
  reserviert_bis timestamptz,
  slot_status text not null default 'frei',
  created_at timestamptz not null default now()
);

create index if not exists besichtigungsslots_datum_idx on public.besichtigungsslots (datum);
create index if not exists besichtigungsslots_status_idx on public.besichtigungsslots (slot_status);

alter table public.besichtigungsslots enable row level security;
