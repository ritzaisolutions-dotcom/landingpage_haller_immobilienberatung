# Haller Landing Page (`01_landing_page`)

Next.js 14 App Router — Upload-Portal (legacy) + **LP2 Selbstauskunft**.

## LP2 — Selbstauskunft

**Route:** `/auskunft?t={lp2_token}`

Multi-Step-Formular (Miete oder Kauf je nach `inserate.typ`), Token-Gültigkeit 7 Tage ab `selbstauskunft_angefordert_at`.

### Env (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_BASE=https://n8n.ritz-ai.solutions
```

### Lokal starten

```bash
npm install
npm run dev
```

### Demo

Nach `supabase/seed_lp2_demo.sql`:

- Miete: http://localhost:3000/auskunft?t=demo-lp2-token-haller-2026
- Kauf: http://localhost:3000/auskunft?t=demo-lp2-kauf-token-2026 (wenn Inserat IS24-99102 existiert)

### n8n

Nach Absenden: `POST /webhook/selbstauskunft-eingereicht` mit `persistedByLp2: true`  
Workflow: `03_docs/workflows/WF4_LP2_Selbstauskunft_eingereicht.json`

LP1 Terminbuchung liegt separat in `04_terminbuchungs_landing`.
