# DNS Cutover Plan — graewe.com

## Overview

Migrate DNS from the current TYPO3-based hosting to Azure Static Web Apps with zero downtime for visitors.

## Pre-Cutover Checklist

- [ ] Azure Static Web App is deployed and accessible via its default `*.azurestaticapps.net` hostname
- [ ] All pages verified on the staging URL
- [ ] SSL/TLS is working on the default hostname
- [ ] Terraform has been applied with `custom_domain` and `apex_domain` variables set
- [ ] 301 redirects for old TYPO3 URL patterns are configured (see below)
- [ ] TTL on current DNS records has been lowered to 300s (5 minutes) at least 48 hours before cutover

## DNS Records to Create

### Option A: www.graewe.com as primary (recommended)

| Type  | Name  | Value                                          | TTL  |
|-------|-------|-------------------------------------------------|------|
| CNAME | www   | `lively-meadow-097c4d503.7.azurestaticapps.net` | 3600 |
| A     | @     | Azure SWA IP (from portal after domain verify)  | 3600 |
| TXT   | @     | Validation token (provided by Azure)            | 3600 |

### Option B: If DNS provider doesn't support ALIAS/ANAME for apex

| Type    | Name  | Value                                          | TTL  |
|---------|-------|-------------------------------------------------|------|
| CNAME   | www   | `lively-meadow-097c4d503.7.azurestaticapps.net` | 3600 |
| 301     | @     | Redirect `graewe.com` → `www.graewe.com`        | —    |

Many DNS providers (Cloudflare, Azure DNS, etc.) support ALIAS/ANAME records for apex domains. Use that if available.

## Post-Cutover

1. Verify `https://www.graewe.com` loads correctly
2. Verify `https://graewe.com` redirects to `https://www.graewe.com`
3. Verify old TYPO3 URLs redirect properly (see below)
4. Increase TTL back to 3600 or 86400
5. Monitor for 404s in Azure portal for 1 week

## URL strategy (ISSUE-005)

**Canonical URLs use German path segments for every locale**, e.g. `/en/unternehmen/wer-ist-graewe`, `/fr/produkte/rohrextrusion`.

Old translated bookmarks (`/en/company/who-is-graewe`, `/fr/entreprise/qui-est-graewe`, …) **301** to those canonical routes. We do **not** restore localized pathnames in `next-intl`.

Source of truth for the redirect matrix:

- `src/lib/legacyRedirects.ts` — path map + news/job query resolution
- `src/proxy.ts` — applies **all** 301s at request time (incl. `.html` and query URLs)
- `staticwebapp.config.json` — security headers only (Azure rejects configs over **20 KB**, so the path matrix cannot be duplicated there)

## 301 Redirect matrix (summary)

Full path list is generated (>400 routes). Representative rows:

### Unprefixed DE hubs (with or without `.html`)

| Old URL | New URL |
|---|---|
| `/unternehmen/wer-ist-graewe.html` | `/de/unternehmen/wer-ist-graewe` |
| `/produkte/rohrextrusion` | `/de/produkte/rohrextrusion` |
| `/produkte/rohrextrusion/kalibier-und-kuehlbaeder` (typo) | `/de/produkte/rohrextrusion/kalibrier-und-kuehlbaeder` |
| `/kontakt.html` | `/de/kontakt` |
| `/index.php` | `/de` |
| `/sitemap` | `/de/sitemap` |
| `/cookies` | `/de/cookies` |

### EN / RU / ES (translated → German slugs)

| Old URL | New URL |
|---|---|
| `/en/company/who-is-graewe` | `/en/unternehmen/wer-ist-graewe` |
| `/en/products/pipe-extrusion/fully-automatic-coilers` | `/en/produkte/rohrextrusion/vollautomatische-wickler` |
| `/en/job-advertisements` | `/en/stellenanzeigen` |
| `/en/product-calculator` | `/en/produktrechner` |
| `/en/news` | `/en/aktuelles` |
| `/en/contact` | `/en/kontakt` |
| `/en/data-privacy` | `/en/datenschutz` |
| `/ru/...` / `/es/...` | Same mapping pattern as EN |

### FR

| Old URL | New URL |
|---|---|
| `/fr/entreprise/qui-est-graewe` | `/fr/unternehmen/wer-ist-graewe` |
| `/fr/produits/extrusion-de-tubes/...` | `/fr/produkte/rohrextrusion/...` |
| `/fr/calculateur` | `/fr/produktrechner` |
| `/fr/offres-demploi` | `/fr/stellenanzeigen` |
| `/fr/vos-informations-personelles` | `/fr/datenschutz` |

### Query-string detail URLs (middleware / App Router)

| Old URL Pattern | New URL |
|---|---|
| `/aktuelles/news-detailansicht?tx_news_pi1[news]=22` | `/de/aktuelles/kalibriertische-profilextrusion` |
| `/en/news/news-detail?tx_news_pi1[news]=ID` | `/en/aktuelles/{slug}` |
| `/fr/nouveautes/nouveautes-detail?tx_news_pi1[news]=ID` | `/fr/aktuelles/{slug}` |
| `/stellenanzeigen/stellendetails?tx_tanjoboffers_jobdetail[job]=9` | `/de/stellenanzeigen/elektriker-elektroniker` |
| `/en/job-advertisements/job-details?tx_tanjoboffers_jobdetail[job]=ID` | `/en/stellenanzeigen/{slug}` |

News ID map: see `src/lib/news.ts` (`NEWS_LEGACY_IDS`).

Job ID map: see `src/lib/jobs.ts` (`JOB_LEGACY_IDS`).

## 404 behaviour

Unknown paths return a real **404** page (`src/app/not-found.tsx` / `src/app/[locale]/not-found.tsx`).  
Do **not** rewrite 404 → `/de` in `staticwebapp.config.json` (that masked broken links).
