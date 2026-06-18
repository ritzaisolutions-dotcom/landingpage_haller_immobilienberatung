One Shot Landing Page Demo 


Build a complete lead qualification landing page for a German real estate management company (Hausverwaltung). This is a Next.js 14 app with Tailwind CSS, deployed on Vercel, connected to Supabase.

## TECH STACK
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase JS client (@supabase/supabase-js)
- react-dropzone (file uploads)
- lucide-react (icons)

## CORE FUNCTIONALITY
The page receives a unique token via URL parameter: /upload?t=f3a9b2c1

On load:
1. Extract token from URL params
2. Fetch lead data from Supabase table "leads" where uuid = token
3. If token invalid or expired (created_at > 72h): show error page "Link abgelaufen"
4. If valid: pre-fill name field (read-only) and show upload form

## SUPABASE SCHEMA (already exists, just use it)

Table: leads
- id: uuid (primary key)
- uuid: text (the URL token)
- name: text
- inserat_id: text
- email: text (null initially, filled by lead)
- telefon: text (null initially, filled by lead)
- status: text (default: 'neu')
- created_at: timestamptz
- dsgvo_accepted: boolean (default: false)
- dsgvo_accepted_at: timestamptz

Storage bucket: "dokumente" (private)
- Path structure: {uuid}/schufa.pdf, {uuid}/entgelt_1.pdf, {uuid}/entgelt_2.pdf, {uuid}/entgelt_3.pdf, {uuid}/buergschaft.pdf

## FORM FIELDS

1. Name — text input, pre-filled from Supabase, READ-ONLY, greyed out
2. Email — text input, required, placeholder "ihre@email.de"
3. Telefon — text input, required, placeholder "+49 171 ..."

Upload zones (react-dropzone), accept PDF only, max 10MB each:
4. Schufa-Auskunft — REQUIRED, single file
5. Entgeltnachweis — REQUIRED, multiple (up to 3 files, label: "letzte 3 Monate")
6. Bürgschaft der Eltern — OPTIONAL, single file, label shows "(Optional — nur für Studenten)"

7. DSGVO Checkbox — REQUIRED before submit can be enabled
   Exact text: "Ich stimme zu, dass meine hochgeladenen Unterlagen (Schufa-Auskunft, Einkommensnachweise) ausschließlich intern zur Bearbeitung meiner Mietanfrage durch die Immobilienverwaltung verarbeitet werden. Die Daten werden nach 90 Tagen automatisch gelöscht und nicht an Dritte weitergegeben. Diese Einwilligung kann ich jederzeit widerrufen."

## ON SUBMIT
1. Validate all required fields filled
2. Validate DSGVO checked
3. Upload files to Supabase Storage under path: dokumente/{uuid}/filename
4. Update leads table: set email, telefon, dsgvo_accepted=true, dsgvo_accepted_at=now(), status='dokumente_eingereicht'
5. Show success screen (no redirect)

## SUCCESS SCREEN
Show in place of form:
- Green checkmark icon (large)
- Headline: "Vielen Dank, {Name}!"
- Text: "Wir haben Ihre Unterlagen erhalten und werden diese in Kürze prüfen. Sie erhalten eine Nachricht über ImmoScout24, sobald wir Ihre Anfrage bearbeitet haben."
- Small grey text: "Ihre Daten werden gemäß unserer Datenschutzerklärung nach 90 Tagen automatisch gelöscht."
- No buttons, no links

## ERROR STATES
- Invalid/expired token: full page error "Dieser Link ist nicht mehr gültig. Bitte kontaktieren Sie uns direkt über ImmoScout24."
- Upload failed: inline error per file, retry possible
- Form submit failed: toast error, form stays filled

## DESIGN
Dark professional theme:
- Background: #07101E
- Card background: #0D1F3C
- Border: #1A3A6A
- Primary accent: #3B82F6 (blue)
- Success: #22C55E
- Text primary: #E2EAF8
- Text muted: #4A6080
- Font: Inter (Google Fonts)

Layout: centered card, max-width 580px, padding 32px
Logo/header: "Immobilienverwaltung Haller" in top left, small grey text "Sicheres Bewerbungsportal" right

Each upload zone:
- Dashed border, rounded corners
- Icon + label + "PDF hochladen oder hier ablegen"
- On file added: show filename with green checkmark and remove button (X)
- Required badge in red, Optional badge in amber

Submit button:
- Full width
- Disabled + greyed out until all required fields filled AND DSGVO checked
- Text: "Unterlagen sicher einreichen"
- Loading spinner on submit

## ENV VARS NEEDED
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

## FILE STRUCTURE
app/
  page.tsx (redirects to /upload)
  upload/
    page.tsx (main page, handles token from searchParams)
  components/
    UploadZone.tsx (reusable dropzone component)
    SuccessScreen.tsx
    ErrorScreen.tsx
  lib/
    supabase.ts (client init)
    uploadFiles.ts (storage upload logic)

## IMPORTANT NOTES
- Mobile responsive (leads will open this on phone)
- No authentication required (token IS the auth)
- All text in German
- Never log or expose the token in console
- File size validation client-side before upload (max 10MB per file)
- Show upload progress bar per file
- After successful upload to Storage, immediately update DB