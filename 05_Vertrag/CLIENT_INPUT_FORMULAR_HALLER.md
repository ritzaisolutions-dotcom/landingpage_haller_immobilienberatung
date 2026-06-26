# Client Input Formular — Haller Immobilienberatung GmbH
## Onboarding für RAIS UC2 — Lead-Qualifizierung & Terminmanagement

**Bitte innerhalb von 3 Werktagen nach Anzahlung vollständig ausfüllen.**

**Projektstart erfolgt erst wenn:**
- [ ] Service Agreement unterzeichnet
- [ ] Anzahlung (€2.250) eingegangen
- [ ] Dieses Formular vollständig vorliegt

---

## 1. UNTERNEHMENSDATEN

**Firmenname (vollständig):**
Haller Immobilienberatung GmbH

**Geschäftsführer:**
Waldemar Haller

**Adresse:**
Kirchberg 42, 56626 Andernach

**Ansprechpartner Projekt:**
Thomas Haller (Sohn, Objektbetreuung)

**Telefon Ansprechpartner:**
_______________________________________________________

**E-Mail Ansprechpartner:**
_______________________________________________________

---

## 2. IMMOSCOUT24 API — OAUTH AUTORISIERUNG

Für die API-Anbindung benötigen wir eine einmalige Autorisierung. Sie klicken auf einen Link, loggen sich mit Ihrem IS24-Konto ein und bestätigen mit "Erlauben". Dauert 30 Sekunden.

**IS24-Account E-Mail:**
_______________________________________________________

**Haben Sie Admin-Zugang zu Ihrem IS24-Konto?**
- [ ] Ja
- [ ] Nein → Wer hat Zugang? _______________________________

**IS24 OAuth-Termin** *(wir koordinieren das gemeinsam)*:
_______________________________________________________

---

## 3. MICROSOFT OUTLOOK — KALENDER-INTEGRATION

Bei jeder Terminbuchung erstellt das System automatisch ein Kalender-Event im Outlook-Kalender des zuständigen Mitarbeiters.

**Welche Kalender-Konten sollen Events erhalten?**

| Mitarbeiter | Outlook E-Mail | Erhält Events für |
|---|---|---|
| Thomas Haller | _________________________ | Alle / Nur bestimmte Inserate |
| Waldemar Haller | _________________________ | Alle / Nur bestimmte Inserate |
| _________________________ | _________________________ | _________________________ |
| _________________________ | _________________________ | _________________________ |

**Nutzen Sie Microsoft 365 / Exchange?**
- [ ] Ja, Microsoft 365 (empfohlen)
- [ ] Ja, Exchange Server
- [ ] Nein, anderer Kalender: _______________________________

**Gibt es einen IT-Admin der die App-Berechtigung genehmigen muss?**
- [ ] Nein, wir haben selbst Admin-Rechte
- [ ] Ja → Name/Kontakt: _______________________________

**Soll es einen geteilten Team-Kalender geben ("Haller Besichtigungen")?**
- [ ] Ja, alle Mitarbeiter abonnieren einen gemeinsamen Kalender
- [ ] Nein, jeder bekommt Events direkt in seinen eigenen Kalender

---

## 4. DASHBOARD-ZUGÄNGE

Das Dashboard ist passwortgeschützt. Jeder Mitarbeiter bekommt einen eigenen Login.

**Bitte alle Mitarbeiter mit benötigtem Zugang auflisten:**

| Name | E-Mail (= Login) | Rolle |
|---|---|---|
| Waldemar Haller | _________________________ | [ ] Admin [ ] Mitarbeiter |
| Thomas Haller | _________________________ | [ ] Admin [ ] Mitarbeiter |
| _________________________ | _________________________ | [ ] Admin [ ] Mitarbeiter |
| _________________________ | _________________________ | [ ] Admin [ ] Mitarbeiter |
| _________________________ | _________________________ | [ ] Admin [ ] Mitarbeiter |

**Admin** = sieht alles, kann Buchungsfenster und Zuständigkeiten verwalten
**Mitarbeiter** = sieht zugewiesene Inserate, kann Entscheidungen treffen

---

## 5. AUSGEHENDE E-MAIL / NACHRICHTEN

Automatische Nachrichten an Interessenten (Bestätigung, Absage, Zusage) werden im Namen von Haller versendet.

**Gewünschte Absender-E-Mail:**
- [ ] info@haller-immobilien.de
- [ ] vermietung@haller-immobilien.de *(empfohlen für Trennung)*
- [ ] Andere: _______________________________

**Wer muss Nachrichtenvorlagen freigeben?**
_______________________________________________________

**Gibt es bestehende Standardtexte für Absagen/Zusagen die wir nutzen sollen?**
- [ ] Ja → Bitte zusenden an kevin@ritz-ai.solutions
- [ ] Nein → RAIS erstellt Vorlagen, Sie geben frei

---

## 6. SELBSTAUSKUNFT — KPIs FÜR MISTRAL-BEWERTUNG

Die KI bewertet Selbstauskünfte nach diesen Kriterien. Bitte definieren Sie Ihre Anforderungen.

### Mietwohnungen:

**Einkommensfaktor:** Nettoeinkommen muss mindestens ___ x Kaltmiete betragen.
*(Empfehlung: 3x, Branchenstandard: 2,5x–3x)*

**Beschäftigungsstatus:**
- [ ] Unbefristetes Arbeitsverhältnis zwingend erforderlich
- [ ] Befristetes Arbeitsverhältnis akzeptabel, aber schlechteres Score
- [ ] Alle Statusarten akzeptabel, KI bewertet individuell

**Haustiere:**
- [ ] Keine Haustiere (generell ausschließen)
- [ ] Haustiere je nach Objekt (Mitarbeiter entscheidet im Einzelfall)
- [ ] Haustiere generell akzeptabel

**Weitere Pflichtkriterien:**
_______________________________________________________
_______________________________________________________

### Kaufobjekte:

**Eigenkapital Mindestquote:** _____ % des Kaufpreises
*(Bankstandard: 20%)*

**Finanzierungsbestätigung:**
- [ ] Bankzusage zwingend erforderlich für guten Score
- [ ] "In Bearbeitung" wird akzeptiert

**Weitere Kaufkriterien:**
_______________________________________________________

---

## 7. BUCHUNGSFENSTER — DEFAULTS

Diese Werte können im Dashboard jederzeit pro Inserat angepasst werden. Hier die Standardwerte:

**Buchbare Wochentage:**
- [ ] Montag
- [ ] Dienstag
- [ ] Mittwoch
- [ ] Donnerstag
- [ ] Freitag
- [ ] Samstag
- [ ] Sonntag

**Buchbare Zeiten:**
Von: _______ Uhr bis _______ Uhr *(z.B. 09:00 bis 17:00)*

**Dauer je Besichtigung:**
- [ ] 30 Minuten
- [ ] 45 Minuten
- [ ] 60 Minuten
- [ ] 90 Minuten

**Maximale Personen gleichzeitig pro Slot:**
_______ Personen *(Standard: 1)*

**Mindest-Vorlaufzeit** *(wie viele Stunden vor dem Termin kann noch gebucht werden?)*:
- [ ] 1 Stunde
- [ ] 2 Stunden
- [ ] 4 Stunden
- [ ] 24 Stunden

---

## 8. MITARBEITER-ZUSTÄNDIGKEITEN

Welcher Mitarbeiter ist für welche Art von Inseraten zuständig (führt Besichtigungen durch)?

**Standard (wenn kein spezifischer Zuständiger gesetzt ist):**
_______________________________________________________

**Gibt es eine Aufteilung nach Objekttyp?**
- [ ] Nein, alle machen alles
- [ ] Ja: 
  - Mietwohnungen: _______________________________
  - Kaufobjekte: _______________________________
  - Hausverwaltung: _______________________________

*Individuelle Zuständigkeit kann im Dashboard pro Inserat jederzeit gesetzt werden.*

---

## 9. NACHRICHTENVORLAGEN — FREIGABE

Bitte bestätigen Sie welche Vorlagen Sie selbst schreiben und welche wir entwerfen:

| Nachricht | Von wem | Status |
|---|---|---|
| Erstantwort (LP1-Link) | [ ] RAIS entwirft, Haller freigibt [ ] Haller schreibt | ⏳ |
| Terminbestätigung (LP1 success) | [ ] RAIS entwirft, Haller freigibt [ ] Haller schreibt | ⏳ |
| Selbstauskunft-Anforderung (LP2) | [ ] RAIS entwirft, Haller freigibt [ ] Haller schreibt | ⏳ |
| Freundliche Absage | [ ] RAIS entwirft, Haller freigibt [ ] Haller schreibt | ⏳ |
| Zusage | [ ] RAIS entwirft, Haller freigibt [ ] Haller schreibt | ⏳ |
| Rückfrage (zu wenig Info) | [ ] RAIS entwirft, Haller freigibt [ ] Haller schreibt | ⏳ |

**Wer gibt Vorlagen abschließend frei?**
_______________________________________________________

---

## 10. INSERATE — INITIALE DATEN

Für Demo und ersten Test benötigen wir mindestens 2 aktive Inserate.

**ImmoScout24 ist verbunden (nach OAuth) → automatischer Import**

Falls IS24 API noch nicht freigeschaltet: Bitte 2–3 aktuelle Inserate manuell angeben:

| IS24-Inserat-ID | Adresse | Zimmer | Kaltmiete/Preis | Typ |
|---|---|---|---|---|
| _________________________ | _________________________ | _____ | _________€ | [ ] Miete [ ] Kauf |
| _________________________ | _________________________ | _____ | _________€ | [ ] Miete [ ] Kauf |
| _________________________ | _________________________ | _____ | _________€ | [ ] Miete [ ] Kauf |

*IS24-Inserat-ID steht in der URL: immobilienscout24.de/expose/**48291***

---

## 11. DATENSCHUTZ & RECHTLICHES

**Datenschutzerklärung auf LP1 und LP2:**

Die Landing Pages verlinken auf Ihre bestehende Datenschutzerklärung:
`https://haller-immobilien.de/datenschutzerklaerung/`

- [ ] Diese URL ist korrekt und aktuell ✓
- [ ] Andere URL: _______________________________
- [ ] Datenschutzerklärung muss aktualisiert werden (wir weisen Sie darauf hin)

**AVV:**
Auftragsverarbeitungsvereinbarung (AVV) zwischen Haller (Controller) und RAIS (Processor) wird gleichzeitig mit dem Service Agreement unterzeichnet.

- [ ] AVV wird zusammen mit Service Agreement unterzeichnet ✓

**EU Cloud bestätigung:**
Alle Daten werden in der EU gespeichert (Supabase Frankfurt, Vercel EU Edge, Hetzner Nürnberg).
- [ ] Bestätigt ✓

---

## 12. MIETER-SELBSTAUSKUNFT VORLAGE

**Nutzen Sie eine eigene Mieter-Selbstauskunft-Vorlage?**
- [ ] Ja → Bitte zusenden, wir digitalisieren die Felder
- [ ] Nein → RAIS verwendet Standard-Selbstauskunft (Deutsch, DSGVO-konform)

**Gibt es Pflichtfelder die über unseren Standard hinausgehen?**
_______________________________________________________
_______________________________________________________

---

## 13. SCOPE-ÜBERSICHT (WAS SIE BEKOMMEN)

### Im Setup-Preis (€4.500) enthalten:

- [x] 7 n8n Automatisierungs-Workflows
- [x] Landing Page 1 (Terminbuchung, Haller Design)
- [x] Landing Page 2 (Selbstauskunft, Haller Design)
- [x] Internes Dashboard (passwortgeschützt)
- [x] KI-Integration (Mistral) für Intent-Analyse und Selbstauskunft-Bewertung
- [x] ImmoScout24 API-Anbindung (nach IS24-Genehmigung)
- [x] Microsoft Outlook Kalender-Integration
- [x] Supabase Datenbankschema (Frankfurt, EU)
- [x] DSGVO-konforme Auto-Delete-Logik (30 Tage)
- [x] Sentry Error Monitoring
- [x] Einweisung (1x 60-Minuten-Session mit Thomas Haller)
- [x] 1 Revisionsrunde pro Lieferabschnitt

### Nicht im Setup-Preis enthalten:

- [ ] UC1 Wissensdatenbank / SharePoint-Integration
- [ ] UC3 Mahnwesen
- [ ] UC4 Voice Agent
- [ ] Immowelt API-Integration
- [ ] Mehr als 1 Revision pro Lieferabschnitt (€150 pro zusätzlicher Runde)
- [ ] Änderungen nach Go-Live außerhalb Retainer (€100/h)
- [ ] Rechtliche Prüfung von Mietverträgen oder Selbstauskunft-Vorlagen

### Im Retainer (€250/Monat) enthalten:

- [x] Hosting (Vercel + Hetzner VPS)
- [x] API-Kosten (Mistral, Supabase — Standard-Volumen)
- [x] Monitoring und Fehlerbehebung
- [x] Kleinanpassungen bis 1h/Monat
- [x] ImmoScout24 Inserate-Sync (alle 6h)
- [x] Technischer Support (Werktags, 4h Reaktionszeit)

---

## 14. CHECKLISTE — STARTBEDINGUNGEN

Bitte vor Rücksendung prüfen:

**Zugang & Accounts:**
- [ ] IS24-Account-Zugangsdaten bekannt (für OAuth-Termin)
- [ ] Outlook/Microsoft 365 Admin-Zugang oder Ansprechpartner benannt
- [ ] Alle Dashboard-Nutzer mit E-Mail aufgelistet (Abschnitt 4)

**Konfiguration:**
- [ ] Absender-E-Mail definiert (Abschnitt 5)
- [ ] Selbstauskunft-KPIs definiert (Abschnitt 6)
- [ ] Buchungsfenster-Defaults angegeben (Abschnitt 7)
- [ ] Mitarbeiter-Zuständigkeit definiert (Abschnitt 8)

**Inhalte:**
- [ ] Nachrichten-Vorlagen: wer schreibt / freigibt definiert (Abschnitt 9)
- [ ] Initiale Inserate für Demo angegeben oder IS24-OAuth bestätigt (Abschnitt 10)
- [ ] Datenschutz-URL bestätigt (Abschnitt 11)
- [ ] Mieter-Selbstauskunft: eigene Vorlage zusenden ODER Standard bestätigt (Abschnitt 12)

**Rechtliches:**
- [ ] Service Agreement unterzeichnet
- [ ] AVV unterzeichnet
- [ ] Anzahlung (€2.250) überwiesen

---

## RÜCKSENDUNG

**Frist:** 3 Werktage nach Anzahlung

📧 **E-Mail:** kevin@ritz-ai.solutions
📱 **WhatsApp:** 0151 29755134

**Fragen?** Jederzeit melden — wir helfen beim Ausfüllen.

---

**Bestätigung:**

Ich bestätige, dass alle obigen Angaben nach bestem Wissen korrekt sind und ich die Scope-Übersicht gelesen habe.

**Name:** _______________________________________________________

**Datum:** _______________________________________________________

**Unterschrift:** _______________________________________________________

---

*RAIS – Ritz AI Solutions · Von-Cohausenstraße 9 · 56076 Koblenz*
*kevin@ritz-ai.solutions · 0151 29755134*
