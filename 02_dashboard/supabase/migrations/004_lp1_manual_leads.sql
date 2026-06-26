-- LP1 manual lead fallback + correct token expiry tracking

alter table public.leads
  add column if not exists lp1_token_issued_at timestamptz,
  add column if not exists lead_source text not null default 'wf1',
  add column if not exists created_by_mitarbeiter text;

-- Backfill issued_at for existing LP1 tokens
update public.leads
set lp1_token_issued_at = created_at
where lp1_token is not null
  and lp1_token_issued_at is null;

create unique index if not exists leads_lp1_token_unique
  on public.leads (lp1_token)
  where lp1_token is not null;
