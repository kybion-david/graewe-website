# GRAEWE Website — Production Readiness & Bug Queue

Technical debug pass over the rebuild in this repository, focused on **shipping quality**:
build/CI health, runtime bugs, mobile behaviour, accessibility, SEO plumbing, and security.

**Audited: 2026-07-29 against `origin/main` @ `6dd1a0a`** (merge of PR #33).
Method: `npm ci` → `type-check` / `lint` / `test` / `build` / `test:e2e`, Next 16 dev server,
Chrome DOM measurements in fixed-width iframes (320 px, 390 px), server-rendered HTML via `curl`,
GitHub Actions run history via `gh`.

This is a **different axis** from [`SITE_COMPARISON_ISSUES.md`](./SITE_COMPARISON_ISSUES.md), which
compares content/parity against the live `graewe.com`. That file owns ISSUE-001 … ISSUE-033.
**This file owns ISSUE-034 … ISSUE-059.** Do not reuse IDs across the two files.

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
- **Status:** Open — **partially addressed upstream**
- **Category:** A11y / UX
- **Problem:** `aria-required` is now set on required fields (good), but React Hook Form errors still only swap a CSS class. No error text is rendered, no `aria-invalid`, no `aria-describedby`, and the success/error banners are not live regions. A screen-reader user submitting an incomplete form still gets no feedback (WCAG 3.3.1 / 4.1.3), and colour-only error signalling fails WCAG 1.4.1.
- **Evidence:** `src/components/contact/ContactForm.tsx` — `errors.*` appears only at lines 145, 157, 172, 198, always as `className={errors.X ? inputError : inputNormal}`. `grep` for `aria-invalid|aria-describedby|role="status"|role="alert"|aria-live` in that file returns **nothing**.
- **Related:** `zod` and `@hookform/resolvers` are still dependencies and `SPEC.md` §2 still says "React Hook Form + **Zod**", but `grep` for `zodResolver|from "zod"` across `ContactForm.tsx`, `api/contact/route.ts` and `lib/contactEmail.ts` returns nothing.
- **Likely files:** `src/components/contact/ContactForm.tsx`, `src/app/api/contact/route.ts`, `src/messages/*.json`, `SPEC.md`
- **Acceptance criteria:**
  - [ ] Per-field error text in all five locales, linked via `aria-describedby`, with `aria-invalid`.
  - [ ] Success/error banners announced (`role="status"` / `role="alert"`).
  - [ ] Zod is either wired up (shared schema, client + API) or removed from deps and `SPEC.md`.

---

### ISSUE-043 — Hero carousel auto-rotates with no pause control and 4 px-tall dots
- **Status:** Open
- **Category:** A11y / Mobile
- **Problem:** Three defects in one component.
  1. Advances every 6 s with no pause/stop/hide affordance, and no pause on hover or focus — WCAG 2.2.2 failure.
  2. Progress-dot buttons are `h-1 w-8` (desktop) and `h-1 w-6` (mobile) — **measured 24×4 px**. WCAG 2.2 §2.5.8 requires 24×24 px.
  3. A `setInterval` fires every 50 ms for the progress bar and never pauses when the tab is hidden or under `prefers-reduced-motion` — continuous re-render and battery drain on mobile.
- **Evidence:** `src/components/home/HeroCarousel.tsx:38` (auto-advance), `:43` (50 ms progress interval), `:119` (`h-1 w-8`), `:243` (`h-1 w-6`). `grep` for `prefers-reduced|visibilitychange|paused` returns nothing. Measured on `/de` at 390 px: 40 interactive elements under 24 px tall, including six `24x4` buttons.
- **Likely files:** `src/components/home/HeroCarousel.tsx`
- **Acceptance criteria:**
  - [ ] A visible pause/play control, or auto-advance removed.
  - [ ] Auto-advance and progress interval stop on hover, on focus within the carousel, when `document.hidden`, and under `prefers-reduced-motion: reduce`.
  - [ ] Dot controls have a ≥24×24 px hit area (padding or `::before`; the visual bar can stay thin).
  - [ ] Off-screen slides hidden from assistive tech; region marked up as a carousel.

---

### ISSUE-057 — Phones download the desktop hero image; all 10 carousel images mount at once
- **Status:** Open
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
  - [ ] Exactly one hero preload per viewport (or two with correct `media`).
  - [ ] A 390 px client does not fetch the 828/1920 px variants — verify in DevTools Network.
  - [ ] Non-visible slides are not eagerly fetched.
  - [ ] Consider WebP/AVIF sources where helpful (Azure SWA uses Next image optimization with avif/webp).

---

### ISSUE-045 — Hardcoded strings still leak into all five locales
- **Status:** Open — **partially addressed upstream**
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
  - [ ] Every string in the table and every non-proper-noun `aria-label` reads from `next-intl`.
  - [ ] Keys added to **all five** locale files with real translations.
  - [ ] A grep for hardcoded JSX text in `src/components` and `src/app` returns only proper nouns.

---

### ISSUE-046 — Footer legal links fail contrast; `text-grey-400` fails on light surfaces
- **Status:** Open
- **Category:** A11y
- **Problem:** Two token misuses produce sub-AA contrast.
  1. `text-grey-500` (`#6b6b6b`) on `bg-bg-footer` (`#2a2a2a`) ≈ **2.8:1** — the copyright line and the Kontakt / Impressum / Datenschutz / Sitemap / Cookies links, at `text-xs`. Needs 4.5:1.
  2. `text-grey-400` (`#9e9e9e`) on white ≈ **2.7:1** — the uppercase section headings in the mobile drawer, the desktop dropdown, and the "Galerie" label. Needs 4.5:1 (12 px uppercase does not qualify as large text).
- **Evidence:** tokens unchanged at `src/app/globals.css:18-19, 24`. Usages: `Footer.tsx:163, 167-171` (`text-grey-500`); `MobileMenu.tsx:60, 75`, `Header.tsx:149, 163, 180`, `ProductDetailContent.tsx:68` (`text-grey-400`). Measured 19–23 interactive elements under 24 px tall per page, footer links at `358x20`.
- **Likely files:** `src/app/globals.css`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/Header.tsx`
- **Acceptance criteria:**
  - [ ] All body and link text reaches ≥4.5:1 against its actual background (use a checker, not the eye).
  - [ ] Fix at token level where possible; update `SPEC.md` §5 if token values change.
  - [ ] Footer legal links are ≥24 px tall.

---

### ISSUE-047 — E2E is not in the CI gate, and covers desktop Chrome only
- **Status:** Open
- **Category:** Testing / Mobile
- **Problem:** Two gaps that compound.
  1. `.github/workflows/deploy.yml` gates on type-check, lint and **unit** tests only. Playwright never runs in CI — which is exactly why ISSUE-059 went unnoticed.
  2. `playwright.config.ts` defines a single project, `devices["Desktop Chrome"]`. Mobile is a stated requirement, the mobile menu has been fixed twice, and ISSUE-036 is a pure small-viewport regression — none of which any current test would catch.
- **Evidence:** `playwright.config.ts:14-19` (single project), `:21` (`webServer` command). `.github/workflows/deploy.yml` `quality` job steps: Type check, Lint, Unit tests.
- **Likely files:** `playwright.config.ts`, `tests/e2e/*`, `.github/workflows/deploy.yml`
- **Acceptance criteria:**
  - [ ] E2E runs in CI on PRs.
  - [ ] A `Mobile Chrome` project (e.g. `devices["Pixel 5"]`) plus a 320 px-wide project.
  - [ ] A spec asserting `document.documentElement.scrollWidth <= window.innerWidth` on a representative route list at both widths.
  - [ ] A spec covering: open drawer → tap link → navigates **and** closes; tap the current page's own link → closes.

---

### ISSUE-059 — An e2e test has been broken since it was written
- **Status:** Open
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
  - [ ] The assertion matches the real accessible name (drop the anchors, or exclude the marker from the label and expose it via `aria-required` only).
  - [ ] `npx playwright test` is 32/32 green from a clean port 3000.
  - [ ] Audit the other anchored `getByLabel` assertions for the same trap.

---

### ISSUE-049 — Product lightbox is not a real dialog
- **Status:** Open
- **Category:** A11y / Mobile
- **Problem:** The gallery lightbox is a plain `div` overlay: no `role="dialog"` / `aria-modal`, no focus trap, no `Escape` handler, no body scroll lock — so on a phone the page scrolls behind the open image and there is no keyboard dismissal. No swipe gesture either, and the prev/next buttons sit at `left-4`/`right-4` over the image on narrow screens.
- **Evidence:** `src/components/products/ProductDetailContent.tsx` — `grep` for `role="dialog"|aria-modal|Escape` returns nothing; the overlay and its controls are at `:105-140`.
- **Likely files:** `src/components/products/ProductDetailContent.tsx`
- **Acceptance criteria:**
  - [ ] `role="dialog" aria-modal="true"` with an accessible name; focus moves in on open, returns to the thumbnail on close.
  - [ ] `Escape` closes; focus trapped; body scroll locked.
  - [ ] Controls do not overlap image content at 320 px; swipe navigation on touch.

---

## P2 — Hardening & polish

### ISSUE-054 — Azure SWA hosting of a `standalone` Next build is unverified end-to-end
- **Status:** Open
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
- **Evidence:** `.github/workflows/deploy.yml` `deploy` job; `next.config.ts`; Oryx warning in run `30480939032`; `next start` warning reproduced locally.
- **Likely files:** `.github/workflows/deploy.yml`, `next.config.ts`, `staticwebapp.config.json`, `playwright.config.ts`, `infra/DNS_CUTOVER.md`
- **Acceptance criteria:**
  - [ ] A staging deploy verified end-to-end **on Azure**: `/` → `/de`, a locale switch, `POST /api/contact`, and a legacy `?tx_tanjoboffers_jobdetail[job]=9` redirect.
  - [ ] `playwright.config.ts` `webServer` and the documented production command use `node .next/standalone/server.js`.
  - [ ] `Strict-Transport-Security` added to `globalHeaders`.
  - [ ] The PR `Deploy` check is green under normal parallel load — either by raising `swa_sku_tier` above `Free`, or by capping how many PRs run preview deploys — so a red check means something again.
  - [ ] Deploy method documented so the next agent need not re-derive it.

---

### ISSUE-044 — Partner link `next-machines.com` is served over plain HTTP
- **Status:** Open
- **Category:** Security / Polish
- **Problem:** The "next — Second Hand · First Quality" partner link points to `http://www.next-machines.com`: an unencrypted outbound link from an HTTPS page.
- **Evidence:** `src/components/layout/Footer.tsx:147`.
- **Likely files:** `src/components/layout/Footer.tsx`
- **Acceptance criteria:**
  - [ ] Link uses `https://` — confirm the target serves a valid certificate first.
  - [ ] Grep for any other `http://` external links in `src/`.

> **Do not "fix" the `tel:` link.** `src/components/layout/Footer.tsx:60` is `tel:+4976317944-0`.
> RFC 3966 permits `-` as a *visual separator* inside `phone-digits`; dialers strip it, giving
> `+49763179440` — country 49, Neuenburg 7631, PBX 7944, Durchwahl 0. That is the correct main line.
> Rewriting it to `tel:+4976317944` **drops the trailing 0 and breaks it.**

---

### ISSUE-050 — Root `/` is a `<meta http-equiv="refresh">` stub
- **Status:** Open
- **Category:** SEO
- **Problem:** `src/app/page.tsx` renders a meta-refresh page with visible "Redirecting to ./de/…" text. Meta refresh is a soft redirect: crawlers may index the stub, and users on a slow connection see placeholder text. The proxy handles `/` correctly on the SSR path, so this stub only surfaces in the static-export path — where it is still wrong, and where it carries no `noindex`.
- **Evidence:** `src/app/page.tsx:7` — `<meta httpEquiv="refresh" …>`; no `robots` meta. Verified against a production build: `/` → `307` → `/de` on the SSR path.
- **Likely files:** `src/app/page.tsx`, `next-sitemap.config.js`, `staticwebapp.config.json`
- **Acceptance criteria:**
  - [ ] `/` issues a real 307/308 on the deployed target, not a meta refresh.
  - [ ] The bare-domain URL is excluded from the sitemap, or is the canonical entry that redirects.

---

### ISSUE-052 — No `error.tsx` or `global-error.tsx`
- **Status:** Open — **narrowed; `not-found.tsx` landed upstream**
- **Category:** Bug / UX
- **Problem:** Localized 404 pages now exist at `src/app/not-found.tsx` and `src/app/[locale]/not-found.tsx`. There is still **no error boundary anywhere**, so any thrown render error in production shows Next's unstyled default error page — no header, no footer, no localisation.
- **Evidence:** `find src -name "error.tsx" -o -name "global-error.tsx"` → no matches (`not-found.tsx` ×2 present).
- **Likely files:** new `src/app/[locale]/error.tsx`, `src/app/global-error.tsx`
- **Acceptance criteria:**
  - [ ] Branded, localized error page inside the locale layout.
  - [ ] `global-error.tsx` as the last-resort boundary.
  - [ ] Verified against a production build, not dev.

---

### ISSUE-051 — Harden `generateMetadata` against an unvalidated locale
- **Status:** Open — **low confidence, not currently reachable**
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
  - [ ] `generateMetadata` validates with `hasLocale` and calls `notFound()` before importing messages.
  - [ ] The routes above still behave as listed.

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
| **ISSUE-006** (captcha) | **Appears done** — Turnstile widget, honeypot and rate limiting are all present. Confirm and close it. |
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
