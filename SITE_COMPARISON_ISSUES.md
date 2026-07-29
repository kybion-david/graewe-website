# GRAEWE Website — Gap Analysis & Fix Queue

Comparison of the **new rebuild** in this repository (`graewe-website`) against the **live site** being replaced: [https://www.graewe.com](https://www.graewe.com/).

Audited: 2026-07-28  
New site checked via local `npm run dev` (`http://localhost:3000`).  
Old site checked live on graewe.com.

---

## How other AIs should use this document

1. Pick the **next open item** by priority (`P0` → `P1` → `P2`), one item per session unless items are tightly coupled.
2. Read the item’s **Problem**, **Evidence**, **Likely files**, and **Acceptance criteria** before coding.
3. Prefer fixing against the live old site as the content/behavior source of truth, unless `PROJECT.md` explicitly decided otherwise.
4. When done, mark the item `Status: Done` and add a one-line note of what changed (files / approach).
5. Do **not** remove completed items; keep history for launch review.
6. If an item needs a business decision (e.g. keep German slugs vs restore translated EN/FR URLs), mark `Status: Blocked — needs decision` and stop.

**Legend**
- **P0** — Launch blocker / broken vs live site / SEO cutover risk
- **P1** — Important parity gap or clear bug
- **P2** — Polish, consistency, nice-to-have

**Categories:** `Missing feature` · `Content gap` · `Bug` · `SEO / redirects` · `i18n` · `UX` · `Legal / compliance`

---

## Summary scorecard

| Area | New site vs graewe.com |
|------|-------------------------|
| Route / page structure (DE) | Mostly present |
| Jobs (Stellenanzeigen) | Present (3 openings + detail pages) |
| News article bodies | Present (5 articles + images) |
| Homepage news teaser | Present (latest 3) |
| Product DE/EN copy | Mostly good |
| Product FR/RU/ES body | Falls back to German |
| Product images | Present (ISSUE-010 filled) |
| Calculator | Present (2 modes) |
| Contact form | Present; Turnstile + honeypot + rate limit |
| HTML Sitemap / Cookies pages | Present (essential-cookies notice; no banner) |
| Analytics | None at launch (documented; policy matches) |
| Multi-language **URL** parity | German slugs canonical; old translated paths **301** |
| Redirects for cutover | Path + news/job query redirects in place |
| Legal pages localized | All 5 locales (DE binding) |
| Social YouTube link | Fixed (Graewemachines) |

---

## P0 — Launch blockers

### ISSUE-001 — Active job openings missing
- **Status:** Done
- **Note:** Migrated 3 openings with listing + `/stellenanzeigen/[slug]` details, HR/apply copy in all 5 locales (`src/lib/jobs.ts` + `jobs.*` messages); TYPO3 `stellendetails?job=` IDs 9/8/42 permanently redirect. Applications are email-only (ISSUE-022).
- **Category:** Content gap / Missing feature
- **Problem:** Live site lists 3 open positions with detail pages and HR contact. New site only shows empty state: “Derzeit sind keine Stellenanzeigen verfügbar.”
- **Evidence (old):** https://www.graewe.com/stellenanzeigen  
  - Elektriker / Elektroniker (Industrieelektriker/in - Betriebstechnik)  
  - SPS-Programmierer (m/w/d)  
  - Konstrukteur Elektronik m/w/d  
  Detail URLs under `/stellenanzeigen/stellendetails?tx_tanjoboffers_jobdetail[...]`  
  Contact: Olga Waigel, `olga.waigel@graewe.com`; benefits copy; application instructions (PDF, salary expectation, online portal / email).
- **Evidence (new):** `src/app/[locale]/stellenanzeigen/page.tsx` — hardcoded empty state via `jobs.noJobs`.
- **Likely files:** `src/app/[locale]/stellenanzeigen/page.tsx`, new `src/lib/jobs.ts` or content JSON, `src/messages/*.json`, optional `/stellenanzeigen/[slug]/page.tsx`, redirects in `staticwebapp.config.json`.
- **Acceptance criteria:**
  - [x] DE page shows intro/benefits content comparable to live site.
  - [x] All three (or current) openings listed with working detail pages or in-page sections.
  - [x] HR contact and application instructions present.
  - [x] EN/FR/RU/ES at least show titles + how to apply (full translation preferred).
  - [x] Empty state only when there are truly zero jobs.

---

### ISSUE-002 — News articles are placeholders (bodies not migrated)
- **Status:** Done
- **Note:** Migrated 5 article bodies + images via `src/lib/news.ts` + `news.items` (all locales); DE/EN bodies from live site, FR/RU/ES (and untranslated EN) show German body with notice; TYPO3 `news-detailansicht?news=` IDs 22/24/27/28/40 redirect. Also fixed Jubiläum “40 Jahre” excerpt (ISSUE-014).
- **Category:** Content gap
- **Problem:** Aktuelles listing has 5 cards (title + excerpt), but every detail page ends with placeholder text (“Artikelinhalt folgt…”). Live site has full article pages (TYPO3 news IDs 22, 24, 27, 28, 40).
- **Evidence (new):** `src/app/[locale]/aktuelles/[slug]/page.tsx` renders `item.excerpt` + `t("articlePlaceholder")`. `src/content/news/` empty; `public/images/news/` empty.
- **Evidence (old):** https://www.graewe.com/aktuelles and `/aktuelles/news-detailansicht?tx_news_pi1[news]=…`
- **Slugs in rebuild:** `kalibriertische-profilextrusion`, `portfolio-erweiterung`, `bauboom-nachfrage`, `produktionshallen-erweitert`, `jubilaeum`
- **Likely files:** news page + MDX/JSON content under `src/content/news/` (as planned in `PROJECT.md`), `src/messages/*.json` (`news.items`), images under `public/images/news/`.
- **Acceptance criteria:**
  - [x] Each of the 5 articles has full body content migrated from graewe.com (DE minimum).
  - [x] Placeholder string removed when content exists.
  - [x] Article images migrated where present on old site.
  - [x] EN (and ideally FR/RU/ES) have usable content or a clear “available in German” notice — not fake placeholders.

---

### ISSUE-003 — Homepage news teaser always shows “no news”
- **Status:** Done
- **Note:** `NewsTeaser` now lists latest 3 via `getLatestNews()`; empty state only when `news.items` is empty.
- **Category:** Bug / Content gap
- **Problem:** Homepage middle column hardcodes empty state even though `/aktuelles` has 5 items. Live homepage shows news teasers when available.
- **Evidence (new):** `src/components/home/NewsTeaser.tsx` comment `{/* News placeholder */}` + `t("home.noNews")`.
- **Likely files:** `src/components/home/NewsTeaser.tsx`, shared news data helper.
- **Acceptance criteria:**
  - [x] Homepage lists latest N articles (title + excerpt + link).
  - [x] “Keine Nachrichten verfügbar” only when the news list is empty.
  - [x] Matches visual role of the old homepage news column reasonably.

---

### ISSUE-004 — Incomplete / wrong 301 redirect map for DNS cutover (SEO)
- **Status:** Done
- **Note:** Central map in `src/lib/legacyRedirects.ts`; applied via `src/proxy.ts` (path + news/job query 301s) and regenerated `staticwebapp.config.json` (path-only). `infra/DNS_CUTOVER.md` documents the matrix. Removed `responseOverrides.404 → /de`; added dedicated 404 pages. Typo slug `kalibier-und-kuehlbaeder` included (also closes ISSUE-030).
- **Category:** SEO / redirects
- **Problem:** `staticwebapp.config.json` only covers a subset of DE `.html` hub pages. Live site also uses:
  - Translated EN/FR/RU/ES paths (see ISSUE-005)
  - Product **subpage** URLs
  - TYPO3 news detail query URLs
  - Job detail query URLs
  - Typo slug `kalibier-und-kuehlbaeder` (missing “r”) on old DE
  - Clean paths without `.html`
- **Evidence:** `staticwebapp.config.json`, `infra/DNS_CUTOVER.md` (still claims `/en/...` paths stay the same — **incorrect** relative to rebuilt routes).
- **Likely files:** `staticwebapp.config.json`, `infra/DNS_CUTOVER.md`, possibly `next.config.ts` redirects for local/Azure.
- **Acceptance criteria:**
  - [x] Documented redirect matrix: old URL → new URL for DE + EN + FR + RU + ES hubs and all product subpages.
  - [x] News `tx_news_pi1[news]=ID` → matching `/de/aktuelles/{slug}` (and locale equivalents).
  - [x] Job detail query URLs → new job pages.
  - [x] Old typo `.../kalibier-und-kuehlbaeder` → `.../kalibrier-und-kuehlbaeder`.
  - [x] DNS cutover doc updated to match reality.
  - [x] 404 override does **not** silently rewrite unknown URLs to homepage in a way that hides broken links from monitoring (revisit `responseOverrides.404` → `/de`).

---

### ISSUE-005 — Non-DE locales lost translated URL structure
- **Status:** Done
- **Decision:** **(B)** Keep German slugs as canonical for all locales; comprehensive 301s from old translated EN/FR/RU/ES paths (see ISSUE-004 / `legacyRedirects.ts`). Language switcher already preserves the equivalent page because pathnames are shared across locales.
- **Category:** SEO / i18n / Missing feature
- **Problem:** Live site uses localized path segments. Rebuild uses **German slugs for all locales** (`/en/unternehmen/wer-ist-graewe`). Old English bookmarks/SEO URLs 404 on the new app (e.g. `/en/company/who-is-graewe` → 404 locally).
- **Evidence (old EN examples):**
  - `/en/company/who-is-graewe`
  - `/en/products/pipe-extrusion/fully-automatic-coilers`
  - `/en/job-advertisements`, `/en/product-calculator`, `/en/news`, `/en/sitemap`
- **Evidence (old FR examples):**
  - `/fr/entreprise/qui-est-graewe`
  - `/fr/produits/extrusion-de-tubes/...`
  - `/fr/offres-demploi`, `/fr/calculateur`
- **Evidence (RU/ES):** English-like segments under `/ru/...` and `/es/...` (company/products/…).
- **Decision needed:** Either (A) restore pathnames localization in `next-intl` routing, or (B) keep German slugs and add comprehensive 301s from every old localized path.
- **Likely files:** `src/i18n/routing.ts`, `src/i18n/navigation.ts`, all `Link` usages, `staticwebapp.config.json`.
- **Acceptance criteria:**
  - [x] Chosen approach documented in this item.
  - [x] Every major old EN/FR/RU/ES URL either still works or 301s to the canonical new URL.
  - [x] Language switcher preserves the equivalent page across locales.

---

### ISSUE-006 — Contact form missing captcha / spam protection
- **Status:** Done
- **Note:** Cloudflare Turnstile (site + server verify) with honeypot + per-IP rate limit; captcha errors localized in all 5 locales (`src/lib/contactSpam.ts`, ContactForm, API route). Configure `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` for production.
- **Category:** Missing feature / Legal / compliance
- **Problem:** Live contact form requires Captcha (`Captcha *`). New form has no captcha, honeypot, or rate limiting.
- **Evidence (old):** https://www.graewe.com/kontakt  
- **Evidence (new):** `src/components/contact/ContactForm.tsx`, `src/app/api/contact/route.ts`
- **Likely files:** ContactForm, API route, env example for captcha keys.
- **Acceptance criteria:**
  - [x] Spam protection comparable to live site (captcha **or** modern equivalent: Turnstile/hCaptcha + server verify).
  - [x] Failed verification returns clear error; no email send.
  - [x] Works in all locales.

---

### ISSUE-007 — YouTube footer link is broken (404)
- **Status:** Done
- **Note:** Footer YouTube → `https://www.youtube.com/user/Graewemachines/videos/` (200). Facebook aligned with live site → `https://www.facebook.com/GraeweExtrusion/`.
- **Category:** Bug
- **Problem:** Footer links to `https://www.youtube.com/channel/UCgraewe` which returns **404**. Live site uses `https://www.youtube.com/user/Graewemachines/videos/`.
- **Evidence (new):** `src/components/layout/Footer.tsx`
- **Evidence (old EN homepage):** `https://www.youtube.com/user/Graewemachines/videos/`
- **Acceptance criteria:**
  - [x] YouTube URL opens a valid GRAEWE channel/videos page.
  - [x] Facebook URL verified (old EN also references `facebook.com/GraeweExtrusion/` vs new `graewegmbh` — confirm correct official page).

---

## P1 — Important parity gaps & bugs

### ISSUE-008 — HTML Sitemap page missing
- **Status:** Done
- **Note:** Added `/[locale]/sitemap` listing company, product trees, service, and legal links; footer link; SWA redirects `/sitemap(.html)` → `/de/sitemap`.
- **Category:** Missing feature
- **Problem:** Live site has `/sitemap` (and `/en/sitemap`, etc.). New site has XML sitemap via `next-sitemap` but **no HTML sitemap route**. Footer i18n keys `footer.sitemap` / `legal.sitemap` exist but are unused; `/de/sitemap` → 404.
- **Evidence (old):** https://www.graewe.com/sitemap
- **Likely files:** new `src/app/[locale]/sitemap/page.tsx`, Footer legal links, redirects from old `/sitemap`.
- **Acceptance criteria:**
  - [x] HTML sitemap lists main sections + product trees.
  - [x] Linked from footer (and matches old “Sitemap” footer entry).
  - [x] Available in all locales.

---

### ISSUE-009 — Cookies / consent page & banner missing
- **Status:** Done
- **Note:** Chose essential-only approach: `/[locale]/cookies` page + footer link; Datenschutz §3 updated (no etracker); no consent banner. Launch analytics decision closed in ISSUE-023 (none).
- **Category:** Missing feature / Legal / compliance
- **Problem:** Live footer links to Cookies (`/cookies` → opt-in UI `?showOptIn=1`). Live Datenschutz references etracker cookies. New site has no cookies route, no consent banner, and unused `footer.cookies` / `legal.cookies` keys. `/de/cookies` → 404.
- **Decision needed:** If no tracking is used post-launch, update Datenschutz accordingly and either remove Cookies link or provide a short “we only use essential cookies” page. If analytics is added, implement consent + update policy.
- **Likely files:** Footer, new cookies page or banner component, `src/app/[locale]/datenschutz/page.tsx`, analytics integration.
- **Acceptance criteria:**
  - [x] Footer Cookies behavior matches the chosen privacy approach.
  - [x] Datenschutz text matches actual technologies used (no stale etracker claims if unused).
  - [x] If non-essential cookies/trackers exist, consent mechanism works before load.

---

### ISSUE-010 — Product galleries empty for 2 products
- **Status:** Done
- **Note:** Live pages also had no galleries. Filled `profilextrusion/extruder` with the shared extruder photo set (5 JPGs, same machines as Rohr/Platten extruder) and `plattenextrusion/sondermaschinen` with 5 GRAEWE special-machine photos scraped from sibling Sonder pages; wired in `productImages.ts`.
- **Category:** Content gap / Bug
- **Problem:** Image folders exist but contain **0 files**:
  - `public/images/products/profilextrusion/extruder/`
  - `public/images/products/plattenextrusion/sondermaschinen/`
- **Evidence (new):** local product page `/de/produkte/profilextrusion/extruder` shows text only, no gallery.
- **Likely files:** those image folders, `src/lib/productImages.ts`, scrape/copy from graewe.com product pages.
- **Acceptance criteria:**
  - [x] Both products show a gallery comparable to sibling products (≥1 real product photo; ideally 3–5).
  - [x] Lightbox still works.

### ISSUE-011 — Product detail body missing for FR / RU / ES
- **Status:** Done
- **Category:** i18n / Content gap
- **Problem:** `src/lib/productContent.ts` has structured product copy for `de` and `en` only. `getProductDetail()` falls back to German for other locales — French/Russian/Spanish product pages show German prose under a FR/RU/ES chrome.
- **Likely files:** `src/lib/productContent/` (`de|en|fr|ru|es.json` + `index.ts`).
- **Acceptance criteria:**
  - [x] FR/RU/ES product pages show native (or professionally translated) body text.
  - [x] Fallback behavior documented if intentional interim. (Unknown locales still fall back to `de`; see `getProductDetail`.)

---

### ISSUE-012 — Impressum & Datenschutz not localized
- **Status:** Done
- **Category:** i18n / Legal / compliance
- **Problem:** Legal page bodies are hardcoded German. Visiting `/fr/impressum` or `/en/impressum` still shows German sections (“Anschrift”, etc.). Live site provides localized legal/nav paths (`/en/imprint`, `/en/data-privacy`, `/fr/mentions-legales`, …).
- **Likely files:** `src/app/[locale]/impressum/page.tsx`, `src/app/[locale]/datenschutz/page.tsx`, `src/messages/*.json`.
- **Done note:** Moved imprint/privacy body copy into `imprintPage` / `privacyPage` message namespaces for all five locales; non-DE pages note that DE is legally binding. Legacy `/en/imprint`, `/en/data-privacy`, `/fr/mentions-legales`, `/es/data-privacy` redirects already covered by ISSUE-004/005.
- **Acceptance criteria:**
  - [x] EN (minimum) legal pages readable in English.
  - [x] FR/RU/ES either translated or clearly link to the binding DE version with explanation.
  - [x] Old localized legal URLs redirect (ties to ISSUE-004/005).

---

### ISSUE-013 — Street address inconsistency (`1+2` vs `1-3`)
- **Status:** Done
- **Note:** Canonical GRAEWE address set to `Max-Planck-Straße 1-3` (per `PROJECT.md`); fixed Team + Impressum (`1+2`→`1-3`), normalized hyphenation in contact messages + JSON-LD; `next GmbH` remains `Max-Planck-Str. 1+2`.
- **Category:** Bug / Content gap
- **Problem:** Mixed addresses across the rebuild (also present on old site — still should be corrected for launch):
  - Footer / contact-ish: `Max-Planck-Straße 1-3`
  - Team + Impressum: `Max-Planck-Straße 1+2`
  - JSON-LD: `1-3`
- **Evidence (old):** Team uses `1-3`; Impressum uses `1+2`.
- **Likely files:** `Footer.tsx`, `team/page.tsx`, `impressum/page.tsx`, `layout.tsx` JSON-LD, `messages/*.json` address strings.
- **Acceptance criteria:**
  - [x] Single canonical GRAEWE street address confirmed with stakeholders.
  - [x] All user-facing + schema occurrences updated consistently.
  - [x] `next GmbH` address (`1+2`) kept distinct if that entity differs.

---

### ISSUE-014 — Jubiläum news excerpt incomplete / missing year
- **Status:** Done
- **Note:** Fixed with ISSUE-002 — excerpt/body now say “40 Jahre…” / “Celebrating 40 Years of X-tras (est. 1981)” and include the anniversary image.
- **Category:** Bug / Content gap
- **Problem:** DE excerpt starts with “Jahre erfolgreicher Extrusionstechnik…” — missing the anniversary number/year that should precede “Jahre”.
- **Evidence:** `src/messages/de.json` → `news.items` slug `jubilaeum`.
- **Acceptance criteria:**
  - [x] Excerpt and full article include the correct anniversary wording from the live article.

---

### ISSUE-015 — Hero carousel slide texts mostly duplicated
- **Status:** Done
- **Note:** Unique hero copy in all 5 locales, paired to imagery: coils (winding tagline), pipes, profiles, sheets, brand line (`src/messages/*.json` `hero.slide*`).
- **Category:** Content gap / UX
- **Problem:** Slides 1, 2, 4, 5 share identical title/subtitle in DE messages; only slide 3 differs. Live carousel also appears repetitive in places, but rebuild should migrate distinct slide copy/images intentionally rather than copy-paste.
- **Likely files:** `src/messages/*.json` (`hero.slide*`), `public/images/hero/`, `HeroCarousel.tsx`.
- **Acceptance criteria:**
  - [x] Each slide has intentional unique copy (or fewer slides if content doesn’t exist).
  - [x] Images and text remain paired correctly.

---

### ISSUE-016 — Calculator input validation is silent
- **Status:** Done
- **Note:** Added pure `validateWindingPositionInput` / `validateWindingLengthInput` helpers; UI shows per-field errors (required / invalid / positive / OD>ID) in all 5 locales; unit + e2e coverage.
- **Category:** Bug / UX
- **Problem:** Invalid/empty/non-positive inputs cause calculate to no-op with no error message.
- **Likely files:** `src/components/calculator/*`, `src/lib/calculator.ts`, messages under `calculator.*`.
- **Acceptance criteria:**
  - [x] User sees validation errors for missing/invalid fields.
  - [x] Unit tests cover invalid input handling.
  - [x] Results still match live calculator within documented ±10% disclaimer (spot-check against graewe.com/produktrechner).

---

### ISSUE-017 — Contact page missing map (if still desired)
- **Status:** Done
- **Note:** Decision: yes (per `PROJECT.md` Kontakt checklist). Privacy-friendly static OSM map image on `/kontakt` with OSM + Google Maps outbound links; no third-party map scripts on page load. Datenschutz §4 notes the static map + external links. Files: `ContactMap.tsx`, `contactLocation.ts`, `public/images/contact/location-map.png`, messages, `datenschutz/page.tsx`.
- **Category:** Missing feature
- **Problem:** `PROJECT.md` content checklist includes map embed for Kontakt. Live kontakt page shows address block; confirm whether a map was expected. New kontakt has form + address only.
- **Likely files:** `src/app/[locale]/kontakt/page.tsx`
- **Acceptance criteria:**
  - [x] Stakeholder decision recorded.
  - [x] If yes: privacy-friendly map (or static map image + link to OpenStreetMap/Google) with Datenschutz update if needed.

---

### ISSUE-018 — Products overview route missing
- **Status:** Done
- **Note:** Added `/[locale]/produkte` overview (live-site intro + machine list + category cards); legacy `/produkte`, `/en/products`, `/fr/produits`, etc. 301 to the overview instead of homepage.
- **Category:** Missing feature / SEO / redirects
- **Problem:** Live site has `/en/products` (and FR `/fr/produits`, etc.). New site `/de/produkte` and `/en/products` → 404.
- **Likely files:** optional `src/app/[locale]/produkte/page.tsx`, redirects.
- **Acceptance criteria:**
  - [x] Overview page exists **or** old overview URLs 301 to a sensible destination (e.g. homepage categories / first category).

---

### ISSUE-019 — Menu button label hardcoded as “MENÜ”
- **Status:** Done
- **Note:** Header menu button + aria-label use `nav.menu` / `nav.menuAria` in all five locales (`Header.tsx` + messages).
- **Category:** i18n / UX
- **Problem:** Header always shows German “MENÜ” even on EN/FR/RU/ES.
- **Evidence:** `src/components/layout/Header.tsx` (`hidden sm:inline">MENÜ</span>`).
- **Acceptance criteria:**
  - [x] Label comes from messages for each locale (MENU / MENU / …).

---

### ISSUE-020 — Fallback “Product details coming soon.” is English-only
- **Status:** Done
- **Note:** Replaced hardcoded English fallback with `products.detailsComingSoon` in all five locale files; wired in Rohr-/Profil-/Plattenextrusion product detail pages.
- **Category:** i18n / Bug
- **Problem:** Product detail pages hardcode English fallback string if content lookup fails.
- **Evidence:** `src/app/[locale]/produkte/*/ [product]/page.tsx`
- **Acceptance criteria:**
  - [x] Fallback uses i18n key in all locales; ideally never shown for shipped products.

---

### ISSUE-021 — Success story quotes not localized for FR/RU/ES
- **Status:** Open
- **Category:** i18n / Content gap
- **Problem:** Non-EN locales largely reuse English testimonial text for Maplast / ASG.
- **Likely files:** `src/messages/{fr,ru,es}.json` → `successStories.testimonials`
- **Acceptance criteria:**
  - [ ] Testimonials translated (or DE/EN shown with language note).

---

### ISSUE-022 — Job application “online portal” not represented
- **Status:** Done
- **Decision:** Email-only for launch. Live “Onlineportal” is **not** an external career URL — on listing pages the word has no `href`; on job details it is the TYPO3 on-site form “JETZT ONLINE BEWERBEN” (`bewerberformular-512`). Do not rebuild that form for launch. Apply CTAs stay mailto / HR email in `jobs.*` messages.
- **Note:** Rebuild copy already has no portal wording; documented so agents do not reintroduce an application form without an explicit request.
- **Category:** Missing feature
- **Problem:** Live Stellenanzeigen mentions preferring applications via online portal or email. Rebuild has no portal link / application flow.
- **Acceptance criteria:**
  - [x] Confirm whether portal still exists; if yes, link it from jobs pages; if no, remove that instruction and keep email apply path only.

---

## P2 — Polish & consistency

### ISSUE-023 — Analytics not implemented (and policy may still imply tracking)
- **Status:** Done
- **Note:** Documented launch decision = **no analytics** in `SPEC.md` + `PROJECT.md`; removed planned `NEXT_PUBLIC_ANALYTICS_ID` / Plausible-Umami guidance. Datenschutz + `/cookies` already state essential-only / no etracker (ISSUE-009). Adding trackers later requires consent + policy updates.
- **Category:** Missing feature / Legal / compliance
- **Problem:** `PROJECT.md` planned Plausible/Umami; `NEXT_PUBLIC_ANALYTICS_ID` in env example. Live site uses etracker. New site has no analytics integration.
- **Acceptance criteria:**
  - [x] Either implement privacy-friendly analytics **with consent if required**, or explicitly document “no analytics” and ensure Datenschutz matches.

---

### ISSUE-024 — Homepage Vimeo embed often appears as blank dark block
- **Status:** Open
- **Category:** Bug / UX
- **Problem:** During local review, homepage video area rendered as solid dark rectangle before/without visible player chrome (iframe present in `NewsTeaser.tsx`). May be cookie/third-party blocking, missing Vimeo privacy hash, or lazy-load issue.
- **Likely files:** `src/components/home/NewsTeaser.tsx`
- **Acceptance criteria:**
  - [ ] Video visibly loads on desktop + mobile in clean browser profile.
  - [ ] Accessible title retained; no CLS jump preferred.
  - [ ] Fallback thumbnail + link if embed blocked.

---

### ISSUE-025 — Contact form labels partially English on old DE page — don’t regress
- **Status:** Done
- **Note:** DE uses Nachname/Vorname/Telefon/Nachricht/Pflichtfeld (not old-site English mix); EN/FR/RU/ES verified; required `*` markers consistent + `aria-required`/label wiring; unit + e2e regression coverage.
- **Category:** UX / i18n
- **Problem:** Live DE kontakt shows mixed labels (“First Name”, “Phone”, “Message”). Rebuild should keep **proper German labels** on DE (and correct labels per locale) — improvement is fine, but verify all five locales.
- **Likely files:** `src/messages/*.json` → `contact.*`, `ContactForm.tsx`
- **Acceptance criteria:**
  - [x] DE labels fully German; EN fully English; etc.
  - [x] Required-field markers consistent.

---

### ISSUE-026 — Leftover Next.js starter assets in `public/`
- **Status:** Open
- **Category:** Bug / Polish
- **Problem:** Starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) remain in `public/` and are not part of GRAEWE brand.
- **Acceptance criteria:**
  - [ ] Unused starter assets removed if not referenced.

---

### ISSUE-027 — Footer omits Sitemap + Cookies links (keys unused)
- **Status:** Done
- **Note:** Footer legal strip now includes Sitemap + Cookies (with ISSUE-008/009 pages).
- **Category:** Missing feature / UX
- **Problem:** Translation keys exist; footer legal strip only has Kontakt / Impressum / Datenschutz.
- **Depends on:** ISSUE-008, ISSUE-009
- **Acceptance criteria:**
  - [x] Footer matches agreed legal link set from live site.

---

### ISSUE-028 — `PROJECT.md` content checklist still unchecked / contradictory
- **Status:** Open
- **Category:** Polish
- **Problem:** Phases marked complete / “launch-ready”, but Section 8 checklist boxes remain unchecked and some notes still say FR/RU/ES are EN copies.
- **Acceptance criteria:**
  - [ ] Checklist updated to reflect real migration status (especially news, jobs, images, legal i18n).
  - [ ] Contradictory i18n notes reconciled.

---

### ISSUE-029 — Team phone formatting differs from live presentation
- **Status:** Done
- **Note:** Corrected Service display/`tel:` from `+49 (7631)794440` → `+49 (7631)79440` (`tel:+49763179440`); other departments and emails already matched live.
- **Category:** Polish
- **Problem:** Live team lists compact numbers like `+49 (7631)79440`; rebuild may format differently. Verify click-to-call `tel:` URIs are correct (no missing digits).
- **Likely files:** `src/app/[locale]/team/page.tsx`
- **Acceptance criteria:**
  - [x] Display + `tel:` hrefs match real numbers from live Team page.
  - [x] Service / Ersatzteile / Gebrauchtmaschinen / Jobs emails match live site.

---

### ISSUE-030 — Old DE product typo slug needs redirect
- **Status:** Done
- **Note:** Folded into ISSUE-004 (`legacyRedirects.ts` + SWA config).
- **Category:** SEO / redirects
- **Problem:** Live DE uses `/produkte/rohrextrusion/kalibier-und-kuehlbaeder` (typo). Rebuild correctly uses `kalibrier-und-kuehlbaeder`. Local old typo path → 404.
- **Acceptance criteria:**
  - [x] Typo URL 301s to corrected slug for all locales that need it.

---

### ISSUE-031 — Verify calculator numeric parity vs live site
- **Status:** Open
- **Category:** Bug
- **Problem:** Formulas were reverse-engineered; PROJECT warns results may differ. Needs a golden-test table vs live Produktrechner outputs for both modes / both winding patterns.
- **Likely files:** `src/lib/calculator.ts`, `tests/unit/*`
- **Acceptance criteria:**
  - [ ] Documented sample inputs with expected outputs from live site.
  - [ ] Unit tests assert parity (within intentional rounding).
  - [ ] Disclaimer remains visible.

---

### ISSUE-032 — Resend / contact email must be verified before cutover
- **Status:** Open
- **Category:** Missing feature / Ops
- **Problem:** API falls back to console logging without `RESEND_API_KEY`. Launch without configured email = silent “success” UX risk if status handling assumes send worked.
- **Likely files:** `src/app/api/contact/route.ts`, `.env.example`, Azure/GitHub secrets docs.
- **Acceptance criteria:**
  - [ ] Production secrets configured.
  - [ ] End-to-end test: form submit → inbox `CONTACT_EMAIL_TO`.
  - [ ] If email provider unset, UI must not claim success.

---

### ISSUE-033 — 404 handling rewrites to homepage
- **Status:** Done
- **Note:** Removed SWA `responseOverrides.404`; added `src/app/not-found.tsx` and `src/app/[locale]/not-found.tsx` (done with ISSUE-004).
- **Category:** SEO / Bug
- **Problem:** `staticwebapp.config.json` `responseOverrides.404.rewrite = "/de"` masks missing pages as the homepage (bad for SEO debugging and users).
- **Acceptance criteria:**
  - [x] Dedicated localized 404 page.
  - [x] Real 404 status preserved where platform allows.

---

## Suggested work order for parallel agents

| Order | Issue IDs | Rationale |
|------|-----------|-----------|
| 1 | 001, 002, 003 | Visible content holes vs live site |
| 2 | 004, 005, 030, 033 | Cutover/SEO won’t survive without redirects/URL strategy |
| 3 | 006, 007, 032 | Contact + social reliability |
| 4 | 008, 009, 027 | Legal/footer parity |
| 5 | 010, 011, 012, 021 | Product/legal i18n + images |
| 6 | 013–016, 019, 020, 024, 031 | Bugs/UX polish |
| 7 | 017, 018, 022, 023, 025, 026, 028 | Remaining parity / docs |

---

## Quick reference — old vs new URL philosophy

| Locale | Old (live) path style | New (rebuild) path style |
|--------|------------------------|---------------------------|
| DE | `/unternehmen/...`, `/produkte/...` | `/de/unternehmen/...`, `/de/produkte/...` |
| EN | `/en/company/...`, `/en/products/pipe-extrusion/...` | `/en/unternehmen/...`, `/en/produkte/rohrextrusion/...` |
| FR | `/fr/entreprise/...`, `/fr/produits/extrusion-de-tubes/...` | `/fr/unternehmen/...` (German slugs) |
| RU/ES | English-like `/ru|es/company|products/...` | German slugs under `/ru|es/...` |

This mismatch is the single largest silent cutover risk after missing jobs/news content.

---

## Sources used for this audit

- Live site pages: home, aktuelles (+ news detail URLs), stellenanzeigen (+ job details), kontakt, downloads, team, impressum, datenschutz, produktrechner, sitemap, cookies, product extruder, EN/FR/RU/ES home nav hrefs
- Repo: `PROJECT.md`, `staticwebapp.config.json`, `infra/DNS_CUTOVER.md`, `src/app/**`, `src/components/**`, `src/lib/productContent.ts`, `src/lib/productImages.ts`, `src/messages/*.json`, `public/downloads`, `public/images/products/**`
- Local runtime: `npm run dev` on 2026-07-28
