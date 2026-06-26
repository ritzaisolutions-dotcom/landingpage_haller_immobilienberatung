# GOAL.md — Immobilienverwaltung Haller Andernach

## Projektziel

Aufbau eines AI-gestützten Automatisierungs-Systems für die Immobilienverwaltung Haller in Andernach. Ziel ist es, repetitive, manuelle Prozesse in der Hausverwaltung durch intelligente n8n-Workflows zu ersetzen — mit Human-in-the-Loop (HITL) als Sicherheitsnetz und Mistral (Pay-as-you-go API) als LLM-Backbone.

Der Kontakt wurde über den Sohn der Geschäftsführung hergestellt. Er kennt die Prozesse genau und ist technisch versiert. Die drei (bzw. vier) Use Cases wurden in einer gemeinsamen Analyse erarbeitet und auf operative Umsetzbarkeit geprüft.

---

## Use Cases (Priorisiert)

### UC3 — Mahnwesen mit One-Click Release ⭐ Stärkster Pitch

**Ziel:** Automatische Erkennung von Mietrückständen und One-Click-Freigabe einer vorgefertigten Mahnung durch den Mitarbeiter — kein manuelles Schreiben, kein Vergessen.

**Stack:**
- Immoware24 als Datenbasis (Mietrückstände werden nativ getrackt)
- Finapi (AIS-Anbieter) für Bankkonten-Monitoring — "Access for own use" (eigene Konten der HV, keine PSD2-Lizenz nötig)
- n8n: täglicher Poll, Abgleich gegen Sollmieten-Liste in Supabase
- Mistral API: generiert vollständig befüllten Mahnentwurf (Name, Betrag, Datum, Objekt)
- HITL: Mitarbeiter erhält WhatsApp-Alert oder UI-Queue → klickt "Senden" → Mahnung geht raus
- Mahnstufen 1–3 in Supabase hinterlegt

**Offene Fragen beim Call klären:**
- Ist das Mietkonto bereits in Immoware24 verknüpft (Online-Banking-Modul)?
- Wenn ja → Immoware24 CSV/Export als Trigger möglich, Finapi ggf. nicht nötig
- Nutzt ihr das Mahnwesen in Immoware24 aktiv oder manuell?
- Wer ist aktuell zuständig? Wie lange dauert eine Mahnung von Erkennung bis Versand?

**Rechtliches:**
- Pflichtangaben Mahnung: Name + Adresse beider Parteien, Forderungsbenennung, offener Betrag, neues Zahlungsziel (7–14 Tage), Kontonummer
- Kevin baut Template + Automation. Hausverwaltung ist rechtlich verantwortlich für Inhalt. Keine Mahnung geht ohne explizite Freigabe raus.
- §556b BGB: Miete fällig zum 3. Werktag → ab 4. Werktag automatisch in Verzug

---

### UC1 — ImmoScout Anfragen-Qualifikation + Besichtigungsslots

**Ziel:** Eingehende ImmoScout-Anfragen automatisch bearbeiten, Leads qualifizieren (Datenvollständigkeit prüfen), Besichtigungstermine koordinieren — mit HITL-UI für den Mitarbeiter.

**Stack:**
- n8n IMAP-Trigger auf Postfach der Hausverwaltung
- Mistral: prüft ausschließlich Datenvollständigkeit (Einkommensnachweis vorhanden? Personalausweis vorhanden?) — KEIN inhaltliches Urteil über Personen (AGG-sicher)
- Fehlende Daten → Mistral generiert personalisierte Nachfrage-Email mit Variablen (Name, fehlende Unterlagen)
- **Email-Threading-Lösung:** Tally/Typeform-Formular mit ref={lead-uuid} im Link → Leads laden Dokumente strukturiert hoch → kein Email-Chaos
- Supabase: Lead-Datensätze + Besichtigungsslots (Adresse, Datum, Uhrzeit, Kapazität)
- HITL-UI (Vercel, React): Tab 1 = Eingehende Anfragen mit GO / NO-GO / Nachfrage-Aktion; Tab 2 = Inserate anlegen + Besichtigungsslots verwalten
- 2h vor Besichtigung: internes Summary per Email/WhatsApp (Name des Leads, Slot, Qualifikationsstatus)

**Offene Fragen:**
- Wie viele Objekte aktuell in Neuvermietung? (≤3 → Calendly reicht; ≥10 → Supabase-UI nötig)
- Nutzen sie das Interessenten-Modul in Immoware24? Wenn ja → Import statt parallele UI
- Kommt Einkommensnachweis-Abfrage per Email-Reply oder soll Formular-Link verschickt werden?

**Bruchstellen gelöst:**
- Email-Threading via Formular-Link (nicht Email-Ping-Pong)
- AGG: LLM urteilt nie über Person, nur über Vollständigkeit der Unterlagen
- HITL: Keine automatische Absage ohne menschliche Freigabe

---

### UC2 — Internal AI Agent (Intent GPT / Wissensdatenbank)

**Ziel:** AI-Agent der auf internen Daten der Hausverwaltung zugreift — Immoware24-Einträge, OneDrive-Dokumente (Mietverträge, Protokolle, Objekte) — und Mitarbeitern erlaubt, per natürlicher Sprache zu suchen und Informationen abzurufen.

**Stack (Phase 1 — OneDrive first):**
- Microsoft Graph API (pull-only, Webhook bei neuen Dateien)
- n8n: pollt täglich neue/geänderte Dokumente aus definierten OneDrive-Ordnern
- Mistral API (Pay-as-you-go): Embeddings + Chat (kein OpenAI nötig)
- Supabase pgvector: Vektordatenbank für Embeddings
- Chat-Interface für Mitarbeiter (einfaches Web-Frontend oder Teams-Integration)

**Stack (Phase 2 — Immoware24):**
- Immoware24 CSV-Export als zusätzliche Quelle (manuelle Ablage in OneDrive-Ordner oder direkte Pipeline wenn Export-API verfügbar)

**Deployment-Entscheidung beim Call:**
- Microsoft 365 vorhanden? → Teams-Bot oder Sharepoint-Einbettung
- Google Workspace? → Google Chat Bot oder Custom Web-App

**DSGVO:**
- Mietverträge und Protokolle enthalten personenbezogene Daten
- AV-Vertrag mit Mistral API erforderlich (oder self-hosted Ollama auf VPS für maximale Datensicherheit)
- Empfehlung Phase 1: Mistral API + AV-Vertrag; Phase 2: Prüfung Self-Hosted

**Pitch-Strategie:** Low-Hanging Fruit — schnell zu implementieren (wenige Tage sobald OneDrive-Verbindung steht). Wird als erster Quick-Win gezeigt, nicht als Hauptpitch.

---

## Technischer Gesamtstack

| Komponente | Tool | Begründung |
|---|---|---|
| Automation/Workflow | n8n (self-hosted) | Flexibel, kein per-Task-Pricing |
| LLM | Mistral API (Pay-as-you-go) | EU-Server, DSGVO-konform, kein Vendor-Lock |
| Datenbank | Supabase (Postgres + pgvector) | SQL + Vektorsuche in einem |
| Frontend/HITL-UI | Vercel + React/Next.js | Schnelles Deployment |
| Bank-Monitoring | Finapi (bei Bedarf) | AIS-lizenziert, PSD2-konform |
| Dokument-Quelle | OneDrive (Microsoft Graph API) | Pull-only, sauber dokumentiert |
| Immobiliensoftware | Immoware24 | Bereits im Einsatz beim Kunden |
| Benachrichtigung | WhatsApp Business API | Human-in-the-Loop Approvals |

---

## Pitch-Reihenfolge im Sales Call

1. **UC3 Mahnwesen** — Konkreter Schmerz, klarer ROI, klares Bild: "Mitarbeiter bekommt WhatsApp, klickt einmal, Mahnung ist draußen."
2. **UC2 Internal GPT** — Quick Win, in wenigen Tagen deploybar sobald OneDrive-Zugang besteht
3. **UC1 ImmoScout** — Wenn sie aktiv Neuvermietungen machen und die Anfragelast spürbar ist

**Der Einstieg:**
> "Welche Aufgaben machen eure Mitarbeiter jeden Monat, die sich anfühlen, als würde man dieselbe Sache immer wieder tippen?"

---

## Kritische Fragen für den Sales Call (Priorisiert)

1. Ist das Mietkonto in Immoware24 verknüpft (Online-Banking-Modul aktiv)?
2. Welche Bank nutzt ihr für das Mietkonto?
3. Schickt Immoware24 automatisch eine Benachrichtigung wenn Miete überfällig ist — oder schaut ihr manuell nach?
4. Wie läuft das Mahnwesen aktuell ab — wer, wie oft, wie lange?
5. Nutzt ihr Microsoft 365 oder Google Workspace?
6. Wie viele Objekte habt ihr aktuell in der Neuvermietung?
7. Nutzt ihr das Interessenten-Modul in Immoware24?
8. Speichert ihr Dokumente in OneDrive/SharePoint oder nur in Immoware24?

---

## Nächste Schritte nach dem Call

- [ ] Antworten auf kritische Fragen dokumentieren
- [ ] Entscheidung: Finapi nötig oder Immoware24-Export ausreichend für UC3?
- [ ] Entscheidung: Microsoft 365 oder Google Workspace für UC2 Deployment
- [ ] Demo UC2 (Internal GPT) als ersten Quick-Win bauen
- [ ] HITL-UI Mockup für UC3 + UC1 zeigen (Approval Queue)
- [ ] Angebot ausarbeiten: Aufbau + monatlicher Retainer (inkl. Mistral API-Kosten)

---

*Erstellt: Juni 2026 | Projekt: Kevin Ritz / AI Automation | Kunde: Immobilienverwaltung Haller, Andernach*
