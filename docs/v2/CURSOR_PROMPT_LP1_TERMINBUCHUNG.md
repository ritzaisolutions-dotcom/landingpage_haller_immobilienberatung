# Cursor Prompt — LP1: Terminbuchung

Paste this directly into Cursor in the `01_landing_page` directory.

---

```
You are building LP1 — a booking landing page for Haller Immobilienberatung GmbH.
Work in the existing Next.js 14 App Router project. Add new routes only.

## TASK
Build a viewing appointment booking page at /termin?t={token}

## EXISTING PROJECT CONTEXT
- Next.js 14, TypeScript, Tailwind CSS already installed
- Supabase client already configured in lib/supabase/
- Assets: public/logo_haller.png

## SUPABASE TABLES (read existing, do not recreate)

leads (read + update):
  lp1_token text, name text, email text, telefon text,
  inserat_id text, status text, termin_gebucht_at timestamptz,
  dsgvo_accepted bool, dsgvo_accepted_at timestamptz,
  kalender_event_id text, zustaendiger_mitarbeiter text

inserate (read):
  id uuid, is24_inserat_id text, titel text, adresse text,
  zimmer numeric, kaltmiete_eur numeric, kaufpreis_eur numeric, typ text

buchungsfenster (read):
  inserat_id uuid, gueltig_von date, gueltig_bis date,
  buchbare_wochentage int[], startzeit time, endzeit time,
  slot_dauer_minuten int, max_kapazitaet int,
  vorlaufzeit_stunden int, aktiv bool

besichtigungsslots (read + update):
  id uuid, inserat_id uuid, datum date, uhrzeit time,
  dauer_minuten int, kapazitaet int, belegt int,
  slot_status text (frei/reserviert/confirmed)

## NEW FILES TO CREATE

app/termin/page.tsx          → main page (server component, reads token)
app/termin/BookingForm.tsx   → client component (interactive form)
app/termin/actions.ts        → server actions (book slot)
app/termin/success/page.tsx  → confirmation page

## DESIGN — HALLER BRAND (strictly follow)

Colors:
  Primary:     #00AFCB  (buttons, accents, borders)
  Background:  #FFFFFF
  Surface:     #F7F7F7
  Text:        #1A1A1A
  Muted:       #6B7280
  Border:      #E5E7EB
  Success:     #059669

Typography:
  Font: Nunito (Google Fonts, weights 400, 600, 700, 800)
  H1: 28px, font-weight 800, color #1A1A1A
  H2: 20px, font-weight 700
  Body: 16px, font-weight 400
  Small: 14px

Border radius: 8px (inputs, cards), 6px (buttons)

Logo: <img src="/logo_haller.png" alt="Haller Immobilienberatung" height="48" />

Style goal: Clean, trustworthy, modern German real estate feel.
NOT dark. NOT flashy. Calm, professional, like a premium bank app.

## PAGE STRUCTURE

### Layout (all pages):
Header: white background, logo left, "Sicheres Bewerbungsportal 🔒" right (small muted text)
Footer: "© Haller Immobilienberatung GmbH · Datenschutz · Impressum" (links to haller-immobilien.de)

### /termin page flow:

1. SERVER: Read lp1_token from URL params
   → Query leads WHERE lp1_token = token
   → If not found: show "Link ungültig oder abgelaufen" error page
   → If token older than 72h: show "Link abgelaufen" page
   → If status already 'termin_gebucht': show "Termin bereits gebucht" with details

2. SERVER: Load inserat data via leads.inserat_id

3. SERVER: Load available slots:
   Option A: From besichtigungsslots WHERE inserat_id = X AND slot_status = 'frei'
             AND belegt < kapazitaet AND datum >= today
   Option B: From buchungsfenster — generate slots dynamically
   Use Option A (simpler, slots pre-created by n8n)

4. CLIENT: Render BookingForm with pre-loaded data

### BookingForm component:

Step 1 — Inserat Info (read-only card at top):
  Show: Inserat titel, adresse, zimmer, kaltmiete_eur / kaufpreis_eur
  typ=miete: "Mietwohnung · X Zimmer · X m² · X€/Monat"
  typ=verkauf: "Kaufobjekt · X Zimmer · X m² · Kaufpreis: X€"

Step 2 — Contact Data:
  Name* (pre-filled from leads.name, editable)
  Email* (pre-filled from leads.email, editable)
  Telefon* (pre-filled from leads.telefon, editable)
  All fields: required, validation on blur

Step 3 — Slot Selection:
  Show available slots grouped by date (German format: "Montag, 30. Juni 2026")
  Each slot: pill button showing time ("10:00 Uhr") + duration ("30 Min.")
  Selected slot: filled with #00AFCB color
  If no slots available: "Derzeit sind keine Termine verfügbar.
  Wir melden uns in Kürze bei Ihnen." (no booking possible)

Step 4 — DSGVO Checkbox (required):
  "Ich stimme der Verarbeitung meiner personenbezogenen Daten zur
   Terminverwaltung durch Haller Immobilienberatung GmbH gemäß
   Datenschutzerklärung zu. Meine Daten werden nach Abschluss des
   Prozesses automatisch gelöscht."
  Link: opens https://haller-immobilien.de/datenschutz/ in new tab

[TERMIN VERBINDLICH BUCHEN] button
  → Disabled if: no slot selected, DSGVO not checked, required fields empty
  → Loading state: spinner + "Buchung wird verarbeitet..."

### server action (actions.ts):
On submit:
  1. Validate token still valid
  2. Check slot still free (race condition prevention)
  3. UPDATE besichtigungsslots: belegt+1, slot_status='reserviert', reserviert_lead_uuid=lead.uuid
  4. UPDATE leads: status='termin_gebucht', termin_gebucht_at=now(), email, telefon, dsgvo_accepted=true
  5. POST to n8n webhook: https://n8n.ritz-ai.solutions/webhook/termin-gebucht
     Body: { leadUuid, slotId, name, email, telefon, inseratId, datum, uhrzeit }
  6. Redirect to /termin/success?datum=X&uhrzeit=Y&adresse=Z

### /termin/success page:
Large checkmark icon (#059669)
"Ihr Besichtigungstermin ist bestätigt! ✓"
Show: Datum (German format), Uhrzeit, Adresse
"Sie erhalten in Kürze eine Bestätigung per Nachricht."
"Bei Fragen erreichen Sie uns unter 02632 9458-0"

## ENV VARS (already exist in .env.local)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_N8N_WEBHOOK_BASE=https://n8n.ritz-ai.solutions

## IMPORTANT
- All text in German
- No mock data — all real Supabase reads
- Loading skeleton on slot grid while fetching
- Error boundary for failed Supabase calls
- Mobile-first responsive (many leads will use phone)
- No external UI libraries except lucide-react for icons
- Use Next.js server actions for form submission (no API routes)
```
