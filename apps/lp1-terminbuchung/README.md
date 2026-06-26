# Haller LP1 — Terminbuchung

Lead-facing booking landing page for Haller Immobilienberatung GmbH.

**Route:** `/termin?t={lp1_token}` (nicht `uuid`)

Token-Ablauf: 72h ab `lp1_token_issued_at` (Fallback `created_at`).

## Setup

From monorepo root: `pnpm install`

Create `apps/lp1-terminbuchung/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_BASE=https://n8n.ritz-ai.solutions
```

`SUPABASE_SERVICE_ROLE_KEY` is required (server-only). LP1 uses service role for token-scoped reads/writes because dashboard RLS is staff-only.

## Dev

```bash
pnpm dev:lp1   # http://localhost:3000
```

## Demo

After running `packages/supabase/seeds/seed_lp1_demo.sql` on the shared Supabase project:

```
http://localhost:3000/termin?t=demo-lp1-token-haller-2026
```

## Deploy

- **Monorepo:** `landingpage_haller_immobilienberatung`
- **Vercel project:** `immo-v-haller-terminwahl`
- **Root Directory:** `apps/lp1-terminbuchung`
- See [`docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md)

## n8n

On successful booking, server action POSTs to:

`POST {N8N_WEBHOOK_BASE}/webhook/termin-gebucht`

Body includes `lp1Token`, `leadUuid`, `slotId`, `inseratId` (IS24), `inseratUuid`, `persistedByLp1: true`.

**Architecture note:** LP1 writes slot + lead in Supabase before calling WF2. WF2 must **not** repeat those updates (only calendar, IS24/Telegram confirmation, staff pool). See `SYSTEM_ARCHITEKTUR_V2.md` §9 vs `CURSOR_PROMPT_LP1_TERMINBUCHUNG.md` — LP1 owns persistence.

Slot source: pre-created `besichtigungsslots` (Option A). `buchungsfenster.vorlaufzeit_stunden` filters how soon slots can be booked. Arch §17.2 Buchungsfenster dynamic generation is deferred.

## Stack

Next.js 14 · TypeScript · Tailwind · Supabase (service role) · lucide-react
