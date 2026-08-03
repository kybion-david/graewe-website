# GRAEWE Website — Production Readiness & Bug Queue

Technical debug pass over the rebuild in this repository, focused on **shipping quality**:
build/CI health, runtime bugs, mobile behaviour, accessibility, SEO plumbing, and security.

**Audited: 2026-07-29 against `origin/main` @ `6dd1a0a`** (merge of PR #33).
Method: `npm ci` → `type-check` / `lint` / `test` / `build` / `test:e2e`, Next 16 dev server,
Chrome DOM measurements in fixed-width iframes (320 px, 390 px), server-rendered HTML via `curl`,
GitHub Actions run history via `gh`.

This is a **different axis** from [`SITE_COMPARISON_ISSUES.md`](./SITE_COMPARISON_ISSUES.md), which
compares content/parity against the live `graewe.com`. That file owns ISSUE-001 … ISSUE-033.
**This file owns ISSUE-034 and upward** (currently through ISSUE-067). Do not reuse IDs across the
two files — sweep both with `grep -ohE "ISSUE-[0-9]{3}" *.md | sort -u | tail` before assigning one.

> ### ⚠️ Read this before you audit anything
>
> The first version of this file was written against a checkout that was **73 commits behind
> `origin/main`**. Eight of its issues were already fixed upstream, and one P0 ("CI is red") was
> false — the lint error came from a local `node_modules` that had drifted from `package-lock.json`.
> That version was never merged; this one replaces it.
>
> **Always start from the current remote, and install from the lockfile:**
> ```bash
> git fetch origin main
> git log --oneline main..origin/main   # if this is non-empty, your checkout is STALE
> git worktree add -b <type>/<desc> ../graewe-website-<desc> origin/main
> cd ../graewe-website-<desc> && npm ci   # npm ci, not npm install
> ```
> `git rev-parse main origin/main` only tells you they *differ* — it does not tell you which way.
> Use `main..origin/main` to see what you are missing. See `SPEC.md` §0.

---

## How other AIs should use this document

1. Pick the **next open item** by priority (`P0` → `P1` → `P2`), one item per session unless items are tightly coupled.
2. **Re-verify the evidence before you code.** Line numbers and measurements are accurate as of `6dd1a0a`; this repo moves fast. If the evidence no longer reproduces, mark the item `Status: Withdrawn` with a note rather than inventing a fix.
3. Follow `AGENTS.md`: worktree off `origin/main` + branch, then `npm run type-check && npm run lint && npm run test`.
4. When done, mark the item `Status: Done` and add a one-line note of what changed.
5. Do **not** delete completed or withdrawn items; keep the history for launch review.
6. Some items **add evidence to an existing issue** in `SITE_COMPARISON_ISSUES.md` — see [Cross-references](#cross-references-existing-issues). Update the item **there**.

**Legend**
- **P0** — Launch blocker: a pipeline is red, or the site is broken on real devices
- **P1** — Clear bug / accessibility or SEO defect that should not ship
- **P2** — Polish, hardening, consistency

**Categories:** `Build / CI` · `Bug` · `Mobile` · `A11y` · `SEO` · `Security` · `i18n` · `Ops` · `Testing`

---

## Verified-good on `6dd1a0a` (do not "fix" these)

Recorded so nobody re-audits them:

- `npm run lint` — **clean, zero errors and zero warnings** (after `npm ci`). `npm run type-check` — clean. `npm run test` — **68/68 passing across 10 files**. `npm run build` — succeeds.
- `.github/workflows/deploy.yml` (Azure, "Build & Deploy") — **green on `main`** for the two most recent runs, after the lockfile repairs in PRs #32/#33.
- **No horizontal overflow at 390 px** — re-measured on 8 routes across DE/EN/FR/RU/ES including Cyrillic. The 320 px case is broken — see ISSUE-036.
- **Contact form is in good shape**: 6/6 labels carry `htmlFor`, 6/6 inputs carry `id`, 5 carry `autoComplete`, `aria-required` is set, a honeypot (`contact-website`) is present, Turnstile is wired, the API escapes all user input, and it now fails closed when Resend is unconfigured. The workflow passes `RESEND_API_KEY` / `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM` / `TURNSTILE_*`.
- Calculator inputs are properly labelled too (4/4 `htmlFor` + `id`) via `CalculatorField.tsx`.
- Homepage Vimeo is a **click-to-load facade** with `dnt=1` and a localized play label — no third-party request before interaction.
- `<meta name="viewport" content="width=device-width, initial-scale=1">`, no `user-scalable=no`.

---

## P0 — Launch blockers

### ISSUE-058 — GitHub Pages workflow fails on every push to `main`
- **Status:** Done — Removed `pages.yml` and Pages export path; Azure SWA is the only deploy target (`SPEC.md` §2).
- **Category:** Build / CI
- **Problem:** `.github/workflows/pages.yml` ("Deploy to GitHub Pages") has failed on **all 8 most recent runs on `main`**. The static export cannot prerender the legacy TYPO3 query-param redirect routes, because `output: "export"` forbids `await searchParams`. The export aborts, so the Pages path has been dead since those routes landed.
- **Evidence — reproduced locally:**
  ```
  $ GITHUB_PAGES=true npx next build
  Error occurred prerendering page "/fr/aktuelles/news-detailansicht".
  Error: Route /[locale]/aktuelles/news-detailansicht with `dynamic = "error"` couldn't be
         rendered statically because it used `await searchParams`, `searchParams.then`, or similar.
  Export encountered an error on /[locale]/aktuelles/news-detailansicht/page, exiting the build.
  ```
  Run history (`gh run list --workflow=pages.yml --branch main`): `failure` ×8, most recent `2026-07-29T18:26`.
  Offending routes: `src/app/[locale]/aktuelles/news-detailansicht/page.tsx:20` (`await searchParams`) and, by the same pattern, `src/app/[locale]/stellenanzeigen/stellendetails/page.tsx`.
- **Decision needed first:** is the Pages export still a supported target, or is Azure SWA the only one? `SPEC.md` §2 calls Pages "optional". If it is dead, delete `pages.yml` rather than leaving a permanently red pipeline that trains everyone to ignore failures.
- **Likely files:** `.github/workflows/pages.yml`, `src/app/[locale]/aktuelles/news-detailansicht/page.tsx`, `src/app/[locale]/stellenanzeigen/stellendetails/page.tsx`, `next.config.ts`, `SPEC.md`
- **Acceptance criteria:**
  - [x] Either `GITHUB_PAGES=true npm run build` succeeds, or `pages.yml` is removed and `SPEC.md` records that Azure SWA is the only target.
  - [x] If Pages is kept: legacy query-param redirects still work there (a static `_redirects`-style rule, or client-side handling — document which). — N/A: Pages path removed.
  - [x] No workflow on `main` is left in a permanently failing state.

---

### ISSUE-036 — Site scrolls horizontally on 320 px phones (header bar overflows)
- **Status:** Done — Compact header logo/controls + calculator padding below `sm`; unit layout contract in `headerMobileLayout.test.ts`. Full scrollWidth e2e deferred to ISSUE-047.
- **Category:** Mobile / A11y
- **Problem:** At a 320 px viewport (iPhone SE 1st gen, older Androids, and the width WCAG 1.4.10 *Reflow* mandates) **every page** overflows horizontally. Root cause is the header row: logo + language switcher + menu button do not fit inside the `px-4`-padded 288 px content box.
- **Evidence — re-measured on `6dd1a0a` (iframe at width=320):**
  ```
  /de                                   documentElement.scrollWidth=339  innerWidth=320
  /de/team                              339 / 320
  /de/kontakt                           339 / 320
  /de/downloads                         339 / 320
  /de/aktuelles                         339 / 320
  /de/produkte                          339 / 320
  /de/sitemap                           339 / 320
  /de/cookies                           339 / 320
  /de/produkte/rohrextrusion/extruder   339 / 320
  /en/kontakt                           339 / 320
  /ru                                   340 / 320
  /de/produktrechner                    357 / 320   <-- worst
  ```
  Offending elements (`scrollWidth > clientWidth`):
  ```
  HEADER  .sticky.top-0.z-50                        sw=339 cw=320
  DIV     .max-w-[1200px].mx-auto.px-4              sw=339 cw=320
  DIV     .flex.items-center.justify-between.h-16   sw=323 cw=288   <-- root cause
  ```
  The calculator adds a further ~18 px from nested `p-6` inside a `p-6` card, leaving 238 px of content width. **Note:** the calculator was rewritten twice (PRs #30, #31) and the 357 px figure is unchanged, so this is not incidental to the old layout.
  At 390 px all 8 sampled routes are clean, so this is specifically a small-phone regression.
- **Likely files:** `src/components/layout/Header.tsx`, `src/components/ui/LanguageSwitcher.tsx`, `src/components/calculator/Calculator.tsx`, `src/components/calculator/WindingPosition.tsx`, `src/components/calculator/WindingLength.tsx`
- **Acceptance criteria:**
  - [x] `document.documentElement.scrollWidth === window.innerWidth` at 320 px on every route above.
  - [x] Logo stays legible; menu button and language switcher stay reachable.
  - [x] Calculator inputs, mode tabs and result grids fit at 320 px without inner scrollbars.
  - [x] Regression guard added — unit layout contract; scrollWidth e2e deferred to ISSUE-047.

---

## P1 — Bugs, accessibility, SEO

### ISSUE-041 — No canonical URLs and no `hreflang` alternates on any page
- **Status:** Done
- **Category:** SEO
- **Problem:** The site publishes the same content under five locale prefixes but emits **zero** `<link rel="canonical">` and **zero** `<link rel="alternate" hreflang>`. Search engines have no signal linking `/de/kontakt` ↔ `/en/kontakt` ↔ `/ru/kontakt`, and no canonical to collapse duplicates. On a cutover from an established TYPO3 domain this is a material ranking risk.
- **Evidence:** measured `link[rel=canonical]` and `link[rel=alternate][hreflang]` counts in the rendered DOM of `/de`, `/de/produktrechner`, `/de/produkte/rohrextrusion/extruder`, `/de/team`, `/de/kontakt`, `/ru` — **`canonical: 0, hreflang: 0` on all six**. `grep -rn "alternates\|canonical\|hreflang" src/app/` returns nothing. `next-sitemap.config.js` has no `alternateRefs`.
- **Likely files:** `src/app/[locale]/layout.tsx`, each `generateMetadata`, `next-sitemap.config.js`
- **Acceptance criteria:**
  - [x] Every page emits `alternates.canonical` for its own absolute URL.
  - [x] Every page emits `alternates.languages` for all five locales plus `x-default` → `de`.
  - [x] `next-sitemap` emits `alternateRefs`.
  - [x] `metadataBase` derives from `NEXT_PUBLIC_SITE_URL` rather than the hardcoded `https://www.graewe.com` in `layout.tsx`, so preview environments don't advertise production URLs.
- **Note:** Added `src/lib/seo.ts`; `pageMetadata` emits canonical + hreflang per locale/path; layout `metadataBase` from env; `next-sitemap` transform emits absolute `alternateRefs`.

---

### ISSUE-042 — Every page shares one identical meta description; homepage has no `<h1>`
- **Status:** Done — Per-page `generateMetadata` descriptions (via `pageMetadata` / product excerpts) in all five locales; homepage has one `sr-only` `<h1>` in `HeroCarousel`.
- **Category:** SEO / A11y
- **Problem:** Two defects in the same area.
  1. Every URL inherits the single site-level `meta.description`; only the locale changes it, not the page. Search Console will flag this across the whole site.
  2. Every locale homepage renders **no `<h1>` at all** — the hero headline is an `<h2>`. The most important page has no primary heading for SEO or screen-reader navigation.
- **Evidence — measured on `6dd1a0a`:**
  ```
  /de                        h1=0   description: "GRAEWE ist eine begehrte Marke in der Welt der Extruder…"
  /de/produkte/rohrextrusion h1=1   description: (identical)
  /de/team                   h1=1   description: (identical)
  /de/stellenanzeigen        h1=1   description: (identical)
  /de/aktuelles/jubilaeum    h1=1   description: (identical)
  /de/produktrechner         h1=1   description: (identical)
  /en/produkte/rohrextrusion h1=1   description: (identical, EN)
  /ru/kontakt                h1=1   description: (identical, RU)
  ```
- **Likely files:** `src/app/[locale]/page.tsx`, `src/components/home/HeroCarousel.tsx`, all `generateMetadata` functions, `src/messages/*.json`
- **Acceptance criteria:**
  - [x] Each locale homepage has exactly one `<h1>` (visible or visually hidden).
  - [x] Product, category, news, job and legal pages each set a distinct translated `description`.
  - [x] No two indexed URLs share a description.

---

### ISSUE-037 — Closed menus and dropdowns stay in the tab order
- **Status:** Done — closed mobile drawer, desktop dropdown, and language list use `inert` + `aria-hidden`; `useDismissibleOverlay` handles Escape, focus return, and focus trap when open.
- **Category:** A11y
- **Problem:** The mobile drawer, the desktop dropdown and the language dropdown are hidden with `opacity-0 pointer-events-none` only. That removes neither the tab order nor the accessibility tree, so keyboard and screen-reader users traverse 16 invisible links on every page before reaching content.
- **Evidence — measured on `6dd1a0a`, menu closed, at 390 px:**
  ```json
  { "closedMenuTabbables": 16, "ariaHidden": null, "inert": false }
  ```
  Identical on `/de`, `/de/kontakt`, `/de/produktrechner`, `/de/produkte/rohrextrusion/extruder`, `/de/team`.
  Source: `src/components/layout/MobileMenu.tsx:35`, `src/components/layout/Header.tsx:133`, `src/components/ui/LanguageSwitcher.tsx:48` — all the same `opacity-0 … pointer-events-none` pattern.
- **Likely files:** `src/components/layout/MobileMenu.tsx`, `src/components/layout/Header.tsx`, `src/components/ui/LanguageSwitcher.tsx`
- **Acceptance criteria:**
  - [x] Closed overlays are out of the tab order (`inert`, `hidden`, `visibility: hidden`, or conditional render) — measured tabbable count is 0 when closed.
  - [x] Opening the drawer moves focus into it; `Escape` closes it and returns focus to the menu button; focus is trapped while open.
  - [x] Same `Escape` + focus-return behaviour for the language dropdown.

---

### ISSUE-039 — Contact form signals validation errors by colour only
- **Status:** Done — shared Zod schema + per-field error text/icons/`aria-invalid`/`aria-describedby`; success/error banners use `role="status"` / `role="alert"` (2026-07-29)
- **Category:** A11y / UX
- **Problem:** `aria-required` is now set on required fields (good), but React Hook Form errors still only swap a CSS class. No error text is rendered, no `aria-invalid`, no `aria-describedby`, and the success/error banners are not live regions. A screen-reader user submitting an incomplete form still gets no feedback (WCAG 3.3.1 / 4.1.3), and colour-only error signalling fails WCAG 1.4.1.
- **Evidence:** `src/components/contact/ContactForm.tsx` — `errors.*` appears only at lines 145, 157, 172, 198, always as `className={errors.X ? inputError : inputNormal}`. `grep` for `aria-invalid|aria-describedby|role="status"|role="alert"|aria-live` in that file returns **nothing**.
- **Related:** `zod` and `@hookform/resolvers` are still dependencies and `SPEC.md` §2 still says "React Hook Form + **Zod**", but `grep` for `zodResolver|from "zod"` across `ContactForm.tsx`, `api/contact/route.ts` and `lib/contactEmail.ts` returns nothing.
- **Likely files:** `src/components/contact/ContactForm.tsx`, `src/app/api/contact/route.ts`, `src/messages/*.json`, `SPEC.md`
- **Acceptance criteria:**
  - [x] Per-field error text in all five locales, linked via `aria-describedby`, with `aria-invalid`.
  - [x] Success/error banners announced (`role="status"` / `role="alert"`).
  - [x] Zod is either wired up (shared schema, client + API) or removed from deps and `SPEC.md`.

---

### ISSUE-043 — Hero carousel auto-rotates with no pause control and 4 px-tall dots
- **Status:** Done — pause/play control; autoplay stops on hover, focus-within, `document.hidden`, and `prefers-reduced-motion`; progress-dot hit areas are ≥24×24 px (`h-6 min-w-6`) with thin visual bars; carousel region + `aria-hidden` on inactive slides; strings in all 5 locales.
  - **Follow-up (2026-08-01):** the first cut attached hover-pause to the whole `<section>` and focus-pause to any focus event, which made autoplay look broken — measured with Playwright at 1512×806, the hero band is **1512×560 (~69% of the viewport)**, so a pointer resting anywhere over the copy, image, or surrounding whitespace froze it indefinitely (0 advances in 14 s), and a **mouse click** on prev/next latched `focusWithin` on until the user clicked outside the hero. Hover-pause is now scoped to the two control clusters and gated on `(hover: hover)` (a tap fires `mouseenter` with no matching `mouseleave`), and focus-pause is gated on `:focus-visible` so only keyboard focus pauses. Pause-on-hover-of-controls, keyboard-focus pause, and the explicit pause button all still hold.
- **Category:** A11y / Mobile
- **Problem:** Three defects in one component.
  1. Advances every 6 s with no pause/stop/hide affordance, and no pause on hover or focus — WCAG 2.2.2 failure.
  2. Progress-dot buttons are `h-1 w-8` (desktop) and `h-1 w-6` (mobile) — **measured 24×4 px**. WCAG 2.2 §2.5.8 requires 24×24 px.
  3. A `setInterval` fires every 50 ms for the progress bar and never pauses when the tab is hidden or under `prefers-reduced-motion` — continuous re-render and battery drain on mobile.
- **Evidence:** `src/components/home/HeroCarousel.tsx:38` (auto-advance), `:43` (50 ms progress interval), `:119` (`h-1 w-8`), `:243` (`h-1 w-6`). `grep` for `prefers-reduced|visibilitychange|paused` returns nothing. Measured on `/de` at 390 px: 40 interactive elements under 24 px tall, including six `24x4` buttons.
- **Likely files:** `src/components/home/HeroCarousel.tsx`
- **Acceptance criteria:**
  - [x] A visible pause/play control, or auto-advance removed.
  - [x] Auto-advance and progress interval stop on hover (of the controls — not the whole hero band), on keyboard focus within the carousel, when `document.hidden`, and under `prefers-reduced-motion: reduce`.
  - [x] Dot controls have a ≥24×24 px hit area (padding or `::before`; the visual bar can stay thin).
  - [x] Off-screen slides hidden from assistive tech; region marked up as a carousel.

---

### ISSUE-057 — Phones download the desktop hero image; all 10 carousel images mount at once
- **Status:** Done — unified `HeroCarousel` into one responsive layout with a single image plane (`sizes` `(max-width: 639px) 100vw, 56vw`); only current (+ briefly outgoing) slides mount, so SSR emits one preload and phones no longer fetch the desktop 828/1920 tier. AVIF/WebP already enabled in `next.config.ts`.
- **Category:** Mobile / Performance
- **Problem:** `HeroCarousel` renders its desktop layout (`hidden sm:flex`, line 53) **and** its mobile layout (`sm:hidden`, line 159) simultaneously, each marking slide 0 as `priority` (lines 151 and 207). Next therefore emits **two unconditional `<link rel="preload" as="image">` tags for the same hero PNG at two size tiers, with no `media` attribute** — a phone eagerly downloads the 828/1920 px desktop variant it will never display, on the LCP path. The same duplication mounts all 10 `<Image>` elements at once.
- **Evidence:** server-rendered `<head>` of `/de`:
  ```html
  <link rel="preload" as="image" imageSrcSet="…slide-1.png&w=828&q=75 1x, …&w=1920&q=75 2x"/>
  <link rel="preload" as="image" imageSrcSet="…slide-1.png&w=640&q=75 1x, …&w=1200&q=75 2x"/>
  ```
  Neither carries `media`. Hero assets are 188–259 KB each.
- **Related:** same duplicate-render pattern as ISSUE-043. Fixing the layout duplication once resolves the preload waste too.
- **Likely files:** `src/components/home/HeroCarousel.tsx`
- **Acceptance criteria:**
  - [x] Exactly one hero preload per viewport (or two with correct `media`).
  - [x] A 390 px client does not fetch the 828/1920 px variants — verify in DevTools Network.
  - [x] Non-visible slides are not eagerly fetched.
  - [x] Consider WebP/AVIF sources where helpful (Azure SWA uses Next image optimization with avif/webp).

---

### ISSUE-045 — Hardcoded strings still leak into all five locales
- **Status:** Done — remaining nav/product/carousel/layout strings and aria-labels moved into `src/messages/{de,en,fr,ru,es}.json` (nav + hero + common keys)
- **Category:** i18n / A11y
- **Problem:** The menu button label is now localized (`t("menu")` / `t("menuAria")` — ISSUE-019 is done), but several strings and most `aria-label`s remain hardcoded, so non-German visitors see German text and screen readers announce English labels regardless of `lang`.
- **Evidence (visible text), verified on `6dd1a0a`:**
  | String | File:line | Shown in |
  |---|---|---|
  | `Unternehmen` | `src/components/layout/MobileMenu.tsx:61` | all 5 locales, every page |
  | `Produkte` | `src/components/layout/MobileMenu.tsx:76` | all 5 locales, every page |
  | `Galerie` | `src/components/products/ProductDetailContent.tsx:69` | all 5 locales, every product page |
  | `Skip to content` | `src/app/[locale]/layout.tsx:87` | all 5 locales |

  **Evidence (`aria-label`, English in every locale):** `MobileMenu.tsx:50` `"Close menu"`; `Header.tsx:140` `"Main navigation"`; `LanguageSwitcher.tsx:32` `"Select language"`; `HeroCarousel.tsx:95,105,220,230` `"Previous slide"` / `"Next slide"` and `:120,244` `` `Go to slide ${idx+1}` ``; `ProductDetailContent.tsx:111,122,134` `"Close"` / `"Previous image"` / `"Next image"`. (`Footer.tsx` `"Facebook"` / `"YouTube"` are proper nouns — leave them.)
- **Likely files:** the above, plus `src/messages/{de,en,fr,ru,es}.json`
- **Acceptance criteria:**
  - [x] Every string in the table and every non-proper-noun `aria-label` reads from `next-intl`.
  - [x] Keys added to **all five** locale files with real translations.
  - [x] A grep for hardcoded JSX text in `src/components` and `src/app` returns only proper nouns.

---

### ISSUE-046 — Footer legal links fail contrast; `text-grey-400` fails on light surfaces
- **Status:** Done
- **Category:** A11y
- **Problem:** Two token misuses produce sub-AA contrast.
  1. `text-grey-500` (`#6b6b6b`) on `bg-bg-footer` (`#2a2a2a`) ≈ **2.8:1** — the copyright line and the Kontakt / Impressum / Datenschutz / Sitemap / Cookies links, at `text-xs`. Needs 4.5:1.
  2. `text-grey-400` (`#9e9e9e`) on white ≈ **2.7:1** — the uppercase section headings in the mobile drawer, the desktop dropdown, and the "Galerie" label. Needs 4.5:1 (12 px uppercase does not qualify as large text).
- **Evidence:** tokens unchanged at `src/app/globals.css:18-19, 24`. Usages: `Footer.tsx:163, 167-171` (`text-grey-500`); `MobileMenu.tsx:60, 75`, `Header.tsx:149, 163, 180`, `ProductDetailContent.tsx:68` (`text-grey-400`). Measured 19–23 interactive elements under 24 px tall per page, footer links at `358x20`.
- **Likely files:** `src/app/globals.css`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/Header.tsx`
- **Acceptance criteria:**
  - [x] All body and link text reaches ≥4.5:1 against its actual background (use a checker, not the eye).
  - [x] Fix at token level where possible; update `SPEC.md` §5 if token values change.
  - [x] Footer legal links are ≥24 px tall.
- **Note:** Done — footer copyright/legal links use `text-grey-400` on `bg-bg-footer` (~5.4:1) with `min-h-6`; light-surface section labels use `text-text-muted` (~5.7:1). SPEC §5 documents the light/dark muted-text rule (token values unchanged — one grey cannot pass AA on both white and footer).

---

### ISSUE-047 — E2E is not in the CI gate, and covers desktop Chrome only
- **Status:** Done — E2E in `quality` job; Mobile Chrome + mobile-320 projects; `viewport-overflow` + `mobile-menu` specs; drawer links call `onClose`. Gate unblocked with ISSUE-059 label/aria fixes already on main.
- **Category:** Testing / Mobile
- **Problem:** Two gaps that compound.
  1. `.github/workflows/deploy.yml` gates on type-check, lint and **unit** tests only. Playwright never runs in CI — which is exactly why ISSUE-059 went unnoticed.
  2. `playwright.config.ts` defines a single project, `devices["Desktop Chrome"]`. Mobile is a stated requirement, the mobile menu has been fixed twice, and ISSUE-036 is a pure small-viewport regression — none of which any current test would catch.
- **Evidence:** `playwright.config.ts:14-19` (single project), `:21` (`webServer` command). `.github/workflows/deploy.yml` `quality` job steps: Type check, Lint, Unit tests.
- **Likely files:** `playwright.config.ts`, `tests/e2e/*`, `.github/workflows/deploy.yml`
- **Acceptance criteria:**
  - [x] E2E runs in CI on PRs.
  - [x] A `Mobile Chrome` project (e.g. `devices["Pixel 5"]`) plus a 320 px-wide project.
  - [x] A spec asserting `document.documentElement.scrollWidth <= window.innerWidth` on a representative route list at both widths.
  - [x] A spec covering: open drawer → tap link → navigates **and** closes; tap the current page's own link → closes.

---

### ISSUE-059 — An e2e test has been broken since it was written
- **Status:** Done — relaxed EN `getByLabel(/^Message$/)` to `/Message/` so it matches the accessible name with RequiredMark (`Message *`); audited other anchored labels (`Telefon`/`Phone`) — optional fields, no marker, still correct. Also fixed menu test to use DE aria-label `Hauptnavigation` (was hardcoded EN `Main navigation`).
- **Category:** Testing
- **Problem:** `tests/e2e/navigation.spec.ts:55` asserts `enForm.getByLabel(/^Message$/)`, but the label's accessible name is `Message *` — the required marker is rendered *inside* the `<label>`. The anchored regex can never match, so this test has failed since it was written. It went unnoticed because e2e is not in the CI gate (ISSUE-047). The neighbouring `/^Phone$/` passes only because Phone is optional and therefore has no marker.
- **Evidence:**
  ```
  $ npx playwright test          # on 6dd1a0a, clean build
  1 failed
    [chromium] › tests/e2e/navigation.spec.ts:36 › contact form labels are localized
        waiting for locator('form').getByLabel(/^Message$/)
  31 passed (16.1s)
  ```
  `src/components/contact/ContactForm.tsx:190-192`:
  ```tsx
  <label htmlFor="contact-message" …>
    {t("message")} <RequiredMark />
  </label>
  ```
  vs `:177-179`, where the Phone label has no `<RequiredMark />`. The underlying copy is correct in all five locales (`de: Nachricht`, `en: Message`, `fr: Message`, `ru: Сообщение`, `es: Mensaje`) — this is a test bug, not an i18n bug.
- **⚠️ Beware a contaminated run:** `playwright.config.ts` sets `reuseExistingServer: true`, so a stray `next start`/`next dev` on port 3000 from another checkout will be silently reused and produce a wall of false failures. Confirm nothing is on port 3000 before trusting a red run.
- **Likely files:** `tests/e2e/navigation.spec.ts`
- **Acceptance criteria:**
  - [x] The assertion matches the real accessible name (drop the anchors, or exclude the marker from the label and expose it via `aria-required` only).
  - [x] `npx playwright test` is 32/32 green from a clean port 3000.
  - [x] Audit the other anchored `getByLabel` assertions for the same trap.

---

### ISSUE-060 — `global-error.tsx` ships all five locale catalogs on every page
- **Status:** Done — copy moved to `src/app/globalErrorCopy.ts` (inlined `error.*` for all five locales); homepage JS **291 KB → 217 KB gzip (−74 KB, −25 %)**. Guarded by `tests/unit/globalErrorCopy.test.ts`; exception documented in `SPEC.md`.
- **Category:** Performance / Bundle size
- **Problem:** `src/app/global-error.tsx` is a `"use client"` component that statically imported `de/en/fr/ru/es.json` (248 KB raw) to render **five strings** (`error.code|title|description|retry|backHome`). Turbopack bundled all five catalogs into one 221 KB raw / **74 KB gzip** client chunk that loaded on *every* page — a German visitor downloaded the Russian, French, Spanish and English catalogs on every navigation. It cannot use `useTranslations` because `global-error.tsx` replaces the root layout and renders outside `NextIntlClientProvider`.
- **Evidence:** measured 2026-08-01 against the live deploy at `d5e3355`, and reproduced locally with two clean builds:
  ```
  chunk 0u6.t22bj094..js — 221 KB raw / 75 KB gzip
    contains simultaneously: "Wickellänge" (de), Cyrillic (ru),
    "bobinage" (fr), "bobinado" (es), "winding length" (en)
    loaded on /de, /de/impressum, /de/produktrechner
  homepage JS, same build + measurement method:
    baseline 291 KB gzip / 16 chunks  →  fixed 217 KB gzip / 15 chunks
  ```
- **Likely files:** `src/app/global-error.tsx`, `src/app/globalErrorCopy.ts`
- **Acceptance criteria:**
  - [x] No client chunk contains more than one locale's catalog.
  - [x] `src/messages/*.json` remains the source of truth; drift fails CI (mutation-tested both guards).
  - [x] A locale added to `routing` without inlined copy fails CI.

---

### ISSUE-061 — `npm run test` deletes the HSTS header from `staticwebapp.config.json`
- **Status:** Done — added `Strict-Transport-Security` to `STATIC_WEB_APP_GLOBAL_HEADERS`, and changed `tests/unit/generate-swa-config.test.ts` to *verify* the committed file instead of writing it.
- **Category:** Security / Testing
- **Problem:** `tests/unit/generate-swa-config.test.ts:16` called `writeFileSync(configPath, …)`, regenerating the committed `staticwebapp.config.json` from `STATIC_WEB_APP_GLOBAL_HEADERS` (`src/lib/legacyRedirects.ts:319`) — which never contained `Strict-Transport-Security`. So **running the test suite silently stripped HSTS from the repo**, and any subsequent commit would ship it. ISSUE-051's acceptance criterion claimed HSTS was declared; only the committed JSON had it, and only because it was stale. The write also made the assertions tautological — they checked what the test had just written.
- **Evidence:** on `d5e3355`, `git diff` after a clean `npm run test`:
  ```diff
     "globalHeaders": {
  -    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
       "X-Content-Type-Options": "nosniff",
  ```
  Production was unaffected: CI's `deploy` job does a fresh `actions/checkout`, and Azure injects HSTS on `*.azurestaticapps.net`. The exposure was a developer committing post-test churn, plus loss of the platform fallback after DNS cutover to `www.graewe.com`.
- **Likely files:** `src/lib/legacyRedirects.ts`, `tests/unit/generate-swa-config.test.ts`
- **Acceptance criteria:**
  - [x] Generator and committed JSON both declare HSTS, and are asserted equal.
  - [x] No test writes into the working tree (`npm run test` leaves `git status` clean).
  - [x] Mutation-tested: dropping HSTS from the generator, or from both files, fails CI.

---

### ISSUE-062 — `deviceSizes` generates three byte-identical image variants
- **Status:** Done — `deviceSizes` trimmed to `[640, 750, 828, 1080, 1200, 1920]` via `src/lib/imageConfig.ts`, guarded by `tests/unit/imageConfig.test.ts`.
- **Category:** Performance / Images
- **Problem:** Next's default `deviceSizes` runs to 3840, but the widest source image in `public/images/` is **1600 px** and the optimizer never upscales. So `w=1920`, `w=2048` and `w=3840` returned identical bytes while occupying three separate entries in the optimizer cache (keyed on url + width + quality + `Accept`). The only effect was redundant cold AVIF/WebP encodes on the LCP path and a hit rate split three ways across widths that render the same.
- **Evidence:** measured 2026-08-01 against the live deploy:
  ```
  bauboom.jpg (1200 px source), Accept: image/avif
    w=1080 → 130370 bytes
    w=1200 → 156804
    w=1920 → 156804   ← identical
    w=2048 → 156804   ← identical
    w=3840 → 156804   ← identical

  all 118 rasters under public/images/: max intrinsic width 1600 px, none > 1920
  ```
  1920 is retained as the top entry so the one 1600 px source (`news/kalibriertische-1.jpg`) still serves at native resolution on high-DPR displays.
- **Likely files:** `next.config.ts`, `src/lib/imageConfig.ts`
- **Acceptance criteria:**
  - [x] No width above 1920 is emitted in any prerendered page.
  - [x] Exactly one configured width is ≥ the widest source image; adding a wider image fails CI.
  - [x] Mutation-tested: re-adding 2048/3840, trimming below the widest source, or unsorting the array each fail CI.

- **Rejected alternative — do not re-propose without reading this.** Raising `images.minimumCacheTTL` (e.g. to one year) was considered and **deliberately rejected**. Every image is referenced by a string path into `/public` (55 refs across 16 files); no static imports, so no content hash in the URL. The optimizer cache key therefore does not change when the bytes at a path change, and per Next 16's own reference (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md:802`) *"there is no mechanism to invalidate the cache at this time"* — a returning browser would hold a stale image for the full TTL with no way to bust it. It also would not have helped the problem it was proposed for: cold encodes happen when `.next/cache/images` is *empty* (after a deploy), and a longer TTL does not populate an empty cache. The safe route to long-lived image caching is converting to static imports, which content-hash the filename and self-invalidate — worth doing only once images start changing regularly.

---

### ISSUE-063 — Hero slides are 578 px wide and upscale ~2× on the LCP element
- **Status:** Open — needs new source assets; not an engineering fix.
- **Category:** Content / Image quality
- **Problem:** All five hero slides are **578 × 370**, but `HeroCarousel` renders them at `sizes="(max-width: 639px) 100vw, 56vw"` — roughly **1075 CSS px** on a 1920 viewport, and double that in device pixels on a high-DPR display. The browser upscales the largest, most prominent image on the homepage. This is also why the hero emits seven `srcset` entries that all collapse to the same 578 px output.
- **Evidence:** measured 2026-08-01 from the committed files and the live deploy:
  ```
  578 x 370   188 KB  public/images/hero/slide-1.png
  578 x 370   218 KB  public/images/hero/slide-2.png
  578 x 370   253 KB  public/images/hero/slide-3.png
  578 x 370   202 KB  public/images/hero/slide-4.png
  578 x 370   235 KB  public/images/hero/slide-5.png

  /de emits slide-1 at w=384,640,750,828,1080,1200,1920 — all capped to 578 px
  ```
- **Likely files:** `public/images/hero/slide-*.png`, `src/components/home/HeroCarousel.tsx`
- **Acceptance criteria:**
  - [ ] Hero sources are at least ~2150 px wide (56vw × 1920 × 2 DPR), or the hero layout is capped to the resolution the assets can actually support.
  - [ ] Re-check `IMAGE_DEVICE_SIZES` afterwards — wider heroes will change the widest-source figure that ISSUE-062's guard test asserts against.
  - [ ] Weigh the byte cost: correctly sized heroes will be larger than today's 188–253 KB PNGs, so re-encode (and consider JPEG/WebP sources rather than PNG).

---

### ISSUE-064 — Cookieless web analytics (Umami) — supersedes ISSUE-023 and part of ISSUE-009
- **Status:** Done (code) / **Blocked on owner action** (see prerequisites) — 2026-08-01
- **Category:** Feature / Legal / compliance
- **Supersedes:** **ISSUE-023** ("no analytics at launch") and the analytics half of **ISSUE-009**. Those are still marked `Done` and their notes say the site ships *no* analytics. That is no longer the decision — **do not act on those notes**. The owner reversed it deliberately on 2026-08-01, choosing Umami Cloud.

- **Why the reversal is safe without a consent banner:** TDDDG §25 triggers on *storing or accessing information on the visitor's terminal equipment*. Umami does neither, so the section does not apply and the processing rests on Art. 6(1)(f) GDPR. Verified empirically rather than taken from marketing copy — headless Chromium load of `/de` against a production build with the tracker live:
  ```
  script in DOM:        true
  network:              GET  https://cloud.umami.is/script.js
                        POST https://gateway.umami.is/api/send
  document.cookie:      ""
  localStorage keys:    []
  sessionStorage keys:  []
  ```
  Note the two **different hosts**: the tracker loads from one and posts to another. A CSP that only allows the script host will silently break collection.

- **The DNT opt-out actually works** — the Datenschutz text promises one, so it was tested rather than assumed. Same page, same build, `navigator.doNotTrack` forced to `"1"`:
  ```
  DNT=off -> POST gateway.umami.is/api/send : 1
  DNT=1   -> POST gateway.umami.is/api/send : 0
  ```
  Caveat for whoever maintains this copy: Chrome and Safari have removed the DNT toggle from their UIs, so in practice few visitors can exercise it. It is a real opt-out, not a widely reachable one.

- **`NEXT_LOCALE` was removed, not documented.** The first draft of this work described `NEXT_LOCALE` as a technically necessary cookie that keeps your language while navigating. Testing that claim disproved it: with `NEXT_LOCALE=en` set, `/de` still rendered `lang="de"`. With `localeDetection: false` and no middleware, nothing ever read it — next-intl just writes it by default. `routing.ts` now sets `localeCookie: false`, so the site sets **no cookies of its own at all**. A cookie with no purpose is one you would have to defend as "necessary" on the `/cookies` page.

- **What the old site did, for comparison:** `graewe.com` still runs etracker with `data-block-cookies="true"` — already cookieless — *and* gates it behind a TYPO3 consent group (`"required": false`). So the legacy analytics needed no banner but had one anyway, and its numbers only ever counted visitors who clicked accept. Any year-on-year comparison against legacy etracker figures is apples-to-oranges: expect the new numbers to look like a jump that is really just the removal of consent-gating.

- **Implementation:** `src/lib/analytics.ts` (`getUmamiConfig()`) + `src/components/analytics/Analytics.tsx`, mounted in `src/app/[locale]/layout.tsx`. Loads only when **both** `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID` are non-blank — a half-configured beacon would ship a script that can never report while the privacy policy claims analytics run. `data-do-not-track="true"` is set, so the DNT opt-out promised in the Datenschutz text actually works. `deploy.yml` passes the vars only on `push`, so `swa-preview` PR builds cannot report into the production dataset.

- **Copy rewritten in all five locales** (the previous text asserted the opposite and became false the moment this shipped):
  - `cookiesPage.intro` — now states cookieless measurement, no banner required
  - `cookiesPage.noTrackingTitle` / `noTrackingBody` → **renamed** to `analyticsTitle` / `analyticsBody`. The old names asserted the opposite of the new content; a stale key name is how the next edit quietly reintroduces a false claim.
  - `cookiesPage.essentialBody` — now states plainly that the site itself sets no cookies (true once `localeCookie: false` landed), leaving only what the hosting/Turnstile infrastructure may set.
  - `privacyPage.cookiesLead` — dropped "etracker or comparable analytics tools are currently not used"
  - `privacyPage.analyticsTitle` / `analyticsBody` — **new Art. 13 section 4**; `linksTitle` 4→5, `newsletterTitle` 5→6, `infoRightsTitle` 6→7

- **Data location — got it wrong twice; settled on the third pass.** Worth reading before touching §4, because both wrong answers looked well-evidenced at the time.
  1. First draft asserted EU hosting and reduced the risk to an owner checkbox ("select the EU region") — an unverified fact dressed up as an action item.
  2. Second draft swung the other way and asserted processing happens **outside** the EU. Its evidence: `docs.umami.is/docs/cloud/regions` returning **404**, `eu.umami.is` not resolving to a regional endpoint, and ingest posting to a single global host. All three are worthless for this question — the docs URL was guessed, and `cloud.umami.is` / `gateway.umami.is` are shared global hosts that reveal nothing about where data is stored.
  3. Correct answer: Umami Cloud **does** have a data region, selected during signup ([docs](https://docs.umami.is/docs/cloud/sign-up)), and this account is set to **EU**. §4 now states EU storage, names the US processor (**Umami Software, Inc., 28 Geary St, Suite 650 #243, San Francisco, California**), and keeps the **Standard Contractual Clauses** from DPA §12 as the safeguard for possible access from a third country.

  Lesson for the next agent: **the data region is dashboard state and cannot be determined from the network.** Probing hosts yields confident-looking wrong answers in both directions. Ask the owner, or look in the account.

  This also means nothing in this repo can detect the region being changed. If the account is ever switched to US, §4 silently becomes false in all five locales.

- **The DPA needs no separate signature.** Its opening clause states it "forms part of the agreement between Umami Software, Inc. … and the customer entity that executes an Order Form, **accepts Umami's Terms of Service** … or otherwise uses the Services as a business customer." Signing up incorporates it, SCCs included via §12 — which is what §4's reference to a *concluded* processing agreement rests on.

- **Prerequisites — all resolved 2026-08-02:**
  - [x] Umami Cloud site created with the **EU** data region; repo vars `UMAMI_SRC` (`https://cloud.umami.is/script.js`) and `UMAMI_WEBSITE_ID` set. Live and verified on the production host: script present, correct website id, `data-do-not-track` set.
  - [x] DPA — incorporated automatically on ToS acceptance, no separate signature (see above).
  - [ ] **Still open:** a human should review the **DE** Datenschutz wording (analytics moved to §6 — renumbered by **ISSUE-065**, which extends the review to the whole document) — `SPEC.md` marks DE as the legally binding version. Two points deserve a conscious sign-off: retention is phrased by criterion ("only as long as required for statistical evaluation") rather than a fixed period, which is permissible under Art. 13(2)(a); and the third-country sentence deliberately says access "cannot be entirely ruled out" rather than claiming EU storage settles the question, because the processor is US-based.

- **Acceptance criteria:**
  - [x] Analytics loads only when fully configured; unit tests mutation-checked against gate removal, unmounting, DNT removal, and the preview-isolation guard.
  - [x] No cookie, `localStorage` or `sessionStorage` written by the tracker — measured, not assumed.
  - [x] `cookiesPage` / `privacyPage` copy matches what actually runs, in all five locales.
  - [x] `SPEC.md` §7 and §8 updated in the same PR.
  - [ ] Verified live after the repo vars are set (dashboard receives a pageview from the production host).

---

### ISSUE-065 — Datenschutzerklärung review: undisclosed Vimeo transfer, invalid consent clause, missing Art. 13/15–21 information
- **Status:** Done — 2026-08-02
- **Category:** Legal / compliance
- **Trigger:** the owner asked for a review of the **legally binding DE version** after ISSUE-064. The review found defects well beyond the analytics section, so the whole document was rewritten in all five locales.

- **What was wrong (each verified against this repo or the deployed host, not assumed):**
  1. **Vimeo transfer was undisclosed.** `src/components/home/HomeVideo.tsx` embeds a Vimeo player on the home page. It is a proper two-click solution — local thumbnail, `dnt=1`, no `<iframe>` in the deployed HTML of any page — but the click still sends the visitor's IP to a US provider and lets Vimeo write to the device. Nothing in the policy mentioned it. Now §7, with the click named as the Art. 6(1)(a) / TDDDG §25(1) consent.
  2. **Consent-by-submission.** The old `collectionP3` read *"Mit der Übermittlung Ihrer personenbezogenen Daten an uns erklären Sie sich … einverstanden."* Consent cannot be constructed from the act of sending a form (Art. 4(11), Art. 7). Deleted; the contact form now runs on Art. 6(1)(b)/(f) in §3.
  3. **No supervisory-authority complaint right** (Art. 13(2)(d) / 77) and no rights beyond Auskunft. §9 now carries Art. 15, 16, 17, 18, 20, 7(3), the Art. 21(1) objection right (which matters because access logs and analytics both run on 6(1)(f)), and the complaint right naming the LfDI Baden-Württemberg.
  4. **No controller identified** (Art. 13(1)(a)) — the policy never named GRAEWE. Now §1.
  5. **Server logs had no legal basis and no retention statement.** Now §2, on Art. 6(1)(f) with criterion-based retention.
  6. **Hosting was undisclosed.** `az staticwebapp list` → `swa-graewe-website-prod`, region **West Europe**, hostname `lively-meadow-097c4d503.7.azurestaticapps.net` (the host the deploy workflow publishes to). Microsoft is a processor and was not named. Now in §2 with SCCs.
  7. **Cookie claims were wrong in both directions.** `curl -I` against the deployed host returns `ARRAffinity` + `ARRAffinitySameSite` on *every* response, no `Expires` → session cookies. The policy hedged that cookies "may" be set by the browser or infrastructure; they are, always. Both are now named, with the TDDDG §25(2) no. 2 exemption. The Impressum separately claimed *"Wir verwenden Cookies ausschließlich, um Ihnen … mehr Bequemlichkeit bieten zu können"* — false since the app stopped setting any — and that access logs *"sind nicht personenbezogen"*, which is wrong for IP addresses under ECJ C-582/14 (Breyer). Both fixed.
  8. **A newsletter section for a newsletter that does not exist.** No signup exists anywhere in `src/`. Removed rather than left as a promise.
  9. **"Online-Bestellungen über unsere Webseite"** — there is no ordering flow — and *"so dass ein Ausspähen dieser Daten durch Dritte ausgeschlossen ist"*, an absolute guarantee TLS does not provide. Both replaced by a factual §3.

- **Deliberately NOT disclosed — Turnstile and Resend.** Both are implemented (`TurnstileWidget.tsx`, `contactEmail.ts`) but **not configured in production**: no `TURNSTILE_SITE_KEY` var, no `TURNSTILE_SECRET_KEY` / `RESEND_API_KEY` secret, no environment-scoped secrets, and the deployed `/de/kontakt` HTML contains no `challenges.cloudflare.com`. They process nothing today, so naming them would repeat exactly the error ISSUE-064 was filed for — asserting a fact not in evidence in a binding document. A processor that processes nothing cannot be under-disclosed. The change point is guarded instead: `.env.example` now warns, above both keys, that setting either requires adding the processor to §3 in all five locales in the same change.
  - **Update 2026-08-03 — the two are no longer symmetrical.** Turnstile has since been **decided against** (ISSUE-066), so its guard is *don't set the key*, not *disclose it if you do*. Resend is still merely pending and should be configured, with §3 updated in the same change. `.env.example` and `SPEC.md` §7 now say so at the point of temptation.
  - Side finding: because `RESEND_API_KEY` is unset in production, **the contact form cannot deliver mail right now** — it returns `503 email_unavailable`. That is a launch blocker independent of privacy; see the cutover checklist in `infra/DNS_CUTOVER.md`.

- **Completeness method.** Rather than grepping for suspected third parties, every external origin was extracted from the deployed HTML plus the `_next/static` CSS/JS of `/de`, `/de/kontakt`, `/de/produktrechner`, `/de/downloads`, `/de/gebrauchtmaschinen`, `/de/aktuelles`, `/de/produkte`, `/de/success-stories`. Only **`cloud.umami.is`** loads automatically. `facebook.com`, `youtube.com`, `next-machines.com`, `openstreetmap.org` and `google.com` appear as plain `<a>` links (Footer, contact map) with no embeds — stated as such in §8. `player.vimeo.com` appears only in the bundle, behind the click. Two sentences that survived from the old copy were re-checked rather than trusted: `ContactMap.tsx` renders `next/image` from a local `mapImageSrc` with plain `<a>` links to OSM/Google (so "keine Kartendienste von Drittanbietern beim Seitenaufruf" holds), and `HomeVideo` is imported only by `NewsTeaser`, which is imported only by `src/app/[locale]/page.tsx` (so "auf unserer Startseite" is accurate).

- **Structure now:** 1 Verantwortlicher · 2 Zugriffsdaten und Hosting · 3 Kontaktaufnahme und Kontaktformular · 4 Nutzung und Weitergabe · 5 Cookies · 6 Web-Analyse (Umami) · 7 Video (Vimeo) · 8 Links · 9 Ihre Rechte · 10 Sicherheitshinweis. Section numbers live inside the `*Title` strings, so **renumbering means touching five files**; every cross-reference between sections was deliberately made textual (`cookiesLead`, `hostingBody`, `rightsBody` all name the target section instead of numbering it), so inserting a section can no longer silently break one. `grep -oE "Abschnitt [0-9]" src/messages/*.json` returns nothing — keep it that way.

- **Acceptance criteria:**
  - [x] Every factual sentence traces to something verified in this session; nothing carried over on trust.
  - [x] All five locales rewritten together, keys renamed rather than reused (`infoRights*` → `rights*`, old `collectionP3` dropped, `hostingBody` / `contact*` / `video*` / `linksSocialBody` added).
  - [x] Impressum's duplicate privacy block corrected where it contradicts the policy.
  - [x] `SPEC.md` §7 updated: ARRAffinity, the §4→§6 renumber, the "only disclose processors that actually run" rule, and the warning not to make the Vimeo embed auto-load.
  - [ ] **Owner action:** have a DPO or counsel read the DE version. This is a rewritten binding document, produced by an AI from code evidence — the facts are verified, the legal judgement calls are not signed off. Specifically: retention stated by criterion rather than fixed periods (Art. 13(2)(a)); Art. 6(1)(f) chosen for access logs; no DPO named (add one to §1 if GRAEWE has designated one).
  - [ ] **Editorial call:** the Impressum still duplicates a shortened privacy block (`privacyBody`, `securityBody`, `techBody`, `logsBody`, `cookiesBody`). It is now consistent with the policy, but two documents saying the same thing will drift again. Recommend deleting the block from the Impressum and linking to `/datenschutz` — not done here, since it is a content decision.

---

### ISSUE-049 — Product lightbox is not a real dialog
- **Status:** Done — lightbox is `role="dialog" aria-modal` with `useDismissibleOverlay` (Escape, focus trap, focus return), body scroll lock, bottom nav controls (no overlap at 320px), and swipe navigation; `lightboxAria` in all 5 locales.
- **Category:** A11y / Mobile
- **Problem:** The gallery lightbox is a plain `div` overlay: no `role="dialog"` / `aria-modal`, no focus trap, no `Escape` handler, no body scroll lock — so on a phone the page scrolls behind the open image and there is no keyboard dismissal. No swipe gesture either, and the prev/next buttons sit at `left-4`/`right-4` over the image on narrow screens.
- **Evidence:** `src/components/products/ProductDetailContent.tsx` — `grep` for `role="dialog"|aria-modal|Escape` returns nothing; the overlay and its controls are at `:105-140`.
- **Likely files:** `src/components/products/ProductDetailContent.tsx`
- **Acceptance criteria:**
  - [x] `role="dialog" aria-modal="true"` with an accessible name; focus moves in on open, returns to the thumbnail on close.
  - [x] `Escape` closes; focus trapped; body scroll locked.
  - [x] Controls do not overlap image content at 320 px; swipe navigation on touch.

---

## P2 — Hardening & polish

### ISSUE-066 — Contact-form spam protection is honeypot-only, by decision; Turnstile ruled out
- **Status:** **Decided 2026-08-03 (owner).** Honeypot + rate limit are the spam protection for
  launch. **Turnstile will not be enabled** — the Datenschutz cost is not worth it for this form.
  Left open only for the optional cheap hardening at the bottom; the Turnstile question is closed.
- **Category:** Security / spam
- **Trigger:** found while walking through the `RESEND_API_KEY` setup (ISSUE-065 side finding). The code has three spam defences; only two of them actually run.

- **What is live today, and what is not:**
  | Defence | Where | Live in production? |
  |---|---|---|
  | Honeypot | `contactSpam.ts:12` + `ContactForm.tsx:169-181` | **Yes** — pure server/client logic, no key needed |
  | Per-IP rate limit | `contactSpam.ts:29-45` | **Yes, but best-effort** — see caveat |
  | Cloudflare Turnstile | `TurnstileWidget.tsx`, `contactSpam.ts:60-100` | **No** — no keys configured |

  The honeypot needs no "activation" — it has been running since the form shipped. What is switched
  off is Turnstile: `gh variable list` / `gh secret list` (2026-08-03) show no `TURNSTILE_SITE_KEY`
  and no `TURNSTILE_SECRET_KEY`. With the site key empty `ContactForm` omits the widget; with the
  secret empty `verifyTurnstileToken()` returns `{ ok: true }` **without calling Cloudflare**
  (`contactSpam.ts:65-67`) — it fails *open*, by design, so local dev works without keys. The
  consequence is that the defence the code calls "the primary gate" (`contactSpam.ts:9`) is a no-op
  in production.

- **Rate-limit caveat (weaker than it reads):** `rateBuckets` is an in-memory `Map` on a serverless
  Azure Function. Instances are ephemeral and scale out, so the 5-per-15-min ceiling is per-instance,
  not per-site. Do not count it as a real cap.

- **Why Turnstile is ruled out — the reasoning, so nobody re-opens it casually.** Blast radius is
  inbox noise, not compromise: `to` and `from` are both fixed from env (`contactEmail.ts:60-67`) and
  only reply-to comes from the visitor, so the form cannot be driven as an open relay. Against that,
  enabling Turnstile adds **Cloudflare, Inc. (US) as a processor** — an Art. 13(1)(f) third-country
  disclosure plus SCCs in §3 of the Datenschutzerklärung in all five locales, and it likely disturbs
  §5, which now states that the only cookies set are Azure's two `ARRAffinity` session cookies
  (possible TDDDG §25(1) consent question). That is the exact change `.env.example` warns about above
  the Turnstile keys. Taking on a US processor, and a fresh consent question in a binding document
  that was just rewritten, to filter nuisance mail from a B2B contact form is a bad trade. **Do not
  set the Turnstile keys without re-opening this decision with the owner** — the keys alone would
  silently put an undisclosed processor into production.

- **What would change the decision:** spam arriving in `CONTACT_EMAIL_TO` at a rate that actually
  annoys whoever reads it, *and* the cheap hardening below having already failed to stop it. Turnstile
  is the last resort here, not the next step.

- **Dead-code note:** the Turnstile implementation (`TurnstileWidget.tsx`, `verifyTurnstileToken`,
  the localized captcha error strings) stays in the tree, unreachable while the keys are unset. It is
  tested and costs nothing to keep, and removing it would mean touching five locale files to delete
  the error strings. If it is still unused a few months after launch, deleting it is reasonable
  cleanup — but that is a separate decision, and `.env.example`'s warning must survive it in some form.

- **Cheap hardening — the only work left in this issue** (no processor, no privacy copy, no new
  disclosure). Worth more now than before, since the honeypot is the whole gate:
  1. Rename the honeypot field. `CONTACT_HONEYPOT_FIELD = "website"` (`contactSpam.ts:2`) is one of
     the most-guessed honeypot names, and the input is a plain off-screen `div` at `-9999px` with
     `aria-hidden`. Any non-obvious name (`fax_2`) is strictly better; it is a single constant read
     by both sides.
  2. Add a submit-timing check — render timestamp in a hidden field, reject server-side under ~2 s.
     Humans never manage it; scripted posts nearly always do.

  Both stop the realistic bypass (a headless browser that respects computed visibility) without
  touching the Datenschutzerklärung at all. Note the timing check is a check on *submission timing*,
  not on message content — it is unaffected by the ISSUE-067 decision.

- **Likely files:** `src/lib/contactSpam.ts`, `src/components/contact/ContactForm.tsx`,
  `src/app/api/contact/route.ts`
- **Acceptance criteria (if the hardening is picked up):**
  - [ ] Honeypot field renamed away from `website`; the constant is the only place it is defined.
  - [ ] Submit-timing check rejects sub-threshold posts server-side, with unit tests.
  - [ ] No new third-party processor introduced — that is the whole point of preferring these.
  - [x] ISSUE-006's acceptance criterion corrected to reflect production, not code presence.

---

### ISSUE-067 — No content-level spam filtering on contact-form submissions
- **Status:** **Not doing for launch — decided 2026-08-03 (owner).** Raised, scoped, then dropped the
  same day: not worth building before there is evidence of a problem. Kept on file rather than
  withdrawn, because the premise is still true and the analysis below is the reason not to start from
  scratch if it ever comes back. **Do not implement this unopened** — reopen with the owner first.
- **Category:** Security / spam
- **Depends on:** nothing. Independent of DNS handover and of ISSUE-066.

- **Problem:** ISSUE-066's defences all answer "is this submitter a bot?". Nothing looks at *what was
  submitted*. A human spammer, or a bot that clears the honeypot, gets their payload delivered
  verbatim to `CONTACT_EMAIL_TO`.

- **Why the mailbox will not catch it — the point that makes this issue non-obvious.** Contact-form
  mail is sent `website@graewe.com` → `info@graewe.com` through Resend, over a domain whose SPF/DKIM
  we control and will have verified. To Exchange Online Protection / Gmail that is authenticated,
  aligned, first-party mail from a trusted sender — it will be delivered, and inbox spam filters will
  not touch it however spammy the *body* is. **Filtering therefore has to happen in
  `src/app/api/contact/route.ts`, before `sendContactEmail()` is called.** Do not go looking for a
  mailbox rule or a Resend setting; Resend is send-only and has no inbound filtering (its abuse
  monitoring protects Resend's IP reputation, not this inbox).

- **Cheap option (recommended — €0, no processor, no privacy disclosure):** score the payload
  server-side with heuristics and act on the score. Signals that work well on a German/EN B2B
  industrial form: count of URLs in `message` (a genuine enquiry rarely has 3+), BBCode/HTML markup,
  script-mismatch (Cyrillic body on the DE form), classic pharma/SEO/crypto keyword sets, message
  length at both extremes, and name/email fields that fail a plausibility check. Keep the rules in
  one testable module beside `contactSpam.ts` so they are unit-testable like the rest.

  **Prefer tagging over rejecting.** A false positive is a lost sales lead, which costs far more than
  a spam mail costs. Deliver flagged submissions with a subject prefix (`[SPAM?] …`) or a header so
  the recipient can file them with one Outlook rule, and hard-reject only on an overwhelming score.

- **Paid option (only if heuristics prove insufficient):** a classification service such as Akismet.
  Commercial use is paid — check current pricing rather than assuming. Note the same cost ISSUE-066
  describes: it means shipping submission content to a **US processor** (Automattic), so it triggers
  the `.env.example` rule and needs §3 of the Datenschutzerklärung updated in all five locales in the
  same change. The heuristic option avoids that entirely, which is most of why it is recommended.

- **Why it was dropped.** Every filter has a false-positive rate, and a false positive here is a lost
  sales enquiry — the failure mode is worse than the problem it solves. With no spam observed yet
  there is nothing to tune against, so any ruleset written today would be guesswork calibrated on
  imagined traffic. Cheaper to wait for real examples: if spam starts arriving, the messages
  themselves become the test fixtures, and the heuristics can be written against evidence instead.

- **Likely files (if it ever comes back):** new `src/lib/contactSpamContent.ts` (+ tests),
  `src/app/api/contact/route.ts`, `src/lib/contactEmail.ts` (subject prefix)
- **Acceptance criteria (deferred with the issue):**
  - [ ] Scoring runs before send, is unit-tested with both spam and genuine-enquiry fixtures, and is
        locale-agnostic (must not penalise RU or ES submissions for being RU or ES — the site serves
        five locales and a Cyrillic enquiry is a *customer*, not a signal on its own).
  - [ ] Flagged mail is still delivered, marked, unless the score is overwhelming; the threshold and
        its rationale are written down.
  - [ ] No new processor without the matching Datenschutzerklärung change in the same PR.

---

### ISSUE-054 — Azure SWA hosting of a `standalone` Next build is unverified end-to-end
- **Status:** Done — E2E verified on Azure default hostname 2026-07-29; standalone start + HSTS + `swa-preview` label gate + `infra/DEPLOY.md`. Residual: Free SKU still 3 staging slots (raise via Terraform when needed); `www.graewe.com` still TYPO3 until DNS cutover.
- **Category:** Ops
- **Problem:** `next.config.ts` sets `output: "standalone"` and the app needs SSR — a proxy, a dynamic `/api/contact` route, and dynamic query-param redirects. The deploy workflow hands the repo to `Azure/static-web-apps-deploy@v1` with `app_location: "/"`, `api_location: ""`, `output_location: ""`, letting Oryx run its own build. The workflow is green, but **green means "the action uploaded something"** — nobody has confirmed the deployed site actually runs the proxy or the API route. The Oryx log even warns: `For Next.js apps, staticwebapp.config.json features are not fully supported yet!`
- **Note 1:** `npm run start` (`next start`) is **the wrong entry point for this config**, and Next says so: `⚠ "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.` It serves pages anyway, which is why nobody has noticed — but `playwright.config.ts:21` uses `npm run build && npm run start` as its `webServer`, so **e2e does not exercise the artifact that ships**.
- **Note 2:** `staticwebapp.config.json` sets `globalHeaders` but no `Strict-Transport-Security`. Add it once HTTPS on the custom domain is confirmed.
- **Note 3 — PR preview deploys are currently broken by quota, so every PR shows a red `Deploy` check:**
  ```
  The content server has rejected the request with: BadRequest
  Reason: This Static Web App already has the maximum number of staging environments
  ```
  `infra/variables.tf` defaults `swa_sku_tier` to `Free` (commit `0dba437`), which caps **concurrent** staging environments at a small number (3 on Free).

  **The teardown mechanism does work** — verified on runs `30482461415` and `30483207703`, where `deploy.yml`'s `close_pull_request` job reported `Close PR = success` on merge. So this is *not* a backlog of orphaned environments; it is a concurrency cap. Do not go hunting for stale environments to reclaim.

  The practical consequence is that the cap is reached whenever enough PRs are open at once, and every affected PR then shows a red `Deploy` check — which is how a real deploy failure gets waved through. Decide whether the Free SKU is right for a repo with this many parallel agents.
- **Evidence (re-verified 2026-07-29 against `origin/main` + live Azure):**
  - Oryx on successful main deploy `30489323390`: `Detected standalone folder, so using it for deployment` → `Deployment Complete` → https://lively-meadow-097c4d503.7.azurestaticapps.net
  - curl E2E on that host: `/` → `307` `/de`; `/en` → `200` + `NEXT_LOCALE=en`; legacy job query → `301` `/de/stellenanzeigen/elektriker-elektroniker`; `POST /api/contact` `{}` → `400` `Missing required fields`; platform HSTS present
  - Quota failure still real on unrestricted PR deploys (e.g. `30489426955`); teardown still not the issue
  - `www.graewe.com` still Apache/TYPO3 (cutover not done)
- **Likely files:** `.github/workflows/deploy.yml`, `next.config.ts`, `staticwebapp.config.json`, `playwright.config.ts`, `infra/DNS_CUTOVER.md`
- **Acceptance criteria:**
  - [x] A staging deploy verified end-to-end **on Azure**: `/` → `/de`, a locale switch, `POST /api/contact`, and a legacy `?tx_tanjoboffers_jobdetail[job]=9` redirect. (SWA default hostname = pre-cutover staging; see `infra/DEPLOY.md`)
  - [x] `playwright.config.ts` `webServer` and the documented production command use `node .next/standalone/server.js` (`package.json` `start` + README / SPEC / DEPLOY.md).
  - [x] `Strict-Transport-Security` added to `globalHeaders` (Azure already sent HSTS on the default HTTPS host; config now declares it explicitly). ⚠️ This was only half-true until ISSUE-061 — the header was added to the committed JSON but never to the generator, and the test suite rewrote the JSON from the generator, silently deleting it again.
  - [x] The PR `Deploy` check is meaningful under parallel load — PR Azure uploads run **only** with the `swa-preview` label (≤3 concurrent on Free); `main` uses concurrency group `swa-production` with `cancel-in-progress: false`. SKU remains Free until Terraform apply raises it.
  - [x] Deploy method documented in `infra/DEPLOY.md`.

---

### ISSUE-044 — Partner link `next-machines.com` is served over plain HTTP
- **Status:** Done — switched footer + gebrauchtmaschinen partner links to `https://www.next-machines.com` (cert verified 200/307).
- **Category:** Security / Polish
- **Problem:** The "next — Second Hand · First Quality" partner link points to `http://www.next-machines.com`: an unencrypted outbound link from an HTTPS page.
- **Evidence:** `src/components/layout/Footer.tsx:147`.
- **Likely files:** `src/components/layout/Footer.tsx`
- **Acceptance criteria:**
  - [x] Link uses `https://` — confirm the target serves a valid certificate first.
  - [x] Grep for any other `http://` external links in `src/`.

> **Do not "fix" the `tel:` link.** `src/components/layout/Footer.tsx:60` is `tel:+4976317944-0`.
> RFC 3966 permits `-` as a *visual separator* inside `phone-digits`; dialers strip it, giving
> `+49763179440` — country 49, Neuenburg 7631, PBX 7944, Durchwahl 0. That is the correct main line.
> Rewriting it to `tel:+4976317944` **drops the trailing 0 and breaks it.**

---

### ISSUE-050 — Root `/` is a `<meta http-equiv="refresh">` stub
- **Status:** Done — `src/app/page.tsx` now uses `redirect()` (HTTP 307 → `/de`); bare `/` excluded from next-sitemap; SPEC §4 updated.
- **Category:** SEO
- **Problem:** `src/app/page.tsx` renders a meta-refresh page with visible "Redirecting to ./de/…" text. Meta refresh is a soft redirect: crawlers may index the stub, and users on a slow connection see placeholder text. The proxy handles `/` correctly on the SSR path, so this stub only surfaces in the static-export path — where it is still wrong, and where it carries no `noindex`.
- **Evidence:** `src/app/page.tsx:7` — `<meta httpEquiv="refresh" …>`; no `robots` meta. Verified against a production build: `/` → `307` → `/de` on the SSR path.
- **Likely files:** `src/app/page.tsx`, `next-sitemap.config.js`, `staticwebapp.config.json`
- **Acceptance criteria:**
  - [x] `/` issues a real 307/308 on the deployed target, not a meta refresh.
  - [x] The bare-domain URL is excluded from the sitemap, or is the canonical entry that redirects.

---

### ISSUE-052 — No `error.tsx` or `global-error.tsx`
- **Status:** Done — added `src/app/[locale]/error.tsx` (localized, keeps header/footer) and `src/app/global-error.tsx` (last-resort; locale from pathname); verified via production `next start` throw route
- **Category:** Bug / UX
- **Problem:** Localized 404 pages now exist at `src/app/not-found.tsx` and `src/app/[locale]/not-found.tsx`. There is still **no error boundary anywhere**, so any thrown render error in production shows Next's unstyled default error page — no header, no footer, no localisation.
- **Evidence:** `find src -name "error.tsx" -o -name "global-error.tsx"` → no matches (`not-found.tsx` ×2 present).
- **Likely files:** new `src/app/[locale]/error.tsx`, `src/app/global-error.tsx`
- **Acceptance criteria:**
  - [x] Branded, localized error page inside the locale layout.
  - [x] `global-error.tsx` as the last-resort boundary.
  - [x] Verified against a production build, not dev.

---

### ISSUE-051 — Harden `generateMetadata` against an unvalidated locale
- **Status:** Done — `generateMetadata` now calls `hasLocale` + `notFound()` before the dynamic messages import (defense-in-depth; HTTP still not reachable via proxy as before).
- **Category:** Hardening
- **Problem:** `generateMetadata` does `await import(\`@/messages/${locale}.json\`)` **before** any validation; `hasLocale()` is only checked later in the layout body. An unvalidated locale reaching the import would reject with module-not-found and surface as a 500 instead of `notFound()`.
- **Evidence — tested against a production build; it does not currently trigger:**
  ```
  /xx/kontakt     -> 307 -> /de/xx/kontakt
  /de/xx/kontakt  -> 404
  /fr/xx          -> 404
  ```
  The proxy prefixes the unknown segment rather than treating it as a locale. Source: `src/app/[locale]/layout.tsx:20` (import) vs the later `hasLocale` check.
- **Why keep it:** the ordering is only safe because of how `src/proxy.ts` happens to behave, and the export path has no proxy at all.
- **Likely files:** `src/app/[locale]/layout.tsx`
- **Acceptance criteria:**
  - [x] `generateMetadata` validates with `hasLocale` and calls `notFound()` before importing messages.
  - [x] The routes above still behave as listed.

---

## Withdrawn

Issues from the first draft of this file that **do not reproduce on `6dd1a0a`**. Kept for history so
nobody re-files them. None of these were ever merged as open items.

| ID | Title | Why withdrawn |
|---|---|---|
| **034** | `npm run lint` fails, CI red on `main` | **Premise false.** `npm run lint` is clean after `npm ci`; the `react-hooks/set-state-in-effect` error came from a local `node_modules` drifted from the lockfile. CI's `quality` job passes. The `Header` menu-close logic was also refactored away from the effect. |
| **035** | Contact form reports success when no email is sent | Fixed upstream (`45efa28`) — the route fails closed; `deploy.yml` now passes `RESEND_API_KEY` / `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM`. |
| **038** | Form labels not associated with inputs | Fixed upstream — measured 6/6 `htmlFor` + `id` on the contact form (5 with `autoComplete`) and 4/4 on the calculator via `CalculatorField.tsx`. |
| **040** | Submissions interpolated unescaped into the email | Fixed upstream — `escapeHtml()` now wraps name, firstName, email, phone and message. |
| **048** | Dead variable in `calculator.ts` | Fixed upstream by the ISSUE-031 parity work; `pipeLengthPerRotation` is gone and lint is warning-free. |
| **053** | Vimeo iframe loads before consent | Fixed upstream — `HomeVideo.tsx` is a click-to-load facade with `dnt=1` and a localized play label. |
| **055** | Leftover Next.js starter SVGs | Fixed upstream (`45c464c`) — `public/*.svg` removed. |
| **056** | E2E strict-mode violation on duplicate nav | No longer reproduces; the nav markup changed. A different, real e2e failure exists — see **ISSUE-059**. |

---

## Cross-references (existing issues)

| Existing | Note from this audit |
|---|---|
| **ISSUE-006** (captcha) | **Closed as won't-do on captcha, 2026-08-03.** The earlier note ("appears done — confirm and close it") was written from code presence alone: Turnstile is wired but **inert in production** — no keys, and `verifyTurnstileToken` fails open without a secret. That is now the accepted end state; honeypot + rate limit are the spam protection. Do not set the Turnstile keys without re-opening **ISSUE-066**. |
| **ISSUE-019** (`MENÜ` hardcoded) | **Appears done** — now `t("menu")` / `t("menuAria")`. Remaining hardcoded strings are ISSUE-045. |
| **ISSUE-031** (calculator parity) | The dead `pipeLengthPerRotation` variable is gone; treat the formula question as settled by that work. |
| **ISSUE-032** (Resend before cutover) | Code and workflow are wired; what remains is the live inbox test. |
| **ISSUE-033** (404 rewrites to `/de`) | `not-found.tsx` pages landed; error boundaries are still missing — ISSUE-052. |

---

## Suggested work order

| Order | Issue IDs | Rationale |
|---|---|---|
| 1 | 058 | A pipeline has been red on every push for hours; decide keep-or-delete before anything else |
| 2 | 036 | Every page scrolls sideways on small phones |
| 3 | 041, 042, 050 | SEO plumbing must be right *before* DNS cutover |
| 4 | 047, 059 | Get e2e green and into CI, so the mobile fixes below stay fixed |
| 5 | 037, 043, 057 | One duplicate-render/hidden-overlay cluster across nav and carousel |
| 6 | 039, 045, 046, 049 | Remaining a11y and i18n |
| 7 | 044, 051, 052, 054 | Polish, hardening, deploy verification |

---

## Method / reproducibility

- Overflow figures come from same-origin iframes at fixed widths (320 px, 390 px), comparing `documentElement.scrollWidth` with `contentWindow.innerWidth`, then walking the DOM for elements whose `scrollWidth > clientWidth`. Chrome cannot resize its own window below ~400 px, so top-level `resize` is **not** a valid substitute — it silently reports the old width.
- Tap-target, label and `aria` counts come from `getBoundingClientRect()` and attribute counts in the same iframes.
- SEO figures come from `curl` against the dev server plus `grep` over the server-rendered HTML — no client JS involved, so they reflect what a crawler sees.
- Contrast ratios are computed from the token values in `src/app/globals.css`; re-verify with a checker before changing tokens.
- CI history via `gh run list --workflow=<file> --branch main`.
