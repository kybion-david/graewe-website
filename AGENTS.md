# AGENTS.md — Mandatory instructions for AI assistants

You are working on the GRAEWE corporate website. Follow this file on every task.

## Read first (in order)

1. **[`SPEC.md`](./SPEC.md)** — living source of truth (stack, layout, conventions, quality bar)
2. **This file** — workflow and hard rules
3. **[`PROJECT.md`](./PROJECT.md)** — only when you need history, brand audit, calculator formulas, or company reference
4. **Next.js docs in `node_modules/next/dist/docs/`** — before using Next APIs; this is Next.js 16 with breaking changes vs training data

Also load matching rules under `.cursor/rules/` (workflow, coding, i18n, pages, components).

## Open work queues

Two issue queues track everything still to do before launch. Check both before starting, and mark
items `Status: Done` with a one-line note when you finish one. IDs are unique across both files.

- **[`SITE_COMPARISON_ISSUES.md`](./SITE_COMPARISON_ISSUES.md)** — content/parity vs the live `graewe.com` (ISSUE-001 – ISSUE-033)
- **[`PRODUCTION_READINESS_ISSUES.md`](./PRODUCTION_READINESS_ISSUES.md)** — build/CI, runtime bugs, mobile, a11y, SEO plumbing, security (ISSUE-034 – ISSUE-057)

## Isolation & git workflow (non-negotiable)

Every feature, fix, refactor, or docs change must follow this loop:

1. **Worktree** — Before editing, create a dedicated git worktree so you do not collide with another agent on the same checkout:
   ```bash
   git fetch origin main
   git worktree add -b <type>/<short-description> ../graewe-website-<short-description> origin/main
   ```
   Then continue work **inside that worktree** (move the agent root there).
2. **Branch** — Never commit directly on `main`. Use:
   - `feature/<short-description>`
   - `fix/<short-description>`
   - `chore/<short-description>`
   - `docs/<short-description>`
3. **Implement** on that branch only.
4. **Verify** with `npm run type-check`, `npm run lint`, and `npm run test` (plus e2e when relevant — see `SPEC.md`).
5. **PR** — When ready for review, push the branch and open a pull request against `main`. Do not merge unless explicitly asked.
6. **Update `SPEC.md`** in the same PR if the change alters architecture, conventions, routes, env, or agent workflow.

### Commit style

Imperative, concise: `Add product brochure downloads`, `Fix mobile menu tap targets`.

## Hard product rules

- User-facing copy goes in `src/messages/{de,en,fr,ru,es}.json` — all five locales, every time
- Prefer `src/components/ui/*` over one-off styled elements
- Use brand tokens from `globals.css` (`accent` + `text-dark` on yellow CTAs)
- Locale-aware navigation via `@/i18n/navigation`, not raw `next/link`
- `await params` (and `searchParams`) in App Router pages/layouts
- Do not invent CMS or new content systems without an explicit request — content is file-based

## Out of scope unless asked

Phase 5 ideas (3D viewers, e-commerce, customer portal, headless CMS). Keep changes focused on the requested task.
