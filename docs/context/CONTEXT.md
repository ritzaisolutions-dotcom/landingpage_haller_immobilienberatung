# Haller Immobilienberatung — Projektkontext

> Single Source of Truth für Landing Page, Branding und Agent-Arbeit.  
> Quelle Website: [haller-immobilien.de](https://haller-immobilien.de/) · Scraped: 2026-06-17 (Firecrawl)  
> Git-Remote: [landingpage_haller_immobilienberatung](https://github.com/ritzaisolutions-dotcom/landingpage_haller_immobilienberatung.git)  
> Deployment (Monorepo, 3× Vercel): [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md)

---

## 1. Logo & Assets

### Lokales Logo (verbindlich)

```
assets/logo_haller.png
```

- Teal/Cyan-Balken + weißes Dach-Element
- Text: **HALLER** (bold) / **IMMOBILIENBERATUNG GMBH** (light caps)
- Hintergrund: Schwarz (`#000000`)
- Primärfarbe aus Logo: `#00A9C6`

### Remote-Assets (Referenz, nicht für Logo)

| Kategorie | URL |
|---|---|
| Favicon | `https://haller-immobilien.de/wp-content/uploads/2020/06/favicon32.png` |
| Hero Startseite | `https://haller-immobilien.de/wp-content/uploads/2021/03/slide_start.jpg` |
| GF-Portrait Start | `https://haller-immobilien.de/wp-content/uploads/2021/03/waldemar_haller_4_r.jpg` |
| GF-Portrait Verkauf | `https://haller-immobilien.de/wp-content/uploads/2021/04/Waldemar-Haller5.jpg` |
| GF-Profil (Team) | `https://haller-immobilien.de/wp-content/uploads/2024/05/WH-Profil--scaled-600x600.jpg` |
| Team-Gruppenfoto | `https://haller-immobilien.de/wp-content/uploads/2024/07/Teamfoto-ohne-Lampen.jpg` |
| Handshake | `https://haller-immobilien.de/wp-content/uploads/2021/01/handshake900g.png` |
| Unterschrift | `https://haller-immobilien.de/wp-content/uploads/2021/03/Haller-Unterschrift-300x39.png` |
| Anne Ehl (Kontakt) | `https://haller-immobilien.de/wp-content/uploads/2020/05/ehl.jpg` |
| Björn Jonas (HV) | `https://haller-immobilien.de/wp-content/uploads/2021/04/Bjoern-Jonas2.jpg` |
| Loftpark Projekt | `https://haller-immobilien.de/wp-content/uploads/2021/03/Loftpark-1024x683.jpg` |
| Suchprofil-Icon | `https://haller-immobilien.de/wp-content/uploads/2021/02/suchprofil-200x200.png` |
| Logo schwarz (alt) | `https://haller-immobilien.de/wp-content/uploads/2020/05/logo_241_black.png` |

### Partner-Logos

| Partner | URL |
|---|---|
| MPLUS Architekten | `https://haller-immobilien.de/wp-content/uploads/2020/05/mplus.jpg` → [mplus-architekten.de](https://mplus-architekten.de/) |
| RAHMIG Architekturbüro | `https://haller-immobilien.de/wp-content/uploads/2020/05/rahmig.jpg` → [rahmig.pro](http://www.rahmig.pro/) |
| Sprung & Risos | `https://haller-immobilien.de/wp-content/uploads/2020/05/sprung_risos.jpg` → [sprung-risos.de](https://www.sprung-risos.de/) |
| VDIV RLP/Saarland | `https://haller-immobilien.de/wp-content/uploads/2020/05/vdiv.jpg` → [vdiv.de](https://vdiv.de/hp1/Startseite.htm) |
| immowelt Diamond Partner | `https://haller-immobilien.de/wp-content/uploads/2020/07/immowelt3.jpg` → [immowelt Profil](https://www.immowelt.de/profil/d9f7f306efffb14aa0ffaf43b2974eb8#objects) |

### Team-Fotos

| Name | Bild-URL |
|---|---|
| Waldemar Haller | `https://haller-immobilien.de/wp-content/uploads/2024/05/WH-Profil--scaled-600x600.jpg` |
| Birgit Zerwas | `https://haller-immobilien.de/wp-content/uploads/2021/03/Birgit-Pritzer_1440x1440.jpg` |
| Björn Jonas | `https://haller-immobilien.de/wp-content/uploads/2021/03/Bjoern-Jonas_1440x1440.jpg` |
| Thomas Haller | `https://haller-immobilien.de/wp-content/uploads/2024/05/Thomas-Profil-scaled-600x600.jpg` |
| Lukas Haller | `https://haller-immobilien.de/wp-content/uploads/2024/07/Lukas-Profil-ohne-Lampen-600x600.jpg` |
| Marlies Reitz | `https://haller-immobilien.de/wp-content/uploads/2021/03/Marlies-Reitz_1440x1440.jpg` |
| Lydia Haller | `https://haller-immobilien.de/wp-content/uploads/2021/05/Lydia-Haller_1440x1440_2.jpg` |

---

## 2. Branding & Design Tokens

### CSS Variables (Website-Stil)

```css
:root {
  --color-primary:     #00AFCB;  /* CTA, Buttons, Akzente */
  --color-primary-alt: #00A9C6;  /* aus lokalem Logo */
  --color-secondary:   #5C727D;  /* Headlines, neutrale Texte */
  --color-link:        #0073E1;
  --color-bg:          #F7F7F7;
  --color-bg-dark:     #000000;  /* Logo-Hintergrund */
  --color-text-on-dark:#FFFFFF;
  --color-btn-text:    #FFFFFF;
  --color-muted:       #959898;
  --color-input-border:#EEEEEE;
  --color-btn-secondary-border: #06A3BD;

  --font-family:       "Nunito", sans-serif;
  --font-size-body:    16px;
  --font-size-h1:      40px;
  --font-size-h2:      24px;
  --border-radius:     3px;
  --spacing-base:      4px;
}
```

### Button-Stil (aus Firecrawl Branding)

- **Primary:** Hintergrund `#00AFCB`, Text `#FFFFFF`, Radius `3px`
- **Secondary:** Transparent, Border `#959898`, Text `#959898`

### Tonalität

Professionell, vertrauensvoll, persönlich, inhabergeführt. Zielgruppe: Käufer, Verkäufer, Vermieter, WEG-Eigentümer, Kapitalanleger.

### Tech-Stack der bestehenden Website

WordPress 7.0, Elementor 4.1.3, WPBakery Page Builder, Slider Revolution 6.7.35, Bootstrap-Komponenten.

---

## 3. Marken-Sprache & Slogans

| Typ | Text |
|---|---|
| Hero-Zitat | *„Ein Haus wird gebaut, aber ein Zuhause wird geformt."* — Hazrat Inayat Khan |
| Akrostichon HALLER | **H**eim · **A**ls · **L**angfristigen · **L**ebensmittelpunkt · **E**rfolgreich · **R**ealisieren |
| Leistungsclaim | **KOMPETENT – KOMFORTABEL – ERFOLGREICH** |
| Signatur-USP | **PERSÖNLICH – ZUVERLÄSSIG – PROFESSIONELL** |
| Positionierung | *„Allgemeinmediziner für Wohnraum"* |
| Team-Claim | **GEMEINSAM MEHR ERREICHEN** |
| Angebote-Claim | **IHRE IDEEN WERDEN BEI UNS WIRKLICHKEIT** |

### CTA-Texte (Originalseite)

- „Sichern SIE sich Ihren persönlichen Beratungstermin."
- „RUFEN SIE UNS AN"
- „E-MAIL AN UNS"
- „Wir freuen uns darauf, Sie kennenzulernen."

### SEO Meta (Startseite)

- **Title:** Ihr Immobilienmakler \| Haller Immobilien Andernach
- **Description:** IHR Immobilienmakler für Koblenz, Neuwied & Umgebung ✓Hausverwaltung ✓Immobilienkauf ✓Immobilienverkauf ✓Immobilienberatung ✆ 02632 94580
- **og:site_name:** Immobilien Haller
- **og:locale:** de_DE

---

## 4. Firmendaten

| Feld | Wert |
|---|---|
| **Firma** | Haller Immobilienberatung GmbH |
| **Geschäftsführer** | Waldemar Haller |
| **Adresse** | Kirchberg 42, 56626 Andernach |
| **Telefon** | 02632 9458-0 |
| **Fax** | 02632 9458-29 |
| **E-Mail** | info@haller-immobilien.de |
| **Website** | https://haller-immobilien.de |
| **Handelsregister** | HRB 13727, Amtsgericht Koblenz |
| **USt-ID** | DE178908468 |
| **Erfahrung Makler** | 30+ Jahre |
| **Erfahrung Hausverwaltung** | 25+ Jahre |
| **Zertifizierung** | Zertifizierter WEG-Verwalter IHK |
| **Versicherung** | Betriebshaftpflicht + Vermögensschadenhaftpflicht |
| **Web-Agentur** | Henzgen & Schommer media GmbH, Lohmannstraße 27, 56626 Andernach |

### Öffnungszeiten

**Büro (Footer):**
- Montag bis Freitag: 09:00 – 17:00 Uhr

**Telefonservice (Footer):**
- Montag, Dienstag, Donnerstag: 09:00 – 17:00 Uhr
- Mittwoch: kein Telefonservice
- Freitag: 09:00 – 12:00 Uhr

**Termine nach Vereinbarung (Kontaktseite — Waldemar Haller):**
- Montag bis Freitag: 09:00 – 20:00 Uhr
- Samstag: 09:00 – 16:00 Uhr

### Servicegebiet

Andernach, Koblenz, Neuwied, Kreis Mayen-Koblenz, vorderer Westerwald — „zwischen Köln und Wiesbaden". Kontaktseite erwähnt zusätzlich **Mallorca** (exklusive Immobilien).

**Städte mit Listings:** Andernach, Kruft, Mendig, Neuwied, Nickenich, Welling

---

## 5. Navigation & Site-Struktur

| Nav-Punkt | URL |
|---|---|
| Über uns | `/` |
| Immobilienangebote | `/immobilienangebote/` |
| Immobilie verkaufen | `/immobilie-verkaufen/` |
| Hausverwaltung | `/hausverwaltung/` |
| Projekte | `/projekte/` |
| Team | `/team/` |
| Kontakt | `/kontakt/` |
| Impressum | `/impressum/` |
| Datenschutz | `/datenschutz/` |
| AGB | `/agb/` |

**Dynamisches Immobilienportal:** `/properties/*`, `/listings/kauf`, `/listings/miete`, `/city/*`, `/action/*` — 50+ URLs, nicht vollständig gecrawlt.

---

## 6. Leistungen (4 Säulen)

### 6.1 Immobilie verkaufen

**Claim:** KOMPETENT – KOMFORTABEL – ERFOLGREICH

Begleitung von der Wertermittlung bis zur notariellen Übergabe. Über 30 Jahre Erfahrung.

**Persönlich gut beraten:**
- Persönliche Erstberatung
- Begutachtung & transparente Wertermittlung
- Überprüfung & Organisation aller Objektunterlagen
- Individuelle Vermarktungsstrategie & Zielgruppenanalyse
- Fotografie & Exposé-Erstellung
- Diskrete Direktvermittlung (auf Wunsch)
- Veröffentlichung in Internetportalen
- Versand an Interessenten aus dem Bestand

**Immobilienverkauf zum Bestpreis:**
- Besichtigungsorganisation
- Bonitätsprüfung
- Finanzierungsvermittlung
- Verhandlungsgespräche & Kaufvertragsvorbereitung
- Begleitung zum Notartermin
- Kaufpreiszahlungsprüfung
- Objektübergabe
- Nachgelagertes Kundenmanagement

### 6.2 Immobilienangebote / Kauf

**Claim:** Große Vermögenswerte brauchen einen erfahrenen und kompetenten Partner

Aktuelle Listings (Stand Scrape): EFH, Eigentumswohnungen, Kapitalanlagen, Mehrfamilienhäuser in Andernach, Welling, Mendig, Kruft, Neuwied.

**Suchprofil-Service:** Vorgemerkte Kunden erhalten neue Angebote vor Veröffentlichung.

### 6.3 Hausverwaltung

**Claim:** Jede Immobilie sollte ein gewinnbringendes Investment sein

Betreuung ab **3 Wohneinheiten**. Mitglied VDIV Rheinland-Pfalz/Saarland e.V.

**WEG-Verwaltung:**
- Jährliche Eigentümerversammlung
- Beschlussdurchführung & Beschlusssammlung
- Hausgeld- & Instandhaltungsrücklagen-Verwaltung
- Betriebskostenabrechnungen (gesetzeskonform)
- Haushaltsnahe Dienstleistungen
- Wirtschaftsplan
- Technischer Service
- Buchhaltung

**Mietverwaltung:**
- Mietverträge erstellen
- Wohnungsabnahmen & -übergaben
- Mieter-Ansprechpartner
- Mietzahlungsprüfung & Mahnwesen
- Betriebskostenabrechnungen
- Kostenaufstellung für Steuererklärung
- Technischer Service
- Mietkonten-Buchhaltung

**Tätigkeitsschwerpunkte:** Ein- bis Dreifamilienhäuser, Mehrfamilienhäuser, Eigentumswohnungen

**Tätigkeitsgebiete:** Kreis Mayen-Koblenz, Koblenz, Kreis Neuwied

**Ansprechpartner technische HV:** Björn Jonas — 0151 610 638 06, bj@haller-immobilien.de

### 6.4 Projekte / Projektplanung

| Projekt | Details |
|---|---|
| **Loftpark Andernach** | Fertigstellung Anfang 2017, 30 Eigentumswohnungen, schlüsselfertig, parkähnliche Außenanlagen, Prime Location |
| **Rheinpalais Andernach** | Fertigstellung Anfang 2013, 37 Wohneinheiten, schlüsselfertig, provisionsfrei, Logenblick, 3 Gebäudekörper (Konvent, Rheinpalais, Parkpalais) |
| **Im Winkel 14, Andernach** | Fertigstellung Anfang 2020, 3 Eigentumswohnungen, schlüsselfertig |

### Besondere Leistungen (Startseite)

- Erstellen eines Umbau-/Sanierungskonzeptes
- Fachhandwerker-Plattform
- Kooperationen mit renommierten Architekten und Fachanwälten

---

## 7. Team

| Name | Rolle | Kontakt |
|---|---|---|
| Waldemar Haller | Geschäftsführer | — |
| Birgit Zerwas | Büroleitung und Marketing | — |
| Björn Jonas | Technische Hausverwaltung / Objektmanagement | bj@haller-immobilien.de, 0151 610 638 06 |
| Thomas Haller | Objektbetreuung | — |
| Lukas Haller | Kaufmännische Hausverwaltung | — |
| Marlies Reitz | Buchhaltung | — |
| Lydia Haller | Büroassistenz | — |

---

## 8. Seiten-Content (Firecrawl, bereinigt)

### 8.1 Startseite (`/`)

**HERZLICH WILLKOMMEN bei der Haller Immobilienberatung GmbH**

Der eigene Wohnraum ist für alle Menschen existenziell. Entscheidungen rund um Immobilien haben sowohl emotional, als auch finanziell eine große Bedeutung. Im Eigenheim täglich eine Wohlfühlatmosphäre, eine Schutzfunktion und gleichzeitig einen Rückzugsort vom Alltag für die ganze Familie vorzufinden verbindet unsere Leidenschaft für Immobilien, auch im Hinblick zur Erreichung eines langfristigen Kapitals für eine finanziell sorgenfreie Zukunft unserer Kunden. Denn schließlich geht es beim Kauf oder Verkauf einer Immobilie oft um die größte finanzielle Transaktion im Leben.

Immobilien sind seit über 30 Jahren unsere Leidenschaft. Als inhabergeführtes Maklerunternehmen unterstützen und begleiten wir unsere Kunden mit ehrlicher Freundlichkeit, persönlich und individuell auf dem Weg zu ihrem Immobilienziel. Wohnraum ist der Raum zum Leben und Erleben, gerade deshalb ist der Verkauf, Kauf oder die Vermietung einer Immobilie Vertrauenssache. Persönlichkeit, Fairness, Transparenz und gegenseitiges Vertrauen sind uns ausgesprochen wichtig. Dank unserer Erfahrung, Expertise und Marktkenntnis im Raum Andernach, Koblenz, Neuwied und Umgebung bis zum vorderen Westerwald, kurzum zwischen Köln und Wiesbaden, verstehen wir uns als „Allgemeinmediziner für Wohnraum".

Ihre Wünsche und Ziele definieren die Anforderungen an uns. Gemeinsam mit Ihnen gestalten wir von Anfang an den für Sie optimalen Weg zur Realisierung Ihres Wohntraumes – das Haus für Ihr Leben, damit alles passt. Beim Verkauf Ihrer Immobilie erzielen wir für Sie durch professionelle Bewertung den Bestpreis, optimal beworben, freundlich präsentiert und erfolgreich verkauft. Wir finden für Sie den perfekten Mieter oder die ideale Kapitalanlage mit durchdachtem Finanzierungskonzept.

Dabei ist es uns besonders wichtig, und dies zählen wir auch zu einer unserer ganz großen Stärken, dass Sie von uns einen Leitfaden erhalten, der transparent und realistisch ist und keinerlei Lücken aufweist. Im Mittelpunkt unserer Arbeit stehen dabei immer Sie als Kunde im Hinblick auf Ihre individuellen Wünsche, Ziele und Interessen, sowohl persönlich als auch finanziell. Das ist unser Anspruch für Ihr Vertrauen.

Wir garantieren Ihnen eine fachkundige Beratung und eine professionelle Betreuung bis zur Übergabe des Objektes.

### 8.2 Immobilie verkaufen (`/immobilie-verkaufen/`)

**Immobilienverkauf mit uns: KOMPETENT – KOMFORTABEL – ERFOLGREICH**

Ihre Immobilienwerte verdienen einen kompetenten Partner. Wir wissen Ihre Immobilie zu schätzen, denn jede Immobilie hat eine individuelle Geschichte.

Der richtige Preis für Ihre Immobilie entscheidet. Eine präzise Ermittlung Ihres Immobilienwertes ist essenziell für den erfolgreichen und schnellen Verkauf Ihres Objektes. Bei schwierigen Fragen rund um die Grundbucheinträge, Teilungserklärungen oder Kaufverträge kann man schnell die Übersicht beim Immobilien-Verkauf verlieren.

Über 30 Jahre Erfahrung in der Immobilienbranche machen uns zu Ihrem leistungsstarken Partner.

Wir begleiten Sie sicher durch den gesamten Prozess einer Verkaufsabwicklung: Von der Ermittlung des Verkehrswertes über die Festlegung des gewünschten Verkaufspreises zur zielführenden Akquise bis zur finalen notariell beglaubigten Unterschriftsreife und darüber hinaus.

Gerne prüfen wir mit Ihnen gemeinsam Ihre individuelle Situation und erarbeiten maßgeschneiderte Lösungen, die genau zu Ihren Vorstellungen passen. Unser Ziel ist es, für Sie als Eigentümer das beste Verkaufsergebnis zu erhalten.

### 8.3 Hausverwaltung (`/hausverwaltung/`)

**Jede Immobilie sollte ein gewinnbringendes Investment sein**

Wir sind Ihr zuverlässiger Partner für Ihre Hausverwaltung — KOMPETENT – KOMFORTABEL – ERFOLGREICH

Häufig sind Immobilien ein Bestandteil der privaten Altersvorsorge und des Vermögensaufbaus und somit eine sehr persönliche Komponente. Deshalb verwalten wir Ihre Immobilie mit respektvoller Sorgfalt und Zuverlässigkeit, als wäre sie unsere eigene!

Unser Wunsch ist IHR Ziel: Wir verwalten, erhalten und steigern langfristig den Wert und die Rendite Ihrer Immobilie. Profitieren Sie von unserem Rundumservice für IHR Eigentum – zuverlässig, schnell, kompetent und persönlich. Als inhabergeführtes Unternehmen sind wir in unserer Region in Rheinland Pfalz sowie zwischen Köln und Wiesbaden und Umgebung seit über 25 Jahren verwurzelt und arbeiten mit einer bewährten Handwerkerplattform.

Wir übernehmen für SIE alle nötigen Verwaltungsabläufe und dienen als professionelle Schnittstelle zwischen IHNEN, IHREN Mietern und externen Dienstleistern. Im Rahmen der WEG-Verwaltung betreuen wir vollumfänglich Ihre Eigentümergemeinschaft und verwalten das Gemeinschaftseigentum. Um eine optimale Werterhaltung zu erreichen, ist es uns ein besonderes Anliegen, Probleme frühzeitig zu erkennen, um schnellstmöglich Lösungen zu finden.

Unsere Abteilung Technische Hausverwaltung begleitet persönlich anstehende Maßnahmen am Objekt.

Verpflichtend für uns ist die regelmäßige Teilnahme an anerkannten Fortbildungsmaßnahmen, damit wir für Sie immer auf dem neuesten Stand sind.

### 8.4 Immobilienangebote (`/immobilienangebote/`)

**Große Vermögenswerte brauchen einen erfahrenen und kompetenten Partner**

IHRE IDEEN WERDEN BEI UNS WIRKLICHKEIT — Beginnen Sie einen neuen Lebensabschnitt

Immobilien bieten Lebensraum für Familien, sind Altersruhesitz, dienen als Rückzugsort aus dem oftmals hektischen Alltag. Und sie sind für jeden, der sich für eine eigene Immobilie entscheidet, eine bedeutende Investition.

### 8.5 Projekte (`/projekte/`)

**Projektplanung mit uns — KOMPETENT – KOMFORTABEL – ERFOLGREICH**

**Loftpark Andernach:** Nachhaltig geplante Wohnungslinien im Bauhaus-Stil an Werftstraße/Rampenstraße. Erneuerbare Energien, gute EnEV-Bilanz, niedrige Energiekosten.

**Rheinpalais Andernach:** Exklusive Eigentumswohnungen im Zentrum von Natur und Innenstadt. Charisma alter Gemäuer, parkähnliches Ambiente, modernster Komfort. Grünblick, Ost-/Süd-/Westausrichtung.

### 8.6 Team (`/team/`)

**GEMEINSAM MEHR ERREICHEN**

Wir freuen uns auf Ihre Wünsche und begleiten Sie ganz persönlich, bis wir unser gemeinsam gestecktes Ziel erreichen und Sie rundum zufrieden sind.

### 8.7 Kontakt (`/kontakt/`)

**Wir freuen uns über Ihre Anfrage**

Haller Immobilienberatung GmbH, Kirchberg 42, 56626 Andernach

**Zertifizierter WEG-Verwalter IHK**

Die Haller Immobilienberatung GmbH ist seit nahezu 30 Jahren erfolgreich auf dem Immobilienmarkt tätig. Gerne beraten wir Sie rund um die Themen Immobilien und Immobilienvermittlung sowie über unser umfangreiches Dienstleistungs-Angebot in der Haus- und Mietverwaltung.

**Kontaktformular-Optionen:** Immobilie verkaufen, Immobilie kaufen, Vermietung, Allgemeine Frage

### 8.8 Impressum (`/impressum/`)

Angaben gemäß § 5 DDG — Haller Immobilienberatung GmbH, Kirchberg 42, 56626 Andernach. HRB 13727, AG Koblenz. GF: Waldemar Haller. Tel: 02632 9458-0. E-Mail: info@haller-immobilien.de. USt-ID: DE178908468.

---

## 9. Landing-Page-Briefing (Vorschlag)

| Sektion | Inhalt |
|---|---|
| Header | Logo `assets/logo_haller.png`, Navigation (4 Leistungen + Team + Kontakt) |
| Hero | Zitat + Akrostichon HALLER + CTA Beratungstermin |
| Über uns | GF-Text, „30 Jahre", „Allgemeinmediziner für Wohnraum" |
| Leistungen | 4 Karten: Verkauf, Kauf, Hausverwaltung, Projekte |
| Warum Haller | Persönlich – Zuverlässig – Professionell + besondere Leistungen |
| Team-Teaser | 3–4 Karten (Waldemar, Björn, Birgit) |
| Partner | Logo-Marquee (VDIV, immowelt, Architekten, Handwerker) |
| Kontakt | Adresse, Telefon, Formular, Öffnungszeiten |
| Footer | Impressum, Datenschutz, AGB |

---

## 10. UC2 — Lead-Qualifizierung (separates Produkt)

> Vollständige Spec: [`One Shot Landing Page Demo.md`](One%20Shot%20Landing%20Page%20Demo.md)  
> Prozessflow: [`UC2_Visualisierung.html`](UC2_Visualisierung.html)

**Kurzüberblick:** Next.js 14 Upload-Portal für Mietinteressenten. Token-Auth via `/upload?t={uuid}`. Supabase (EU), DSGVO-konform, 90-Tage-Löschung. **Nicht** die Marketing-Landing-Page.

**UC2 Design (dunkel, separat von Website-Branding):**
- Background: `#07101E`, Card: `#0D1F3C`, Accent: `#3B82F6`, Font: Inter

---

## 11. Offene Punkte

- [ ] Scope Landing Page: One-Page vs. Multi-Page?
- [ ] Listings: statische Teaser vs. Link zum WP-Portal?
- [ ] Design: WP-Stil nachbauen vs. modernes Redesign (Farben beibehalten)?
- [ ] Öffnungszeiten: welche Variante ist verbindlich?
- [ ] Mallorca-Erwähnung auf Landing Page ja/nein?
- [ ] Weitere User-Specs: _(hier ergänzen)_

---

## 12. Verwandte Dateien im Projekt

| Datei | Zweck |
|---|---|
| `assets/logo_haller.png` | Offizielles Logo |
| `One Shot Landing Page Demo.md` | UC2 Upload-Portal Spec |
| `UC2_Visualisierung.html` | Prozessflow-Diagramm UC2 |
| `CONTEXT.md` | Diese Datei |
