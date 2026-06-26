# Cursor Prompt — LP2: Mieter-/Käufer-Selbstauskunft

Paste this directly into Cursor in the `01_landing_page` directory.

---

```
You are building LP2 — a self-disclosure form for Haller Immobilienberatung GmbH.
Work in the existing Next.js 14 App Router project. Add new routes only.

## TASK
Build a self-disclosure form at /auskunft?t={token}
The form branches based on inserat type (Miete vs. Verkauf).

## SUPABASE TABLES

leads (read):
  lp2_token text, name text, inserat_id text, status text

inserate (read):
  typ text (miete|verkauf), titel text, adresse text,
  kaltmiete_eur numeric, kaufpreis_eur numeric

selbstauskuenfte (insert):
  lead_id uuid, inserat_id uuid,
  -- MIETE fields:
  nettoeinkommen_eur numeric, beschaeftigung_status text,
  arbeitgeber text, angestellt_seit text, arbeitsverhaeltnis text,
  haushaltsgroesse integer, haustiere boolean, haustiere_art text,
  einzugstermin date, warum_diese_wohnung text, sonstige_angaben text,
  -- KAUF fields:
  kaufbudget_eur numeric, eigenkapital_vorhanden text,
  eigenkapital_hoehe_eur numeric, finanzierung_typ text,
  finanzierungsbestaetigung text, kaufzeitraum text,
  kaufgrund text, in_laufendem_verkauf boolean,
  -- shared:
  dsgvo_accepted boolean, dsgvo_accepted_at timestamptz

## NEW FILES

app/auskunft/page.tsx              → server component
app/auskunft/SelbstauskunftForm.tsx → client, multi-step
app/auskunft/MieteForm.tsx          → Miet-specific fields
app/auskunft/KaufForm.tsx           → Kauf-specific fields
app/auskunft/actions.ts             → server action (submit)
app/auskunft/success/page.tsx       → thank you page

## DESIGN — HALLER BRAND (identical to LP1)

Colors:
  Primary: #00AFCB, Background: #FFFFFF, Surface: #F7F7F7
  Text: #1A1A1A, Muted: #6B7280, Border: #E5E7EB

Font: Nunito (400, 600, 700, 800)
Border radius: 8px inputs/cards, 6px buttons
Same header/footer as LP1.

Style goal: Form-heavy but feels light and trustworthy.
Progress indicator at top (Step 1 of 3, Step 2 of 3, etc.)
Each step fits on one screen without scrolling (mobile).

## PAGE STRUCTURE

### Token validation (server):
  → Query leads WHERE lp2_token = token
  → If invalid: error page "Link ungültig"
  → If token > 7 days old: "Link abgelaufen. Bitte kontaktieren Sie uns."
  → If selbstauskuenfte already submitted for this lead: "Selbstauskunft bereits eingereicht"
  → Load inserat data

### Intro section (before form):
  Personalized greeting: "Guten Tag [Name],"
  "Vielen Dank für Ihr Interesse an [Inserat-Titel]."
  typ=miete:   "Bitte füllen Sie die Mieterselbstauskunft vollständig aus."
  typ=verkauf: "Bitte teilen Sie uns Ihre Kaufabsicht mit."
  Small note: "Ihre Angaben sind vertraulich und werden nach Abschluss
               des Auswahlverfahrens automatisch gelöscht."

---

## MIETE FORM (3 Steps when typ=miete)

### Step 1 — Einkommen & Beschäftigung
Title: "Berufliche Situation"

  Beschäftigungsstatus* (Select):
    - Angestellt (unbefristet)
    - Angestellt (befristet)
    - Angestellt (in Kündigung)
    - Selbständig / Freiberuflich
    - Beamter/Beamtin
    - Rentner/Rentnerin
    - Student/Studentin
    - Derzeit arbeitssuchend

  Arbeitgeber / Unternehmen* (Text) — show if not student/retired/unemployed
  Beschäftigt seit* (Month+Year select) — show if employed/self-employed
  Monatliches Nettoeinkommen* (Number, €) — all statuses

  Helper text below Einkommen field:
  "Kaltmiete dieser Wohnung: [X]€/Monat (empfohlenes Mindest-Nettoeinkommen: [X*3]€)"

### Step 2 — Haushalt & Einzug
Title: "Haushalt & Wünsche"

  Anzahl Personen im Haushalt inkl. Ihrer Person* (Select: 1–8, "8 oder mehr")
  Haustiere vorhanden* (Radio: Ja / Nein)
  Falls Ja: Welche Haustiere?* (Text, show conditionally)
  Gewünschter Einzugstermin* (Date, min: today+14 days)
  Warum möchten Sie in diese Wohnung?* (Textarea, min 50 chars, max 500)
    Placeholder: "Bitte beschreiben Sie kurz Ihre Wohnsituation und warum diese Wohnung für Sie passt..."
  Sonstige Anmerkungen (Textarea, optional)

### Step 3 — Datenschutz & Absenden
Title: "Datenschutz & Abschluss"

  Summary card (read-only):
    Beschäftigung: [status] bei [arbeitgeber]
    Nettoeinkommen: [X]€/Monat
    Haushalt: [X] Personen[, Haustiere: X]
    Einzugstermin: [datum]

  DSGVO Checkbox (required):
  "Ich bestätige die Richtigkeit meiner Angaben und stimme der
   Verarbeitung meiner personenbezogenen Daten durch die Haller
   Immobilienberatung GmbH zur Bearbeitung meiner Mietbewerbung zu.
   Bei Ablehnung werden meine Daten nach 30 Tagen automatisch gelöscht.
   [Datenschutzerklärung]"

  [SELBSTAUSKUNFT EINREICHEN] button
  Note: "Nach dem Absenden werden Ihre Angaben von unserem Team geprüft."

---

## KAUF FORM (3 Steps when typ=verkauf)

### Step 1 — Finanzierung
Title: "Ihre Kaufabsicht"

  Kaufbudget (€)* (Number)
  Eigenkapital vorhanden* (Select): Ja / Nein / Teilweise
  Eigenkapitalhöhe (€) (Number, show if Ja/Teilweise)
  Finanzierung* (Select):
    - Vollständige Eigenfinanzierung
    - Bankfinanzierung bereits beantragt
    - Bankfinanzierung geplant
    - Noch offen
  Finanzierungsbestätigung* (Select):
    - Vorhanden (Bank-Zusage liegt vor)
    - In Bearbeitung
    - Noch nicht vorhanden

### Step 2 — Kaufabsicht
Title: "Kaufzeitraum & Ziel"

  Angestrebter Kaufzeitraum* (Select):
    - Sofortkauf (innerhalb 4 Wochen)
    - Kurzfristig (1–3 Monate)
    - Mittelfristig (3–6 Monate)
    - Noch offen
  Kaufgrund* (Select):
    - Eigennutzung
    - Kapitalanlage
    - Beides
  Aktuell in laufendem Immobilienverkauf?* (Radio: Ja / Nein)
  Sonstige Anmerkungen (Textarea, optional)

### Step 3 — same DSGVO step as Miete (text adapted for Kauf)

---

## SERVER ACTION (actions.ts)

On submit:
  1. Validate token
  2. Load lead (get lead.id + inserat_id)
  3. INSERT into selbstauskuenfte (all fields)
  4. UPDATE leads: status='selbstauskunft_eingereicht'
  5. POST to n8n: https://n8n.ritz-ai.solutions/webhook/selbstauskunft-eingereicht
     Body: { leadUuid, selbstauskunftId, inseratId, typ }
  6. Redirect to /auskunft/success

## SUCCESS PAGE
Large checkmark (green)
"Vielen Dank, [Name]!"
"Ihre Selbstauskunft ist bei uns eingegangen."
"Wir melden uns zeitnah bei Ihnen."
Contact: "Fragen? 02632 9458-0 · info@haller-immobilien.de"

## UX NOTES
- Multi-step with progress bar (Step 1/3, 2/3, 3/3)
- Back button on each step (no data loss)
- Validate each step before proceeding
- Conditional fields animate in/out smoothly (CSS transition)
- All inputs: large touch targets (min 48px height) for mobile
- Error messages below each invalid field (red, small)
- No external UI libraries except lucide-react

## ENV (already in .env.local)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_N8N_WEBHOOK_BASE
```
