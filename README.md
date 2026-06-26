# RAIS × Haller Immobilienberatung GmbH

pnpm monorepo for lead qualification: LP1 termin booking, LP2 selbstauskunft, internal dashboard.

## Structure

| Path | App | Route | Vercel |
|------|-----|-------|--------|
| [`apps/lp1-terminbuchung/`](apps/lp1-terminbuchung/) | LP1 Terminbuchung | `/termin?t=` | immo-v-haller-terminwahl |
| [`apps/lp2-selbstauskunft/`](apps/lp2-selbstauskunft/) | LP2 + legacy upload | `/auskunft?t=`, `/upload` | landingpage-haller-immobilienberatu |
| [`apps/dashboard/`](apps/dashboard/) | Internal dashboard | `/` (auth) | inserats-dashboard-haller |
| [`packages/types/`](packages/types/) | Shared DB types | — | — |
| [`packages/supabase/`](packages/supabase/) | Shared clients + migrations | — | — |
| [`docs/`](docs/) | Architecture, workflows | — | — |

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for Vercel setup and env vars.

## Quick start

```bash
pnpm install
pnpm dev:lp1        # :3000
pnpm dev:lp2        # :3002
pnpm dev:dashboard  # :3001
pnpm build
```

## Demo URLs (after seeds)

- LP1: http://localhost:3000/termin?t=demo-lp1-token-haller-2026
- LP2: http://localhost:3002/auskunft?t=demo-lp2-token-haller-2026
