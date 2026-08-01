# GRAEWE Website — Living Spec

> **Authority**: This file is the current-state source of truth for AI agents and contributors.
> Update it in the same PR whenever you change architecture, conventions, routes, or workflow.
> Historical vision and phase notes live in [`PROJECT.md`](./PROJECT.md) — prefer this file when they disagree.

## 0. Worktree lifecycle (do this first, every time)

Many agents work this repo in parallel and `main` moves fast. **Every task gets its own worktree** —
that is what lets several agents work at once without fighting over one checkout, one `node_modules`,
or one dev server. And a local checkout is stale far more often than it looks; stale work wastes a
whole session, auditing code that no longer exists and re-fixing what someone already fixed.

### Start — always in a fresh worktree off `origin/main`

```bash
git fetch origin main
git log --oneline main..origin/main   # NON-EMPTY = your checkout is STALE. Do not work in it.
git worktree add -b <type>/<desc> ../graewe-website-<desc> origin/main
cd ../graewe-website-<desc> && npm ci
```

This applies to **every** task — features, fixes, chores, docs, and read-only audits. Never work
directly in the primary checkout, and never branch off local `main`.

### Finish — remove the worktree when the PR is merged

A worktree is scratch space, not a record. Leaving them behind is not free: they pin branches so
`git branch -d` refuses, they multiply `node_modules` copies, and a stale server or checkout inside
one silently corrupts later runs. On 2026-07-29 this repo had accumulated **32 dead worktrees**, one
of them nested inside another.

```bash
cd /Users/<you>/repos/graewe-website          # back to the primary checkout first
git worktree remove ../graewe-website-<desc>  # refuses if you have uncommitted work — good
git branch -d <type>/<desc>                   # safe: fails unless fully merged
git worktree prune                            # clears records for dirs already deleted
git worktree list                             # verify: only the primary checkout remains
```

Before removing, check `git status` in the worktree for **gitignored local config** that is not
recoverable from git — `infra/terraform.tfvars`, `.env.local`, `infra/.terraform.lock.hcl`. Copy
anything real out first; `--force` will delete it without asking.

If you did not create a worktree because the task turned out to be trivial, say so in the PR — do
not silently leave one behind.

### Rules that follow — none of them optional

- **One worktree per task, always.** It is what makes parallel agents safe; it also keeps the
  primary checkout permanently clean and on `main`.
- **Always branch off `origin/main`, never local `main`.** The worktree command above already does.
- **`git rev-parse main origin/main` is not a staleness check.** It tells you the two differ, not
  which way. Use `main..origin/main` (what you are missing) and `origin/main..main` (what you have
  that the remote does not). Assuming the wrong direction is the specific mistake that produced a
  73-commit-stale audit on 2026-07-29.
- **Install with `npm ci`, not `npm install`.** `npm ci` installs exactly the lockfile. A drifted
  local `node_modules` reports lint errors and test failures that CI does not see — and hides ones
  it does.
- **Re-check before you finish.** If a session runs long, `git fetch origin main` again before
  opening the PR; rebase if the remote moved.
- **Verify claims about CI against CI**, not against your machine: `gh run list --branch main`.
  Check the deploy workflow by name (`--workflow=deploy.yml`).
- **Kill stray dev/preview servers before running e2e.** `playwright.config.ts` sets
  `reuseExistingServer: true`, so a leftover server from another checkout on port 3000 is silently
  reused and produces a wall of false failures.

If your findings contradict CI, assume your environment is wrong until you have proven otherwise.

## 1. Product

Corporate website for **GRAEWE GmbH Maschinenbau** (extrusion machinery). Replaces the old TYPO3 site at [graewe.com](https://www.graewe.com/).

- Faithful visual identity: brand yellow `#ffd600`, dark neutrals, industrial photography
- Locales: `de` (default), `en`, `fr`, `ru`, `es`
- Launch-ready (Phases 1–4 complete). Phase 5 (3D demos, e-commerce, portal) is post-launch only

## 2. Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js **16** App Router (not older Next.js mental models) |
| Language | TypeScript strict |
| UI | React 19, Tailwind CSS 4, brand tokens in `src/app/globals.css` |
| i18n | `next-intl` — routing + JSON messages |
| Forms | React Hook Form + Zod (`src/lib/contactSchema.ts` shared by contact form + `/api/contact`); Resend + Turnstile |
| Tests | Vitest (unit), Playwright (e2e) |
| Deploy | Azure Static Web Apps (`standalone`) only — see [`infra/DEPLOY.md`](./infra/DEPLOY.md) |

**Critical Next.js 16 quirks**

- `params` / `searchParams` are `Promise`s — always `await` them
- Request proxy lives in `src/proxy.ts` (not `middleware.ts`)
- Read `node_modules/next/dist/docs/` before using unfamiliar Next APIs

## 3. Repository map

```
src/app/[locale]/     # All pages (locale-prefixed routes)
src/app/api/          # API routes (contact)
src/components/       # layout | home | products | calculator | contact | ui
src/messages/         # de|en|fr|ru|es.json — UI + page copy
src/lib/              # calculator, products, productContent/, productImages
src/i18n/             # routing, request, navigation helpers
tests/unit|e2e/       # Vitest + Playwright
infra/                # Azure SWA Terraform
public/images/        # Static assets by section
```

### Where content lives

| Kind | Location |
|------|----------|
| Nav, UI strings, page copy | `src/messages/{locale}.json` |
| Product tree / slugs | `src/lib/products.ts` |
| Product body content | `src/lib/productContent/` (`de\|en\|fr\|ru\|es.json` + `index.ts`) |
| Product images map | `src/lib/productImages.ts` |
| Calculator math | `src/lib/calculator.ts` (pure; golden-tested vs live graewe.com) |
| Contact form validation | `src/lib/contactSchema.ts` (Zod; shared by RHF + `/api/contact`) |
| Calculator diagrams | `public/images/calculator/{ugl,ggl}.gif` (live Wickelbild assets) |
| Job openings (slugs / TYPO3 IDs) | `src/lib/jobs.ts` |
| Job copy (titles, bodies, apply text) | `src/messages/{locale}.json` → `jobs.*` (email-only apply; no on-site application form) |
| Imprint / privacy page bodies | `src/messages/{locale}.json` → `imprintPage.*` / `privacyPage.*` |
| News articles (slugs / TYPO3 IDs / images) | `src/lib/news.ts` + `public/images/news/` |
| News copy (titles, excerpts, bodies) | `src/messages/{locale}.json` → `news.*` |
| Legacy URL → canonical redirects | `src/lib/legacyRedirects.ts` |
| Per-page meta title/description | `src/lib/pageMetadata.ts` |
| Canonical + hreflang helpers | `src/lib/seo.ts` (`buildLocaleAlternates`, `getSiteUrl`) |
| Global error boundary copy | `src/app/globalErrorCopy.ts` — **inlined**, mirrors `error.*` (see exception below) |

Do **not** hardcode user-facing strings in components. Add keys to **all five** locale files.

**One exception — `global-error.tsx`.** It replaces the root layout, so it renders
outside `NextIntlClientProvider` and cannot use `useTranslations`. Importing the
catalogs to get its five strings instead bundled all five locales (248 KB raw /
**74 KB gzip**) into a client chunk loaded on *every* page. Its copy therefore lives
inlined in `src/app/globalErrorCopy.ts`. `src/messages/{locale}.json` → `error.*`
stays the source of truth; `tests/unit/globalErrorCopy.test.ts` deep-compares the two
and fails CI on drift, on a locale added to `routing` but not inlined, or if a catalog
import is reintroduced. Do not extend this exception to other components.

Product detail bodies live in `src/lib/productContent/{de,en,fr,ru,es}.json`. `getProductDetail()` serves the matching locale; unknown locales fall back to `de`.

## 4. Routing & URLs

- Pattern: `/[locale]/...` with German slugs preserved (`/de/produkte/rohrextrusion/extruder`)
- `localeDetection: false` — `/` always **HTTP-redirects** (307) to `/de` via `src/proxy.ts` (next-intl). `src/app/page.tsx` uses `redirect()` from `next/navigation` as the same fallback when the proxy does not run — never a meta-refresh stub. Bare `/` is excluded from `next-sitemap`.
- Old TYPO3 / translated-locale URLs: 301 via `src/lib/legacyRedirects.ts` in `src/proxy.ts`. `staticwebapp.config.json` holds security headers only (Azure 20 KB config limit). See `infra/DNS_CUTOVER.md`.
- Unknown paths: dedicated 404 pages — do **not** rewrite 404 → homepage in SWA config
- Runtime errors: `src/app/[locale]/error.tsx` (localized fallback inside locale layout; Next 16 `unstable_retry`) and `src/app/global-error.tsx` (root last-resort; own `<html>`/`<body>`, copy from messages via pathname locale)
- Use `@/i18n/navigation` (`Link`, `useRouter`, `usePathname`) — not `next/link` / `next/navigation` — for locale-aware routing

## 5. Design tokens (use these, not ad-hoc colors)

From `globals.css` / Tailwind theme:

- Accent / CTAs: `bg-accent` + `text-dark` (never white text on yellow — WCAG)
- Headings: `text-dark` (not inventing `text-primary`)
- Muted text on light surfaces: `text-text-muted` (or `text-grey-500`) — never `text-grey-400` (fails AA on white)
- Muted text on dark surfaces (`bg-bg-footer`): `text-grey-400` — never `text-grey-500` (fails AA on footer)
- Surfaces: `bg-grey-100`, `bg-bg-hero`, `bg-bg-footer`
- Reuse `src/components/ui/*` (`Button`, `Card`, `SectionHeader`, …) before creating one-offs

## 6. Quality bar

Before calling work done:

```bash
npm run type-check
npm run lint
npm run test
```

Run `npm run test:e2e` when changing navigation, i18n, calculator, or contact flows.

CI (`.github/workflows/deploy.yml`) gates on type-check, lint, unit tests, and Playwright e2e (Desktop Chrome plus Mobile Chrome / 320 px projects for overflow + mobile drawer specs). Azure upload runs on `main` (and on PRs labeled `swa-preview` only).

## 7. Environment

Copy `.env.example` → `.env.local`. **Contact email requires `RESEND_API_KEY`** — without it the API returns `503` / `email_unavailable` and the form shows an error (never a fake success). Set production secrets in GitHub (`RESEND_API_KEY`) and vars (`CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`); see cutover checklist in `infra/DNS_CUTOVER.md`. Contact spam protection: Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`) plus honeypot + per-IP rate limit in `src/lib/contactSpam.ts`. Without Turnstile keys, the widget is omitted and only honeypot/rate-limit run.

**Analytics:** None at launch. Do not add Plausible, Umami, etracker, Google Analytics, or similar without also adding consent (if required) and updating Datenschutz + `/cookies`. There is no `NEXT_PUBLIC_ANALYTICS_ID` (or equivalent) env var.

## 8. Current status snapshot

- Pages: home, unternehmen (4), produkte (overview + 3 categories + 19 products), success stories, aktuelles (+ articles), produktrechner, gebrauchtmaschinen, downloads, team, kontakt, stellenanzeigen (+ job detail pages), impressum, datenschutz (bodies in `imprintPage` / `privacyPage` for all locales; DE legally binding), sitemap (HTML), cookies (essential-only; no analytics / no consent banner)
- Interactive: Produktrechner (modern UI with labeled Wickelbild diagrams, live calc, validation), contact form (Resend + Turnstile/honeypot/rate-limit)
- SEO: `generateMetadata` via `pageMetadata` (per-page title/description) plus `alternates.canonical` + `alternates.languages` (five locales + `x-default`→`de`) from `src/lib/seo.ts`; `metadataBase` from `NEXT_PUBLIC_SITE_URL`; Open Graph; JSON-LD; `next-sitemap` with `alternateRefs` (no third-party analytics)
- A11y: skip link, ARIA on menu/language switcher, focus-visible, contrast-safe yellow buttons; contact field errors use text + icon + `aria-invalid`/`aria-describedby` (not colour alone); submit banners use `role="status"` / `role="alert"`
- Deploy: Azure SWA (`standalone` via Oryx) + GH Actions — production on every `main` push; PR previews only with the `swa-preview` label (Free SKU staging cap). Local/prod entry: `npm run start` → `node .next/standalone/server.js`. Details: [`infra/DEPLOY.md`](./infra/DEPLOY.md)

## 9. Spec maintenance (required)

When a change affects how the system works, update this file in the **same PR**:

- New routes, components folders, or data locations
- Stack / deploy / env changes
- New conventions or gotchas agents must know
- Status snapshot when a phase or major feature lands

Keep this file short and operational. Long rationale belongs in `PROJECT.md` or the PR description.
