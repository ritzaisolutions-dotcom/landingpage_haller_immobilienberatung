-- Demo seed for Dashboard V2.1 testing
-- Run after 001_dashboard_schema.sql and 002_v2_schema.sql

-- Miete inserat (update existing or insert)
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
  titel = excluded.titel;

-- Verkauf inserat
insert into public.inserate (
  is24_inserat_id, titel, adresse, zimmer, flaeche_qm, kaltmiete_eur, kaufpreis_eur, typ, status, is24_url
)
values (
  'IS24-99102',
  'Einfamilienhaus mit Garten — Koblenzer Str.',
  'Koblenzer Str. 45, 56626 Andernach',
  5, 142, 0, 320000, 'verkauf', 'aktiv',
  'https://www.immobilienscout24.de'
)
on conflict (is24_inserat_id) do nothing;

-- Buchungsfenster for Miete inserat
insert into public.buchungsfenster (
  inserat_id, gueltig_von, gueltig_bis, buchbare_wochentage,
  startzeit, endzeit, slot_dauer_minuten, max_kapazitaet, vorlaufzeit_stunden
)
select
  i.id,
  current_date,
  (current_date + interval '30 days')::date,
  '{1,2,3,4,5,6}',
  '09:00', '17:00', 30, 1, 2
from public.inserate i
where i.is24_inserat_id = 'IS24-48291'
  and not exists (
    select 1 from public.buchungsfenster b where b.inserat_id = i.id
  );

-- Staff assignment
insert into public.inserat_zustaendigkeiten (inserat_id, mitarbeiter_email, ist_hauptverantwortlich)
select i.id, 'thomas@haller-immobilien.de', true
from public.inserate i
where i.is24_inserat_id = 'IS24-48291'
on conflict (inserat_id, mitarbeiter_email) do nothing;

-- Slots
insert into public.besichtigungsslots (inserat_id, adresse, datum, uhrzeit, dauer_minuten, kapazitaet, belegt, slot_status)
select i.id, i.adresse, (current_date + interval '2 days')::date, '10:00:00', 30, 1, 1, 'reserviert'
from public.inserate i where i.is24_inserat_id = 'IS24-48291'
  and not exists (select 1 from public.besichtigungsslots s where s.inserat_id = i.id and s.datum = (current_date + interval '2 days')::date);

insert into public.besichtigungsslots (inserat_id, adresse, datum, uhrzeit, dauer_minuten, kapazitaet, belegt, slot_status)
select i.id, i.adresse, (current_date + interval '5 days')::date, '14:00:00', 30, 1, 0, 'frei'
from public.inserate i where i.is24_inserat_id = 'IS24-48291'
  and not exists (select 1 from public.besichtigungsslots s where s.inserat_id = i.id and s.datum = (current_date + interval '5 days')::date);

-- Demo leads (Miete inserat)
insert into public.leads (
  uuid, lp1_token, name, email, telefon, inserat_id, status,
  termin_gebucht_at, besichtigung_stattgefunden, nachricht_text, created_at
)
select
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  'Max Mustermann',
  'max.mustermann@example.de',
  '+49 171 1234567',
  'IS24-48291',
  'termin_gebucht',
  now() - interval '2 hours',
  false,
  'Guten Tag, ich interessiere mich für die Wohnung.',
  now() - interval '1 day'
where not exists (select 1 from public.leads where email = 'max.mustermann@example.de');

-- Link reserved slot to Max Mustermann (after lead exists)
update public.besichtigungsslots s
set
  reserviert_lead_uuid = l.uuid,
  belegt = 1,
  slot_status = 'reserviert'
from public.inserate i
join public.leads l on l.inserat_id = i.is24_inserat_id and l.email = 'max.mustermann@example.de'
where s.inserat_id = i.id
  and i.is24_inserat_id = 'IS24-48291'
  and s.datum = (current_date + interval '2 days')::date;

insert into public.leads (
  uuid, lp1_token, lp2_token, name, email, telefon, inserat_id, status,
  termin_gebucht_at, besichtigung_stattgefunden, selbstauskunft_angefordert_at, created_at
)
select
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  'Anna Schmidt',
  'anna.schmidt@example.de',
  '+49 172 9876543',
  'IS24-48291',
  'besichtigung_stattgefunden',
  now() - interval '3 days',
  true,
  now() - interval '1 day',
  now() - interval '5 days'
where not exists (select 1 from public.leads where email = 'anna.schmidt@example.de');

insert into public.leads (
  uuid, lp1_token, lp2_token, name, email, telefon, inserat_id, status,
  termin_gebucht_at, besichtigung_stattgefunden, selbstauskunft_angefordert_at, created_at
)
select
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  'Peter Meyer',
  'peter.meyer@example.de',
  '+49 173 5551234',
  'IS24-48291',
  'selbstauskunft_eingereicht',
  now() - interval '7 days',
  true,
  now() - interval '5 days',
  now() - interval '10 days'
where not exists (select 1 from public.leads where email = 'peter.meyer@example.de');

insert into public.leads (
  uuid, lp1_token, lp2_token, name, email, telefon, inserat_id, status,
  termin_gebucht_at, besichtigung_stattgefunden, created_at
)
select
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  'Lisa Weber',
  'lisa.weber@example.de',
  '+49 174 4445566',
  'IS24-48291',
  'selbstauskunft_eingereicht',
  now() - interval '6 days',
  true,
  now() - interval '8 days'
where not exists (select 1 from public.leads where email = 'lisa.weber@example.de');

-- Selbstauskuenfte for comparison view
insert into public.selbstauskuenfte (
  lead_id, inserat_id, nettoeinkommen_eur, beschaeftigung_status, arbeitgeber,
  angestellt_seit, arbeitsverhaeltnis, haushaltsgroesse, haustiere, haustiere_art,
  einzugstermin, warum_diese_wohnung, mistral_score, mistral_begruendung,
  mistral_staerken, mistral_risiken, analysiert_at, created_at
)
select
  l.id, i.id, 3570, 'angestellt', 'Stadtwerke Andernach',
  '03/2019', 'unbefristet', 2, false, null,
  (current_date + interval '60 days')::date,
  'Perfekte Lage nahe dem Bahnhof, ideal für meinen Arbeitsweg.',
  92,
  'Sehr gutes Einkommensverhältnis von 4,2x der Kaltmiete. Unbefristetes Arbeitsverhältnis seit über 5 Jahren.',
  'Stabiles Einkommen|Ideale Haushaltsgröße|Keine Haustiere',
  '',
  now() - interval '1 day',
  now() - interval '1 day'
from public.leads l
join public.inserate i on i.is24_inserat_id = l.inserat_id
where l.email = 'peter.meyer@example.de'
  and not exists (select 1 from public.selbstauskuenfte sa where sa.lead_id = l.id);

insert into public.selbstauskuenfte (
  lead_id, inserat_id, nettoeinkommen_eur, beschaeftigung_status, arbeitgeber,
  angestellt_seit, arbeitsverhaeltnis, haushaltsgroesse, haustiere, haustiere_art,
  einzugstermin, warum_diese_wohnung, mistral_score, mistral_begruendung,
  mistral_staerken, mistral_risiken, analysiert_at, created_at
)
select
  l.id, i.id, 2635, 'angestellt', 'Büro Center GmbH',
  '08/2023', 'befristet', 1, true, '1 Katze',
  (current_date + interval '45 days')::date,
  'Ruhige Wohngegend, gute Anbindung.',
  78,
  'Ausreichendes Einkommen mit 3,1x Faktor. Befristeter Vertrag und Haustier sind leichte Risikofaktoren.',
  'Ausreichendes Einkommen|Einzelperson',
  'Befristeter Arbeitsvertrag|Haustier vorhanden',
  now() - interval '3 hours',
  now() - interval '3 hours'
from public.leads l
join public.inserate i on i.is24_inserat_id = l.inserat_id
where l.email = 'lisa.weber@example.de'
  and not exists (select 1 from public.selbstauskuenfte sa where sa.lead_id = l.id);

-- Verkauf lead + selbstauskunft
insert into public.leads (
  uuid, lp1_token, lp2_token, name, email, telefon, inserat_id, status,
  termin_gebucht_at, besichtigung_stattgefunden, created_at
)
select
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  gen_random_uuid()::text,
  'Thomas Keller',
  'thomas.keller@example.de',
  '+49 175 7778899',
  'IS24-99102',
  'selbstauskunft_eingereicht',
  now() - interval '4 days',
  true,
  now() - interval '6 days'
where not exists (select 1 from public.leads where email = 'thomas.keller@example.de');

insert into public.selbstauskuenfte (
  lead_id, inserat_id, kaufbudget_eur, eigenkapital_vorhanden, finanzierung_typ,
  finanzierungsbestaetigung, kaufzeitraum, kaufgrund, warum_diese_wohnung,
  mistral_score, mistral_begruendung, mistral_staerken, mistral_risiken,
  analysiert_at, created_at
)
select
  l.id, i.id, 340000, 'ja', 'bankfinanzierung',
  'vorhanden', 'sofort', 'eigennutzung',
  'Familienhaus mit Garten für unsere Kinder.',
  88,
  'Finanzierungsbestätigung liegt vor. Kaufzeitraum sofort signalisiert hohe Ernsthaftigkeit.',
  'Finanzierung gesichert|Sofortiger Kaufzeitraum|Eigennutzung',
  '',
  now() - interval '2 hours',
  now() - interval '2 hours'
from public.leads l
join public.inserate i on i.is24_inserat_id = l.inserat_id
where l.email = 'thomas.keller@example.de'
  and not exists (select 1 from public.selbstauskuenfte sa where sa.lead_id = l.id);
