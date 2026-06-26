-- UC2 Upload-Portal: leads table + private dokumente bucket
-- RLS enabled with no public anon policies (server uses service role)

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  uuid text not null unique,
  name text not null,
  inserat_id text not null,
  email text,
  telefon text,
  status text not null default 'neu',
  created_at timestamptz not null default now(),
  dsgvo_accepted boolean not null default false,
  dsgvo_accepted_at timestamptz
);

create index if not exists leads_uuid_idx on public.leads (uuid);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- Private storage bucket for applicant documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dokumente',
  'dokumente',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
