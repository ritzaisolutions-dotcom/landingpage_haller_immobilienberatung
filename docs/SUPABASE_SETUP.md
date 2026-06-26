# Supabase Setup — IM24 Lead Qualifizierung

**Projekt:** `IM24 Lead Qualifizierungs und Termin Managment System`  
**Ref:** `htyeflqymmbcjhvknjoe` · Region: Frankfurt (eu-central-1)

## 1. Schema (Migrationen)

```bash
supabase link --project-ref htyeflqymmbcjhvknjoe
supabase db push
```

| Migration | Inhalt |
|---|---|
| `001_initial_schema.sql` | `leads`-Tabelle, RLS, Storage-Bucket `dokumente` |
| `002_n8n_workflow_fields.sql` | WF1–WF5 Felder + `besichtigungsslots` |

### n8n-Felder auf `leads`

| Workflow | Spalten |
|---|---|
| WF1 | `nachricht_text`, `liquiditaet_erwaehnt`, `is24_contact_id`, `landing_page_url` |
| WF2 | `mistral_score`, `fehlende_dokumente`, `mindestanforderung_ok`, `dokumente_eingereicht_at` |
| WF4 | `mitarbeiter_notiz`, `ablehnungsgrund`, `entscheidung_at` |

## 2. Seed (Test-Lead)

`supabase/seed.sql` im SQL Editor ausführen oder:

```bash
# Nach db push
psql "$DATABASE_URL" -f supabase/seed.sql
```

| Feld | Wert |
|---|---|
| Token | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| Name | Max Mustermann |
| Inserat | IS24-48291 |
| `nachricht_text` | Anfrage Mainzer Str. 12 |

## 3. Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://htyeflqymmbcjhvknjoe.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (nur Server) |
| `N8N_WF2_WEBHOOK_URL` | Optional: `https://<n8n>/webhook/dokumente-eingereicht` |

## 4. Sicherheit

- RLS auf `leads` und `besichtigungsslots`, keine öffentlichen Policies
- Browser → nur `/api/lead` und `/api/submit`
- Nach Submit: serverseitiger WF2-Webhook (fire-and-forget)

## 5. Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add N8N_WF2_WEBHOOK_URL production   # optional
vercel --prod
```
