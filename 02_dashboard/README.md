# Haller Dashboard V2.1

Internes Verwaltungssystem für die Haller Immobilienberatung GmbH.

## Setup

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
N8N_WEBHOOK_BASE=https://n8n.ritz-ai.solutions
LP1_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=
```

`N8N_WEBHOOK_BASE` is server-only (used by `/api/n8n/*` proxies). Do not expose it as `NEXT_PUBLIC_*`.

`LP1_BASE_URL` is used when staff manually creates booking links (Termine / Besichtigungen).

Run migrations in Supabase SQL Editor (in order):

1. `supabase/migrations/001_dashboard_schema.sql`
2. `supabase/migrations/002_v2_schema.sql`
3. `supabase/migrations/003_security_hardening.sql`
4. `supabase/migrations/004_lp1_manual_leads.sql`
5. `supabase/migrations/006_single_person_slots.sql`
6. `supabase/seed_demo_v2.sql` (optional demo data)

Create staff users in Supabase Auth (Email + Password, no public registration).

## Dev

```bash
npm run dev   # http://localhost:3001
```

## Routes

| Route | Beschreibung |
|-------|--------------|
| `/login` | Mitarbeiter-Login |
| `/inserate` | Inserat-Liste mit Suche |
| `/inserate/[id]/buchungsfenster` | Buchungsfenster + Slot-Generierung |
| `/inserate/[id]/zustaendigkeiten` | Mitarbeiter-Pool |
| `/inserate/[id]/slots` | Manuelle Slot-Verwaltung |
| `/inserate/[id]/besichtigungen` | Besichtigungs-Workflow |
| `/inserate/[id]/selbstauskuenfte` | Vergleichsansicht + Entscheidung |
| `/termine` | Terminübersicht (alle Inserate) |
| `/notifications` | Neue Buchungen + Selbstauskünfte (24h) |

## Manueller LP1-Link (WF1-Fallback)

Auf **Termine** und **Besichtigungen** → „LP1-Link manuell erstellen“:

- Legt immer einen **neuen** `leads`-Eintrag an (`lead_source=manual`)
- Frische `uuid` + `lp1_token` (getrennt — kein Re-Mapping bestehender Leads)
- Link 72h gültig ab `lp1_token_issued_at`

## n8n Webhook Contract

Dashboard proxies these endpoints via `/api/n8n/*`:

| Action | n8n Endpoint |
|--------|--------------|
| Slot generieren | `POST /webhook/slots-generieren` |
| Absage | `GET /webhook/absage?leadId={uuid}` |
| Selbstauskunft anfordern | `GET /webhook/selbstauskunft-anfordern?leadId={uuid}` |
| Entscheidung (batch) | `GET /webhook/entscheidung?ids={csv}&entscheidung=zusage\|absage` |
| Entscheidung (single) | `GET /webhook/entscheidung?selfId={uuid}&entscheidung=zusage\|absage` |

## Stack

Next.js 14 · TypeScript · Tailwind · Supabase Auth · Sentry
