# Client Inputs Required — Haller Immobilienberatung GmbH
## Alle benötigten Angaben für die Produktivsetzung

> **Für:** RAIS – Ritz AI Solutions  
> **Erstellt:** 25. Juni 2026  
> **Status:** ⏳ Offene Punkte vor Go-Live

---

## 1. ImmoScout24 API (KRITISCH — Blocker)

| Was | Wer | Status |
|---|---|---|
| IS24-Login von Haller für OAuth-Flow | Waldemar oder Thomas Haller | ⏳ Ausstehend |
| IS24 OAuth "Erlauben" einmalig klicken | Haller persönlich | ⏳ Nach Permission-Genehmigung |
| Immowelt API (falls gewünscht) | Separate Beantragung | 📋 Phase 2 |

**Was wir von Haller brauchen:**
> "Wir schicken Ihnen einen Link. Sie loggen sich mit Ihrem ImmoScout24-Konto ein und klicken auf 'Erlauben'. Das dauert 30 Sekunden und muss nur einmal gemacht werden."

---

## 2. Microsoft Outlook / Kalender

| Was | Wert | Status |
|---|---|---|
| Microsoft 365 Konto vorhanden? | ❓ Ja / Nein | ⏳ Klären |
| Welche Email-Konten sollen Kalender-Events bekommen? | Thomas Haller: ? | ⏳ Angabe nötig |
| Soll es ein geteilter Team-Kalender sein? | ❓ Ja / Nein | ⏳ Klären |
| Microsoft Admin muss App-Berechtigung genehmigen | IT-Verantwortlicher bei Haller | ⏳ Ausstehend |

**Was wir von Haller brauchen:**
- Email-Adressen aller Mitarbeiter die Kalender-Events bekommen sollen
- Bestätigung ob Microsoft 365 oder Google Workspace genutzt wird
- Falls MS365: Admin-Zugang für einmalige App-Genehmigung

---

## 3. Email-Versand (Absender für ausgehende Nachrichten)

| Was | Wert | Status |
|---|---|---|
| Absender-Email für Mietinteressenten | ❓ z.B. vermietung@haller-immobilien.de | ⏳ Angabe nötig |
| Email-Host/Provider von Haller | ❓ | ⏳ Klären |
| SMTP-Zugangsdaten oder Email-Weiterleitung | ❓ | ⏳ Nötig |
| Alternativ: Email läuft über RAIS Brevo | marco@ritz-ai.solutions (vorerst) | ✅ Verfügbar |

---

## 4. Dashboard-Zugänge (Mitarbeiter)

| Mitarbeiter | Email | Rolle | Status |
|---|---|---|---|
| Waldemar Haller | ❓ | Admin | ⏳ Angabe nötig |
| Thomas Haller | ❓ | Mitarbeiter | ⏳ Angabe nötig |
| Weitere? | ❓ | Mitarbeiter | ⏳ Klären |

**Was wir brauchen:** Vollständige Liste mit Email-Adressen aller Mitarbeiter die Zugang zum Dashboard bekommen sollen.

---

## 5. Selbstauskunft & Scoring KPIs

| Frage | Antwort von Haller | Status |
|---|---|---|
| Einkommensfaktor Mindestgrenze? (Standard: 3x Kaltmiete) | ❓ | ⏳ Klären |
| Ist unbefristetes Arbeitsverhältnis Pflicht? | ❓ Ja / Nein / Empfehlung | ⏳ Klären |
| Haustiere: automatisch ausschließen? | ❓ Ja / Nein / Je nach Objekt | ⏳ Klären |
| Haben Sie eine eigene Selbstauskunft-Vorlage? | ❓ Ja/Nein → bitte senden | ⏳ Klären |
| Welche KPIs beim Verkauf? (Eigenkapital ≥ X%) | ❓ | ⏳ Klären |

---

## 6. Buchungsfenster-Defaults

| Einstellung | Vorschlag RAIS | Haller-Wunsch | Status |
|---|---|---|---|
| Standard Besichtigungsdauer | 30 Minuten | ❓ | ⏳ Klären |
| Buchbar von / bis (Uhrzeit) | 09:00 – 17:00 | ❓ | ⏳ Klären |
| Buchbare Wochentage | Mo–Sa | ❓ | ⏳ Klären |
| Vorlaufzeit (min. X Stunden vorher buchbar) | 2 Stunden | ❓ | ⏳ Klären |
| Max. Personen pro Slot | 1 | ❓ | ⏳ Klären |

---

## 7. Nachrichten-Vorlagen (müssen von Haller freigegeben werden)

| Vorlage | Inhalt | Status |
|---|---|---|
| Erstantwort (LP1-Link) | "Guten Tag [Name], vielen Dank für Ihr Interesse..." | ⏳ Review nötig |
| LP1-Bestätigung | "Ihr Besichtigungstermin am [Datum] ist bestätigt..." | ⏳ Review nötig |
| LP2-Anforderung | "Vielen Dank für die Besichtigung. Bitte füllen Sie..." | ⏳ Review nötig |
| Freundliche Absage | "Vielen Dank für Ihr Interesse. Leider haben wir..." | ⏳ Review nötig |
| Zusage | "Wir freuen uns, Ihnen mitteilen zu können..." | ⏳ Review nötig |
| Rückfrage (zu wenig Info) | "Für welches Inserat interessieren Sie sich?" | ⏳ Review nötig |

---

## 8. Rechtliches (vor Go-Live Pflicht)

| Dokument | Status |
|---|---|
| AVV Haller ↔ RAIS | ⏳ Zu erstellen + unterzeichnen |
| Service Agreement Haller ↔ RAIS | ⏳ Zu erstellen + unterzeichnen |
| Datenschutzerklärung auf LP1 (von Haller freigegeben) | ⏳ Review nötig |
| Datenschutzerklärung auf LP2 (von Haller freigegeben) | ⏳ Review nötig |
| Impressum-Link auf beiden LPs | ✅ haller-immobilien.de/impressum |

---

## 9. Technische Zugangsdaten von Haller

| Was | Zweck | Status |
|---|---|---|
| ImmoScout24 Login (OAuth) | API-Autorisierung | ⏳ Bei Go-Live |
| Microsoft/Google Account (OAuth Kalender) | Kalender-Integration | ⏳ Klären |
| Haller Email SMTP (optional) | Absender-Email | ⏳ Optional |

---

## Übergabe-Checkliste (Go-Live)

- [ ] IS24 OAuth Flow abgeschlossen (Access Token erhalten)
- [ ] Outlook/Google Calendar verknüpft
- [ ] Alle Dashboard-Zugänge angelegt
- [ ] Alle Nachrichten-Vorlagen von Haller freigegeben
- [ ] AVV + Service Agreement unterzeichnet
- [ ] Datenschutzerklärungen auf LP1 + LP2 live
- [ ] Selbstauskunft-KPIs definiert
- [ ] Buchungsfenster initial konfiguriert
- [ ] Test-Durchlauf (Ende-zu-Ende) mit Thomas Haller

---

*RAIS – Ritz AI Solutions · Kevin Ritz · ritzaisolutions@gmail.com*
