# Azure Static Web Apps — deploy method (ISSUE-054)

How this Next.js `standalone` app is built, deployed, and verified on Azure SWA.

## Production hostname (pre-cutover)

| Role | URL |
|------|-----|
| Azure SWA default | https://lively-meadow-097c4d503.7.azurestaticapps.net |
| Public brand domain | https://www.graewe.com (still the old TYPO3/Apache site until DNS cutover — see [`DNS_CUTOVER.md`](./DNS_CUTOVER.md)) |

Until DNS cutover, **treat the `*.azurestaticapps.net` hostname as the staging/production slot for the rebuild**.

## What ships

1. `next.config.ts` sets `output: "standalone"`.
2. `npm run build` runs `next build`, then copies `.next/static` and `public` into `.next/standalone/` (required for the Node server).
3. GitHub Actions (`.github/workflows/deploy.yml`) hands the repo to `Azure/static-web-apps-deploy@v1` with `app_location: "/"`, empty `api_location` / `output_location`.
4. Oryx builds on the runner, detects `.next/standalone`, and packages that artifact for the SWA Node backend (`Detected standalone folder, so using it for deployment` — e.g. run `30489323390`).
5. Local / e2e production entry point is **`npm run start` → `node .next/standalone/server.js`** — not `next start`.

Oryx may warn: `For Next.js apps, staticwebapp.config.json features are not fully supported yet!` Security headers in `staticwebapp.config.json` are still kept; Azure also injects `Strict-Transport-Security` on the default HTTPS hostname.

## When CI deploys

| Event | `quality` job | `Deploy` job |
|-------|---------------|--------------|
| Push to `main` | always | always (production slot) |
| Pull request | always | **only if the PR has the `swa-preview` label** |
| PR closed | — | `Close PR` tears down the preview **if** it had `swa-preview` |

**Why the label gate:** Free SKU allows only **3 concurrent** staging environments. Unrestricted PR deploys hit `This Static Web App already has the maximum number of staging environments` (e.g. run `30489426955`), which painted every PR Deploy check red and also caused production uploads to be canceled under load. Teardown on merge still works (`close_pull_request`); this is a concurrency cap, not orphaned environments.

To preview a PR on Azure: add the `swa-preview` label (keep ≤3 labeled open PRs on Free). Raising `swa_sku_tier` to `Standard` in Terraform (and applying) raises the staging limit if parallel previews become routine.

Production deploys use concurrency group `swa-production` with `cancel-in-progress: false` so queued `main` pushes do not cancel each other.

## End-to-end verification (2026-07-29)

Against `https://lively-meadow-097c4d503.7.azurestaticapps.net` after a successful main deploy (`Deployment Complete` + that URL in run `30489323390`):

| Check | Result |
|-------|--------|
| `GET /` | `307` → `/de` (`NEXT_LOCALE=de`) |
| `GET /de` | `200` HTML (`x-nextjs-cache` / prerender headers present) |
| `GET /en` | `200` HTML (`NEXT_LOCALE=en`) — locale routing works |
| `GET /stellenanzeigen/stellendetails?tx_tanjoboffers_jobdetail[job]=9` | `301` → `/de/stellenanzeigen/elektriker-elektroniker` (proxy + legacy redirects) |
| `POST /api/contact` with `{}` | `400` `{"error":"Missing required fields"}` (App Router API is live, not a static 404) |
| HSTS | `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Azure platform; also declared in `staticwebapp.config.json`) |

Re-verify after meaningful deploy changes:

```bash
BASE=https://lively-meadow-097c4d503.7.azurestaticapps.net
curl -sI "$BASE/" | head -5
curl -sI "$BASE/en" | head -5
curl -sI -G --data-urlencode 'tx_tanjoboffers_jobdetail[job]=9' \
  "$BASE/stellenanzeigen/stellendetails" | head -5
curl -s -o /dev/null -w '%{http_code}\n' -X POST "$BASE/api/contact" \
  -H 'content-type: application/json' -d '{}'
```

## Local production smoke

```bash
npm ci
npm run build
npm run start   # node .next/standalone/server.js
# then curl http://localhost:3000/  etc.
```

Playwright’s `webServer` uses the same `npm run build && npm run start` path so e2e exercises the shipped artifact.
