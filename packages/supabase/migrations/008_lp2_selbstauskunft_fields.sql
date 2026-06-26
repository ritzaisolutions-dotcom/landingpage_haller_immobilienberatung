-- LP2 Mieter-Selbstauskunft: additional self-declaration fields

alter table public.selbstauskuenfte
  add column if not exists aktuelle_adresse text,
  add column if not exists insolvenzverfahren_laufend boolean,
  add column if not exists raeumungstitel_5_jahre boolean,
  add column if not exists angaben_wahrheitsgemaess boolean default false,
  add column if not exists angaben_wahrheitsgemaess_at timestamptz;

drop view if exists public.selbstauskunft_vergleich;

create view public.selbstauskunft_vergleich
with (security_invoker = true) as
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
  sa.aktuelle_adresse,
  sa.insolvenzverfahren_laufend,
  sa.raeumungstitel_5_jahre,
  sa.kaufbudget_eur,
  sa.eigenkapital_vorhanden,
  sa.eigenkapital_hoehe_eur,
  sa.finanzierung_typ,
  sa.finanzierungsbestaetigung,
  sa.kaufzeitraum,
  sa.kaufgrund,
  sa.in_laufendem_verkauf,
  sa.dsgvo_accepted,
  sa.dsgvo_accepted_at,
  sa.angaben_wahrheitsgemaess,
  sa.angaben_wahrheitsgemaess_at,
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
  l.status as lead_status,
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
