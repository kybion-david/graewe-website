# GRAEWE Website — Production Readiness & Bug Queue

Technical debug pass over the rebuild in this repository, focused on **shipping quality**:
build/CI health, runtime bugs, mobile behaviour, accessibility, SEO plumbing, and security.

Audited: **2026-07-29** against `main` @ `3a59cf9`.
Method: `npm run type-check` / `lint` / `test` / `build`, Next 16 dev server (`localhost:3001`),
Chrome DOM measurements at 320 px and 390 px iframe viewports, server-rendered HTML inspection via `curl`.

This is a **different axis** from [`SITE_COMPARISON_ISSUES.md`](./SITE_COMPARISON_ISSUES.md), which
compares content/parity against the live `graewe.com`. That file owns ISSUE-001 … ISSUE-033.
**This file owns ISSUE-034 – ISSUE-057.** Do not reuse IDs across the two files.

---

## How other AIs should use this document

1. Pick the **next open item** by priority (`P0` → `P1` → `P2`), one item per session unless items are tightly coupled.
2. Read **Problem**, **Evidence**, **Likely files** and **Acceptance criteria** before coding.
3. Follow `AGENTS.md`: dedicated worktree + branch, then `npm run type-check && npm run lint && npm run test`.
4. When done, mark the item `Status: Done` and add a one-line note of what changed.
5. Do **not** delete completed items; keep the history for launch review.
6. Several items here **add evidence to an existing issue** in `SITE_COMPARISON_ISSUES.md` rather than
   duplicating it — those are collected in the [Cross-references](#cross-references-existing-issues) section at the bottom. Update the item **there**.

**Legend**
- **P0** — Launch blocker: CI is red, users silently lose data, or the page is broken on real devices
- **P1** — Clear bug / accessibility or SEO defect that should not ship
- **P2** — Polish, hardening, consistency

**Categories:** `Build / CI` · `Bug` · `Mobile` · `A11y` · `SEO` · `Security` · `i18n` · `Ops` · `Testing`

---

## Verified-good (do not "fix" these)

Recorded so nobody re-audits them:

- `npm run type-check` — clean. `npm run test` — 12/12 passing. `npm run build` — succeeds, 226 sitemap URLs, `standalone` output + `static`/`public` copy step works. (`npm run lint` fails — ISSUE-034. `npm run test:e2e` is 16 passed / 1 failed — ISSUE-056.)
- **No horizontal overflow at 390 px** on 23 pages sampled across all five locales (DE/EN/FR/RU/ES), including Cyrillic. The 320 px case is broken — see ISSUE-036.
- All 33 static asset paths referenced from `src/` exist under `public/`.
- **Message-key parity is exact**: all five locale files have the same 188 leaf keys and identical array lengths. No missing-key runtime errors.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` present, no `user-scalable=no` — pinch-zoom works.
- Build artifacts (`.next/`, `out/`, `*.tsbuildinfo`, `playwright-report/`, `test-results/`) are all git-ignored; no `.DS_Store` is tracked.

---

## P0 — Launch blockers

### ISSUE-034 — `npm run lint` fails, so CI is red on `main`
- **Status:** Open
- **Category:** Build / CI
- **Problem:** `npm run lint` exits non-zero on a `react-hooks/set-state-in-effect` error. `.github/workflows/deploy.yml` runs `npm run lint` in the `quality` job and `deploy` has `needs: quality` — so **every push and every PR currently fails the gate and never deploys**. This blocks every other agent in the queue.
- **Evidence:**
  ```
  $ npm run lint
  /src/components/layout/Header.tsx
    41:5  error  Calling setState synchronously within an effect can trigger cascading renders
                 react-hooks/set-state-in-effect
  ✖ 3 problems (1 error, 2 warnings)
  ```
  `src/components/layout/Header.tsx:40-42`:
  ```tsx
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  ```
- **Context:** git history shows two prior fixes in this exact area (`f984501 fix: resolve mobile menu tap navigation`, `4efce5d fix: resolve mobile navigation links being unclickable`). This effect is the "close the menu after navigation" workaround. Fix it together with ISSUE-035, which is the real bug it is papering over.
- **Likely files:** `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`
- **Acceptance criteria:**
  - [ ] `npm run lint` exits 0 with no errors.
  - [ ] Menu still closes after navigating from both the desktop dropdown and the mobile drawer (close on link click, not via a post-navigation effect).
  - [ ] The two remaining warnings are resolved or explicitly justified (see ISSUE-048).

---

### ISSUE-035 — Contact form reports success when no email is sent
- **Status:** Open
- **Category:** Bug / Ops / Security
- **Problem:** When `RESEND_API_KEY` is unset the API route logs the submission to `console.log` and still returns `{ success: true }`, so the UI shows the green "message sent" confirmation. **No production configuration supplies that key**, so on launch day every enquiry is silently dropped while the customer believes it was delivered.
- **Evidence:**
  - `src/app/api/contact/route.ts:4-6` — `const resend = process.env.RESEND_API_KEY ? new Resend(...) : null;`
  - `src/app/api/contact/route.ts:47-53` — `else { console.log(...) }` then `return NextResponse.json({ success: true })`.
  - `src/components/contact/ContactForm.tsx:38-40` — `if (res.ok) { setSubmitStatus("success") }`.
  - `.github/workflows/deploy.yml` `deploy` job sets only `NEXT_PUBLIC_SITE_URL`; there is no `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, or `CONTACT_EMAIL_FROM`.
  - `infra/main.tf` creates `azurerm_static_web_app.website` with **no `app_settings` block at all** — the Static Web App has no application settings provisioned.
- **Likely files:** `src/app/api/contact/route.ts`, `infra/main.tf`, `infra/variables.tf`, `.github/workflows/deploy.yml`, `.env.example`
- **Acceptance criteria:**
  - [ ] Without a configured mail provider the route returns a **5xx** (or an explicit `configured: false`) and the UI shows the error state — never "success".
  - [ ] `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` are provisioned as SWA `app_settings` in Terraform, sourced from variables/secrets (never committed).
  - [ ] End-to-end check documented: submit form on the deployed site → mail arrives at `CONTACT_EMAIL_TO`.
  - [ ] Coordinate with **ISSUE-032** (existing) — that item tracks provider/domain verification; this one tracks the false-success bug and the missing infra wiring.

---

### ISSUE-036 — Site scrolls horizontally on 320 px phones (header bar overflows)
- **Status:** Open
- **Category:** Mobile / A11y
- **Problem:** At a 320 px viewport (iPhone SE 1st gen, older Androids, and the width WCAG 1.4.10 *Reflow* mandates) **every page** overflows horizontally. The root cause is the header row: logo `w-[180px]` + language switcher + `MENÜ` button do not fit inside the `px-4`-padded 288 px content box.
- **Evidence (measured, iframe at width=320):**
  ```
  /de                                  documentElement.scrollWidth=339  innerWidth=320
  /de/team                             339 / 320
  /de/kontakt                          339 / 320
  /de/downloads                        339 / 320
  /de/aktuelles                        339 / 320
  /de/success-stories                  339 / 320
  /de/gebrauchtmaschinen               339 / 320
  /de/stellenanzeigen                  339 / 320
  /de/produkte/rohrextrusion/extruder  339 / 320
  /en                                  339 / 320
  /ru                                  340 / 320
  /de/produktrechner                   357 / 320   <-- worst
  ```
  Offending elements (`scrollWidth > clientWidth`):
  ```
  HEADER  .sticky.top-0.z-50                          sw=339 cw=320
  DIV     .max-w-[1200px].mx-auto.px-4                sw=339 cw=320
  DIV     .flex.items-center.justify-between.h-16     sw=323 cw=288   <-- root cause
  ```
  On `/de/produktrechner` a second offender adds ~18 px: nested `p-6` padding inside the `p-6` card leaves only 238 px of content width —
  ```
  DIV  .bg-white.rounded-xl.border.border-grey-200.shadow-sm.p-6   sw=341 cw=286
  DIV  .flex.gap-1.mb-8.bg-grey-100.rounded-lg.p-1                 sw=276 cw=238
  DIV  .bg-grey-100.rounded-xl.p-6                                 sw=317 cw=238
  ```
  At 390 px all 23 sampled pages are clean, so this is specifically a small-phone regression.
- **Likely files:** `src/components/layout/Header.tsx` (logo width classes, gap), `src/components/ui/LanguageSwitcher.tsx`, `src/components/calculator/Calculator.tsx`, `src/components/calculator/WindingPosition.tsx`, `src/components/calculator/WindingLength.tsx`
- **Acceptance criteria:**
  - [ ] `document.documentElement.scrollWidth === window.innerWidth` at 320 px on every route (spot-check the list above).
  - [ ] Logo remains legible; the `MENÜ` button and language switcher stay reachable.
  - [ ] Calculator inputs, mode tabs and result grids fit at 320 px without inner scrollbars.
  - [ ] Regression guard added — see ISSUE-047 (mobile Playwright project).

---

## P1 — Bugs, accessibility, SEO

### ISSUE-037 — Closed menus and dropdowns stay in the tab order
- **Status:** Open
- **Category:** A11y
- **Problem:** The mobile drawer, the desktop dropdown and the language dropdown are hidden with `opacity-0 pointer-events-none` only. `pointer-events-none` does not remove elements from the tab order or from the accessibility tree, so keyboard and screen-reader users tab through ~16 invisible links on every page before reaching the content.
- **Evidence (measured on `/de/kontakt` at 390 px, menu closed):**
  ```json
  { "mobileMenuClosedTabbables": 16, "mobileMenuAriaHidden": null, "mobileMenuInert": false }
  ```
  - `src/components/layout/MobileMenu.tsx:31-35` — `isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"`
  - `src/components/layout/Header.tsx:126-133` — same pattern on the desktop dropdown
  - `src/components/ui/LanguageSwitcher.tsx:47-53` — same pattern on the language list
- **Likely files:** `src/components/layout/MobileMenu.tsx`, `src/components/layout/Header.tsx`, `src/components/ui/LanguageSwitcher.tsx`
- **Acceptance criteria:**
  - [ ] Closed overlays are removed from the tab order (`inert`, `hidden`, `visibility: hidden`, or conditional render) — measured tabbable count is 0 when closed.
  - [ ] Opening the mobile drawer moves focus into it, `Escape` closes it and returns focus to the `MENÜ` button, and focus is trapped while open.
  - [ ] Same `Escape` + focus-return behaviour for the language dropdown.

---

### ISSUE-038 — Form labels are not associated with their inputs
- **Status:** Open
- **Category:** A11y / Mobile
- **Problem:** Every `<label>` on the contact form and the calculator is a bare element with no `htmlFor`, and no input has an `id`. Screen readers announce the fields unlabelled, and tapping a label does not focus its field — a real usability loss on touch devices, where labels are the largest target.
- **Evidence (measured on `/de/kontakt`):**
  ```json
  { "labels": 5, "labelsWithFor": 0, "inputs": 5, "inputsWithId": 0, "inputsWithAutocomplete": 0 }
  ```
  - `src/components/contact/ContactForm.tsx:60-63, 70-73, 85-95, 98-106, 109-118`
  - `src/components/calculator/WindingPosition.tsx:96-105` (`InputField`) and the equivalent in `WindingLength.tsx`
- **Likely files:** `src/components/contact/ContactForm.tsx`, `src/components/calculator/WindingPosition.tsx`, `src/components/calculator/WindingLength.tsx`
- **Acceptance criteria:**
  - [ ] Every input/textarea has a stable `id`; every label has a matching `htmlFor` (use `useId()`).
  - [ ] Tapping a label focuses its field.
  - [ ] Contact fields carry `autoComplete` (`family-name`, `given-name`, `email`, `tel`) so mobile browsers can autofill.

---

### ISSUE-039 — Contact form shows no validation messages, only a red border
- **Status:** Open
- **Category:** A11y / UX
- **Problem:** React Hook Form errors only swap a CSS class. No error text is rendered, no `aria-invalid`, no `aria-describedby`, and the success/error banners are not in a live region. A screen-reader user submitting an incomplete form gets no feedback at all (WCAG 3.3.1 / 4.1.3). Colour-only error signalling also fails WCAG 1.4.1.
- **Evidence:** `src/components/contact/ContactForm.tsx:24, 61-66` — `formState: { errors }` is used exclusively as `className={errors.name ? inputError : inputNormal}`. The `submitStatus` banners at `:120-142` have no `role="status"` / `aria-live`.
- **Related:** `zod` and `@hookform/resolvers` are dependencies and `SPEC.md` §2 states "React Hook Form + **Zod**", but no resolver is wired up — the form validates with inline RHF rules and the API route hand-rolls a regex. Resolving this issue should either wire Zod up (shared schema client + server) or correct `SPEC.md`.
- **Likely files:** `src/components/contact/ContactForm.tsx`, `src/app/api/contact/route.ts`, `src/messages/*.json` (five locales), `SPEC.md`
- **Acceptance criteria:**
  - [ ] Per-field error text in all five locales, linked via `aria-describedby`, with `aria-invalid` on the field.
  - [ ] Success and error banners announced (`role="status"` / `role="alert"`).
  - [ ] Zod is either used (shared schema for client and API route) or removed from deps and `SPEC.md`.

---

### ISSUE-040 — Contact submissions are interpolated unescaped into the notification email
- **Status:** Open
- **Category:** Security
- **Problem:** The API route builds the outgoing HTML email with raw template interpolation of attacker-controlled fields. Anyone can submit `<a href="https://evil.example">Rechnung ansehen</a>` or an `<img src>` tracking pixel in the message body and it renders as live HTML in the GRAEWE inbox — a phishing vector aimed at staff, plus mail-client tracking.
- **Evidence:** `src/app/api/contact/route.ts:26-38` — `${firstName} ${name}`, `<a href="mailto:${email}">${email}</a>`, `${phone}` and `${message}` are all inserted without escaping. Validation upstream is only "non-empty" plus `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` on the email; `name`, `firstName`, `phone` and `message` are unconstrained and unbounded in length.
- **Likely files:** `src/app/api/contact/route.ts`
- **Acceptance criteria:**
  - [ ] All user values HTML-escaped before interpolation (or the mail composed as `text` plus an escaped HTML part).
  - [ ] Server-side schema validation with max lengths (e.g. name ≤ 100, message ≤ 5000); oversized/invalid payloads rejected with 400.
  - [ ] `replyTo` only set when the address passes validation.
  - [ ] Coordinate with **ISSUE-006** (existing) for captcha/rate limiting — that item owns spam protection; this one owns injection and payload validation.

---

### ISSUE-041 — No canonical URLs and no `hreflang` alternates on any page
- **Status:** Open
- **Category:** SEO
- **Problem:** The site publishes the same content set under five locale prefixes but emits **zero** `<link rel="canonical">` and **zero** `<link rel="alternate" hreflang>` tags. Search engines have no signal linking `/de/kontakt` ↔ `/en/kontakt` ↔ `/ru/kontakt`, and no canonical to collapse duplicates. On a domain cutover from an established TYPO3 site this is a material ranking risk.
- **Evidence:** grep over server-rendered HTML for `/de`, `/de/produkte/rohrextrusion`, `/de/produkte/rohrextrusion/extruder`, `/de/team`, `/de/stellenanzeigen`, `/de/downloads`, `/en/produkte/rohrextrusion`, `/de/aktuelles/jubilaeum`, `/ru/kontakt` — `canonical: 0  hreflang: 0` on all nine. `src/app/[locale]/layout.tsx:16-40` `generateMetadata` sets `title`/`description`/`icons`/`openGraph` but no `alternates`. `next-sitemap.config.js` has no `alternateRefs`.
- **Likely files:** `src/app/[locale]/layout.tsx`, each `src/app/[locale]/**/page.tsx` `generateMetadata`, `next-sitemap.config.js`
- **Acceptance criteria:**
  - [ ] Every page emits `alternates.canonical` for its own absolute URL.
  - [ ] Every page emits `alternates.languages` for all five locales plus `x-default` → `de`.
  - [ ] `next-sitemap` emits `alternateRefs` (or the sitemap is generated with hreflang entries).
  - [ ] `metadataBase` derives from `NEXT_PUBLIC_SITE_URL` instead of the hardcoded `https://www.graewe.com` at `layout.tsx:26`, so preview environments don't advertise production URLs.

---

### ISSUE-042 — Every page shares one identical meta description; homepage has no `<h1>`
- **Status:** Open
- **Category:** SEO
- **Problem:** Two separate defects in the same area.
  1. All 226 sitemap URLs inherit the single site-level `meta.description` — Google Search Console will flag ~226 duplicate descriptions. Only the locale changes it, not the page.
  2. `/de` (and every locale homepage) renders **no `<h1>` at all** — the hero headline is an `<h2>` and there is no page-level heading. The most important page has no primary heading for either SEO or screen-reader navigation.
- **Evidence:**
  ```
  /de                                   h1count: 0   D: "GRAEWE ist eine begehrte Marke in der Welt der Extrudertechnik…"
  /de/produkte/rohrextrusion            h1count: 1   D: (identical)
  /de/produkte/rohrextrusion/extruder   h1count: 1   D: (identical)
  /de/team                              h1count: 1   D: (identical)
  /de/stellenanzeigen                   h1count: 1   D: (identical)
  /de/downloads                         h1count: 1   D: (identical)
  /de/aktuelles/jubilaeum               h1count: 1   D: (identical)
  ```
  `src/components/home/HeroCarousel.tsx:76-78` and `:222-224` use `<h2>` for the slide headline.
- **Likely files:** `src/app/[locale]/page.tsx`, `src/components/home/HeroCarousel.tsx`, all `generateMetadata` functions, `src/messages/*.json`
- **Acceptance criteria:**
  - [ ] Each locale homepage has exactly one `<h1>` (visible or visually hidden) naming GRAEWE and its business.
  - [ ] Product, category, news, job and legal pages each set a distinct `description` in `generateMetadata`, translated in all five locales.
  - [ ] No two indexed URLs share a description.

---

### ISSUE-043 — Hero carousel auto-rotates with no pause control and 4 px-tall dots
- **Status:** Open
- **Category:** A11y / Mobile
- **Problem:** Three defects in one component.
  1. The carousel advances every 6 s with no pause/stop/hide affordance and no pause on hover or focus — WCAG 2.2.2 failure for anyone who reads slowly or uses a screen magnifier.
  2. The progress-dot buttons are `h-1 w-8` (desktop) and `h-1 w-6` (mobile) — measured **32×4 px** and **24×4 px**. WCAG 2.2 §2.5.8 requires 24×24 px; 4 px tall is essentially untappable on a phone.
  3. A `setInterval` fires every **50 ms** for the progress bar and never pauses when the tab is hidden or `prefers-reduced-motion` is set — continuous re-render and battery drain on mobile.
- **Evidence:** `src/components/home/HeroCarousel.tsx:15` (`SLIDE_DURATION = 6000`), `:37-40` (auto-advance interval), `:42-47` (50 ms progress interval), `:116-131` and `:245-260` (dot buttons `h-1 w-8` / `h-1 w-6`). Measured tap targets on `/de` at 390 px: 40 elements below 32 px, including six `button 24x4`.
- **Likely files:** `src/components/home/HeroCarousel.tsx`
- **Acceptance criteria:**
  - [ ] A visible pause/play control, or auto-advance disabled entirely.
  - [ ] Auto-advance and the progress interval stop on hover, on keyboard focus within the carousel, when `document.hidden`, and under `prefers-reduced-motion: reduce`.
  - [ ] Dot controls have a ≥24×24 px hit area (padding/`::before` is fine — the visual bar can stay thin).
  - [ ] Off-screen slides are hidden from assistive tech (`aria-hidden` / `inert`), and the region is marked up as a carousel (`aria-roledescription`, live region for slide changes).

---

### ISSUE-044 — Partner link `next-machines.com` is served over plain HTTP
- **Status:** Open
- **Category:** Security / Polish
- **Problem:** The "next — Second Hand · First Quality" partner link points to `http://www.next-machines.com`. That is an unencrypted outbound link from an HTTPS page: browsers handle the downgrade inconsistently, and there is no reason to ship it.
- **Evidence:** `src/components/layout/Footer.tsx:196` — `href="http://www.next-machines.com"`.
- **Likely files:** `src/components/layout/Footer.tsx`
- **Acceptance criteria:**
  - [ ] Link uses `https://` — confirm the target actually serves a valid certificate before switching.
  - [ ] Grep for any other `http://` external links in `src/` and fix them together.

> **Do not "fix" the `tel:` link.** `src/components/layout/Footer.tsx:63` is `tel:+4976317944-0`.
> RFC 3966 permits `-` as a *visual separator* inside `phone-digits`; dialers strip it, giving
> `+49 7631 7944-0` → `+49763179440` — country 49, Neuenburg 7631, PBX 7944, Durchwahl 0.
> This is the correct main line. Rewriting it to `tel:+4976317944` **drops the trailing 0 and breaks it.**
> If you touch it at all, only verify the digit count matches `+49763179440`.

---

### ISSUE-045 — Hardcoded German/English strings leak into all five locales
- **Status:** Open
- **Category:** i18n / A11y
- **Problem:** `AGENTS.md` requires all user-facing copy to live in `src/messages/*.json`. Several strings — including every carousel and menu `aria-label` — are hardcoded, so Russian, Spanish, French and English visitors see German or English text, and screen readers announce English labels regardless of `lang`.
- **Evidence (visible text):**
  | String | File:line | Shown in |
  |---|---|---|
  | `Galerie` | `src/components/products/ProductDetailContent.tsx:69` | all 5 locales, every product page |
  | `Unternehmen` | `src/components/layout/MobileMenu.tsx:61` | all 5 locales, every page |
  | `Produkte` | `src/components/layout/MobileMenu.tsx:76` | all 5 locales, every page |
  | `Service` | `src/components/layout/Footer.tsx:105` | all 5 locales |
  | `Social` | `src/components/layout/Footer.tsx:118` | all 5 locales |
  | `Skip to content` | `src/app/[locale]/layout.tsx:87` | all 5 locales |

  **Evidence (`aria-label`, English in every locale):** `HeroCarousel.tsx` — `"Previous slide"`, `"Next slide"`, `` `Go to slide ${idx+1}` `` (×2 layouts); `LanguageSwitcher.tsx:31` — `"Select language"`; `Header.tsx:100` — `"Navigation menu"`, `:140` — `"Main navigation"`; `MobileMenu.tsx:47` — `"Close menu"`; `ProductDetailContent.tsx` — `"Close"`, `"Previous image"`, `"Next image"`; `Breadcrumb.tsx` — `"Breadcrumb"`; `Footer.tsx` — `"Facebook"`, `"YouTube"` (proper nouns, fine to leave).
- **Note:** `MENÜ` in `Header.tsx:117` is already tracked as **ISSUE-019** — fix it in the same pass but keep the status note there.
- **Likely files:** all of the above, plus `src/messages/{de,en,fr,ru,es}.json`
- **Acceptance criteria:**
  - [ ] Every string in the table and every non-proper-noun `aria-label` reads from `next-intl`.
  - [ ] Keys added to **all five** locale files with real translations (not German fallbacks).
  - [ ] A grep for hardcoded JSX text in `src/components` and `src/app` returns only proper nouns.

---

### ISSUE-046 — Footer legal links fail contrast; `text-grey-400` fails on light surfaces
- **Status:** Open
- **Category:** A11y
- **Problem:** Two token misuses produce sub-AA contrast.
  1. `text-grey-500` (`#6b6b6b`) on `bg-bg-footer` (`#2a2a2a`) ≈ **2.8:1** — used for the copyright line and the Kontakt / Impressum / Datenschutz links at `text-xs`. Needs 4.5:1.
  2. `text-grey-400` (`#9e9e9e`) on white ≈ **2.7:1** — used for the uppercase section headings in the mobile drawer, the desktop dropdown, the "Galerie" label and the "Video" label. Needs 4.5:1 (3:1 if it qualifies as large text, which 12 px uppercase does not).
- **Evidence:** tokens at `src/app/globals.css:16-19, 24`. Usages: `src/components/layout/Footer.tsx:214-220` (`text-grey-500`), `src/components/layout/MobileMenu.tsx:59, 74`, `src/components/layout/Header.tsx:150, 163, 178`, `src/components/products/ProductDetailContent.tsx:68`, `src/components/home/NewsTeaser.tsx:32` (`text-grey-400` on white/`grey-100`).
- **Likely files:** `src/app/globals.css`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/Header.tsx`
- **Acceptance criteria:**
  - [ ] All body and link text reaches ≥4.5:1 against its actual background (verify with a contrast checker, not by eye).
  - [ ] Fix at the token level where possible so the whole site benefits; `SPEC.md` §5 updated if token values change.
  - [ ] Footer legal links are also ≥24 px tall (they measure 20 px today — see ISSUE-043 for the same class of problem).

---

### ISSUE-047 — Playwright covers desktop Chrome only; no mobile regression guard
- **Status:** Open
- **Category:** Testing / Mobile
- **Problem:** `playwright.config.ts` defines a single project, `devices["Desktop Chrome"]`. Mobile is a stated requirement, the mobile menu has already been fixed twice (`f984501`, `4efce5d`), and ISSUE-036 is a pure small-viewport regression — none of which any current test would catch.
- **Evidence:** `playwright.config.ts:14-19`. `tests/e2e/` contains `calculator.spec.ts`, `language.spec.ts`, `navigation.spec.ts`, all viewport-agnostic.
- **Likely files:** `playwright.config.ts`, `tests/e2e/*`, `.github/workflows/deploy.yml`
- **Acceptance criteria:**
  - [ ] A `Mobile Chrome` project (e.g. `devices["Pixel 5"]`) plus a 320 px-wide project.
  - [ ] A spec asserting `document.documentElement.scrollWidth <= window.innerWidth` on a representative route list at both widths.
  - [ ] A spec covering: open drawer → tap a link → navigates **and** drawer closes; tap the current page's own link → drawer closes.
  - [ ] E2E runs in CI (currently only type-check, lint and unit tests gate the deploy).

---

### ISSUE-056 — `npm run test:e2e` fails: mobile drawer and desktop dropdown render simultaneously
- **Status:** Open
- **Category:** Testing / A11y
- **Problem:** One of the 17 Playwright tests fails. The cause is not the test being sloppy — it is a genuine duplicate-content defect: the desktop dropdown (`hidden lg:block`) and the mobile drawer (`lg:hidden`) both render their full link list into the DOM at all times, so `"Unternehmen"` exists twice inside `<header>` on every page and Playwright's strict mode rejects the ambiguous locator. Assistive tech sees the same duplication. This is the same root cause as ISSUE-037, surfacing as a red test.
- **Evidence:**
  ```
  1) [chromium] › tests/e2e/navigation.spec.ts:47 › menu opens and shows navigation links
     strict mode violation: getByRole('banner').getByText('Unternehmen') resolved to 2 elements:
       1) <p class="… mb-3">Unternehmen</p>   aka getByLabel('Main navigation').getByText('Unternehmen')
       2) <p class="… mb-2">Unternehmen</p>   aka getByText('Unternehmen').nth(1)
  1 failed, 16 passed (15.4s)
  ```
  `src/components/layout/Header.tsx:126` (`hidden lg:block` dropdown) and `src/components/layout/MobileMenu.tsx:31` (`lg:hidden` drawer) — both mounted unconditionally.
- **Likely files:** `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`, `tests/e2e/navigation.spec.ts`
- **Acceptance criteria:**
  - [ ] Only one navigation tree is present in the accessibility tree at a given viewport (conditional render, or `inert`/`aria-hidden` on the inactive one — the same change ISSUE-037 needs).
  - [ ] `npm run test:e2e` passes with no locator disambiguation hacks in the spec.
  - [ ] E2E added to the CI gate (see ISSUE-047).

---

### ISSUE-057 — Phones download the desktop hero image; all 10 carousel images mount at once
- **Status:** Open
- **Category:** Mobile / Performance
- **Problem:** `HeroCarousel` renders its desktop layout (`hidden sm:flex`) **and** its mobile layout (`sm:hidden`) into the DOM simultaneously, each marking slide 0 as `priority`. Next therefore emits **two unconditional `<link rel="preload" as="image">` tags for the same hero PNG at two different size tiers, with no `media` attribute** — so a phone eagerly downloads the 828 px/1920 px desktop variant it will never display, on the LCP critical path. The same duplication mounts all 10 `<Image>` elements (5 unique PNGs, 190–260 KB each) at once.
- **Evidence:** server-rendered `<head>` of `/de`:
  ```html
  <link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Fimages%2Fhero%2Fslide-1.png&w=828&q=75 1x,
                                              /_next/image?url=%2Fimages%2Fhero%2Fslide-1.png&w=1920&q=75 2x"/>
  <link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Fimages%2Fhero%2Fslide-1.png&w=640&q=75 1x,
                                              /_next/image?url=%2Fimages%2Fhero%2Fslide-1.png&w=1200&q=75 2x"/>
  ```
  Neither carries `media`. Source: `src/components/home/HeroCarousel.tsx:49` (`hidden sm:flex` desktop block) and `:180` (`sm:hidden` mobile block); `priority={index === 0}` at `:159` and `:236`. Asset sizes: `public/images/hero/slide-{1..5}.png` = 188 KB, 223 KB, 259 KB, 207 KB, 241 KB.
- **Related:** same duplicate-render anti-pattern as **ISSUE-056** (nav) and **ISSUE-043** (carousel a11y). Fixing the layout duplication once — one responsive layout, or CSS-only switching over a single image set — resolves the preload waste too.
- **Likely files:** `src/components/home/HeroCarousel.tsx`
- **Acceptance criteria:**
  - [ ] Exactly one hero preload is emitted for a given viewport (or two with correct `media` attributes).
  - [ ] A 390 px client does not fetch the 828/1920 px variants — verify in DevTools Network on a throttled mobile profile.
  - [ ] Non-visible slides are not eagerly fetched.
  - [ ] Consider re-encoding the source PNGs as WebP/AVIF: the `GITHUB_PAGES=true` export path uses a custom loader (`src/lib/image-loader.ts`) with **no** optimization, so those builds ship the raw PNGs.

---

## P2 — Hardening & polish

### ISSUE-048 — Two dead variables, one of which suggests a calculator formula gap
- **Status:** Open
- **Category:** Bug / Build
- **Problem:** `npm run lint` reports two `no-unused-vars` warnings. One is cosmetic; the other is a possible correctness signal.
  - `src/lib/calculator.ts:37` — `pipeLengthPerRotation` is computed (`pipesPerLayer * d`) and never used. In `calculateWindingPositionUneven`, `rotationsPerLayer` is instead set to `pipesPerLayer` directly, mixing a pipe count with a rotation count. Worth checking whether the intended formula was `totalPipeLength / pipeLengthPerRotation`.
  - `src/app/[locale]/datenschutz/page.tsx:21` — `t` is assigned but unused because the whole page body is hardcoded German (that part is **ISSUE-012**).
- **Evidence:** lint output; `src/lib/calculator.ts:33-42`.
- **Likely files:** `src/lib/calculator.ts`, `tests/unit/calculator.test.ts`, `src/app/[locale]/datenschutz/page.tsx`
- **Acceptance criteria:**
  - [ ] Formula intent confirmed against the live `graewe.com/produktrechner` (this is the same verification **ISSUE-031** asks for — record the outcome there).
  - [ ] Variable either used or removed; unit test added for the case it was meant to cover.
  - [ ] `npm run lint` reports zero warnings.

---

### ISSUE-049 — Product lightbox is not a real dialog
- **Status:** Open
- **Category:** A11y / Mobile
- **Problem:** The gallery lightbox is a plain `div` overlay: no `role="dialog"` / `aria-modal`, no focus trap, no `Escape` handler, and no body scroll lock — so on a phone the page scrolls behind the open image and there is no obvious way to dismiss it with the keyboard. There is also no swipe gesture, and the prev/next buttons sit at `left-4` / `right-4` directly over the image on narrow screens.
- **Evidence:** `src/components/products/ProductDetailContent.tsx:100-140`. Compare `MobileMenu.tsx:22-29`, which at least does lock body scroll.
- **Likely files:** `src/components/products/ProductDetailContent.tsx`
- **Acceptance criteria:**
  - [ ] `role="dialog" aria-modal="true"` with an accessible name; focus moves in on open and returns to the thumbnail on close.
  - [ ] `Escape` closes; focus is trapped while open; body scroll locked.
  - [ ] Controls do not overlap image content at 320 px; swipe navigation on touch.

---

### ISSUE-050 — Root `/` is a `<meta http-equiv="refresh">` stub and is listed in the sitemap
- **Status:** Open
- **Category:** SEO
- **Problem:** `src/app/page.tsx` renders a meta-refresh page with visible "Redirecting to ./de/…" text. Meta refresh is a soft redirect: search engines may index the stub, and users on a slow connection see the placeholder text. `next-sitemap` then lists `https://www.graewe.com` as its own indexable URL. `SPEC.md` §4 says `/` "always redirects to `/de`" — the proxy does that for the SSR deploy, so this stub only ever surfaces in the static-export path, where it is still wrong.
- **Evidence:** `src/app/page.tsx`; `public/sitemap-0.xml` contains `<loc>https://www.graewe.com</loc>`; `src/proxy.ts` matcher excludes `api|_next|_vercel|\.swa|images|downloads` and handles `/` on the SSR path.
- **Likely files:** `src/app/page.tsx`, `next-sitemap.config.js`, `staticwebapp.config.json`
- **Acceptance criteria:**
  - [ ] `/` issues a real 307/308 on the Azure SWA deploy (route rule or proxy), not a meta refresh.
  - [ ] The bare-domain URL is excluded from the sitemap, or is the canonical entry that redirects.
  - [ ] If the GitHub Pages export path is still supported, the stub carries `<meta name="robots" content="noindex">`.

---

### ISSUE-051 — Harden `generateMetadata` against an unvalidated locale (defence in depth)
- **Status:** Open — **low confidence, not currently reachable**
- **Category:** Bug / Hardening
- **Problem:** `generateMetadata` in the locale layout does `await import(\`@/messages/${locale}.json\`)` **before** any validation; `hasLocale()` is only checked later, in the layout component body. An unvalidated locale reaching the import would reject with module-not-found and surface as a 500 instead of the intended `notFound()`.
- **Evidence — tested, and it does not currently trigger.** Against a production build (`next build` + server):
  ```
  /xx/kontakt     -> 307  ->  /de/xx/kontakt
  /de/xx/kontakt  -> 404
  /fr/xx          -> 404
  /               -> 307  ->  /de
  ```
  The proxy prefixes the unknown segment rather than passing it through as a locale, so `generateMetadata` is never called with `locale="xx"`. Source: `src/app/[locale]/layout.tsx:16-24` (import, unvalidated) vs `:49-51` (`hasLocale` check).
- **Why keep it:** the ordering is only safe because of how `src/proxy.ts` happens to behave. ISSUE-054 may change the deploy topology, and the `GITHUB_PAGES` export path has no proxy at all.
- **Likely files:** `src/app/[locale]/layout.tsx`
- **Acceptance criteria:**
  - [ ] `generateMetadata` validates with `hasLocale` and calls `notFound()` before importing messages.
  - [ ] The routes above still behave as listed after the change.

---

### ISSUE-052 — No `error.tsx`, `not-found.tsx` or `global-error.tsx` anywhere
- **Status:** Open
- **Category:** Bug / UX
- **Problem:** The App Router tree defines no error or not-found boundaries. Any thrown render error in production shows Next's unstyled default error page — no GRAEWE header, footer or navigation, and no localisation. `notFound()` is already called in `layout.tsx:50` with nothing to render it.
- **Evidence:** `find src -name "error.tsx" -o -name "not-found.tsx" -o -name "global-error.tsx"` → no matches. Confirmed against a **production build**: `GET /de/nichtvorhanden` returns 404 with Next's default page —
  ```
  <title>404: This page could not be found.</title>
  ```
  English, unstyled, no header, no footer, no locale awareness, on a site whose default locale is German.
- **Related:** **ISSUE-033** (existing) covers the SWA `responseOverrides.404.rewrite = "/de"` masking. These two must be fixed together — a localized `not-found.tsx` is useless while the platform rewrites 404s to the homepage.
- **Likely files:** new `src/app/[locale]/not-found.tsx`, `src/app/[locale]/error.tsx`, `src/app/global-error.tsx`, `staticwebapp.config.json`
- **Acceptance criteria:**
  - [ ] Branded, localized 404 and error pages inside the locale layout (header/footer intact).
  - [ ] `global-error.tsx` as the last-resort boundary.
  - [ ] Verified against a production build, not dev.

---

### ISSUE-053 — Vimeo iframe loads before any consent is given
- **Status:** Open
- **Category:** Legal / compliance / Mobile
- **Problem:** The homepage embeds `player.vimeo.com` directly. The iframe fires on load, so Vimeo receives the visitor's IP and can set cookies before any consent interaction — a TTDSG/GDPR problem for a German company, and the reason the embed is also a heavyweight third-party request on mobile data.
- **Evidence:** `src/components/home/NewsTeaser.tsx:18-27` — `<iframe src="https://player.vimeo.com/video/987078686?…" loading="lazy">`. `loading="lazy"` defers the fetch but does not gate it behind consent.
- **Related:** **ISSUE-009** (existing) tracks the missing cookie/consent page and banner. This item is the concrete embed that makes it urgent; record the fix there if the banner lands first.
- **Likely files:** `src/components/home/NewsTeaser.tsx`, whatever consent mechanism ISSUE-009 introduces
- **Acceptance criteria:**
  - [ ] No third-party request fires before consent — click-to-load poster, or `player.vimeo.com/…?dnt=1` behind an explicit opt-in.
  - [ ] Placeholder is keyboard-accessible and localized.
  - [ ] Datenschutz page names the embed and its legal basis.

---

### ISSUE-054 — Azure SWA deployment path for a `standalone` Next build is unverified
- **Status:** Open
- **Category:** Ops
- **Problem:** `next.config.ts` sets `output: "standalone"` (SSR: a proxy/middleware, a dynamic `/api/contact` route, and the dynamic `stellendetails` search-param redirect). The deploy workflow hands the repo to `Azure/static-web-apps-deploy@v1` with `app_location: "/"`, `api_location: ""` and `output_location: ""`, letting Oryx run its own build. Whether that pipeline actually serves Next SSR — and whether `src/proxy.ts` runs at all — has not been confirmed on a live deployment. If the proxy does not run, `/` never redirects to `/de` and locale negotiation breaks; if the API route is not hosted, the contact form 404s.
- **Note 1:** `npm run build` also does `cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/` — verified working locally, but Oryx may invoke `next build` directly and skip the npm script wrapper.
- **Note 2:** `npm run start` (`next start`) is **the wrong entry point for this config** and Next says so:
  ```
  ⚠ "next start" does not work with "output: standalone" configuration.
    Use "node .next/standalone/server.js" instead.
  ```
  It happens to serve pages anyway, which is why nobody has noticed. This matters twice over:
  `playwright.config.ts:21` runs `npm run build && npm run start` as its `webServer`, so **e2e tests
  do not exercise the artifact that actually ships**; and `package.json` / `README.md` advertise
  `npm run start` as the production command.
- **Note 3:** `staticwebapp.config.json` sets `globalHeaders` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) but no `Strict-Transport-Security`. Add it as part of the cutover, once HTTPS on the custom domain is confirmed working.
- **Evidence:** `.github/workflows/deploy.yml` `deploy` job; `next.config.ts:10`; `infra/main.tf` (`sku_tier` defaults to `Standard`, so hybrid rendering is at least plan-eligible); `package.json` `build` script.
- **Likely files:** `.github/workflows/deploy.yml`, `next.config.ts`, `staticwebapp.config.json`, `infra/main.tf`, `infra/DNS_CUTOVER.md`
- **Acceptance criteria:**
  - [ ] A staging deploy is verified end to end: `/` → `/de` redirect, a locale switch, `POST /api/contact`, and a legacy `?tx_tanjoboffers_jobdetail[job]=9` redirect all work **on Azure**.
  - [ ] If hybrid SSR is not viable on the chosen plan, the decision (static export vs. Container Apps / App Service) is recorded in `SPEC.md` and `infra/DNS_CUTOVER.md`.
  - [ ] `playwright.config.ts` `webServer` and the documented production command both use `node .next/standalone/server.js` (or the config drops `standalone`).
  - [ ] `Strict-Transport-Security` added to `globalHeaders`.
  - [ ] Deploy method documented so the next agent does not have to re-derive it.

---

### ISSUE-055 — Leftover Next.js starter SVGs still shipped in `public/`
- **Status:** Open — **duplicate of ISSUE-026**, listed here only as confirmation
- **Category:** Polish
- **Problem:** `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` are unreferenced create-next-app assets, publicly reachable on the production domain.
- **Evidence:** `ls public/` — the five files are present; no reference to any of them exists in `src/`.
- **Action:** Fix under **ISSUE-026** in `SITE_COMPARISON_ISSUES.md`; do not track separately.

---

## Cross-references (existing issues)

New evidence gathered in this pass that belongs on items already tracked in `SITE_COMPARISON_ISSUES.md`.
**Update those items, not this list.**

| Existing | New evidence from this audit |
|---|---|
| **ISSUE-006** (captcha) | The API route also has no rate limiting, no honeypot, and no payload size cap — see ISSUE-040 for the injection half. |
| **ISSUE-009** (cookies/consent) | The Vimeo embed fires before consent — see ISSUE-053. |
| **ISSUE-012** (legal pages not localized) | Confirmed: `datenschutz/page.tsx` and `impressum/page.tsx` are fully hardcoded German; the unused `t` at `datenschutz/page.tsx:21` is the lint symptom. |
| **ISSUE-016** (silent calculator validation) | Confirmed at `WindingPosition.tsx:26-29` — bare `return` on invalid input, no message. |
| **ISSUE-019** (`MENÜ` hardcoded) | Confirmed `Header.tsx:117`; fold into ISSUE-045 so all hardcoded strings land in one pass. |
| **ISSUE-026** (starter assets) | Confirmed — see ISSUE-055. |
| **ISSUE-031** (calculator parity) | `pipeLengthPerRotation` is dead code in `calculator.ts:37`, which may indicate a formula gap — see ISSUE-048. |
| **ISSUE-032** (Resend before cutover) | Terraform provisions **no** `app_settings` and CI passes no mail env vars — see ISSUE-035 for the false-success bug. |
| **ISSUE-033** (404 rewrites to `/de`) | Compounded by the total absence of `not-found.tsx` / `error.tsx` — see ISSUE-052. |

---

## Suggested work order

| Order | Issue IDs | Rationale |
|---|---|---|
| 1 | 034 | CI is red; nothing else can merge cleanly until lint passes |
| 2 | 035, 054 | Contact form silently drops enquiries and the deploy path is unproven — both are launch-day failures |
| 3 | 036, 047 | Fix small-phone overflow and add the regression guard in the same pass |
| 4 | 041, 042, 050 | SEO plumbing must be right *before* DNS cutover, not after |
| 5 | 037, 056, 043, 057 | One duplicate-render root cause across nav, carousel a11y and hero preloads — fix together |
| 6 | 038, 039, 046, 049 | Remaining accessibility cluster; 038+039 pair naturally |
| 7 | 040, 052, 053 | Security, error handling, compliance |
| 8 | 044, 045, 048, 051, 055 | Polish and hardening |

---

## Method / reproducibility

- Overflow figures come from same-origin iframes at fixed widths (320 px, 390 px), reading `documentElement.scrollWidth` vs `contentWindow.innerWidth`, then walking the DOM for elements whose `scrollWidth > clientWidth`. Chrome's own window cannot be resized below ~400 px, so top-level `resize` is not a valid substitute.
- Tap-target and label figures come from `getBoundingClientRect()` and attribute counts in the same iframes.
- SEO figures come from `curl` against the dev server and `grep` over the server-rendered HTML — no client-side JS involved, so they reflect what a crawler sees.
- Contrast ratios are computed from the token values in `src/app/globals.css`; re-verify with a checker before changing tokens.
