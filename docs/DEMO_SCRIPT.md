# UC1 Lead-Landingpage — Live-Demo-Skript

**Zielgruppe:** Thomas Haller · **Dauer:** ca. 8–10 Minuten  
**Produkt-URL:** `https://landingpage-haller-immobilienberatu.vercel.app/upload`

---

## Sprechtext (IS24)

> „Die ImmoScout24-API-Genehmigung läuft noch — das dauert typischerweise 5–10 Werktage. Das System steht aber schon: Sobald IS24 freigibt, gehen die Anfragen automatisch rein. Heute zeige ich Ihnen den kompletten Flow mit einem Test-Lead.“

---

## Schritt 1 — n8n WF1 (manueller Webhook)

Test-Payload:

```json
{
  "name": "Max Mustermann",
  "inseratId": "IS24-48291",
  "message": "Guten Tag, ich interessiere mich für die Wohnung in der Mainzer Str. 12.",
  "datum": "2026-06-20T09:15:00Z"
}
```

**Sprechtext:** „WF1 legt den Lead in Supabase an — mit Name, Inserat, Nachricht — und generiert den personalisierten Link.“

---

## Schritt 2 — Supabase Table Editor

1. Dashboard → `leads` → Zeile **Max Mustermann**
2. Felder zeigen: `uuid`, `nachricht_text`, `landing_page_url`, Status `neu`
3. Link:

```
https://landingpage-haller-immobilienberatu.vercel.app/upload?t=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## Schritt 3 — Personalisierte Landingpage (Hero)

1. Link öffnen (Desktop oder Handy)
2. **Hero zeigen:**
   - „Guten Tag, Max!“ (Vorname aus Supabase-Metadaten)
   - Wechselnder Hintergrund (Wohnung / Haus)
   - Zitat der IS24-Nachricht (`nachricht_text`)
3. Darunter: Upload-Formular mit vorausgefülltem Namen
4. **Fallback:** `/upload?t=demo` → „Guten Tag, Anna!“

**Sprechtext:** „Jeder Interessent bekommt seine eigene Seite — kein Login, der Link ist die Authentifizierung, 72 Stunden gültig.“

---

## Schritt 4 — Upload & WF2-Trigger

1. E-Mail + Telefon + PDFs (Schufa + Entgelt)
2. DSGVO aktivieren → **Unterlagen sicher einreichen**
3. Erfolgsseite
4. Supabase Storage: `dokumente/{uuid}/schufa.pdf`
5. Optional: n8n WF2 Execution Log (`dokumente-eingereicht`)

**Sprechtext:** „Nach dem Upload startet WF2 automatisch — Mistral prüft nur die Vollständigkeit, kein inhaltliches Urteil.“

---

## Schritt 5 — HITL-E-Mail (Preview)

`visuals/hitl-email-preview.html` als Tab/Screenshot

---

## Checkliste vor dem Call

- [ ] Vercel Env: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Seed-Lead Max Mustermann in Supabase
- [ ] Test-PDFs bereit
- [ ] Hero + Formular unter `/upload?t=demo` getestet
- [ ] `hitl-email-preview.html` vorbereitet

---

## Schnelllinks

| Was | URL |
|---|---|
| Live (Token) | `/upload?t={uuid}` |
| Demo | `/upload?t=demo` |
| RAIS Pitch | `/` |
| Haller Website | `/website` |
