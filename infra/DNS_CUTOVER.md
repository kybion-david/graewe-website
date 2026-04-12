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
| CNAME | www   | `swa-graewe-website-prod.azurestaticapps.net`   | 3600 |
| A     | @     | Azure SWA IP (from portal after domain verify)  | 3600 |
| TXT   | @     | Validation token (provided by Azure)            | 3600 |

### Option B: If DNS provider doesn't support ALIAS/ANAME for apex

| Type    | Name  | Value                                          | TTL  |
|---------|-------|-------------------------------------------------|------|
| CNAME   | www   | `swa-graewe-website-prod.azurestaticapps.net`   | 3600 |
| 301     | @     | Redirect `graewe.com` → `www.graewe.com`        | —    |

Many DNS providers (Cloudflare, Azure DNS, etc.) support ALIAS/ANAME records for apex domains. Use that if available.

## Post-Cutover

1. Verify `https://www.graewe.com` loads correctly
2. Verify `https://graewe.com` redirects to `https://www.graewe.com`
3. Verify old TYPO3 URLs redirect properly (see below)
4. Increase TTL back to 3600 or 86400
5. Monitor for 404s in Azure portal for 1 week

## 301 Redirects from Old TYPO3 URLs

The old TYPO3 site uses query-parameter-based URLs. These need 301 redirects to the new clean URLs. Configure these in `staticwebapp.config.json`.

### Known URL Patterns

| Old URL Pattern | New URL |
|---|---|
| `/unternehmen/wer-ist-graewe.html` | `/de/unternehmen/wer-ist-graewe` |
| `/unternehmen/was-macht-graewe.html` | `/de/unternehmen/was-macht-graewe` |
| `/unternehmen/wofuer-steht-graewe.html` | `/de/unternehmen/wofuer-steht-graewe` |
| `/unternehmen/die-graewe-gruppe.html` | `/de/unternehmen/die-graewe-gruppe` |
| `/produkte/rohrextrusion.html` | `/de/produkte/rohrextrusion` |
| `/produkte/profilextrusion.html` | `/de/produkte/profilextrusion` |
| `/produkte/plattenextrusion.html` | `/de/produkte/plattenextrusion` |
| `/success-stories.html` | `/de/success-stories` |
| `/gebrauchtmaschinen.html` | `/de/gebrauchtmaschinen` |
| `/aktuelles.html` | `/de/aktuelles` |
| `/produktrechner.html` | `/de/produktrechner` |
| `/downloads.html` | `/de/downloads` |
| `/team.html` | `/de/team` |
| `/kontakt.html` | `/de/kontakt` |
| `/stellenanzeigen.html` | `/de/stellenanzeigen` |
| `/impressum.html` | `/de/impressum` |
| `/datenschutz.html` | `/de/datenschutz` |
| `/en/...` | `/en/...` (same paths, just drop `.html`) |

### TYPO3-specific redirects

| Old URL Pattern | New URL |
|---|---|
| `/?tx_news_pi1[news]=*` | `/de/aktuelles` |
| `/?id=*` | `/de` |
| `/index.php?id=*` | `/de` |
