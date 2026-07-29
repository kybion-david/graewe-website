# GRAEWE Website — Living Spec

> **Authority**: This file is the current-state source of truth for AI agents and contributors.
> Update it in the same PR whenever you change architecture, conventions, routes, or workflow.
> Historical vision and phase notes live in [`PROJECT.md`](./PROJECT.md) — prefer this file when they disagree.

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
| Forms | React Hook Form + Zod; contact API + Resend + Turnstile |
| Tests | Vitest (unit), Playwright (e2e) |
| Deploy | Azure Static Web Apps (`standalone`) primary; GitHub Pages export optional |

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
src/lib/              # calculator, products, productContent, productImages
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
| Product body content | `src/lib/productContent.ts` |
| Product images map | `src/lib/productImages.ts` |
| Calculator math | `src/lib/calculator.ts` (pure functions) |
| Job openings (slugs / TYPO3 IDs) | `src/lib/jobs.ts` |
| Job copy (titles, bodies, apply text) | `src/messages/{locale}.json` → `jobs.*` |
| News articles (slugs / TYPO3 IDs / images) | `src/lib/news.ts` + `public/images/news/` |
| News copy (titles, excerpts, bodies) | `src/messages/{locale}.json` → `news.*` |

Do **not** hardcode user-facing strings in components. Add keys to **all five** locale files.

## 4. Routing & URLs

- Pattern: `/[locale]/...` with German slugs preserved (`/de/produkte/rohrextrusion/extruder`)
- `localeDetection: false` — `/` always redirects to `/de`
- Old TYPO3 URLs: 301s in `staticwebapp.config.json`
- Use `@/i18n/navigation` (`Link`, `useRouter`, `usePathname`) — not `next/link` / `next/navigation` — for locale-aware routing

## 5. Design tokens (use these, not ad-hoc colors)

From `globals.css` / Tailwind theme:

- Accent / CTAs: `bg-accent` + `text-dark` (never white text on yellow — WCAG)
- Headings: `text-dark` (not inventing `text-primary`)
- Muted text: `text-text-muted`
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

CI (`.github/workflows/deploy.yml`) gates on type-check, lint, and unit tests.

## 7. Environment

Copy `.env.example` → `.env.local`. Without `RESEND_API_KEY`, contact submissions log to console (expected in local/dev). Contact spam protection: Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`) plus honeypot + per-IP rate limit in `src/lib/contactSpam.ts`. Without Turnstile keys, the widget is omitted and only honeypot/rate-limit run.

## 8. Current status snapshot

- Pages: home, unternehmen (4), produkte (3 categories + 19 products), success stories, aktuelles (+ articles), produktrechner, gebrauchtmaschinen, downloads, team, kontakt, stellenanzeigen (+ job detail pages), impressum, datenschutz, sitemap (HTML), cookies (essential-only notice; no consent banner while analytics unused)
- Interactive: Produktrechner (2 modes), contact form (Resend + Turnstile/honeypot/rate-limit)
- SEO: `generateMetadata`, Open Graph, JSON-LD, `next-sitemap`
- A11y: skip link, ARIA on menu/language switcher, focus-visible, contrast-safe yellow buttons
- Deploy: Azure SWA Terraform + GH Actions; optional GitHub Pages path via `GITHUB_PAGES=true`

## 9. Spec maintenance (required)

When a change affects how the system works, update this file in the **same PR**:

- New routes, components folders, or data locations
- Stack / deploy / env changes
- New conventions or gotchas agents must know
- Status snapshot when a phase or major feature lands

Keep this file short and operational. Long rationale belongs in `PROJECT.md` or the PR description.
