# Deployment — Haller Immobilien Monorepo

Single Git repository, three Vercel projects, shared Supabase database.

## Repository structure

```
haller-immobilien/
├── apps/
│   ├── lp1-terminbuchung/     → Vercel: immo-v-haller-terminwahl
│   ├── lp2-selbstauskunft/    → Vercel: landingpage-haller-immobilienberatu
│   └── dashboard/             → Vercel: inserats-dashboard-haller
├── packages/
│   ├── types/                 → @haller/types
│   └── supabase/              → @haller/supabase (+ migrations)
└── docs/
```

**Git remote:** `https://github.com/ritzaisolutions-dotcom/landingpage_haller_immobilienberatung.git`

## Local development

```bash
pnpm install
pnpm dev:lp1        # http://localhost:3000  — /termin?t=...
pnpm dev:lp2        # http://localhost:3002  — /auskunft?t=...
pnpm dev:dashboard  # http://localhost:3001
pnpm build          # all apps
```

LP1 and LP2 can run in parallel (ports 3000 and 3002).

## Vercel configuration

Each project connects to the **same** GitHub repo with a different **Root Directory**:

| Vercel project | Root Directory | Production URL |
|----------------|----------------|----------------|
| `immo-v-haller-terminwahl` | `apps/lp1-terminbuchung` | https://immo-v-haller-terminwahl.vercel.app |
| `landingpage-haller-immobilienberatu` | `apps/lp2-selbstauskunft` | https://landingpage-haller-immobilienberatu.vercel.app |
| `inserats-dashboard-haller` | `apps/dashboard` | (project production domain) |

Per-app [`vercel.json`](../apps/lp1-terminbuchung/vercel.json) sets:

- `installCommand`: `cd ../.. && pnpm install`
- `buildCommand`: `cd ../.. && pnpm --filter @haller/<app> build`

Enable **Include source files outside of the Root Directory** in Vercel project settings (monorepo / `packages/*`).

## Environment variables

| Variable | LP2 | LP1 | Dashboard |
|----------|-----|-----|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | yes | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | optional | yes | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | yes | no |
| `N8N_WEBHOOK_BASE` | yes | yes | yes (server) |
| `LP1_BASE_URL` | — | — | yes |
| `LP2_BASE_URL` | — | — | yes |
| `NEXT_PUBLIC_SENTRY_DSN` | — | — | optional |

**Dashboard production:**

```
LP1_BASE_URL=https://immo-v-haller-terminwahl.vercel.app
LP2_BASE_URL=https://landingpage-haller-immobilienberatu.vercel.app
```

## Supabase schema

Migrations (run in order in Supabase SQL Editor):

`packages/supabase/migrations/001` … `007`

Seeds: `packages/supabase/seeds/`

## Demo URLs

- LP1: `/termin?t=demo-lp1-token-haller-2026`
- LP2 Miete: `/auskunft?t=demo-lp2-token-haller-2026`
- LP2 Kauf: `/auskunft?t=demo-lp2-kauf-token-2026`
