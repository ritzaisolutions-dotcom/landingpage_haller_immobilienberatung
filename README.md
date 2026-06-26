# RAIS × Haller Immobilienberatung GmbH

Monorepo für die Lead-Qualifizierung und das interne Verwaltungssystem der Haller Immobilienberatung GmbH.

## Struktur

| Ordner | Beschreibung |
|--------|--------------|
| [`01_landing_page/`](01_landing_page/) | Mietinteressenten Upload-Portal (Next.js) — personalisierte Lead-Landingpage, PDF-Upload, DSGVO-Einwilligung |
| [`02_dashboard/`](02_dashboard/) | Internes Verwaltungssystem (Dashboard V2.1) |
| [`04_terminbuchungs_landing/`](04_terminbuchungs_landing/) | LP1 Terminbuchung — `/termin?t={lp1_token}` für Besichtigungstermine |
| [`03_docs/`](03_docs/) | Projektdokumentation, AVVs, n8n-Workflows, Visualisierungen |

## 01_landing_page — Upload-Portal

**Deploy:** [landingpage-haller-immobilienberatu.vercel.app](https://landingpage-haller-immobilienberatu.vercel.app)

```bash
cd 01_landing_page
npm install   # falls node_modules fehlt
npm run dev
```

Demo-URL: `/upload?t=demo` · Datenschutz: `/datenschutz`

> Nach der Reorganisation muss in Vercel das **Root Directory** auf `01_landing_page` gesetzt werden.

## 02_dashboard — Internes Verwaltungssystem

```bash
cd 02_dashboard
npm install
npm run dev   # http://localhost:3001
```

## 04_terminbuchungs_landing — LP1 Terminbuchung

**Deploy:** [ImmoV_Haller_Terminwahl](https://github.com/ritzaisolutions-dotcom/ImmoV_Haller_Terminwahl.git)

```bash
cd 04_terminbuchungs_landing
npm install
npm run dev   # http://localhost:3000
```

Demo-URL (nach `supabase/seed_lp1_demo.sql`): `/termin?t=demo-lp1-token-haller-2026`

## 03_docs — Dokumentation

- `context/CONTEXT.md` — Branding, Firmendaten, Projektkontext
- `workflows/` — n8n-Produktions- und Demo-Workflows (WF1–WF7)
- `datenschutz/` — AVVs und Datenschutzdokumentation (Platzhalter)
- `GOAL.md`, `DEMO_SCRIPT.md`, `SUPABASE_SETUP.md` — Spezifikationen und Setup
