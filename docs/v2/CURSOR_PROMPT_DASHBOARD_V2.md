# Cursor Prompt — Dashboard V2.1 (Inserats_Dashboard_Haller)

Paste this into Cursor in the `02_dashboard` directory (fresh Next.js project).

---

```
Build a complete internal staff dashboard for Haller Immobilienberatung GmbH.
This is a FULL REWRITE / fresh build. Work in the current empty directory.

## INITIALIZE PROJECT FIRST
Run: npx create-next-app@14 . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
Then install: npm install @supabase/supabase-js @supabase/ssr lucide-react @sentry/nextjs

## TECH STACK
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase JS + SSR for auth
- lucide-react for icons
- Sentry for error monitoring
- NO shadcn, NO MUI, NO other component libraries

## SUPABASE SCHEMA (existing, do not recreate)

leads: id, uuid, lp1_token, lp2_token, name, email, telefon,
       inserat_id(text=IS24-id), is24_contact_id, nachricht_text,
       status, termin_gebucht_at, besichtigung_stattgefunden,
       selbstauskunft_angefordert_at, zustaendiger_mitarbeiter,
       kalender_event_id, dsgvo_accepted, created_at

inserate: id(uuid), is24_inserat_id, titel, adresse, zimmer,
          flaeche_qm, kaltmiete_eur, kaufpreis_eur, typ(miete|verkauf),
          status(aktiv|inaktiv), is24_url, foto_urls(jsonb), created_at

besichtigungsslots: id, inserat_id(uuid FK), adresse, datum, uhrzeit,
                    dauer_minuten, kapazitaet, belegt, slot_status,
                    reserviert_lead_uuid, created_at

selbstauskuenfte: id, lead_id(uuid FK), inserat_id(uuid FK),
                  nettoeinkommen_eur, beschaeftigung_status, arbeitgeber,
                  angestellt_seit, arbeitsverhaeltnis, haushaltsgroesse,
                  haustiere, haustiere_art, einzugstermin, warum_diese_wohnung,
                  kaufbudget_eur, eigenkapital_vorhanden, finanzierung_typ,
                  finanzierungsbestaetigung, kaufzeitraum, kaufgrund,
                  dsgvo_accepted, mistral_score, mistral_begruendung,
                  mistral_staerken(text), mistral_risiken(text),
                  entscheidung(zusage|absage|null), entscheidung_at,
                  delete_after, created_at

buchungsfenster: id, inserat_id(uuid FK), gueltig_von, gueltig_bis,
                 buchbare_wochentage(int[]), startzeit, endzeit,
                 slot_dauer_minuten, max_kapazitaet, vorlaufzeit_stunden, aktiv

inserat_zustaendigkeiten: id, inserat_id(uuid FK), mitarbeiter_email,
                           ist_hauptverantwortlich

View selbstauskunft_vergleich:
  All selbstauskuenfte fields + lead_name, lead_email, lead_telefon,
  inserat_titel, inserat_adresse, kaltmiete_eur, einkommens_faktor

## DESIGN — DARK PROFESSIONAL THEME

Background layers:
  Page:     #07101E
  Card:     #0D1F3C
  Card alt: #091528
  Border:   #1A3A6A
  Border subtle: #0F2544

Colors:
  Blue accent:   #3B82F6
  Blue hover:    #2563EB
  Blue subtle:   rgba(59,130,246,0.1)
  Green:         #22C55E
  Green subtle:  rgba(34,197,94,0.1)
  Amber:         #F59E0B
  Amber subtle:  rgba(245,158,11,0.1)
  Red:           #EF4444
  Red subtle:    rgba(239,68,68,0.1)
  Text primary:  #E2EAF8
  Text muted:    #4A6080
  Text disabled: #2A3A55

Font: Inter (Google Fonts, 300–800)
Border radius: 12px cards, 8px inputs/buttons, 20px pills
Shadows: 0 4px 24px rgba(0,0,0,0.3) on cards

HALLER ACCENT (teal, used sparingly for Haller brand element):
  Teal: #00AFCB — use only in logo area and Haller-branded elements

Style goal: High-end internal tool. Think Linear, Vercel dashboard.
Dark, precise, data-dense but readable. Every pixel intentional.

## FILE STRUCTURE
middleware.ts
app/
  layout.tsx
  page.tsx → redirect to /inserate
  login/page.tsx
  inserate/
    page.tsx                    (Inserate list)
    [id]/page.tsx               (Inserat profile)
    [id]/buchungsfenster.tsx    (Booking window config)
    [id]/zustaendigkeiten.tsx   (Staff assignment)
    [id]/slots.tsx              (Slot management)
    [id]/besichtigungen.tsx     (Viewing appointments)
    [id]/selbstauskuenfte.tsx   (Self-disclosure comparison)
  termine/page.tsx              (All upcoming appointments)
  notifications/page.tsx        (New leads + self-disclosures)
components/
  Nav.tsx
  InsertCard.tsx
  SlotForm.tsx
  BesichtigungCard.tsx
  SelbstauskunftCard.tsx
  ScoreBadge.tsx
  StatusBadge.tsx
  Toast.tsx
lib/
  supabase/client.ts
  supabase/server.ts

## SUPABASE AUTH SETUP

lib/supabase/client.ts:
  import { createBrowserClient } from '@supabase/ssr'
  export const createClient = () =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

lib/supabase/server.ts:
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  // Standard SSR setup with getAll/setAll

middleware.ts:
  Protect all routes except /login
  Redirect unauthenticated to /login
  Redirect authenticated from /login to /inserate

## LOGIN PAGE (/login)
Dark theme. Center card (max-w-md).
Logo: HALLER text in teal (#00AFCB), "Verwaltungssystem" in muted
Email + Password fields (dark inputs, border #1A3A6A)
[Anmelden] button (blue, full width)
Error: "Ungültige Zugangsdaten" in red box
No registration. No forgot password.

## NAVIGATION (sidebar, 240px, fixed left)

Top: Haller logo area
  "HALLER" in #00AFCB, bold
  "Immobilien · Verwaltungssystem" muted small

Nav items (with icons):
  🏠 Inserate (/inserate)
  📅 Termine (/termine)
  🔔 Benachrichtigungen (/notifications) [red badge count]

Bottom:
  Logged-in email (muted, truncated)
  [Abmelden] button (ghost, red hover)

Active item: blue left border + blue text

---

## PAGE: /inserate (Inserat List)

Two-column layout: left sidebar (280px fixed) + right panel (flexible)

LEFT: Inserat list
  Search input at top
  Each card (clickable):
    Titel (white, bold, truncated)
    Adresse (muted small)
    "3 Zi · 78m² · 850€/Mo" or "Kaufpreis: 320.000€"
    Pills row: typ badge (MIETE=blue/KAUF=amber) + status badge
  Selected: blue left border (2px)
  Empty state: "Keine Inserate. Werden automatisch von ImmoScout24 importiert."

RIGHT: When inserat selected → show InsertProfile inline
  If nothing selected: centered placeholder "← Inserat auswählen"

---

## COMPONENT: Inserat Profile (/inserate/[id])

This is the main operational view. Tabbed interface within the right panel.

Header section:
  Large titel (h1)
  Adresse + meta row (Zi, m², Preis)
  Badges: typ + status
  IS24-Link button (if is24_url exists)
  Photo gallery: if foto_urls exists show grid, else grey placeholder

Five sub-tabs:

### Tab 1: BUCHUNGSFENSTER (Booking Windows)

Form to set when viewings can be booked:
  Gültig von (date) — Gültig bis (date)
  Wochentage (checkboxes: Mo Di Mi Do Fr Sa So)
  Startzeit (time select, 07:00–12:00)
  Endzeit (time select, 12:00–20:00)
  Dauer je Besichtigung (select: 30/45/60/90 min)
  Max. Personen pro Slot (number: 1–10)
  Vorlaufzeit (select: 1h/2h/4h/24h)

[Zeitfenster speichern + Slots generieren] button
  → INSERT into buchungsfenster
  → Call n8n webhook to generate individual slots from window
  → Show "X Slots wurden erstellt" success toast

List of existing buchungsfenster below form
  Each with: date range, times, status badge
  Delete button (only if no slots booked yet)

### Tab 2: ZUSTÄNDIGKEIT (Staff Assignment)

"Wer ist für dieses Inserat verantwortlich?"

Current assignments list:
  Each row: Email + "Hauptverantwortlich" toggle + Remove button

Add staff form:
  Email input + [Hinzufügen] button
  Toggles for ist_hauptverantwortlich

Note: "Kalender-Events gehen an den Hauptverantwortlichen."

### Tab 3: SLOTS (Slot Overview)

Table: Datum | Uhrzeit | Dauer | Kapazität | Belegt | Status | Aktionen
  German date format
  Status badge: frei=green, reserviert=amber, confirmed=blue
  Delete button (only if belegt=0)

[+ Slot manuell hinzufügen] inline form
  datum, uhrzeit (30min intervals), dauer, kapazitaet
  → INSERT into besichtigungsslots

### Tab 4: BESICHTIGUNGEN (Viewing Appointments)

Filter: Alle / Heute / Diese Woche / Status
Sort: Datum ASC (default)

Each BesichtigungCard:
  Avatar circle with initials
  Name + Email + Telefon (inline)
  Slot: Datum + Uhrzeit (large, prominent)
  Inserat adresse

  If besichtigung_stattgefunden = false AND datum <= today:
    [Besichtigung hat stattgefunden] button (marks as done)
    [Nicht erschienen → Absagen] button

  If besichtigung_stattgefunden = true AND status = 'besichtigung_stattgefunden':
    [❌ Nicht qualifiziert → Absagen]
      → POST n8n: /webhook/absage?leadId=X
      → Lead status = 'abgesagt'
    [✅ Selbstauskunft anfordern]
      → POST n8n: /webhook/selbstauskunft-anfordern?leadId=X
      → Lead status = 'selbstauskunft_angefordert'
      → Button turns to "Selbstauskunft angefordert ✓" (disabled)

### Tab 5: SELBSTAUSKÜNFTE (Comparison View)

This is the most important view. Side-by-side candidate comparison.

Filter tabs: Alle | Ausstehend | Entschieden

Horizontal scroll of SelbstauskunftCards (min-width: 280px each):

SelbstauskunftCard:
  Header: Name + initials avatar
  ScoreBadge: large circle with score number
    ≥80: green (#22C55E), 60-79: amber (#F59E0B), <60: red (#EF4444)
  
  Key metrics grid (2x2):
    EINKOMMEN: [X]€ (einkommens_faktor: X.Xx) — color by ratio: ≥3=green, 2-3=amber, <2=red
    HAUSHALT: X Personen
    BESCHÄFTIGUNG: [status] / [unbefristet=green, befristet=amber]
    EINZUG: [datum formatted]
  
  For typ=verkauf instead:
    BUDGET: [X]€
    FINANZIERUNG: [status]
    KAUFZEITRAUM: [option]
    EIGENKAPITAL: [status]
  
  Haustiere warning if haustiere=true: 🐾 [haustiere_art]

  Begründung section (collapsible):
    mistral_begruendung (italic, muted)
    Stärken: green bullets
    Risiken: red bullets (if any)

  Action buttons (show only if entscheidung=null):
    [☆ FAVORIT MARKIEREN] — toggle highlight
    [📞 KONTAKTIEREN] — opens phone/email
    [❌ ABSAGEN] — immediate friendly rejection DM

  If entscheidung set: show "Zugesagt ✓" or "Abgesagt" with timestamp

SELECTION BAR (sticky bottom, appears when ≥1 favorit marked):
  "[X] Kandidat(en) ausgewählt"
  [ZUSAGE AN AUSWAHL SENDEN] (blue, prominent)
    → Confirm modal: "Zusage an [Namen] senden und alle anderen absagen?"
    → POST n8n: /webhook/entscheidung?ids=[...] &entscheidung=zusage
    → All others auto-rejected

---

## PAGE: /termine (All Upcoming Appointments)

Filter bar (sticky):
  Von (date) Bis (date) — default: today to +30 days
  Status: Alle / Gebucht / Stattgefunden / Abgesagt
  Inserat: dropdown

Grouped by date (section headers: "Freitag, 27. Juni 2026")

Each slot card:
  Left: time pill (large, "10:00 Uhr · 30 Min.")
  Center: Lead name + Inserat titel + adresse
  Right: Kapazität bar X/Y + status badge
  24h warning: amber left border + "⚠ Morgen"

Expand → show lead details + action buttons

---

## PAGE: /notifications (Benachrichtigungen)

Auto-refresh every 60s (useEffect + setInterval)

Section 1: "Neue Buchungen" — leads WHERE status='termin_gebucht' AND termin_gebucht_at > -24h
Section 2: "Neue Selbstauskünfte" — WHERE status='selbstauskunft_eingereicht' AND created_at > -24h

Each card:
  Name, Email, Telefon
  What: "Hat Termin gebucht" / "Selbstauskunft eingereicht"
  When: relative time (e.g. "vor 23 Min.")
  For Selbstauskunft: ScoreBadge + quick GO/NO-GO buttons

Empty state: "Keine neuen Aktivitäten"

---

## SENTRY SETUP

sentry.client.config.ts:
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    integrations: [Sentry.replayIntegration({ maskAllText: true })]
  })

Wrap layout with Sentry error boundary.

---

## ENV VARS (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_N8N_WEBHOOK_BASE=https://n8n.ritz-ai.solutions
NEXT_PUBLIC_SENTRY_DSN=

## GLOBAL RULES
- All UI text in German
- No mock data — always read from Supabase
- Loading: skeleton div with animate-pulse (bg-[#1A3A6A]/30)
- Error: red border card with message
- Toast: fixed bottom-right, 3s auto-dismiss
- All Supabase calls in try/catch with Sentry.captureException
- Mobile responsive (min-width: 375px) but optimized for desktop
- Never expose service key client-side
```
