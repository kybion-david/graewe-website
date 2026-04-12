# GRAEWE Website Rebuild — Project Document

## 1. Vision & Goals

### What
Rebuild the existing GRAEWE GmbH corporate website (currently hosted on a TYPO3-based CMS at [graewe.com](https://www.graewe.com/)) as a modern, self-owned web application. The new site must faithfully reproduce the current content, structure, and visual identity while providing a platform for future expansion.

### Why
- **Full ownership**: Eliminate dependency on a third-party CMS platform and its constraints.
- **Modern UX**: Deliver a fast, smooth, and impressive experience that reflects GRAEWE's engineering excellence.
- **Extensibility**: Enable future additions such as interactive product demos (3D viewers, animations), e-commerce capabilities, customer portals, and rich media content.
- **Developer experience**: Make the codebase easy to work with for future development — whether by humans or AI assistants.

### Success Criteria
- All existing pages and content are faithfully migrated.
- Visual identity (colors, logo, typography, imagery style) is preserved.
- Multi-language support (DE, EN, FR, RU, ES) is maintained.
- Lighthouse performance score ≥ 90.
- The site is deployable and maintainable without CMS vendor involvement.

---

## 2. Current Website Audit

### Site Map (Existing)

```
graewe.com/
├── Home (hero carousel, product category cards, news teaser)
├── Unternehmen/
│   ├── Wer ist Graewe?      — Company identity & history
│   ├── Was macht Graewe?     — Capabilities overview
│   ├── Wofür steht Graewe?   — Values & principles
│   └── Die Graewe Gruppe     — Group structure
├── Produkte/
│   ├── Rohrextrusion/        — Pipe extrusion (8 sub-pages)
│   │   ├── Extruder
│   │   ├── Kalibrier- und Kühlbäder
│   │   ├── Abzüge
│   │   ├── Trenneinrichtungen
│   │   ├── Vollautomatische Wickler
│   │   ├── Halbautomatische Wickler
│   │   ├── Muffenmaschinen
│   │   └── Sondermaschinen
│   ├── Profilextrusion/      — Profile extrusion (6 sub-pages)
│   │   ├── Extruder
│   │   ├── Kalibriertische
│   │   ├── Abzüge
│   │   ├── Trenneinrichtungen
│   │   ├── Wickler
│   │   └── Sondermaschinen
│   └── Plattenextrusion/     — Sheet extrusion (5 sub-pages)
│       ├── Extruder
│       ├── Längstrenn-Einrichtungen
│       ├── Quertrenn-Einrichtungen
│       ├── Plattenstapler
│       └── Sondermaschinen
├── Success Stories            — Customer testimonials
├── Aktuelles                  — News / articles
├── Produktrechner             — Interactive calculators (Wickelendposition, Wickellänge)
├── Gebrauchtmaschinen         — Used machines (links to next-machines.com)
├── Downloads                  — Document downloads
├── Team                       — Contact departments & info
├── Kontakt                    — Contact form
├── Stellenanzeigen            — Job postings
├── Impressum                  — Legal notice
├── Datenschutz                — Privacy policy
└── Sitemap
```

### Languages Supported
DE (primary), EN, FR, RU, ES — selectable via header language switcher.

### Visual Identity
- **Primary color**: Dark blue/navy (#003366 range — extract exact values from live site CSS)
- **Accent color**: Orange/amber highlights
- **Logo**: GRAEWE wordmark (white on dark, dark on light variants)
- **Typography**: Clean sans-serif (likely Helvetica/Arial family)
- **Photography style**: Industrial machinery, factory floors, product close-ups
- **Layout**: Professional corporate style — hero sections, card grids, sidebar navigation on product pages

### Key Interactive Features
- **Hero carousel** on homepage (rotating banner with text overlays)
- **Produktrechner** (product calculator): Two calculation modes — Wickelendposition and Wickellänge — with form inputs and computed results
- **Contact form** with captcha
- **Product sidebar navigation** (persistent across product category pages)
- **Language switcher** (5 languages)
- **Responsive design** (mobile hamburger menu)

---

## 3. Technology Stack

### Core Framework: Next.js 15 (App Router)

**Rationale**: Next.js with the App Router provides the best balance of:
- **SSG/SSR flexibility**: Corporate content pages are statically generated for speed; interactive features (calculator, contact form) use client components.
- **File-based routing**: Maps naturally to the existing URL structure.
- **React Server Components**: Reduce client-side JavaScript for content pages.
- **Image optimization**: Built-in `next/image` for the many product photographs.
- **API routes**: Handle contact form submissions, future e-commerce endpoints.
- **Ecosystem**: Largest community, best deployment options, future-proof.

### Language: TypeScript

Strict mode enabled. All code must be typed — no `any` escape hatches except in genuinely unavoidable third-party integration seams.

### Styling: Tailwind CSS 4

- Utility-first for rapid, consistent styling.
- Custom theme configuration to encode GRAEWE brand tokens (colors, fonts, spacing).
- Component-level `@apply` only when a utility combination is repeated 3+ times.
- Use CSS variables for brand colors so they can be referenced from both Tailwind and any future canvas/WebGL code.

### Content Management: MDX + Structured JSON

Instead of a CMS, content lives in the repository:

- **MDX files** for rich content pages (company info, product descriptions, news articles). MDX allows embedding React components inside markdown — useful for future interactive demos.
- **JSON data files** for structured/repeated content (product specs, team contacts, navigation structure, translations).
- **`/public/images/`** for all imagery, organized by section.

This approach gives full version control over content, no external service dependencies, and is trivially editable by AI assistants.

### Internationalization: next-intl

- Handles routing (`/de/...`, `/en/...`, etc.), message loading, and locale detection.
- Translation files in JSON format: `messages/de.json`, `messages/en.json`, etc.
- Default locale: `de`.

### Form Handling & Email

- **React Hook Form** + **Zod** for form validation (contact form, future forms).
- **Server Actions** (Next.js) for form submission.
- **Resend** or **Nodemailer** for sending contact form emails (configurable via environment variables).

### Testing

Pragmatic testing — enough to catch regressions, not so much that tests become a maintenance burden.

| Layer | Tool | What to Test |
|-------|------|-------------|
| Unit | Vitest | Utility functions, calculator logic, data transformations |
| Component | Vitest + React Testing Library | Key interactive components (calculator, contact form, language switcher) |
| E2E | Playwright | Critical user journeys: navigate to product page, submit contact form, switch language, use calculator |
| Visual | (optional, Phase 3) Playwright screenshots | Catch unintended visual regressions |

**Testing philosophy**: Test behavior, not implementation. Every interactive feature gets at least one test. Pure content pages do not need dedicated tests — they are covered by E2E navigation tests and build-time type checking.

### Deployment

- **Primary**: Azure Static Web Apps (hybrid Next.js support with SSR, API routes, global CDN).
- **Infrastructure as Code**: Terraform files in `infra/` — creates resource group, SWA, and custom domain bindings.
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) — quality gate (type-check, lint, unit tests) then Azure SWA deploy.
- **Standalone mode**: `output: "standalone"` in `next.config.ts` for optimized deployment size.
- **Redirects**: `staticwebapp.config.json` for 301 redirects from old TYPO3 URLs and security headers.
- Environment variables for secrets (email API keys, site URL) managed in Azure portal and GitHub secrets.

### Analytics & SEO

- **Structured metadata** via Next.js `generateMetadata` on every page.
- **Open Graph / Twitter cards** for social sharing.
- **JSON-LD** structured data for organization and products.
- **Sitemap** auto-generated via `next-sitemap`.
- **Analytics**: Plausible or Umami (privacy-friendly, GDPR-compliant) — no Google Analytics unless explicitly requested.

---

## 4. Project Structure

```
graewe-website/
├── public/
│   ├── images/
│   │   ├── logo/                    # Logo variants
│   │   ├── hero/                    # Hero carousel images
│   │   ├── products/
│   │   │   ├── rohrextrusion/       # Pipe extrusion product images
│   │   │   ├── profilextrusion/     # Profile extrusion product images
│   │   │   └── plattenextrusion/    # Sheet extrusion product images
│   │   ├── company/                 # Company/factory photos
│   │   └── news/                    # News article images
│   ├── downloads/                   # Downloadable PDFs/documents
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── [locale]/                # Locale-wrapped routes (de, en, fr, ru, es)
│   │   │   ├── layout.tsx           # Root layout with header, footer, locale provider
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── unternehmen/
│   │   │   │   ├── wer-ist-graewe/page.tsx
│   │   │   │   ├── was-macht-graewe/page.tsx
│   │   │   │   ├── wofuer-steht-graewe/page.tsx
│   │   │   │   └── die-graewe-gruppe/page.tsx
│   │   │   ├── produkte/
│   │   │   │   ├── page.tsx         # Products overview (optional)
│   │   │   │   ├── rohrextrusion/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [product]/page.tsx  # Dynamic: extruder, abzuege, etc.
│   │   │   │   ├── profilextrusion/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [product]/page.tsx
│   │   │   │   └── plattenextrusion/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [product]/page.tsx
│   │   │   ├── success-stories/page.tsx
│   │   │   ├── aktuelles/
│   │   │   │   ├── page.tsx         # News listing
│   │   │   │   └── [slug]/page.tsx  # Individual article
│   │   │   ├── produktrechner/page.tsx
│   │   │   ├── gebrauchtmaschinen/page.tsx
│   │   │   ├── downloads/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── kontakt/page.tsx
│   │   │   ├── stellenanzeigen/page.tsx
│   │   │   ├── impressum/page.tsx
│   │   │   └── datenschutz/page.tsx
│   │   ├── api/                     # API routes (contact form, future endpoints)
│   │   │   └── contact/route.ts
│   │   └── globals.css              # Tailwind base + brand CSS custom properties
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Top nav, logo, language switcher
│   │   │   ├── Footer.tsx           # Footer with product links, legal links, contact
│   │   │   ├── MobileMenu.tsx       # Hamburger menu drawer
│   │   │   └── ProductSidebar.tsx   # Sidebar nav for product category pages
│   │   ├── home/
│   │   │   ├── HeroCarousel.tsx     # Homepage hero slider
│   │   │   ├── ProductCategories.tsx # Three product category cards
│   │   │   └── NewsTeaser.tsx       # Latest news preview
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGallery.tsx   # Image gallery for product detail pages
│   │   │   └── ProductSpecs.tsx     # Technical specifications table
│   │   ├── calculator/
│   │   │   ├── Calculator.tsx       # Main Produktrechner component
│   │   │   ├── WindingPosition.tsx  # Wickelendposition calculator
│   │   │   └── WindingLength.tsx    # Wickellänge calculator
│   │   ├── contact/
│   │   │   └── ContactForm.tsx      # Contact form with validation
│   │   └── ui/                      # Reusable primitives
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── LanguageSwitcher.tsx
│   │
│   ├── content/                     # All content as data (MDX + JSON)
│   │   ├── products/                # Product descriptions & specs per locale
│   │   │   ├── rohrextrusion/
│   │   │   ├── profilextrusion/
│   │   │   └── plattenextrusion/
│   │   ├── company/                 # Company page content
│   │   ├── news/                    # News articles (MDX)
│   │   └── testimonials/            # Success stories
│   │
│   ├── lib/
│   │   ├── calculator.ts           # Winding calculation logic (pure functions)
│   │   ├── content.ts              # Content loading utilities
│   │   ├── email.ts                # Email sending logic
│   │   └── utils.ts                # General utilities
│   │
│   ├── messages/                    # i18n translation files
│   │   ├── de.json
│   │   ├── en.json
│   │   ├── fr.json
│   │   ├── ru.json
│   │   └── es.json
│   │
│   └── types/                       # TypeScript type definitions
│       ├── product.ts
│       ├── content.ts
│       └── calculator.ts
│
├── tests/
│   ├── unit/                        # Vitest unit tests
│   │   └── calculator.test.ts
│   ├── components/                  # Component tests
│   │   ├── ContactForm.test.tsx
│   │   └── Calculator.test.tsx
│   └── e2e/                         # Playwright E2E tests
│       ├── navigation.spec.ts
│       ├── contact.spec.ts
│       ├── calculator.spec.ts
│       └── language.spec.ts
│
├── infra/                           # Azure infrastructure (Terraform)
│   ├── main.tf                      # Azure Static Web App + custom domain
│   ├── variables.tf                 # Configurable variables
│   ├── outputs.tf                   # Deployment token, URLs
│   ├── locals.tf                    # Tags
│   ├── bootstrap.sh                 # One-time TF state backend setup
│   ├── terraform.tfvars.example     # Example variable values
│   └── DNS_CUTOVER.md              # DNS migration checklist
│
├── .github/workflows/
│   └── deploy.yml                   # CI/CD: quality gate + Azure SWA deploy
│
├── staticwebapp.config.json         # Azure SWA redirects + security headers
├── .env.example                     # Template for environment variables
├── .gitignore
├── next.config.ts                   # Next.js config (standalone, i18n, images)
├── next-sitemap.config.js           # Sitemap generation config
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── PROJECT.md                       # This document
└── README.md                        # Setup & development instructions
```

---

## 5. Design System & Brand Tokens

Extracted from the live site and encoded in `globals.css` as CSS custom properties + Tailwind `@theme inline`.

```css
:root {
  /* GRAEWE Brand Yellow */
  --color-accent: #ffd600;
  --color-accent-light: #ffe033;
  --color-accent-dark: #e6c000;

  /* Dark tones */
  --color-dark: #1a1a1a;
  --color-dark-light: #2d2d2d;
  --color-dark-muted: #4a4a4a;

  /* Greys */
  --color-grey-100: #f5f5f5;
  --color-grey-200: #ebebeb;
  --color-grey-300: #d4d4d4;
  --color-grey-400: #9e9e9e;
  --color-grey-500: #6b6b6b;

  /* Backgrounds */
  --color-bg: #ffffff;
  --color-bg-hero: #e8e8e8;
  --color-bg-footer: #2a2a2a;
  --color-bg-footer-bottom: #1e1e1e;

  /* Text */
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  --color-border: #d4d4d4;

  /* Typography */
  font-family: "Helvetica Neue", Arial, "Nimbus Sans L", sans-serif;
}
```

**Key design patterns** (from original site):
- **Header**: Logo top-left, "DE" language dropdown + yellow "MENÜ" button top-right. Navigation hidden behind menu.
- **Hero**: Light grey background (#e8e8e8), text on left, product images on right, carousel arrows bottom-left.
- **Product categories**: Three-column cards below hero with yellow headings and small icons.
- **Footer**: Dark background, Produktrechner banner, legal links, nav columns, "next" branding.
- **Content pages**: Breadcrumb in yellow, headings in dark, two-column layouts with sidebar on product pages.

---

## 6. Implementation Phases

### Phase 1: Foundation (MVP — Static Pages) ✅ COMPLETED

1. ✅ Initialized Next.js 16 project with TypeScript, Tailwind CSS 4, and ESLint.
2. ✅ Set up `next-intl` with DE as default locale; 5 translation files (DE fully translated, EN translated, FR/RU/ES placeholder copies of EN).
3. ✅ Built the layout shell: Header (GRAEWE logo, DE dropdown, yellow MENÜ button), Footer (dark bg, product links, legal links), mobile menu.
4. ✅ Built the Homepage: hero carousel with 5 slides + actual product images, three product category cards, Produktrechner teaser.
5. ✅ Built the Unternehmen section (4 static content pages with full DE/EN text).
6. ✅ Built the Produkte section with product sidebar navigation and all 19 product sub-pages.
7. ✅ Built remaining pages: Success Stories, Gebrauchtmaschinen (with hero image), Downloads, Team, Impressum, Datenschutz, Stellenanzeigen.
8. ✅ All text content migrated into JSON translation files.
9. ✅ Downloaded and organized images from graewe.com (hero slides, logo, favicons, gallery images, Gebrauchtmaschinen hero, Produktrechner diagram).
10. ✅ Responsive design — mobile menu, responsive grids.

**Tests**: 17 E2E tests (navigation, language, calculator), 9 unit tests — all pass.

### Phase 2: Interactive Features & Visual Polish ✅ COMPLETED

1. ✅ Built the Produktrechner (both Wickelendposition and Wickellänge calculator modes).
2. ✅ Built the Contact form with React Hook Form validation, API route endpoint.
3. ✅ Built the Aktuelles (news) section with article listing and 5 detail pages.
4. ✅ Built the Stellenanzeigen (job postings) page.
5. ✅ SEO setup: `generateMetadata` on every page, Open Graph, JSON-LD structured data (Organization schema), auto-generated sitemap via `next-sitemap`.
6. ✅ Visual polish pass — extracted exact colors from live site, matched header/hero/footer/cards design, integrated real product images.

**Tests**: 9 unit tests for calculator logic, 17 E2E tests — all pass.
**Build**: 214 static pages, TypeScript clean, builds in ~6s.

### Phase 3: Deployment & Launch Preparation ✅ COMPLETED

1. ✅ Fixed language switcher — disabled `localeDetection` so `/` always redirects to `/de` instead of browser-sniffed locale.
2. ✅ Fixed hero images — made them large and properly positioned matching original site.
3. ✅ Added hero images on mobile with stacked layout (text above, image below, arrows).
4. ✅ Azure Static Web Apps Terraform infrastructure (`infra/main.tf`, variables, outputs, bootstrap script).
5. ✅ GitHub Actions CI/CD pipeline (`.github/workflows/deploy.yml`) — quality gate + Azure SWA deploy + PR preview environments.
6. ✅ DNS cutover plan (`infra/DNS_CUTOVER.md`) with detailed pre/post cutover checklists and DNS record specs.
7. ✅ 301 redirects from old TYPO3 `.html` URLs and query-param patterns (`staticwebapp.config.json`).
8. ✅ Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
9. ✅ `output: "standalone"` for optimized deployment size on Azure SWA.
10. ✅ Proxy (middleware) updated to exclude `.swa` health-check paths.

**Tests**: 9 unit tests, 17 E2E tests — all pass. Build: 214 static pages.

### Phase 4: Pre-Launch Polish & Integrations ✅ COMPLETED

1. ✅ Contact form email sending wired up with **Resend** SDK — graceful fallback to console logging when `RESEND_API_KEY` is not set.
2. ✅ **FR, RU, ES translations** — all three now have proper native translations (verified rendering).
3. ✅ **Accessibility**: skip-to-content link, `aria-expanded` / `aria-label` on menu and language switcher, `role="banner"`, semantic `<nav>` for menu, global `:focus-visible` outline style.
4. ✅ **Contrast fix**: all yellow (`bg-accent`) buttons now use `text-dark` instead of `text-white` for WCAG AA compliance.
5. ✅ All 5 locales verified: pages return 200, correct `lang` attribute, correct translated content.

### Phase 5: Post-Launch Enhancements
Not in initial scope, but the architecture explicitly supports:

- **Interactive product demos**: 3D model viewers (Three.js/React Three Fiber), animations, product configurators.
- **E-commerce**: Stripe integration for direct purchases, quote request system.
- **Customer portal**: Authenticated area for existing customers (machine documentation, service history).
- **Blog/Knowledge base**: Expanded Aktuelles section with categories, search, RSS.
- **CMS integration** (optional): If non-technical staff need to edit content, add a headless CMS (Sanity, Payload CMS) later — the content structure is already decoupled.

---

## 7. URL Structure & Routing

Preserve the existing URL patterns for SEO continuity. The Next.js `[locale]` dynamic segment handles the language prefix.

| Current URL | New Route | Notes |
|------------|-----------|-------|
| `/` | `/[locale]` | Homepage |
| `/unternehmen/wer-ist-graewe` | `/[locale]/unternehmen/wer-ist-graewe` | Keep German slugs as canonical |
| `/produkte/rohrextrusion` | `/[locale]/produkte/rohrextrusion` | Category page |
| `/produkte/rohrextrusion/extruder` | `/[locale]/produkte/rohrextrusion/extruder` | Product detail |
| `/kontakt` | `/[locale]/kontakt` | Contact form |
| `/produktrechner` | `/[locale]/produktrechner` | Calculator |
| `/aktuelles` | `/[locale]/aktuelles` | News listing |
| `/impressum` | `/[locale]/impressum` | Legal |

**Note**: The locale prefix is added, but `next-intl` middleware handles automatic redirection from bare URLs to the default locale. Set up 301 redirects from the old TYPO3 URL patterns (especially the `tx_news_pi1` query parameters for news articles).

---

## 8. Content Migration Checklist

- [ ] Homepage hero text and carousel images (5 slides)
- [ ] Wer ist Graewe? — full text content
- [ ] Was macht Graewe? — full text content
- [ ] Wofür steht Graewe? — full text content
- [ ] Die Graewe Gruppe — full text content
- [ ] Rohrextrusion overview + 8 product sub-pages (text + images)
- [ ] Profilextrusion overview + 6 product sub-pages (text + images)
- [ ] Plattenextrusion overview + 5 product sub-pages (text + images)
- [ ] Success Stories — 2 testimonials (Maplast S.A., ASG Plastics)
- [ ] Aktuelles — all news articles (at least 5 known)
- [ ] Gebrauchtmaschinen — text + link to next-machines.com
- [ ] Downloads — all downloadable documents
- [ ] Team — department contact info (Service, Ersatzteile, Gebrauchtmaschinen, Jobs)
- [ ] Kontakt — address, phone, fax, email, map embed
- [ ] Impressum — full legal text
- [ ] Datenschutz — full privacy policy text
- [ ] Stellenanzeigen — job postings
- [ ] All product images per category
- [ ] Logo files (all variants)
- [ ] Favicon

---

## 9. Company Information (Reference)

```
GRAEWE GmbH Maschinenbau
Max-Planck-Straße 1-3
79395 Neuenburg am Rhein
Germany

Tel: +49 (0) 7631 79 44-0
Fax: +49 (0) 7631 79 44-22
Email: info@graewe.com
Web: www.graewe.com

Geschäftsführung:
- Dipl.-Ing.(Univ.) Michael Graewe
- Dipl.-Ing.(FH) Dipl.-Exportwirt (EA) Stefan Graewe

Commercial Registry: HRB Freiburg 300198
UST-ID-Nr.: DE 142475242

Related entity:
next GmbH (used machines)
Max-Planck-Str. 1+2, DE-79395 Neuenburg
Tel: +49 (0) 7631 79 44-30
Web: www.next-machines.com
Email: info@next-machines.com
```

---

## 10. Development Conventions

### Code Style
- ESLint with Next.js recommended config + strict TypeScript rules.
- Prettier for formatting (default settings, printWidth: 100).
- Named exports preferred over default exports (except for page/layout components required by Next.js).
- Components: one component per file, file name matches component name (PascalCase).

### Git Workflow
- `main` branch is production.
- Feature branches: `feature/<short-description>`.
- Commit messages: imperative mood, concise ("Add product calculator", "Fix mobile nav overflow").
- PRs require passing CI (lint + type-check + tests) before merge.

### Environment Variables
```env
# .env.example
NEXT_PUBLIC_SITE_URL=https://www.graewe.com
CONTACT_EMAIL_TO=info@graewe.com
EMAIL_API_KEY=             # Resend or SMTP credentials
NEXT_PUBLIC_ANALYTICS_ID=  # Plausible/Umami site ID
```

### AI Assistant Instructions
This project is designed to be AI-friendly. When working on this codebase:
- Read `PROJECT.md` (this file) first for full context.
- Content lives in `src/messages/` (JSON translation files) — edit content there, not in components.
- Calculator logic is in `src/lib/calculator.ts` — pure functions, easy to test.
- Product data (categories, subcategories, slugs) is in `src/lib/products.ts`.
- The `src/components/ui/` directory contains reusable primitives; use them rather than creating one-off styled elements.
- **Colors**: Use `text-dark` for headings (not `text-primary`), `text-accent` for yellow highlights, `bg-grey-100` for light backgrounds, `bg-dark`/`bg-bg-footer` for dark sections. See `globals.css` for all tokens.
- **Next.js 16**: `params` is a `Promise` — always `await params`. Middleware is `proxy.ts` not `middleware.ts`.
- Always run `npm run type-check` and `npm run test` before considering work complete.
- The site must work in all 5 languages — when adding UI text, add translation keys to all message files (DE and EN are fully translated; FR/RU/ES are English copies for now).

---

## 11. Key Dependencies (Installed)

```json
{
  "next": "16.2.0",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "next-intl": "^4.8.3",
  "next-sitemap": "latest",
  "react-hook-form": "^7.71.2",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.3.6",
  "sharp": "^0.34.5"
}
```

Dev dependencies:
```json
{
  "typescript": "^5",
  "@types/react": "^19",
  "@types/node": "^20",
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "vitest": "^4.1.0",
  "@vitejs/plugin-react": "^6.0.1",
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.9.1",
  "@playwright/test": "^1.58.2",
  "eslint": "^9",
  "eslint-config-next": "16.2.0",
  "prettier": "^3.8.1"
}
```

---

## 12. Produktrechner — Calculator Specification

The existing calculator has two modes that need to be reimplemented:

### Mode 1: Wickelendposition (Winding End Position)
**Inputs**: Rohrdurchmesser (pipe diameter) `d` [mm], Länge (length) `L` [m], Innendurchmesser (inner diameter) `ID` [mm], Rohranzahl pro Lage (pipes per layer) [count]

**Outputs** (two winding patterns):
- Ungleiche Lagen (uneven layers): Lageanzahl, Rohranzahl auf letzter Lage, Rotationsanzahl, Bundbreite, Bundhöhe, Außendurchmesser
- Gleiche Lagen versetzt (even layers offset): Same output fields

### Mode 2: Wickellänge (Winding Length)
**Inputs**: Rohrdurchmesser `d` [mm], Innendurchmesser `ID` [mm], Außendurchmesser `OD` [mm], Bundbreite `W` [mm]

**Outputs** (two winding patterns):
- Wickellänge [m], Außendurchmesser OD [mm], Bundbreite W [mm]

**Note**: Results can deviate up to 10%. Implement the calculation logic as pure TypeScript functions in `src/lib/calculator.ts` with comprehensive unit tests. The exact formulas should be reverse-engineered from the existing calculator or provided by GRAEWE engineering.

---

## Summary

This project transforms the GRAEWE corporate website from a CMS-dependent platform into a modern, owned Next.js 16 application deployed to Azure Static Web Apps. **Phases 1–4 are complete and the site is launch-ready.** The site faithfully reproduces the original design with the GRAEWE brand yellow (#ffd600), includes all pages with full i18n support (DE, EN, FR, RU, ES — all properly translated), interactive features (Produktrechner with two calculator modes, contact form with Resend email integration), SEO (sitemap, JSON-LD, Open Graph), accessibility (skip-to-content, ARIA labels, focus styles, WCAG AA contrast), and full deployment infrastructure (Terraform for Azure SWA + GitHub Actions CI/CD + DNS cutover plan + 301 redirects from old TYPO3 URLs). Phase 5 opens the door to post-launch innovations like 3D product demos and e-commerce. The architecture is deliberately simple and file-based, making it maintainable by a small team and fully accessible to AI development assistants.
