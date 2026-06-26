-- Einzelbesichtigung: kapazitaet immer 1, belegt nur 0 oder 1

update public.besichtigungsslots
set kapazitaet = 1, belegt = least(belegt, 1);

update public.besichtigungsslots
set slot_status = 'reserviert'
where belegt >= 1;

update public.besichtigungsslots
set slot_status = 'frei'
where belegt = 0;

update public.buchungsfenster
set max_kapazitaet = 1;

alter table public.besichtigungsslots
  drop constraint if exists besichtigungsslots_kapazitaet_one;

alter table public.besichtigungsslots
  add constraint besichtigungsslots_kapazitaet_one check (kapazitaet = 1);

alter table public.besichtigungsslots
  drop constraint if exists besichtigungsslots_belegt_range;

alter table public.besichtigungsslots
  add constraint besichtigungsslots_belegt_range check (belegt in (0, 1));

alter table public.buchungsfenster
  drop constraint if exists buchungsfenster_max_kapazitaet_one;

alter table public.buchungsfenster
  add constraint buchungsfenster_max_kapazitaet_one check (max_kapazitaet = 1);
