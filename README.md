# GRAEWE GmbH Website

Modern corporate website for GRAEWE GmbH, built with Next.js 16, TypeScript, and Tailwind CSS 4.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to your default locale (e.g. `/de`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Architecture

See [PROJECT.md](./PROJECT.md) for the full project document with architecture decisions, content migration checklist, and implementation phases.

### Key Directories

- `src/app/[locale]/` — All page routes, organized by locale
- `src/components/` — React components (layout, home, products, calculator, contact, ui)
- `src/messages/` — Translation files (de, en, fr, ru, es)
- `src/lib/` — Business logic (calculator, products data)
- `src/i18n/` — Internationalization config (routing, request, navigation)
- `tests/` — Unit tests (Vitest) and E2E tests (Playwright)

### Tech Stack

- **Next.js 16** (App Router, React Server Components)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (custom brand tokens)
- **next-intl** (5-language i18n: DE, EN, FR, RU, ES)
- **Vitest** + **Playwright** (testing)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```
