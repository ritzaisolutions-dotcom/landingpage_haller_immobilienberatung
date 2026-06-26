# Monatliche Kostenkalkulation — RAIS × Haller
## Basis: 100 Anfragen/Tag = 3.000 Anfragen/Monat

---

## Annahmen

| Metrik | Wert | Begründung |
|---|---|---|
| Eingehende Anfragen | 3.000/Monat | 100/Tag |
| Weiterführung nach Besichtigung | ~30% | 900 Selbstauskünfte/Monat |
| Endgültige Zusagen | ~5% | 150 Mieter/Monat |
| Durchschnittliche Token-Länge | 400 Input / 200 Output | Pro Mistral-Call |

---

## Detailkalkulation

### 1. Mistral AI

**WF1 — Intent Check (alle 3.000 Anfragen/Monat):**
```
Input:  3.000 × 400 Tokens = 1.200.000 Tokens × $0,20/1M = $0,24
Output: 3.000 × 150 Tokens =   450.000 Tokens × $0,60/1M = $0,27
WF1 gesamt: $0,51/Monat
```

**WF4 — Selbstauskunft-Analyse (900 Selbstauskünfte/Monat):**
```
Input:  900 × 600 Tokens = 540.000 Tokens × $0,20/1M = $0,11
Output: 900 × 400 Tokens = 360.000 Tokens × $0,60/1M = $0,22
WF4 gesamt: $0,33/Monat
```

**Mistral gesamt: ~$1/Monat ≈ €1/Monat**

> Selbst bei 1.000 Anfragen/Tag (10x) wären es nur ~€10/Monat

---

### 2. Supabase

**Free Tier Limits:**
- 500MB Datenbank (3.000 Leads/Monat → ~30MB/Monat → nach ~16 Monaten voll)
- Aber: Kein tägliches Backup, kein Email-Support

**→ Empfehlung: Supabase Pro von Anfang an**

```
Supabase Pro:   $25/Monat
Enthält:
  - 8GB Datenbank
  - 100GB Storage (für Fotos)
  - Tägliche Backups (DSGVO-relevant!)
  - Point-in-Time Recovery
  - Priority Support
```

**Supabase: ~€23/Monat**

---

### 3. Hetzner Cloud VPS (n8n)

**Empfehlung CX21:**
```
2 vCPU, 4GB RAM, 40GB SSD
Preis: €5,83/Monat

Für 100 Anfragen/Tag:
  - n8n verarbeitet ~4 Anfragen/Stunde
  - RAM-Auslastung: ~800MB (von 4GB)
  - CPU: < 10% durchschnittlich
  → CX21 reicht komfortabel
```

**Ab 500+ Anfragen/Tag: CX31 (4 vCPU, 8GB RAM) für €11,14/Monat**

**Hetzner: €5,83/Monat**

---

### 4. Vercel (Landing Pages + Dashboard)

```
Free Tier:
  - 100GB Bandwidth/Monat
  - 100 Anfragen/Tag × 2 Pages × 50KB = ~9GB/Monat
  → Free Tier reicht locker

Pro: $20/Monat (erst ab ~500 Anfragen/Tag nötig)
```

**Vercel: €0/Monat**

---

### 5. Domains & SSL

```
n8n Domain (ritz-ai.solutions): bereits vorhanden, €0/Monat
SSL (Let's Encrypt): kostenlos, €0/Monat
```

**Domains: €0/Monat**

---

### 6. Microsoft Outlook / Graph API

```
Microsoft Graph API: kostenlos
Haller nutzt Microsoft 365: eigene Lizenz, RAIS zahlt nichts
```

**Outlook: €0/Monat**

---

## Gesamtübersicht

| Posten | Monatlich | Jährlich |
|---|---|---|
| Mistral AI | €1,00 | €12,00 |
| Supabase Pro | €23,00 | €276,00 |
| Hetzner VPS CX21 | €5,83 | €69,96 |
| Vercel | €0,00 | €0,00 |
| Outlook/Graph API | €0,00 | €0,00 |
| Domains | €0,00 | €0,00 |
| **GESAMT KOSTEN** | **€29,83** | **€357,96** |

---

## Marge-Berechnung

```
Retainer Einnahmen:    €250,00/Monat
Infrastrukturkosten:   €29,83/Monat
─────────────────────────────────────
Rohertrag:             €220,17/Monat
Rohmarge:              88%

Eigene Arbeitszeit (Wartung ~1h/Monat à €100):
  Marge nach Arbeitszeit: €120,17/Monat
  Nettomarge: 48%
```

**Der Retainer ist profitabel ab dem ersten Monat.**

---

## Skalierungs-Szenarien

| Anfragen/Tag | Mistral | Supabase | Hetzner | Gesamt |
|---|---|---|---|---|
| 100/Tag (aktuell) | €1 | €23 | €6 | **€30** |
| 500/Tag | €5 | €23 | €11 | **€39** |
| 1.000/Tag | €10 | €25 | €11 | **€46** |
| 5.000/Tag | €50 | €50 | €22 | **€122** |

→ Selbst bei 5.000 Anfragen/Tag liegt die Marge noch bei über 50%.

---

## Empfehlung für Haller-Angebot

Der Retainer von **€250/Monat** ist bei 100 Anfragen/Tag klar profitabel.
Die Infrastrukturkosten werden durch den Retainer mehr als gedeckt.

**Für das Angebot:** Drittkosten sind im Retainer enthalten bis 500 Anfragen/Tag.
Darüber hinaus werden Mehrkosten at-cost weitergegeben (realistisch nie relevant bei einer Hausverwaltung).

