-- Security hardening: security_invoker view + tighter selbstauskuenfte RLS

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

-- Dashboard staff should not insert/delete selbstauskuenfte (LP2 + n8n only)
drop policy if exists "staff_insert_selbstauskuenfte" on public.selbstauskuenfte;
drop policy if exists "staff_delete_selbstauskuenfte" on public.selbstauskuenfte;

-- Staff may update entscheidung fields only via dashboard
drop policy if exists "staff_update_selbstauskuenfte" on public.selbstauskuenfte;
create policy "staff_update_selbstauskuenfte" on public.selbstauskuenfte
  for update to authenticated
  using (true)
  with check (true);
