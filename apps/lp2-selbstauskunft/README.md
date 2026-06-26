# Haller LP2 — Selbstauskunft (`apps/lp2-selbstauskunft`)

Next.js 14 — Digitale Mieter- und Käufer-Selbstauskunft (ohne Schufa/Uploads).

**Route:** `/auskunft?t={lp2_token}`

Legacy `/upload` leitet auf `/auskunft` weiter.

## Setup

From monorepo root: `pnpm install`

Create `apps/lp2-selbstauskunft/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_BASE=https://n8n.ritz-ai.solutions
```

## Dev

```bash
pnpm dev:lp2   # http://localhost:3002
```

## Demo

After `packages/supabase/seeds/seed_lp2_demo.sql` and migration `008_lp2_selbstauskunft_fields.sql`:

- Miete: http://localhost:3002/auskunft?t=demo-lp2-token-haller-2026
- Kauf: http://localhost:3002/auskunft?t=demo-lp2-kauf-token-2026

## Deploy

- **Vercel project:** `landingpage-haller-immobilienberatu`
- **Root Directory:** `apps/lp2-selbstauskunft`
- See [`docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md)

LP1: `apps/lp1-terminbuchung`
