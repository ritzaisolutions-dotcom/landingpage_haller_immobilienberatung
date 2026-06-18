-- Test lead for live demo (token = uuid column value)
insert into public.leads (
  uuid,
  name,
  inserat_id,
  status,
  nachricht_text,
  landing_page_url,
  liquiditaet_erwaehnt
)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Max Mustermann',
  'IS24-48291',
  'neu',
  'Guten Tag, ich interessiere mich für die Wohnung in der Mainzer Str. 12.',
  'https://landingpage-haller-immobilienberatu.vercel.app/upload?t=a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  false
)
on conflict (uuid) do update set
  name = excluded.name,
  inserat_id = excluded.inserat_id,
  status = excluded.status,
  nachricht_text = excluded.nachricht_text,
  landing_page_url = excluded.landing_page_url,
  liquiditaet_erwaehnt = excluded.liquiditaet_erwaehnt;
