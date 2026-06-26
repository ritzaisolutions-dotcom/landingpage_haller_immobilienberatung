-- LP1 demo seed: known token for local/testing
-- Run on shared Supabase after dashboard migrations (001–003)
-- Demo URL: /termin?t=demo-lp1-token-haller-2026

insert into public.leads (
  uuid,
  lp1_token,
  lp1_token_issued_at,
  lead_source,
  name,
  email,
  telefon,
  inserat_id,
  status,
  nachricht_text,
  created_at
)
select
  gen_random_uuid()::text,
  'demo-lp1-token-haller-2026',
  now(),
  'manual',
  'Demo Interessent',
  'demo.interessent@example.de',
  '+49 170 1112233',
  'IS24-48291',
  'neu',
  'Demo-Lead für LP1 Terminbuchung.',
  now()
where not exists (
  select 1 from public.leads where lp1_token = 'demo-lp1-token-haller-2026'
);

-- Ensure free slots exist on Miete inserat
insert into public.besichtigungsslots (
  inserat_id, adresse, datum, uhrzeit, dauer_minuten, kapazitaet, belegt, slot_status
)
select
  i.id,
  i.adresse,
  (current_date + interval '3 days')::date,
  '11:00:00',
  30,
  1,
  0,
  'frei'
from public.inserate i
where i.is24_inserat_id = 'IS24-48291'
  and not exists (
    select 1 from public.besichtigungsslots s
    where s.inserat_id = i.id
      and s.datum = (current_date + interval '3 days')::date
      and s.uhrzeit = '11:00:00'
  );

insert into public.besichtigungsslots (
  inserat_id, adresse, datum, uhrzeit, dauer_minuten, kapazitaet, belegt, slot_status
)
select
  i.id,
  i.adresse,
  (current_date + interval '4 days')::date,
  '15:30:00',
  30,
  1,
  0,
  'frei'
from public.inserate i
where i.is24_inserat_id = 'IS24-48291'
  and not exists (
    select 1 from public.besichtigungsslots s
    where s.inserat_id = i.id
      and s.datum = (current_date + interval '4 days')::date
      and s.uhrzeit = '15:30:00'
  );
