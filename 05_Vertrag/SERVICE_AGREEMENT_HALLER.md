# Service Agreement — RAIS × Haller Immobilienberatung GmbH

**zwischen**

**Ritz AI Solutions (RAIS)**
Einzelunternehmen / Kleingewerbe
Von-Cohausenstraße 9
56076 Koblenz, Deutschland
E-Mail: kevin@ritz-ai.solutions
Telefon: 0151 29755134
Steuernummer: 22/139/34062

nachfolgend "Auftragnehmer"

**und**

Haller Immobilienberatung GmbH
Kirchberg 42
56626 Andernach
vertreten durch: Waldemar Haller (Geschäftsführer)
E-Mail: info@haller-immobilien.de

nachfolgend "Auftraggeber"

---

## 1. VERTRAGSGEGENSTAND

Der Auftragnehmer entwickelt, implementiert und betreibt für den Auftraggeber ein vollautomatisiertes **Lead-Qualifizierungs- und Terminmanagementsystem** (nachfolgend "System") für die Bearbeitung eingehender Miet- und Kaufinteressenten-Anfragen auf ImmoScout24 und weiteren Plattformen gemäß dem vereinbarten Leistungsumfang.

---

## 2. LEISTUNGSUMFANG (SYSTEM-UC2)

### 2.1 Einmalige Setup-Leistungen

**Automatisierungs-Infrastruktur:**
- 7 n8n Workflows (Erstkontakt, Terminbuchung, Mitarbeiter-Benachrichtigung, Selbstauskunft-Anforderung, KI-Analyse, Entscheidungsverarbeitung, Auto-Delete)
- Datenbankschema (Supabase, Frankfurt EU): leads, inserate, besichtigungsslots, selbstauskuenfte, buchungsfenster, inserat_zustaendigkeiten
- KI-Integration (Mistral AI): automatische Intent-Analyse eingehender Nachrichten + Bewertung von Selbstauskünften mit Score und Begründung
- ImmoScout24 API-Integration (OAuth1, nach Genehmigung durch IS24)
- Microsoft Outlook Kalender-Integration (Kalender-Events bei Terminbuchung)

**Landing Page 1 — Terminbuchung (LP1):**
- Buchungsportal für Mietinteressenten (mobil-optimiert)
- Token-basierte Authentifizierung (eindeutiger Link pro Interessent)
- Echtzeit-Slot-Auswahl aus verfügbaren Besichtigungsterminen
- DSGVO-konforme Einwilligungserklärung
- Automatische Bestätigungsbenachrichtigung
- Haller Corporate Design (#00AFCB, Nunito, Logo)

**Landing Page 2 — Selbstauskunft (LP2):**
- Digitales Formular nach Besichtigung (kein PDF-Upload)
- Variante Miete: Einkommen, Beschäftigung, Haushalt, Einzugswunsch
- Variante Kauf: Eigenkapital, Finanzierung, Kaufzeitraum, Kaufgrund
- DSGVO-konforme Einwilligungserklärung
- Haller Corporate Design

**Internes Dashboard:**
- Passwortgeschütztes Verwaltungssystem (Supabase Auth)
- Inserat-Profilseiten mit Buchungsfenster-Konfiguration
- Mitarbeiter-Zuständigkeits-Pool pro Inserat
- Besichtigungs-Übersicht mit Kalender-Integration
- Selbstauskunft-Vergleichsansicht (KI-Score, Begründung, Kandidatenauswahl)
- Benachrichtigungsbereich (neue Buchungen, neue Selbstauskünfte)
- Sentry Error-Monitoring
- Dark Professional Theme (Inter, #07101E)

**Deployment:**
- Landing Pages auf Vercel (EU Edge)
- Dashboard auf Vercel (EU Edge, passwortgeschützt)
- n8n auf Hetzner Cloud VPS (Nürnberg, Deutschland)
- Datenbank auf Supabase (Frankfurt, EU)

### 2.2 Laufende Betriebsleistungen (Retainer)

Im monatlichen Retainer enthalten:
- Hosting (Vercel, Hetzner VPS)
- API-Kosten (Mistral, Supabase)
- Monitoring und Fehlerbehebung
- Kleinanpassungen (bis 1h/Monat, z.B. Nachrichtenvorlagen, KPI-Anpassungen)
- IS24 API Synchronisation (Inserate-Sync alle 6h)
- Microsoft Outlook Kalender-Sync
- Technischer Support (Werktags, 4h Reaktionszeit)

### 2.3 Nicht im Leistungsumfang enthalten

Sofern nicht ausdrücklich schriftlich vereinbart:
- Rechtliche Erstellung oder Prüfung von Impressum, Datenschutzerklärung, Mietverträgen
- Zusätzliche Use Cases (UC1 Wissensdatenbank, UC3 Mahnwesen, UC4 Voice Agent)
- Immowelt API-Integration
- Individuelle CRM-Anbindung
- Schulung des Haller-Teams über vereinbarte Einweisung hinaus
- Mehr als 1 Revision pro Lieferabschnitt
- Laufende Betreuung nach Retainer-Kündigung

---

## 3. PROJEKTPREIS UND ZAHLUNGSSTRUKTUR

### 3.1 Einmalige Setup-Vergütung

**Gesamtpreis Setup:** €5.000,00

**Zahlungsstruktur:**
- Anzahlung: €2.500,00 (50%) — fällig bei Vertragsunterzeichnung
- Restzahlung: €2.500,00 (50%) — fällig nach Abnahme (System live und funktional)

### 3.2 Monatlicher Retainer

**Retainer:** €250,00 / Monat

Fällig monatlich im Voraus, beginnend mit dem Monat nach Go-Live.
Mindestlaufzeit Retainer: 3 Monate.

### 3.3 Allgemeine Zahlungsbedingungen

**Zahlungsziel:** 14 Tage nach Rechnungsstellung

**Kleinunternehmer-Regelung:**
Gemäß §19 UStG wird keine Umsatzsteuer berechnet. Der angegebene Preis ist der Endpreis. Eine Vorsteuerabsetzung durch den Auftraggeber ist nicht möglich.

**Verzug:**
Bei Zahlungsverzug werden Verzugszinsen in Höhe von 5 Prozentpunkten über dem Basiszinssatz gemäß §288 BGB berechnet.

**Drittkosten:**
API-Kosten, die den im Retainer enthaltenen Rahmen übersteigen, werden at-cost weiterberechnet (z.B. Mistral API bei mehr als 10.000 Anfragen/Monat, IS24 API-Gebühren falls IS24 diese erhebt).

**Projektstart:**
Erfolgt erst nach Zahlungseingang der Anzahlung und nach Erhalt der benötigten Kundeninputs (siehe Anlage A).

---

## 4. PROJEKTLAUFZEIT

**Standard-Timeline:** 5–7 Wochen ab Projektstart

**Typischer Ablauf:**

| Phase | Wochen | Inhalt |
|---|---|---|
| Onboarding & Setup | Woche 1 | Client Inputs, IS24 OAuth, Outlook-Verbindung, Supabase |
| Core Build | Woche 2–4 | n8n Workflows, Landing Pages, Dashboard Grundstruktur |
| Testing & Iteration | Woche 5 | End-to-End Tests, Fehlerbehebung, Anpassungen |
| Go-Live & Übergabe | Woche 6–7 | Deployment, Einweisung, IS24 live schalten |

**Verzögerungen:**
Fehlende Inputs, ausstehende Freigaben (IS24 OAuth, Outlook-Anbindung) oder verspätete Rückmeldungen des Auftraggebers verschieben die Timeline entsprechend. Der Auftraggeber hat 3 Werktage Zeit für Feedback auf Zwischenstände.

---

## 5. KUNDENINPUTS UND STARTBEDINGUNGEN

Der Auftraggeber stellt innerhalb 3 Werktagen nach Anzahlung zur Verfügung (vollständige Liste: Anlage A — Client Input Formular):

- ImmoScout24 Account-Zugang (für OAuth-Autorisierung, einmalig)
- Microsoft Outlook Kalender-Zugang (für Kalender-Integration)
- Email-Adressen aller Dashboard-Nutzer
- Selbstauskunft-KPIs (Einkommensfaktor, Pflichtkriterien)
- Buchungsfenster-Präferenzen (Zeiten, Dauer, Kapazität)
- Freigabe der Nachrichtenvorlagen (Bestätigung, Absage, Zusage)
- Absender-E-Mail-Adresse für ausgehende Nachrichten

Projektstart erfolgt erst nach vollständigem Input. Fehlende Inputs verschieben die Timeline.

---

## 6. HOSTING, BETRIEB UND VERFÜGBARKEIT

### 6.1 Infrastruktur

| Dienst | Anbieter | Region | Zweck |
|---|---|---|---|
| Workflows | n8n (selbst-gehostet) | Hetzner, Nürnberg DE | Automatisierung |
| Datenbank | Supabase | Frankfurt, EU | Datenspeicherung |
| Landing Pages | Vercel | EU Edge | Öffentliche Formulare |
| Dashboard | Vercel | EU Edge | Internes Tool |
| KI-Analyse | Mistral AI | Paris, EU | Selbstauskunft-Bewertung |

### 6.2 Verfügbarkeit

Angestrebte Verfügbarkeit: 99% (monatlich, außerhalb geplanter Wartungsfenster).

### 6.3 Support im Retainer

- Werktags (Mo–Fr, 9–18 Uhr): Erste Antwort 4h, Fehlerbehebung 24h
- Wochenende: Erste Antwort 24h, Fehlerbehebung 48h
- Kritischer Ausfall (System komplett nicht erreichbar): Erste Antwort 2h

### 6.4 Leistungen nach Retainer-Kündigung

Nach Kündigung des Retainers werden alle Zugangsdaten und Quellcodes übergeben. Technische Änderungen werden nach Aufwand berechnet: €100/h.

---

## 7. DATENSCHUTZ UND AUFTRAGSVERARBEITUNG

Der Auftragnehmer verarbeitet im Rahmen dieses Vertrags personenbezogene Daten von Miet- und Kaufinteressenten (Name, Kontaktdaten, Einkommens- und Beschäftigungsdaten) im Auftrag des Auftraggebers.

**Der Auftraggeber ist Verantwortlicher (Controller) im Sinne der DSGVO.**
**Der Auftragnehmer ist Auftragsverarbeiter (Processor).**

Die Parteien schließen gleichzeitig eine **Auftragsverarbeitungsvereinbarung (AVV)** ab (Anlage B), die regelt:
- Art, Umfang und Zweck der Verarbeitung
- Kategorien personenbezogener Daten
- Technische und organisatorische Maßnahmen (TOMs)
- Unterauftragsverarbeiter (Supabase, Vercel, Mistral, Hetzner, Microsoft)
- Löschung und Rückgabe nach Vertragsende

**Auto-Delete:**
Abgelehnte Bewerber-Daten werden nach 30 Tagen automatisch gelöscht. Dies ist technisch im System implementiert und wird vom Auftraggeber durch Unterzeichnung dieses Vertrags angeordnet.

---

## 8. KOMMUNIKATION UND FREIGABEN

**Kommunikationskanäle:** E-Mail, Telefon, WhatsApp

**Freigaben:** Per E-Mail (schriftlich). Mündliche Absprachen werden per E-Mail zusammengefasst.

**Feedback-Fenster:** 3 Werktage für Rückmeldung auf Zwischenstände oder Revisionen.

---

## 9. CHANGE REQUESTS

Ein Change Request ist erforderlich für:
- Zusätzliche Use Cases (UC1, UC3, UC4)
- Zusätzliche Plattform-Integrationen (Immowelt, weitere)
- Änderungen am Datenbankschema nach Go-Live
- Neue Dashboard-Funktionen außerhalb des Leistungsumfangs
- Mehr als 1 Revision pro Lieferabschnitt

Change Requests werden erst nach schriftlicher Bestätigung von Preis, Scope und Timeline umgesetzt.

**Pricing Change Requests:**
- Kleinanpassungen (< 2h): €150 pauschal
- Feature-Additions: €100/h (min. 2h)
- Zusätzlicher Use Case: separates Angebot

---

## 10. NUTZUNGSRECHTE

Quellcodes, Workflows und alle erstellten Deliverables gehen nach vollständiger Zahlung aller offenen Forderungen auf den Auftraggeber über. Der Auftragnehmer behält das Recht zur anonymisierten Portfolio-Nutzung.

---

## 11. HAFTUNG UND VERANTWORTUNG

**Der Auftragnehmer übernimmt keine rechtliche Verantwortung für:**
- Die vom KI-System (Mistral) generierten Bewertungen. Alle Entscheidungen trifft ausschließlich ein menschlicher Mitarbeiter des Auftraggebers (Human-in-the-Loop).
- Die Richtigkeit der vom Auftraggeber bereitgestellten Inserate-Daten
- AGG-Konformität der Mieterauswahl (liegt in der Verantwortung des Auftraggebers)
- ImmoScout24 API-Verfügbarkeit oder Genehmigungsentscheidungen durch IS24

**Haftungsbeschränkung:**
Die Haftung des Auftragnehmers ist auf vorhersehbare, vertragstypische Schäden begrenzt und beträgt maximal die Höhe der Setup-Vergütung (€5.000). Eine weitergehende Haftung ist ausgeschlossen, soweit gesetzlich zulässig.

---

## 12. VERTRAGSBEENDIGUNG

**Ordentliche Kündigung Retainer:** Mit 4 Wochen Frist zum Monatsende, frühestens nach 3 Monaten.

**Kündigung Setup-Phase:**
Bei vorzeitigem Abbruch durch den Auftraggeber sind bereits erbrachte Leistungen anteilig zu vergüten. Die Anzahlung wird nur insoweit erstattet, als noch keine entsprechende Leistung erbracht wurde.

**Bei Zahlungsverzug:**
- Nach 14 Tagen Verzug: System wird auf Wartungsmodus gesetzt
- Nach 30 Tagen Verzug: Auftragnehmer kann Vertrag kündigen

---

## 13. SCHLUSSBESTIMMUNGEN

**Änderungen:** In Textform (E-Mail genügt).

**Salvatorische Klausel:** Unwirksame Klauseln berühren die übrigen nicht.

**Gerichtsstand:** Koblenz.

**Anwendbares Recht:** Recht der Bundesrepublik Deutschland.

---

## ANLAGE A — CLIENT INPUT FORMULAR

Siehe separates Dokument: `CLIENT_INPUT_FORMULAR_HALLER.md`

## ANLAGE B — AUFTRAGSVERARBEITUNGSVEREINBARUNG (AVV)

Siehe separates Dokument: `AVV_HALLER.md`

---

## UNTERSCHRIFTEN

**Ort, Datum:** ______________________________

**Für den Auftraggeber (Haller Immobilienberatung GmbH):**

Name: ______________________________

Funktion: ______________________________

Unterschrift: ______________________________

**Für Ritz AI Solutions:**

Name: Kevin Ritz

Unterschrift: ______________________________

---

*RAIS – Ritz AI Solutions · Von-Cohausenstraße 9 · 56076 Koblenz*
*kevin@ritz-ai.solutions · 0151 29755134 · Steuernummer: 22/139/34062*
