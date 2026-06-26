-- LP2 Käuferprofil: additional selbstauskuenfte columns

alter table public.selbstauskuenfte
  add column if not exists eigenkapital_hoehe_eur numeric,
  add column if not exists in_laufendem_verkauf boolean;
