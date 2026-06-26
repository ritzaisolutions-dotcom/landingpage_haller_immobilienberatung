-- LP2 demo: fixed token for local testing
-- Run after dashboard migrations 001 + 002 (+ 005 for kauf columns)
-- Demo URL: /auskunft?t=demo-lp2-token-haller-2026

-- Ensure miete inserat exists
insert into public.inserate (
  is24_inserat_id, titel, adresse, zimmer, flaeche_qm, kaltmiete_eur, typ, status, is24_url
)
values (
  'IS24-48291',
  'Helle 3-Zi.-Wohnung — Mainzer Str.',
  'Mainzer Str. 12, 56626 Andernach',
  3, 78, 850, 'miete', 'aktiv',
  'https://www.immobilienscout24.de'
)
on conflict (is24_inserat_id) do update set
  typ = 'miete',
  titel = excluded.titel,
  kaltmiete_eur = excluded.kaltmiete_eur;

-- Demo lead ready for LP2 (delete prior demo row if re-seeding)
delete from public.selbstauskuenfte
where lead_id in (
  select id from public.leads where lp2_token = 'demo-lp2-token-haller-2026'
);

delete from public.leads where lp2_token = 'demo-lp2-token-haller-2026';

insert into public.leads (
  uuid,
  lp1_token,
  lp2_token,
  name,
  email,
  telefon,
  inserat_id,
  status,
  termin_gebucht_at,
  besichtigung_stattgefunden,
  selbstauskunft_angefordert_at,
  created_at
)
values (
  'demo-lp2-lead-uuid-2026',
  'demo-lp1-token-unused',
  'demo-lp2-token-haller-2026',
  'Demo Mieter LP2',
  'demo.lp2@example.de',
  '+49 170 1234567',
  'IS24-48291',
  'selbstauskunft_angefordert',
  now() - interval '5 days',
  true,
  now(),
  now() - interval '7 days'
);

-- Verkauf demo lead (optional second test)
insert into public.leads (
  uuid,
  lp1_token,
  lp2_token,
  name,
  email,
  telefon,
  inserat_id,
  status,
  termin_gebucht_at,
  besichtigung_stattgefunden,
  selbstauskunft_angefordert_at,
  created_at
)
select
  'demo-lp2-kauf-uuid-2026',
  'demo-lp1-kauf-unused',
  'demo-lp2-kauf-token-2026',
  'Demo Käufer LP2',
  'demo.kauf@example.de',
  '+49 170 7654321',
  'IS24-99102',
  'selbstauskunft_angefordert',
  now() - interval '4 days',
  true,
  now(),
  now() - interval '6 days'
where exists (select 1 from public.inserate where is24_inserat_id = 'IS24-99102')
  and not exists (select 1 from public.leads where lp2_token = 'demo-lp2-kauf-token-2026');
