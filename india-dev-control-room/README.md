# 🇮🇳 India Development Control Room

**Citizen-friendly development dashboard architecture** for India · Bihar · Patna.

> **Status of this package:** Production-ready **frontend shell + data contracts**.  
> All statistical values are intentionally **DEMO / empty**. No fabricated GDP, inflation, unemployment or other official numbers are shown as live data.

---

## What this is

A professional, responsive, bilingual (English + Hindi), light/dark-mode control-room style interface that implements the structure you requested:

- Location selector: India / Bihar / Patna  
- KPI cards with metadata slots (value, previous, period, updated, source)  
- Comparison table  
- 25 Development Areas  
- SmartArt-style development chain  
- Search  
- Indicator detail modal (definition + citizen explanation + source link)  
- Data Sources monitor table  
- Clear DEMO labelling  
- Accessibility basics and responsive layout  

---

## What this is NOT (yet)

A fully live, server-connected production system with:

- PostgreSQL + Redis  
- Scheduled refresh jobs  
- Admin panel with role-based access  
- Live calls to MoSPI / data.gov.in / Bihar DES without API keys  

Those layers must be built on a proper backend once official API access is obtained.

---

## Recommended production architecture

```
Frontend (this UI or Next.js rewrite)
        ↓
REST / GraphQL API layer (FastAPI or Node)
        ↓
Cache (Redis) + Database (PostgreSQL)
        ↓
Scheduled jobs (Celery / cron / GitHub Actions)
        ↓
Official sources (priority order):
  1. MoSPI eSankhyiki / CPI API / NAS
  2. data.gov.in (API key required)
  3. RBI, NITI Aayog NDAP
  4. Government of Bihar e-Statistics / DES
  5. Census of India, NFHS, UDISE+, PLFS
```

### Official entry points (verify current terms)

| Source              | Portal / Notes                                      |
|---------------------|-----------------------------------------------------|
| MoSPI               | https://www.mospi.gov.in / https://esankhyiki.mospi.gov.in |
| CPI Warehouse       | https://cpi.mospi.gov.in                            |
| MoSPI Python client | `esankhyiki` (official NSO client)                  |
| data.gov.in         | https://www.data.gov.in (API key)                   |
| Bihar e-Statistics  | https://e-statistics.bihar.gov.in                   |
| Census              | https://censusindia.gov.in                          |

Never scrape pages that prohibit automated access. Prefer documented APIs or official downloadable series.

---

## Indicator data contract

Every indicator object must contain:

```js
{
  id, name: { en, hi },
  value, previous, change, unit,
  period, lastUpdated,
  source, sourceUrl, frequency, status,
  definition, citizenWhy
}
```

Display rules:

- Show “Latest official data unavailable” when value is missing  
- Always show reference period and last updated  
- Link to original source  
- Never mix DEMO and LIVE numbers on the same card  

---

## How to run this demo UI

Simply open `index.html` in a modern browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8080
```

No build step required for the demo.

---

## Next implementation steps (backend)

1. Register for data.gov.in API key and MoSPI CPI API access if required.  
2. Install and test `esankhyiki` Python client for PLFS, CPI, NAS, IIP.  
3. Create PostgreSQL schema for `indicators`, `observations`, `sources`, `audit_log`.  
4. Write scheduled jobs that pull only official series and store with full metadata.  
5. Expose a public read-only REST API.  
6. Point this frontend (or a Next.js version) at the API.  
7. Add admin authentication (never expose write endpoints publicly).  
8. Implement validation alerts for unexpected jumps / unit changes.  

---

## Design principles followed

- Accuracy over decoration  
- Citizen language + definitions  
- Neutral ↑/↓ (no automatic green/red for every rise)  
- Clear DEMO vs LIVE separation  
- Responsive (mobile → desktop)  
- Light / Dark mode with preference memory  
- Bilingual UI  
- Source transparency  

---

## Licence & responsibility

This repository is a **citizen information architecture demo**.  
Users and deployers are responsible for complying with the terms of every official data source they connect and for never presenting non-official estimates as government statistics.
