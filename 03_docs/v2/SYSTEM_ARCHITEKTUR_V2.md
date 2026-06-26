# RAIS × Haller Immobilienberatung GmbH
## System-Architektur V2 — Single Source of Truth

> **Stand:** 25. Juni 2026  
> **Auftraggeber:** Haller Immobilienberatung GmbH, Kirchberg 42, 56626 Andernach  
> **Auftragnehmer:** RAIS – Ritz AI Solutions, Kevin Ritz, +49 151 29755134  
> **Supabase Projekt:** `htyeflqymmbcjhvknjoe` (eu-central-1, Frankfurt)  
> **n8n Instanz:** `https://n8n.ritz-ai.solutions`  
> **Landing Page:** `https://landingpage-haller-immobilienberatu.vercel.app`  
> **Dashboard:** `https://dashboard-haller.vercel.app` (in Bau)

---

## Inhaltsverzeichnis

1. [Projektziel & Kontext](#1-projektziel--kontext)
2. [Systemarchitektur Überblick](#2-systemarchitektur-überblick)
3. [User Flow V2 (revidiert)](#3-user-flow-v2-revidiert)
4. [Brand & Design Tokens](#4-brand--design-tokens)
5. [Tech Stack](#5-tech-stack)
6. [Datenbankschema](#6-datenbankschema)
7. [Landing Pages](#7-landing-pages)
8. [Dashboard (Internes Tool)](#8-dashboard-internes-tool)
9. [n8n Workflows](#9-n8n-workflows)
10. [API Integrationen](#10-api-integrationen)
11. [DSGVO & Datenschutz](#11-dsgvo--datenschutz)
12. [Cybersecurity](#12-cybersecurity)
13. [Sentry Monitoring](#13-sentry-monitoring)
14. [Skalierbarkeit & Kosten](#14-skalierbarkeit--kosten)
15. [AVV & Vertragsstruktur](#15-avv--vertragsstruktur)
16. [Offene Punkte & Next Steps](#16-offene-punkte--next-steps)

---

## 1. Projektziel & Kontext

### Was gebaut wird

Ein vollautomatisiertes Lead-Qualifizierungs- und Terminmanagement-System für Haller Immobilienberatung GmbH. Das System ersetzt manuelle Bearbeitung von täglich 300+ ImmoScout24-Anfragen durch einen strukturierten, KI-gestützten Prozess mit Human-in-the-Loop.

### Was das System NICHT ist

- Kein CRM-Ersatz
- Keine automatische Mietentscheidung (Mensch entscheidet immer)
- Kein Upload-Portal für Schufa/Entgeltnachweis (wurde gestrichen)
- Kein öffentliches SaaS-Produkt

### Geschäftlicher Kontext

| | |
|---|---|
| **Kunde** | Haller Immobilienberatung GmbH |
| **GF** | Waldemar Haller |
| **Ansprechpartner** | Thomas Haller (Sohn, Objektbetreuung) |
| **Setup-Preis** | €4.500 (Pilotkonditionen) |
| **Retainer** | €250/Monat (inkl. Hosting, Wartung, API-Kosten) |
| **Rechtsform RAIS** | Einzelunternehmen, §19 UStG — keine MwSt |
| **Pilotstatus** | Referenzkunde, kein Rabatt kommuniziert |

---

## 2. Systemarchitektur Überblick

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNE KANÄLE                               │
│  ImmoScout24 API  ←→  [Demo: Telegram Bot]                     │
│  Immowelt API     ←→  (Phase 2)                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ Eingehende Anfrage
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    n8n (Hetzner VPS)                            │
│  WF1: Trigger → Lead anlegen → LP1-Link senden                 │
│  WF2: LP1-Buchung → Slot reservieren → Bestätigung             │
│  WF3: Nach Besichtigung → LP2-Link senden                      │
│  WF4: LP2-Selbstauskunft → Mistral → Dashboard Alert           │
│  WF5: Mitarbeiter GO/NO-GO → Nachricht → Status                │
│  WF6: Auto-Delete nach 30 Tagen                                 │
│  WF7: IS24 Inserate Sync (alle 6h)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Supabase    │ │  Mistral AI  │ │   Vercel     │
│  (Frankfurt) │ │  (Paris, EU) │ │  (EU Edge)   │
│              │ │              │ │              │
│  leads       │ │  Intent-     │ │  LP1:        │
│  inserate    │ │  Analyse     │ │  Terminbuch. │
│  slots       │ │  Selbst-     │ │              │
│  selbst-     │ │  auskunft-   │ │  LP2:        │
│  auskuenfte  │ │  Bewertung   │ │  Selbst-     │
│              │ │              │ │  auskunft    │
│  Storage:    │ │              │ │              │
│  (keine      │ │              │ │  Dashboard:  │
│  Uploads)    │ │              │ │  Intern      │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 3. User Flow V2 (revidiert)

> **Kernprinzip V2:** Keine Qualifizierungsbarriere vor der Besichtigung. Niedrige Hürde für den Lead, strukturierte Auswahl danach.

### Phase 1 — Erstkontakt & Terminbuchung

```
Lead schreibt auf ImmoScout24 (oder Telegram in Demo)
    │
    ▼
n8n WF1: Empfang & Lead-Anlage
    • UUID generieren (lp1_token)
    • Lead in Supabase anlegen (status: 'neu')
    • Mistral Intent-Check (schnell, optional)
    │
    ▼
Automatische Antwort mit LP1-Link:
"Guten Tag [Name], vielen Dank für Ihr Interesse.
Buchen Sie hier direkt Ihren Besichtigungstermin:
https://landingpage.../termin?t={lp1_token}"
    │
    ▼
Lead öffnet LP1 (Terminbuchung)
    • Gibt Name, Email, Telefon ein
    • Wählt einen freien Slot aus
    • Akzeptiert DSGVO-Checkbox
    • Bestätigt Buchung
    │
    ▼
n8n WF2: Slot-Buchung verarbeiten
    • Slot als 'reserviert' markieren, belegt +1
    • Lead: status → 'termin_gebucht'
    • Bestätigungs-DM an Lead
    • Benachrichtigung an Mitarbeiter
```

### Phase 2 — Nach der Besichtigung

```
Besichtigung findet statt
    │
    ▼
Mitarbeiter im Dashboard:
    [Button: "Selbstauskunft anfordern"] für interessante Leads
    │
    ▼
n8n WF3: LP2-Link generieren & senden
    • Neuen UUID generieren (lp2_token)
    • Lead: status → 'selbstauskunft_angefordert'
    • DM an Lead mit LP2-Link:
      "Vielen Dank für die Besichtigung. Bitte füllen
       Sie hier Ihre Selbstauskunft aus: .../auskunft?t={lp2_token}"
    │
    ▼
Lead öffnet LP2 (Selbstauskunft)
    • Füllt strukturiertes Formular aus (kein Upload)
    • Akzeptiert DSGVO-Checkbox
    • Absenden
    │
    ▼
n8n WF4: Selbstauskunft → Mistral → Dashboard
    • Selbstauskunft in Supabase speichern
    • Mistral analysiert: Score 0–100 + Begründung
    • Dashboard: Echtzeit-Update (Supabase Realtime)
    • Lead: status → 'selbstauskunft_eingereicht'
```

### Phase 3 — Entscheidung

```
Dashboard zeigt alle Selbstauskünfte pro Inserat nebeneinander
    • Score, Begründung, Stärken, Risiken pro Lead
    • Einkommensfaktor = Nettoeinkommen / Kaltmiete
    │
    ▼
Mitarbeiter entscheidet:
    │
    ├── [ZUSAGE] ──▶ n8n WF5a:
    │                   • DM an Lead: Glückwunsch + nächste Schritte
    │                   • Lead: status → 'zugesagt'
    │                   • Alle anderen Leads dieses Inserats:
    │                     status → 'abgesagt' + freundliche Absage-DM
    │
    └── [ABSAGE] ──▶ n8n WF5b:
                        • DM an Lead: Freundliche Absage
                        • Lead: status → 'abgesagt'
                        • delete_after = now() + 30 Tage
    │
    ▼
n8n WF6 (Scheduled, täglich):
    • Löscht alle Einträge wo delete_after < now()
    • Leads, Selbstauskünfte, Logs
```

---

## 4. Brand & Design Tokens

### Haller Branding (für Landing Pages)

```css
/* Haller Corporate Identity */
--color-primary:      #00AFCB;   /* CTA, Buttons */
--color-primary-alt:  #00A9C6;   /* Logo-Farbe */
--color-secondary:    #5C727D;   /* Headlines */
--color-bg:           #F7F7F7;
--color-bg-dark:      #000000;   /* Logo-Hintergrund */
--color-text:         #333333;
--color-muted:        #959898;
--font-family:        "Nunito", sans-serif;
--border-radius:      3px;
```

**Logo-Datei:** `assets/logo_haller.png`
- Teal/Cyan-Balken + weißes Dach-Element
- Text: HALLER IMMOBILIENBERATUNG GMBH
- Auf schwarzem Hintergrund

### Dashboard & RAIS Branding (für internes Tool)

```css
/* Dark Theme — Dashboard & interne Tools */
--bg-primary:    #07101E;
--bg-card:       #0D1F3C;
--border:        #1A3A6A;
--accent-blue:   #3B82F6;
--accent-green:  #22C55E;
--accent-amber:  #F59E0B;
--accent-red:    #EF4444;
--text-primary:  #E2EAF8;
--text-muted:    #4A6080;
--font:          Inter, sans-serif;
```

### RAIS Brand Tokens (für RAIS-eigene Materialien)

```css
--rais-orange:      #EC6A37;   /* Digital */
--rais-orange-print:#D94F1A;   /* Print */
--rais-pistachio:   #3C5A2A;
--rais-charcoal:    #2F2A24;
--rais-linen:       #FBF8F3;
```

---

## 5. Tech Stack

### Infrastruktur

| Komponente | Dienst | Region | Zweck |
|---|---|---|---|
| Workflow-Automation | n8n (selbst-gehostet) | Hetzner DE | Orchestrierung aller Prozesse |
| VPS | Hetzner Cloud CX21 | Nürnberg, DE | n8n Docker-Host |
| Reverse Proxy | Nginx + Certbot | Hetzner | SSL-Terminierung |
| Datenbank | Supabase Pro | Frankfurt, EU | Alle Daten + Auth |
| Landing Pages | Vercel | EU Edge | Next.js 14 |
| Dashboard | Vercel | EU Edge | Next.js 14 |

### Anwendungen

| Komponente | Technologie | Version |
|---|---|---|
| Landing Pages | Next.js (App Router) | 14 |
| Dashboard | Next.js (App Router) | 14 |
| Styling | Tailwind CSS | 3 |
| Auth | Supabase Auth | — |
| KI-Analyse | Mistral AI | mistral-small-latest |
| KI-Fallback | Mistral AI | open-mistral-7b |
| Error Monitoring | Sentry | — |
| Demo-Kanal | Telegram Bot API | — |
| Prod-Kanal | ImmoScout24 REST API | v1 (OAuth1) |

### Credentials & Secrets

> ⚠️ Niemals in Git, niemals in Code — nur in n8n Credentials + Vercel Env Variables

| Secret | Wo gespeichert |
|---|---|
| Mistral API Key | n8n Credentials: "Mistral Cloud account" |
| Supabase URL + Anon Key | Vercel Env: `NEXT_PUBLIC_SUPABASE_*` |
| Supabase Service Key | n8n Credentials: "Supabase account" |
| IS24 Consumer Key/Secret | n8n Credentials: "ImmoScout24 OAuth" |
| IS24 Access Token (Haller) | n8n Credentials: "ImmoScout24 Haller" |
| Telegram Bot Token | n8n Credentials: "Telegram RAIS Demo Bot" |
| Sentry DSN | Vercel Env: `NEXT_PUBLIC_SENTRY_DSN` |

---

## 6. Datenbankschema

> Supabase Projekt: `htyeflqymmbcjhvknjoe` (Frankfurt, eu-central-1)
> Row Level Security: aktiviert auf allen Tabellen

### Tabelle: `leads`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | Interne ID |
| `uuid` | text UNIQUE | Legacy-Token (lp2 alte Version) |
| `lp1_token` | text | Token für Terminbuchungs-LP |
| `lp2_token` | text | Token für Selbstauskunft-LP |
| `name` | text | Vollständiger Name |
| `email` | text | E-Mail-Adresse |
| `telefon` | text | Telefonnummer |
| `inserat_id` | text | IS24-Inserat-ID (String, z.B. "IS24-48291") |
| `is24_contact_id` | text | Chat-ID (Telegram) oder IS24 Contact ID |
| `nachricht_text` | text | Originaltext der ersten Nachricht |
| `status` | text | Siehe Status-Tabelle unten |
| `termin_gebucht_at` | timestamptz | Zeitstempel der Terminbuchung |
| `besichtigung_stattgefunden` | boolean | Wurde Besichtigung abgehalten? |
| `selbstauskunft_angefordert_at` | timestamptz | Wann LP2-Link gesendet |
| `landing_page_url` | text | LP1-URL (generiert) |
| `dsgvo_accepted` | boolean | DSGVO Einwilligung LP1 |
| `dsgvo_accepted_at` | timestamptz | Zeitstempel DSGVO LP1 |
| `mitarbeiter_notiz` | text | Interne Notiz + Mistral-Intent |
| `entscheidung_at` | timestamptz | Zeitstempel finale Entscheidung |
| `last_activity_at` | timestamptz | Letzte Aktivität (Status, Buchung, Notiz) |
| `archiviert_at` | timestamptz | Manuell archiviert (aus CRM-Aktiv-Ansicht) |
| `created_at` | timestamptz | Erstellungszeitpunkt |

**Status-Werte (leads.status):**
```
neu                         → Lead angelegt, Link noch nicht geöffnet
dm_gesendet                 → LP1-Link automatisch gesendet (WF1)
termin_gebucht              → Lead hat LP1 ausgefüllt und Slot gewählt
besichtigung_stattgefunden  → Besichtigung wurde durchgeführt
selbstauskunft_angefordert  → LP2-Link gesendet
selbstauskunft_eingereicht  → LP2 ausgefüllt, Mistral-Analyse läuft/fertig
zugesagt                    → Mitarbeiter hat Zusage gegeben
abgesagt                    → Mitarbeiter hat abgesagt oder auto-abgesagt
geloescht                   → Daten gelöscht (nur Status-Marker)
```

### Tabelle: `inserate`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | Interne ID |
| `is24_inserat_id` | text UNIQUE | IS24-ID (z.B. "IS24-48291") |
| `titel` | text | Inserat-Titel |
| `adresse` | text | Vollständige Adresse |
| `zimmer` | numeric | Zimmeranzahl |
| `flaeche_qm` | numeric | Wohnfläche in m² |
| `kaltmiete_eur` | numeric | Kaltmiete in EUR |
| `typ` | text | 'miete' oder 'verkauf' |
| `status` | text | 'aktiv' oder 'inaktiv' |
| `is24_url` | text | Link zum Inserat |
| `created_at` | timestamptz | Angelegt |
| `updated_at` | timestamptz | Zuletzt synchronisiert |

### Tabelle: `besichtigungsslots`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | Interne ID |
| `inserat_id` | uuid FK → inserate.id | Zugehöriges Inserat |
| `adresse` | text | Objekt-Adresse |
| `datum` | date | Besichtigungsdatum |
| `uhrzeit` | time | Uhrzeit |
| `dauer_minuten` | integer | Dauer (Standard: 30) |
| `kapazitaet` | integer | Immer `1` (Einzelbesichtigung, ein Lead pro Termin) |
| `belegt` | integer | `0` = frei, `1` = belegt |
| `slot_status` | text | 'frei', 'reserviert', 'confirmed', 'abgelaufen' |
| `reserviert_lead_uuid` | text | Welcher Lead hat gebucht |
| `reserviert_bis` | timestamptz | Reservierung läuft ab (24h) |
| `created_at` | timestamptz | — |

### Tabelle: `selbstauskuenfte`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | — |
| `lead_id` | uuid FK → leads.id | Zugehöriger Lead |
| `inserat_id` | uuid FK → inserate.id | Zugehöriges Inserat |
| `nettoeinkommen_eur` | numeric | Monatliches Nettoeinkommen |
| `beschaeftigung_status` | text | angestellt/selbstaendig/beamter/rentner/student/arbeitssuchend |
| `arbeitgeber` | text | Name des Arbeitgebers |
| `angestellt_seit` | text | Seit wann beschäftigt |
| `arbeitsverhaeltnis` | text | unbefristet/befristet/in_kuendigung |
| `haushaltsgroesse` | integer | Anzahl Personen |
| `haustiere` | boolean | Haustiere vorhanden? |
| `haustiere_art` | text | Welche Haustiere |
| `einzugstermin` | date | Gewünschter Einzug |
| `warum_diese_wohnung` | text | Freitext-Begründung |
| `sonstige_angaben` | text | Sonstiges |
| `dsgvo_accepted` | boolean | DSGVO Einwilligung LP2 |
| `dsgvo_accepted_at` | timestamptz | Zeitstempel DSGVO LP2 |
| `mistral_score` | integer | KI-Score 0–100 |
| `mistral_begruendung` | text | KI-Begründung |
| `mistral_staerken` | text | KI-Stärken |
| `mistral_risiken` | text | KI-Risiken |
| `analysiert_at` | timestamptz | Wann analysiert |
| `entscheidung` | text | 'zusage', 'absage', null |
| `entscheidung_at` | timestamptz | Wann entschieden |
| `entscheidung_mitarbeiter` | text | Wer entschieden hat |
| `delete_after` | timestamptz | Löschzeitpunkt (30 Tage nach Absage) |
| `created_at` | timestamptz | Formular-Einreichung |

### View: `selbstauskunft_vergleich`

Joined View für Dashboard-Vergleichsansicht:
- Alle Felder aus `selbstauskuenfte`
- `lead_name`, `lead_email`, `lead_telefon`, `is24_contact_id` aus `leads`
- `inserat_titel`, `inserat_adresse`, `kaltmiete_eur` aus `inserate`
- Berechnetes Feld: `einkommens_faktor = nettoeinkommen_eur / kaltmiete_eur`
- Sortierung: `mistral_score DESC NULLS LAST`

---

## 7. Landing Pages

### LP1 — Terminbuchung

**URL:** `https://landingpage.../termin?t={lp1_token}`  
**Repo:** `landingpage-haller-immobilienberatu` (Vercel, Root: `01_landing_page`)  
**Auth:** Token-basiert. URL-Parameter `t` wird gegen `leads.lp1_token` geprüft (nicht `uuid`).  
**Token-Ablauf:** 72 Stunden nach `lp1_token_issued_at` (Fallback: `created_at`).

**Felder:**
1. Name (vorausgefüllt aus Lead-Daten, editierbar)
2. E-Mail (vorausgefüllt, editierbar)
3. Telefon (vorausgefüllt, editierbar)
4. Slot-Auswahl (Kalender-Ansicht der verfügbaren Slots für dieses Inserat)
5. ✅ DSGVO-Checkbox (Pflicht):
   > *"Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß Datenschutzerklärung zu. Meine Daten werden nach Abschluss des Vermietungsprozesses, spätestens nach 30 Tagen, automatisch gelöscht."*

**Nach Absenden:**
- Slot: `belegt +1`, `slot_status = 'reserviert'`
- Lead: `status = 'termin_gebucht'`, `termin_gebucht_at = now()`
- Bestätigungs-DM an Lead via IS24/Telegram
- Benachrichtigung an Mitarbeiter via Dashboard + optional Telegram

**Branding:** Haller CI (`#00AFCB`, Nunito, Logo)

---

### LP2 — Selbstauskunft

**URL:** `https://landingpage.../auskunft?t={lp2_token}`  
**Auth:** Token-basiert. UUID gegen `leads.lp2_token`.  
**Token-Ablauf:** 7 Tage (mehr Zeit für Selbstauskunft als für Terminbuchung).  
**Trigger:** Nur nach Besichtigung, wenn Mitarbeiter auf "Selbstauskunft anfordern" klickt.

**Formularfelder:**
```
PERSÖNLICHE ANGABEN
├── Monatliches Nettoeinkommen (€)
├── Beschäftigungsstatus [Angestellt / Selbständig / Beamter / Rentner / Student / Arbeitssuchend]
├── Arbeitgeber
├── Beschäftigt seit (MM/YYYY)
└── Arbeitsverhältnis [Unbefristet / Befristet / In Kündigung]

HAUSHALT
├── Anzahl Personen im Haushalt (inkl. sich selbst)
├── Haustiere [Ja / Nein]
└── Falls Ja: Welche und wie viele?

EINZUG
├── Gewünschter Einzugstermin (Datum)
└── Warum möchten Sie in diese Wohnung? (Freitext)

SONSTIGES
└── Weitere Angaben (optional)

DATENSCHUTZ
└── ✅ DSGVO-Checkbox (Pflicht):
    "Ich stimme der Verarbeitung meiner personenbezogenen Daten zu.
     Bei Absage werden meine Daten nach 30 Tagen automatisch gelöscht.
     [Link: Datenschutzerklärung]"
```

**Nach Absenden:**
- Selbstauskunft in `selbstauskuenfte` Tabelle gespeichert
- n8n WF4 getriggert → Mistral-Analyse startet
- Lead: `status = 'selbstauskunft_eingereicht'`
- Dashboard: Echtzeit-Update via Supabase Realtime

**Branding:** Haller CI

---

## 8. Dashboard (Internes Tool)

**URL:** `https://dashboard-haller.vercel.app`  
**Repo:** `Inserats_Dashboard_Haller` (separates Git-Repo)  
**Auth:** Supabase Auth (Email + Passwort, keine öffentliche Registrierung)  
**Middleware:** Next.js middleware.ts schützt alle Routen außer `/login`  
**Monitoring:** Sentry (Error Tracking)

### Zugänge (geplant)

| Nutzer | Rolle | Anlegen via |
|---|---|---|
| Waldemar Haller | Admin | Supabase Auth → Invite |
| Thomas Haller | Mitarbeiter | Supabase Auth → Invite |
| Weitere Mitarbeiter | Mitarbeiter | Bei Bedarf anlegen |

### Navigation (V2.2)

| Route | Funktion |
|---|---|
| `/` (Start) | Termine heute, Pipeline-Kacheln, Zuweisung |
| `/termine` | Alle Besichtigungsslots, Filter, Mitarbeiter-Zuweisung |
| `/anfragen` | Mini-CRM — alle Leads mit CJ-Stepper |
| `/inserate` | Setup: Buchungsfenster, Zuständigkeit, Slots, SA-Vergleich |

Badge-Zähler auf **Start** (offene Pipeline-Items). `/notifications` leitet auf `/` um.

### Startseite (`/`)

- Begrüßung + Kennzahlen (Termine heute, ohne Zuständigen, überfällige Aktionen)
- **Termine heute:** belegte Slots mit Thumbnail, Lead-Kontakt, Zuweisung an Mitarbeiter-Pool
- **Pipeline:** Neue Buchungen (48h), neue Selbstauskünfte, offene Entscheidungen, frühe Anfragen
- Auto-Refresh alle 60 Sekunden

### Anfragen (`/anfragen`) — Mini-CRM

- Alle Leads von `neu` bis `zugesagt`/`abgesagt` (inkl. `dm_gesendet`)
- CJ-Stepper (7 Schritte), Suche, Filter-Tabs (Aktiv / Frühphase / Pipeline / Erledigt / Archiv)
- Pagination (50 pro Seite)
- Detail: Originalnachricht, LP1/LP2-Links, manuelle Status-Korrektur, Archivieren, interne Notiz
- Felder: `last_activity_at`, `archiviert_at`

### Inserate (`/inserate`)

- Liste aller Inserate aus Supabase (Sidebar mit Foto-Thumbnail)
- Auto-Sync via IS24 API (WF7, alle 6h)
- Pro Inserat: Buchungsfenster, Zuständigkeit, Slots, Besichtigungen, Selbstauskünfte

### Termine (`/termine`)

- Alle Besichtigungsslots (filterbar nach Datum, Status, Inserat)
- Preset „Heute“, URL-Parameter `?from=&to=`
- Mitarbeiter-Zuweisung pro Termin (`zustaendiger_mitarbeiter` aus `inserat_zustaendigkeiten`-Pool)
- 24h-Warnung für bevorstehende Termine
- Aufklappbare Lead-Aktionen: Besichtigung stattgefunden, Selbstauskunft anfordern, Absage

### Selbstauskünfte (pro Inserat)

- Alle eingereichten Selbstauskünfte pro Inserat
- Nebeneinander-Ansicht (Scrollable Cards)
- Pro Lead-Card:
  - Name, Kontaktdaten
  - Mistral Score (0–100) mit Farbe (grün ≥ 80, gelb 60–79, rot < 60)
  - Einkommensfaktor (Netto / Kaltmiete, z.B. 3.2x)
  - Begründung, Stärken, Risiken
  - Buttons: [✅ ZUSAGE] [❌ ABSAGE]
- Nach Entscheidung: Card grau, Status angezeigt

---

## 9. n8n Workflows

### WF1 — Eingehende Anfrage → Lead anlegen → LP1-Link senden

**Trigger:** Telegram Trigger (Demo) / IS24 Webhook (Produktion)  
**ID:** `8zzbyf5oDhWV09kW`

```
Telegram Trigger
  → Rate Limiter (max 1x/60s pro ChatID)
  → Code: Name extrahieren + UUID generieren (lp1_token)
  → Mistral Intent Check (mistral-small-latest + Fallback open-mistral-7b)
  → Code: Intent parsen + anreichern
  → Supabase INSERT lead (status: 'neu')
  → Telegram/IS24: LP1-Link senden
  → Supabase UPDATE status: 'dm_gesendet'
```

**Sicherheit:** Rate Limiting via `$getWorkflowStaticData`, kein crypto-Modul

---

### WF2 — LP1-Buchung → Bestätigung (revidiert V2.1)

**Trigger:** Webhook POST `/webhook/termin-gebucht`  
**Auslöser:** LP1 nach erfolgreicher Buchung (`persistedByLp1: true` im Body)

> **Architektur-Revidiierung:** LP1 schreibt Slot + Lead **vor** dem Webhook. WF2 darf bei `persistedByLp1 === true` **keine** Supabase-Updates wiederholen (kein doppeltes `belegt+1`).

```
Webhook (LP1 POST)
  Body: lp1Token, leadUuid, slotId, inseratId, inseratUuid, datum, uhrzeit, persistedByLp1
  → IF persistedByLp1
      → Lead/Slot nur lesen (optional)
      → Mitarbeiter-Pool + Google Calendar
      → IS24/Telegram Bestätigung an Lead
  → ELSE (Legacy)
      → Supabase UPDATE slot + lead (alter Client ohne LP1)
```

**Workflow-Datei:** `03_docs/workflows/WF2_LP1_Termin_gebucht.json`

**Manueller LP1-Fallback:** Dashboard erstellt neuen Lead (`lead_source=manual`) mit frischem `lp1_token` — Termine/Besichtigungen → „LP1-Link manuell erstellen“.

---

### WF3 — Nach Besichtigung → Selbstauskunft anfordern

**Trigger:** Webhook GET `/webhook/selbstauskunft-anfordern?leadId=X`  
**Auslöser:** Mitarbeiter klickt Button im Dashboard (Tab 2)

```
Webhook (Dashboard Button)
  → Supabase: Lead laden
  → Code: lp2_token generieren
  → Supabase UPDATE lead: lp2_token, selbstauskunft_angefordert_at, status='selbstauskunft_angefordert'
  → Telegram/IS24: LP2-Link an Lead senden
```

---

### WF4 — Selbstauskunft → Mistral → Dashboard Update

**Trigger:** Webhook POST `/webhook/selbstauskunft-eingereicht`  
**Auslöser:** LP2 nach Formular-Einreichung

```
Webhook (LP2 POST)
  → Supabase: Lead laden (via lp2_token)
  → Supabase: INSERT selbstauskuenfte (alle Formularfelder)
  → Supabase UPDATE lead: status='selbstauskunft_eingereicht'
  → Mistral Chat Model (mistral-small-latest)
    Prompt: KI-Bewertung mit Score + Begründung + Stärken + Risiken
    Fallback: open-mistral-7b
  → Code: Mistral-Antwort parsen (JSON)
  → Supabase UPDATE selbstauskuenfte: mistral_score, mistral_begruendung, etc.
  → Dashboard: Supabase Realtime Event (automatisch)
```

**Mistral KPI-Prompt (Basis):**
```
Bewerte diese Mietbewerbung für eine Wohnung mit {kaltmiete_eur}€ Kaltmiete:
- Einkommensfaktor: {nettoeinkommen_eur / kaltmiete_eur}x (Minimum 3x)
- Beschäftigung: {beschaeftigung_status}, {arbeitsverhaeltnis}
- Haushalt: {haushaltsgroesse} Personen
- Haustiere: {haustiere}
- Einzugswunsch: {einzugstermin}

Antworte NUR mit JSON:
{
  "score": 0-100,
  "begruendung": "2-3 Sätze sachlich",
  "staerken": ["Punkt 1", "Punkt 2"],
  "risiken": ["Punkt 1"] oder []
}
AGG-Hinweis: Keine Bewertung von Nationalität, Herkunft, Religion, Geschlecht.
```

---

### WF5a/b — Mitarbeiter Entscheidung → Nachricht → Auto-Delete

**Trigger:** Webhook GET `/webhook/entscheidung?selfId=X&entscheidung=zusage|absage`  
**Auslöser:** Dashboard Buttons (Tab 3)

```
WF5a (ZUSAGE):
  → Supabase: Selbstauskunft + Lead laden
  → Supabase UPDATE selbstauskunft: entscheidung='zusage', entscheidung_at
  → Supabase UPDATE lead: status='zugesagt'
  → Telegram/IS24: Zusage-Nachricht an Lead
  → Supabase: Alle anderen Leads dieses Inserats
      → status='abgesagt', delete_after = now() + 30 Tage
      → Absage-DM an jeden anderen Lead

WF5b (ABSAGE):
  → Supabase UPDATE selbstauskunft: entscheidung='absage'
  → Supabase UPDATE lead: status='abgesagt', delete_after = now() + 30 Tage
  → Telegram/IS24: Freundliche Absage-Nachricht an Lead
```

---

### WF6 — Auto-Delete (täglich)

**Trigger:** Schedule, täglich 03:00 Uhr

```
→ Inaktive Frühanfragen: leads WHERE status IN ('neu','dm_gesendet')
  AND last_activity_at < now() - interval '14 days'
  → SET delete_after = now() (oder direkter DELETE)
→ Supabase: Alle selbstauskuenfte WHERE delete_after < now()
→ Supabase DELETE selbstauskuenfte
→ Supabase: Alle leads WHERE delete_after < now() AND status IN ('abgesagt','geloescht')
→ Supabase DELETE leads (oder UPDATE status='geloescht' für Audit-Log)
→ Telegram: Täglicher Bericht an Mitarbeiter (X Einträge gelöscht)
```

**Löschregeln:**
- Frühe Anfragen ohne Fortschritt: **14 Tage Inaktivität** (`last_activity_at`)
- Nach Absage / Zusage (Mitbewerber): **30 Tage** (`delete_after`, unverändert)

---

### WF7 — IS24 Inserate Sync (alle 6h)

**Trigger:** Schedule, alle 6 Stunden  
**ID:** `twzjEj6L4qIA1AUh`  
**Status:** Aktiv, wartet auf IS24 API Permission

```
→ IS24 API: GET /user/me/realestate (OAuth1)
→ Code: Response parsen → {is24_inserat_id, titel, adresse, zimmer, ...}
→ Supabase: Bestehende Inserate laden
→ Code: Vergleich → neue, zu aktualisierende, zu deaktivierende
→ Supabase INSERT neue Inserate
→ Supabase UPDATE bestehende Inserate
→ Supabase UPDATE inaktive Inserate (status='inaktiv')
```

---

## 10. API Integrationen

### ImmoScout24 REST API

**Status:** API Key registriert, Permission Request gestellt (ausstehend)  
**Account:** `ritzaisolutions@gmail.com`  
**Key Name:** `ImmoRAIS`  
**Deadline:** Key wird nach 20 Tagen ohne Permission gelöscht

**OAuth1 Endpoints:**
```
Request Token: https://rest.immobilienscout24.de/restapi/security/oauth/request_token
Access Token:  https://rest.immobilienscout24.de/restapi/security/oauth/access_token
Authorization: https://www.immobilienscout24.de/restapi/security/oauth/confirm_access
Signature:     HMAC-SHA1
```

**Benötigte Permissions:**
- `GET /user/{userId}/realestate` — Inserate lesen
- `GET /user/{userId}/realestate/{id}/contact` — Kontaktanfragen lesen
- `POST /user/{userId}/realestate/{id}/contact/{contactId}/message` — Nachrichten senden

**Pro Kunde:** Eigener OAuth1 Flow → eigene Access Token + Secret → eigene Credential in n8n

**Demo-Fallback:** Telegram Bot simuliert IS24 vollständig. Nur WF1-Trigger + Send-Nodes tauschen sich aus. Rest identisch.

---

### Mistral AI

**Modelle:**
- Primary: `mistral-small-latest` (günstig, schnell, gut für strukturierte Tasks)
- Fallback: `open-mistral-7b` (freies Modell, kein Ausfall wenn Primary überlastet)
- Credential in n8n: "Mistral Cloud account"

**DSGVO:** Mistral ist französisches Unternehmen (EU), verarbeitet keine Daten außerhalb EU. DPA verfügbar unter `mistral.ai/legal`.

---

### Telegram (Demo)

**Bot:** RAIS Demo Bot  
**Token:** In n8n Credentials "Telegram RAIS Demo Bot"  
**Chat-ID Mitarbeiter:** In WF2 + WF3 konfiguriert  
**Zweck:** Simuliert IS24-Messaging vollständig während API-Genehmigung läuft

---

## 11. DSGVO & Datenschutz

### Verantwortlichkeiten

| Rolle | Partei | Basis |
|---|---|---|
| **Verantwortlicher (Controller)** | Haller Immobilienberatung GmbH | Vermieter trifft Entscheidungen |
| **Auftragsverarbeiter (Processor)** | RAIS – Ritz AI Solutions | Verarbeitet Daten im Auftrag |

### AVV-Übersicht

> ⚠️ **Alle AVVs müssen vor Go-Live unterzeichnet sein**

| Parteien | Typ | Status |
|---|---|---|
| Haller ↔ RAIS | AVV (Auftragsverarbeitung) | ⏳ Zu erstellen |
| Haller ↔ RAIS | Service Agreement | ⏳ Zu erstellen |
| RAIS ↔ Supabase | DPA | Supabase Dashboard → Settings → Legal |
| RAIS ↔ Vercel | DPA | vercel.com/legal/dpa |
| RAIS ↔ Mistral | DPA | mistral.ai/legal |
| RAIS ↔ Hetzner | DPA | Hetzner Kundenportal |
| RAIS ↔ Telegram | Kein AVV nötig | Nur interne Alerts, keine Mieterdaten |

### Datenschutzerklärung (Pflichtangaben auf LP1 + LP2)

```
Verantwortlicher: Haller Immobilienberatung GmbH
                  Kirchberg 42, 56626 Andernach
                  info@haller-immobilien.de

Rechtsgrundlage:  Art. 6 Abs. 1 lit. b DSGVO
                  (vorvertragliche Maßnahme — Anbahnung Mietvertrag)

Speicherort:      Supabase (AWS Frankfurt, EU)

Speicherdauer:    Bei Absage: 30 Tage, dann automatische Löschung
                  Bei Zusage: bis Vertragsabschluss, dann gemäß gesetzl. Aufbewahrung

Auftragsverarbeiter: RAIS – Ritz AI Solutions (technischer Dienstleister)

KI-Einsatz:       Automatisierte Vorauswertung durch Mistral AI (EU-Server).
                  Endentscheidung trifft immer ein menschlicher Mitarbeiter.

Betroffenenrechte: Auskunft, Berichtigung, Löschung, Einschränkung,
                   Beschwerde bei Datenschutzbehörde RLP:
                   Der Landesbeauftragte für den Datenschutz und
                   die Informationsfreiheit Rheinland-Pfalz
```

### AGG-Compliance (Mistral Prompt)

Alle Mistral-Prompts enthalten explizit:
> "Keine Bewertung basierend auf Nationalität, ethnischer Herkunft, Religion, Geschlecht, Alter, sexueller Identität oder Behinderung (AGG §1)."

### Auto-Delete Logik

```
Absage           → delete_after = jetzt + 30 Tage
Zusage (andere)  → delete_after = jetzt + 30 Tage (alle Mitbewerber)
Täglich 03:00    → WF6 löscht alle Einträge mit delete_after < jetzt
```

---

## 12. Cybersecurity

### n8n (Hetzner VPS)

```bash
# Docker: NUR auf localhost binden
docker run -d \
  --name n8n \
  --restart always \
  -p 127.0.0.1:5678:5678 \   # NICHT 0.0.0.0
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Nginx Reverse Proxy + SSL davor
# Certbot (Let's Encrypt), auto-renew alle 90 Tage
```

**Firewall (UFW):**
- Port 443 (HTTPS): offen
- Port 22 (SSH): nur von eigener IP
- Port 5678 (n8n): geschlossen nach außen

### Supabase

- Row Level Security auf **allen** Tabellen aktiviert
- Dashboard-Auth via Supabase JWT
- n8n nutzt Service Key (nur serverseitig)
- Anon Key nur in Frontend (read-only via RLS)
- Kein Supabase Service Key in Next.js Client-Code

### Landing Pages & Dashboard (Vercel)

- Alle Secrets in Vercel Environment Variables (nie in Git)
- `.env.local` in `.gitignore`
- Dashboard: Supabase Auth + httpOnly Session Cookie
- Landing Pages: Token-Auth (72h Ablauf LP1, 7 Tage LP2)
- Keine sensiblen Daten in URL-Parametern außer UUID-Token

### Secrets Management

```
# Niemals in:
✗ Git Repository
✗ Slack / Telegram
✗ Code-Kommentare
✗ README-Dateien

# Immer in:
✓ n8n Credentials (verschlüsselt)
✓ Vercel Environment Variables
✓ Passwort-Manager (1Password o.ä.)
```

### Cybersecurity Checklist (vor Go-Live)

- [ ] n8n hinter Nginx (nicht direkt exponiert)
- [ ] SSL/TLS auf allen Domains (Let's Encrypt)
- [ ] Supabase RLS auf allen Tabellen
- [ ] Keine API Keys im Frontend-Code
- [ ] Env Variables in Vercel, nicht in Git
- [ ] `.env` in `.gitignore`
- [ ] Service Key nur in n8n, nie in Next.js Client
- [ ] Token-Ablauf: LP1 72h, LP2 7 Tage
- [ ] Dashboard: httpOnly Session Cookie
- [ ] IS24 Access Token nur in n8n Credentials
- [ ] AVV mit Haller unterzeichnet
- [ ] Sentry konfiguriert für Dashboard-Errors

---

## 13. Sentry Monitoring

**Einsatz:** Dashboard (internes Tool)  
**Was wird getrackt:**
- JavaScript-Errors im Dashboard
- Failed API Calls zu n8n Webhooks
- Supabase Query-Fehler
- Auth-Fehler

**Setup:**
```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

// sentry.client.config.js
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% der Transaktionen
});
```

**Alerts:** Sentry → Email an kevin@ritz-ai.solutions bei kritischen Fehlern

---

## 14. Skalierbarkeit & Kosten

### Aktuelle Infrastruktur (Pilot)

| Service | Tier | Kosten/Monat |
|---|---|---|
| Supabase | Free → Pro nach Pilot | $0 → $25 |
| Vercel | Free | $0 |
| Hetzner VPS (n8n) | CX21 (2 vCPU, 4GB) | ~€6 |
| Mistral API | Pay-per-use | ~€5–15 |
| Sentry | Free | $0 |
| **Gesamt** | | **~€11–21/Mo** |

### Skalierung (ab 2. Kunde)

| Trigger | Maßnahme | Zusatzkosten |
|---|---|---|
| >500 Leads/Mo | Supabase Pro | +$25/Mo |
| >10 gleichzeitige User | Vercel Pro | +$20/Mo |
| >200 Anfragen/Tag | Hetzner CX31 (4 vCPU) | +€4/Mo |
| IS24 API aktiv | Keine (bereits eingepreist) | €0 |

### Pro-Kunde-Overhead (bei RAIS-Skalierung)

Ab 3+ Kunden: Separate Supabase-Projekte pro Kunde empfohlen für Datenisolation. n8n-Workflows kopieren, neue IS24 Credentials anlegen.

---

## 15. AVV & Vertragsstruktur

### Haller ↔ RAIS: Service Agreement (Inhalt)

```
1. Leistungsumfang
   - UC2: Lead-Qualifizierung + Terminmanagement
   - 7 n8n Workflows + 2 Landing Pages + 1 Dashboard
   - Hosting, Wartung, Updates

2. Vergütung
   - Setup: €4.500 (Pilotkunde)
   - Retainer: €250/Monat
   - Drittkosten at-cost (Mistral API, etc.)
   - Zahlungsziel: 14 Tage netto
   - Keine MwSt (§19 UStG)

3. Laufzeit
   - Mindestlaufzeit: 6 Monate
   - Kündigung: 4 Wochen zum Monatsende

4. DSGVO / Datenschutz
   - AVV als Anlage
   - Haller = Verantwortlicher
   - RAIS = Auftragsverarbeiter
```

### RAIS Rechnungsstellung

```
Rechnung muss enthalten:
├── Rechnungsnummer
├── Leistungszeitraum
├── Leistungsbeschreibung
├── Betrag (netto = brutto, da §19 UStG)
└── Pflichthinweis: "Gemäß §19 UStG wird keine
    Umsatzsteuer berechnet."
```

---

## 16. Offene Punkte & Next Steps

### Sofort (vor nächstem Call mit Haller)

- [ ] LP1 (Terminbuchung) in Cursor bauen
- [ ] LP2 (Selbstauskunft) bauen
- [ ] WF1 updaten: LP1-Token statt LP2-Token senden
- [ ] WF2 neu: LP1-Buchung → Slot reservieren
- [ ] WF3 neu: Mitarbeiter → LP2-Link senden
- [ ] WF4 updaten: Selbstauskunft → Mistral → Dashboard
- [ ] Dashboard Tab 3: Vergleichsansicht bauen

### Beim nächsten Call mit Haller klären

- [ ] Welche KPIs für Mistral-Scoring? (3x Netto? Unbefristet Pflicht?)
- [ ] Selbstauskunft-Vorlage: eigene von Haller oder RAIS-Standard?
- [ ] Wie viele Dashboard-Zugänge / Mitarbeiter?
- [ ] Welche Email-Adresse für ausgehende Nachrichten?
- [ ] Kalender-Integration gewünscht? (Google/Outlook)
- [ ] Absage-Texte: Haller schreibt selbst oder RAIS-Vorlage?

### Nach IS24 API Permission (5–10 Werktage)

- [ ] OAuth1 Flow mit Haller (einmaliger Klick auf "Erlauben")
- [ ] IS24 Access Token in n8n eintragen
- [ ] WF1 Trigger: Telegram → IS24 Webhook
- [ ] WF1 Send: Telegram → IS24 POST message
- [ ] IS24 Inserate Sync testen (WF7)

### Phase 2 (nach erfolgreichem Pilot)

- [ ] UC1: Interne Wissensdatenbank (falls MS365 vorhanden)
- [ ] UC3: Mahnwesen
- [ ] UC4: Voice Agent (Bland.ai o.ä.)
- [ ] Immowelt API (wenn Haller nachfragt)
- [ ] RAIS-eigene Vermarktung: Demo-Video für Instagram/Website

---

*Erstellt von RAIS – Ritz AI Solutions*  
*Kevin Ritz · ritzaisolutions@gmail.com · +49 151 29755134*  
*Zuletzt aktualisiert: 25. Juni 2026*

---

## 17. Erweiterungen V2.1 (nach Termin 19.06.2026)

### 17.1 Vollständiger Flow (revidiert & finalisiert)

```
PHASE 0 — EINGEHENDE ANFRAGE
──────────────────────────────
IS24 / Telegram DM kommt rein
  → n8n WF1: UUID generieren, Lead in DB anlegen
  → Mistral: Prüft ob genug Info vorhanden
      → NEIN: Rückfrage-DM ("Für welches Inserat interessieren Sie sich?")
      → JA:   LP1-Link senden mit Name + Inserat-Kontext

PHASE 1 — TERMINBUCHUNG (LP1)
──────────────────────────────
Lead öffnet LP1 (?t={lp1_token})
  → Sieht buchbare Zeitfenster für dieses Inserat
  → Bucht Slot
  → DSGVO Checkbox
  → Absenden

n8n WF2: Buchung verarbeiten
  → Slot reservieren in DB
  → Zuständigen Mitarbeiter ermitteln (Pool-Logik)
  → Kalender-Event erstellen (Google Calendar API)
      Details: Datum, Uhrzeit, Adresse, Inserat-ID, Name, Telefon, Email
  → Lead: status = 'termin_gebucht'
  → Bestätigungs-DM an Lead
  → Dashboard: Besichtigung erscheint in Subpage "Termine"

PHASE 2 — POST-BESICHTIGUNG (Dashboard)
─────────────────────────────────────────
Mitarbeiter öffnet Dashboard → Subpage "Termine"
  → Sieht alle heutigen/kommenden Besichtigungen
  → Pro Lead zwei Buttons:

  [❌ NICHT QUALIFIZIERT]
      → Freundliche Absage-DM automatisch
      → Lead: status = 'abgesagt', delete_after = +30 Tage
      → Auto-Delete nach 30 Tagen

  [✅ WEITERFÜHREN → Selbstauskunft anfordern]
      → lp2_token generieren
      → DM mit personalisertem LP2-Link
      → Lead: status = 'selbstauskunft_angefordert'

PHASE 3 — SELBSTAUSKUNFT (LP2)
────────────────────────────────
Lead öffnet LP2 (?t={lp2_token}&typ=miete|verkauf)
  → Formular je nach Inserat-Typ:
      typ=miete  → Mieterselbstauskunft
      typ=verkauf → Käuferprofil
  → DSGVO Checkbox (Pflicht)
  → Absenden

n8n WF4: Selbstauskunft verarbeiten
  → In selbstauskuenfte Tabelle speichern
  → Mistral: Score + Begründung + Stärken + Risiken
  → Dashboard: Subpage "Selbstauskünfte" aktualisiert sich live

PHASE 4 — ENTSCHEIDUNG (Dashboard Subpage)
────────────────────────────────────────────
Dashboard zeigt alle Selbstauskünfte pro Inserat nebeneinander
  → Inserat-Profilseite mit:
      - Fotos (aus IS24 oder manuell hochgeladen)
      - Eckdaten
      - Alle Bewerber-Cards side-by-side
      - LLM Score + Begründung pro Bewerber

  Mitarbeiter wählt 1 oder 2 Kandidaten zur weiteren Kontaktaufnahme:
  → "Zum Gespräch einladen" (DM mit Terminvorschlag)
  → "Zusage" (Mietvertrag / Kaufgespräch)

  [ABSAGE für alle anderen]
      → Freundliche Absage-DM
      → delete_after = +30 Tage
      → Auto-Delete via WF6
```

---

### 17.2 Buchungsfenster (Terminpläne im Dashboard)

**Wo:** Dashboard → Tab "Inserate" → Inserat auswählen → "Buchungsfenster"

**Was eingestellt werden kann:**
```
Pro Inserat:
├── Buchbar von: [Datum] bis [Datum]
├── Buchbare Wochentage: [Mo Di Mi Do Fr Sa So]
├── Buchbare Uhrzeiten: von [08:00] bis [18:00]
├── Terminabstand: [30 min | 45 min | 60 min | 90 min]
├── Einzelbesichtigung (1 Person pro Slot, fest)
└── Vorlaufzeit: min. [X] Stunden vor Buchung
```

**Supabase: neue Tabelle `buchungsfenster`**
```sql
CREATE TABLE buchungsfenster (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  inserat_id uuid REFERENCES inserate(id),
  gueltig_von date,
  gueltig_bis date,
  buchbare_wochentage integer[], -- [1,2,3,4,5] = Mo–Fr
  startzeit time DEFAULT '09:00',
  endzeit time DEFAULT '17:00',
  slot_dauer_minuten integer DEFAULT 30,
  max_kapazitaet integer DEFAULT 1, -- DB-Constraint: immer 1
  vorlaufzeit_stunden integer DEFAULT 2,
  aktiv boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**LP1 liest aus `buchungsfenster`** und generiert daraus automatisch die verfügbaren Slots (statt manuell eingetragene Slots). Manuelle Slots bleiben als Override möglich.

---

### 17.3 Mitarbeiter-Zuständigkeit & Pool

**Konzept:** Jedes Inserat hat einen zuständigen Mitarbeiter-Pool. Besichtigungen werden innerhalb des Pools verteilt (Round-Robin oder manuell).

**Supabase: neue Tabelle `inserat_zustaendigkeiten`**
```sql
CREATE TABLE inserat_zustaendigkeiten (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  inserat_id uuid REFERENCES inserate(id),
  mitarbeiter_email text NOT NULL, -- Supabase Auth User Email
  ist_hauptverantwortlich boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(inserat_id, mitarbeiter_email)
);
```

**Verteilungslogik in WF2:**
```javascript
// Pool laden für dieses Inserat
const pool = await supabase
  .from('inserat_zustaendigkeiten')
  .select('mitarbeiter_email')
  .eq('inserat_id', inseratId);

// Round-Robin: zähle wer diese Woche am wenigsten Termine hat
// Alternativ: Hauptverantwortlicher bekommt immer das Event
const zustaendiger = pool[0].mitarbeiter_email; // Einfach: erst Hauptverantwortlicher
```

**Dashboard:** Pro Inserat auswählen wer im Pool ist (Dropdown mit allen Supabase-Auth-Usern).

---

### 17.4 Kalender-Integration

**Kalender-Option:** Google Calendar (empfohlen, da weit verbreitet)  
**Alternative:** Microsoft Outlook (falls Haller MS365 nutzt — beim Call klären)

**Event-Inhalt bei Buchung:**
```
Titel:       Besichtigung: [Inserat-Titel] – [Lead-Name]
Datum:       [Slot-Datum]
Uhrzeit:     [Slot-Uhrzeit] – [Uhrzeit + Dauer]
Ort:         [Inserat-Adresse]
Beschreibung:
  Interessent: [Name]
  Telefon:     [Telefon]
  E-Mail:      [Email]
  Inserat-ID:  [IS24-ID]
  RAIS-Lead-ID:[UUID]
```

**n8n Node:** Google Calendar → "Create Event"  
**Credential:** Google OAuth2 (pro Mitarbeiter eigene Credential oder Service Account)  
**Trigger:** WF2, nach Slot-Buchung

**Einfachste Lösung für den Start:**
Google Calendar Service Account → alle Events in einen geteilten Team-Kalender "Haller Besichtigungen". Jeder Mitarbeiter abonniert diesen Kalender. Kein individueller OAuth-Flow pro Mitarbeiter nötig.

---

### 17.5 Inserat-Profilseite im Dashboard

**URL:** `/inserate/[id]`

**Inhalt:**
```
Header:
├── Inserat-Titel (groß)
├── Adresse, Zimmer, Fläche, Kaltmiete/Kaufpreis
├── IS24-Link (extern öffnen)
├── Typ-Badge: [MIETE] oder [VERKAUF]
└── Status-Badge: [AKTIV] / [INAKTIV]

Fotos-Bereich:
├── Bilder aus IS24 API (wenn verfügbar)
└── Fallback: Platzhalter

Tabs auf der Profilseite:
├── Tab A: Buchungsfenster einrichten
├── Tab B: Mitarbeiter-Pool verwalten
├── Tab C: Aktive Slots (Übersicht + neue anlegen)
├── Tab D: Besichtigungen (mit Status)
└── Tab E: Selbstauskünfte (Vergleichsansicht + LLM-Score)
```

**Fotos-Quelle:**  
IS24 API liefert Attachment-URLs nach Permission. Alternativ: Mitarbeiter lädt Fotos manuell hoch via Dashboard → Supabase Storage.

---

### 17.6 Smarte Kandidaten-Auswahl UI

**Dashboard Tab E — Selbstauskünfte Vergleich:**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Max Mustermann  │  │ Anna Schmidt    │  │ Peter Meyer     │
│ Score: 92/100   │  │ Score: 78/100   │  │ Score: 45/100   │
│ 🟢 Sehr geeignet│  │ 🟡 Geeignet     │  │ 🔴 Bedenken     │
│                 │  │                 │  │                 │
│ Einkommen: 4.2x │  │ Einkommen: 3.1x │  │ Einkommen: 2.1x │
│ Unbefristet ✓   │  │ Befristet ⚠️    │  │ Arbeitssuchend  │
│ 2 Personen      │  │ 1 Person        │  │ 4 Personen      │
│ Keine Haustiere │  │ 1 Katze         │  │ Hund + Katze    │
│                 │  │                 │  │                 │
│ "Stabiles       │  │ "Ausreichendes  │  │ "Einkommens-    │
│  Einkommen,     │  │  Einkommen,     │  │  faktor unter   │
│  ideale Größe"  │  │  befristeter    │  │  Mindestgrenze" │
│                 │  │  Vertrag"       │  │                 │
│ [☆ FAVORIT]     │  │ [☆ FAVORIT]     │  │ [ABSAGEN]       │
│ [📞 KONTAKT]    │  │ [📞 KONTAKT]    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘

[AUSGEWÄHLT: Max Mustermann + Anna Schmidt]

[✅ ZUSAGE AN AUSWAHL SENDEN]  [🔄 NOCHMAL ÜBERDENKEN]
```

**Logik:**
- Mitarbeiter markiert 1 oder 2 als Favoriten
- "Zusage senden" → DM an Favoriten + Absage an alle anderen
- "Absage" Button direkt auf einzelnen Cards

---

### 17.7 Kauf vs. Miete — vollständige Differenzierung

**Steuerung:** `inserate.typ` = 'miete' | 'verkauf'

```
WF1: Liest inserate.typ
  → typ=miete:   LP1-Link mit &typ=miete
  → typ=verkauf: LP1-Link mit &typ=verkauf

LP1: Gleich für beide (Terminbuchung)
  → Unterschied: Bezeichnung ("Besichtigungstermin" vs. "Besichtigungs-/Beratungstermin")

WF3: LP2-Link enthält &typ=[miete|verkauf]

LP2: Verzweigt basierend auf typ
  → typ=miete:   Mieterselbstauskunft (Einkommen, Beschäftigung, Haushalt)
  → typ=verkauf: Käuferprofil (Eigenkapital, Finanzierung, Kaufzeitraum)

Mistral Prompt: Zwei verschiedene System-Prompts
  → Miete:  "Bewerte nach Einkommensfaktor, Arbeitsstabilität, Haushalt"
  → Verkauf: "Bewerte nach Kaufkraftsignalen, Finanzierungssicherheit, Zeitrahmen"

Dashboard: Spaltenbezeichnungen ändern sich je nach Inserat-Typ
  → Miete:   "Einkommensfaktor", "Arbeitsverhältnis"
  → Verkauf: "Eigenkapital", "Finanzierungsklarheit"
```

**Käuferprofil-Felder (LP2 bei typ=verkauf):**

| Feld | Typ | Optionen |
|---|---|---|
| Kaufbudget (€) | Zahl | Freitext |
| Eigenkapital vorhanden | Select | Ja / Nein / Teilweise |
| Eigenkapitalhöhe (€) | Zahl | Optional |
| Finanzierung | Select | Eigenfinanzierung / Bankfinanzierung / Noch offen |
| Finanzierungsbestätigung | Select | Vorhanden / In Bearbeitung / Nicht vorhanden |
| Kaufzeitraum | Select | Sofort / 3 Monate / 6 Monate / Offen |
| Kaufgrund | Select | Eigennutzung / Kapitalanlage / Beides |
| Aktuell in laufendem Verkauf | Select | Ja / Nein |
| Sonstige Angaben | Text | Optional |

**Mistral KPIs Verkauf:**
```
Score-Kriterien:
├── Finanzierungsklarheit: 40% Gewichtung
│   → Bestätigung vorhanden = +40, In Bearbeitung = +20, Keine = +0
├── Kaufzeitraum-Ernst: 30%
│   → Sofort/3Mo = hoch, 6Mo = mittel, Offen = niedrig
├── Eigenkapital-Signal: 20%
│   → >20% des Preises = stark, <20% = schwach
└── Flexibilität: 10%
    → Eigennutzung = stabiler Käufer, Kapitalanlage = transaktionsorientiert
```

---

### 17.8 Auto-Delete — vollständige Logik

```
Trigger: WF6, täglich 03:00 Uhr

1. NACH ABSAGE DURCH MITARBEITER:
   → delete_after = Absage-Datum + 30 Tage
   → WF6 löscht: selbstauskuenfte, leads
   → DM an Lead: "Ihre Daten wurden gelöscht." (optional)

2. NACH ZUSAGE (alle ANDEREN Bewerber):
   → Alle anderen Leads dieses Inserats: delete_after = +30 Tage
   → Automatische Absage-DM an alle anderen

3. KEINE REAKTION (Lead bucht aber füllt LP2 nie aus):
   → Nach 14 Tagen ohne Selbstauskunft: delete_after = +30 Tage
   → Status: 'abgesagt' (inaktiv)

4. ABGELAUFENE TOKENS:
   → LP1-Token: 72 Stunden (Terminbuchung)
   → LP2-Token: 7 Tage (Selbstauskunft)
   → Nach Ablauf: Token ungültig, Fehlerseite in LP

Was NICHT gelöscht wird (Audit-Log):
   → leads.status bleibt als 'geloescht' Marker
   → Timestamp der Löschung wird geloggt
   → Kein PII mehr vorhanden
```

