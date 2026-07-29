/**
 * Legacy TYPO3 / pre-cutover URL → canonical rebuild URL.
 *
 * Decision (ISSUE-005): keep German slugs for all locales; 301 old
 * translated EN/FR/RU/ES paths (and unprefixed DE hubs) to the new routes.
 *
 * All path + query redirects run in `src/proxy.ts` via `resolveLegacyRedirect`.
 * `staticwebapp.config.json` only carries security headers — Azure SWA rejects
 * config files over 20 KB, so the full path matrix cannot live there.
 */

import { getJobSlugFromLegacyId } from "./jobs";
import { getNewsSlugFromLegacyId } from "./news";
import { productCategories, type ProductCategory } from "./products";

const LOCALES = ["de", "en", "fr", "ru", "es"] as const;
type AppLocale = (typeof LOCALES)[number];

/** Shared DE page paths (no leading slash, no locale). */
const DE_HUB_PATHS = [
  "unternehmen/wer-ist-graewe",
  "unternehmen/was-macht-graewe",
  "unternehmen/wofuer-steht-graewe",
  "unternehmen/die-graewe-gruppe",
  "produkte/rohrextrusion",
  "produkte/profilextrusion",
  "produkte/plattenextrusion",
  "success-stories",
  "gebrauchtmaschinen",
  "aktuelles",
  "produktrechner",
  "downloads",
  "team",
  "kontakt",
  "stellenanzeigen",
  "impressum",
  "datenschutz",
  "sitemap",
  "cookies",
] as const;

/** Old EN/RU/ES translated path → German slug path (no locale prefix). */
const EN_LIKE_PATH_MAP: Record<string, string> = {
  "company/who-is-graewe": "unternehmen/wer-ist-graewe",
  "company/what-does-graewe-do": "unternehmen/was-macht-graewe",
  "company/what-does-graewe-stand-for": "unternehmen/wofuer-steht-graewe",
  "company/graewe-group": "unternehmen/die-graewe-gruppe",
  products: "",
  "products/pipe-extrusion": "produkte/rohrextrusion",
  "products/pipe-extrusion/pipe-extrusion-extruder":
    "produkte/rohrextrusion/extruder",
  "products/pipe-extrusion/pipe-extrusion-vacuum-calibration-tanks":
    "produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
  "products/pipe-extrusion/belt-haul-off": "produkte/rohrextrusion/abzuege",
  "products/pipe-extrusion/cutting-machines":
    "produkte/rohrextrusion/trenneinrichtungen",
  "products/pipe-extrusion/fully-automatic-coilers":
    "produkte/rohrextrusion/vollautomatische-wickler",
  "products/pipe-extrusion/semi-automatic-coilers":
    "produkte/rohrextrusion/halbautomatische-wickler",
  "products/pipe-extrusion/socketing-machines":
    "produkte/rohrextrusion/muffenmaschinen",
  "products/pipe-extrusion/special-machines":
    "produkte/rohrextrusion/sondermaschinen",
  "products/profile-extrusion": "produkte/profilextrusion",
  "products/profile-extrusion/extruders": "produkte/profilextrusion/extruder",
  "products/profile-extrusion/calibration-tables":
    "produkte/profilextrusion/kalibriertische",
  "products/profile-extrusion/haul-off": "produkte/profilextrusion/abzuege",
  "products/profile-extrusion/cutting-machines":
    "produkte/profilextrusion/trenneinrichtungen",
  "products/profile-extrusion/coilers": "produkte/profilextrusion/wickler",
  "products/profile-extrusion/special-machines":
    "produkte/profilextrusion/sondermaschinen",
  "products/sheet-extrusion": "produkte/plattenextrusion",
  "products/sheet-extrusion/extruders": "produkte/plattenextrusion/extruder",
  "products/sheet-extrusion/side-trim-units":
    "produkte/plattenextrusion/laengstrenn-einrichtungen",
  "products/sheet-extrusion/cross-cut-units":
    "produkte/plattenextrusion/quertrenn-einrichtungen",
  "products/sheet-extrusion/sheetstacker":
    "produkte/plattenextrusion/plattenstapler",
  "products/sheet-extrusion/special-machines":
    "produkte/plattenextrusion/sondermaschinen",
  news: "aktuelles",
  "product-calculator": "produktrechner",
  "second-hand-machines": "gebrauchtmaschinen",
  contact: "kontakt",
  "job-advertisements": "stellenanzeigen",
  imprint: "impressum",
  "data-privacy": "datenschutz",
  // Same slug on old + new — still listed for .html / matrix completeness
  "success-stories": "success-stories",
  downloads: "downloads",
  team: "team",
  sitemap: "sitemap",
  cookies: "cookies",
};

/** Old FR translated path → German slug path (no locale prefix). */
const FR_PATH_MAP: Record<string, string> = {
  "entreprise/qui-est-graewe": "unternehmen/wer-ist-graewe",
  "entreprise/que-fabrique-graewe": "unternehmen/was-macht-graewe",
  "entreprise/que-vous-apporte-graewe": "unternehmen/wofuer-steht-graewe",
  "entreprise/le-groupe-graewe": "unternehmen/die-graewe-gruppe",
  produits: "",
  "produits/extrusion-de-tubes": "produkte/rohrextrusion",
  "produits/extrusion-de-tubes/extrudeuses": "produkte/rohrextrusion/extruder",
  "produits/extrusion-de-tubes/bacs-de-calibrage-et-bacs-de-refroidissement":
    "produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
  "produits/extrusion-de-tubes/tireuses": "produkte/rohrextrusion/abzuege",
  "produits/extrusion-de-tubes/unites-de-coupe":
    "produkte/rohrextrusion/trenneinrichtungen",
  "produits/extrusion-de-tubes/enrouleurs-automatiques":
    "produkte/rohrextrusion/vollautomatische-wickler",
  "produits/extrusion-de-tubes/enrouleurs-semi-automatiques":
    "produkte/rohrextrusion/halbautomatische-wickler",
  "produits/extrusion-de-tubes/tulipeuses":
    "produkte/rohrextrusion/muffenmaschinen",
  "produits/extrusion-de-tubes/machines-speciales":
    "produkte/rohrextrusion/sondermaschinen",
  "produits/extrusion-de-profiles": "produkte/profilextrusion",
  "produits/extrusion-de-profiles/extrudeuses":
    "produkte/profilextrusion/extruder",
  "produits/extrusion-de-profiles/tables-de-calibrage":
    "produkte/profilextrusion/kalibriertische",
  "produits/extrusion-de-profiles/tireuses": "produkte/profilextrusion/abzuege",
  "produits/extrusion-de-profiles/unites-de-coupe":
    "produkte/profilextrusion/trenneinrichtungen",
  "produits/extrusion-de-profiles/enrouleurs":
    "produkte/profilextrusion/wickler",
  "produits/extrusion-de-profiles/machines-speciales":
    "produkte/profilextrusion/sondermaschinen",
  "produits/extrusion-de-plaques": "produkte/plattenextrusion",
  "produits/extrusion-de-plaques/extrudeuses":
    "produkte/plattenextrusion/extruder",
  "produits/extrusion-de-plaques/scies-a-lame-a-coupe-longitudinale":
    "produkte/plattenextrusion/laengstrenn-einrichtungen",
  "produits/extrusion-de-plaques/scies-a-lame-a-coupe-transversale":
    "produkte/plattenextrusion/quertrenn-einrichtungen",
  "produits/extrusion-de-plaques/palettiseurs":
    "produkte/plattenextrusion/plattenstapler",
  "produits/extrusion-de-plaques/machines-speciales":
    "produkte/plattenextrusion/sondermaschinen",
  reussites: "success-stories",
  nouveautes: "aktuelles",
  calculateur: "produktrechner",
  "machines-doccasion": "gebrauchtmaschinen",
  telechargements: "downloads",
  equipe: "team",
  contactez: "kontakt",
  "offres-demploi": "stellenanzeigen",
  "mentions-legales": "impressum",
  "vos-informations-personelles": "datenschutz",
  sitemap: "sitemap",
  cookies: "cookies",
};

const NEWS_DETAIL_PATHS = new Set([
  "/aktuelles/news-detailansicht",
  "/en/news/news-detail",
  "/ru/news/news-detail",
  "/es/news/news-detail",
  "/fr/nouveautes/nouveautes-detail",
]);

const JOB_DETAIL_PATHS = new Set([
  "/stellenanzeigen/stellendetails",
  "/en/job-advertisements/job-details",
  "/ru/job-advertisements/job-details",
  "/es/job-advertisements/job-details",
  "/fr/offres-demploi/details-de-loffre",
  "/de/stellenanzeigen/stellendetails",
  "/en/stellenanzeigen/stellendetails",
  "/fr/stellenanzeigen/stellendetails",
  "/ru/stellenanzeigen/stellendetails",
  "/es/stellenanzeigen/stellendetails",
]);

function localeHome(locale: AppLocale): string {
  return `/${locale}`;
}

function withLocale(locale: AppLocale, germanPath: string): string {
  if (!germanPath) return localeHome(locale);
  return `/${locale}/${germanPath}`;
}

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const trimmed =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return trimmed.toLowerCase();
}

function firstParam(
  searchParams: URLSearchParams,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }
  return undefined;
}

function localeFromPath(pathname: string): AppLocale | undefined {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && (LOCALES as readonly string[]).includes(segment)) {
    return segment as AppLocale;
  }
  return undefined;
}

function addRedirect(
  map: Map<string, string>,
  from: string,
  to: string,
): void {
  const key = normalizePathname(from);
  const target = normalizePathname(to);
  if (key === target) return;
  map.set(key, target);
}

function addHtmlVariant(
  map: Map<string, string>,
  fromWithoutHtml: string,
  to: string,
): void {
  addRedirect(map, fromWithoutHtml, to);
  if (!fromWithoutHtml.endsWith(".html")) {
    addRedirect(map, `${fromWithoutHtml}.html`, to);
  }
}

function buildPathRedirectMap(): Map<string, string> {
  const map = new Map<string, string>();

  // Unprefixed DE hubs (+ .html) → /de/...
  for (const hub of DE_HUB_PATHS) {
    addHtmlVariant(map, `/${hub}`, `/de/${hub}`);
  }
  addHtmlVariant(map, "/index", "/de");
  addHtmlVariant(map, "/index.php", "/de");
  addHtmlVariant(map, "/produkte", "/de");

  // DE product subpages (canonical slugs) without locale
  for (const [category, products] of Object.entries(productCategories) as [
    ProductCategory,
    { slug: string }[],
  ][]) {
    for (const product of products) {
      const path = `produkte/${category}/${product.slug}`;
      addHtmlVariant(map, `/${path}`, `/de/${path}`);
    }
  }

  // Old DE typo slug (missing “r” in kalibrier)
  addHtmlVariant(
    map,
    "/produkte/rohrextrusion/kalibier-und-kuehlbaeder",
    "/de/produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
  );
  for (const locale of LOCALES) {
    addHtmlVariant(
      map,
      `/${locale}/produkte/rohrextrusion/kalibier-und-kuehlbaeder`,
      `/${locale}/produkte/rohrextrusion/kalibrier-und-kuehlbaeder`,
    );
  }

  // EN / RU / ES translated paths
  for (const locale of ["en", "ru", "es"] as const) {
    for (const [oldPath, germanPath] of Object.entries(EN_LIKE_PATH_MAP)) {
      addHtmlVariant(
        map,
        `/${locale}/${oldPath}`,
        withLocale(locale, germanPath),
      );
    }
    // RU contact was already German on the old site
    if (locale === "ru") {
      addHtmlVariant(map, "/ru/kontakt", "/ru/kontakt");
    }
  }

  // FR translated paths
  for (const [oldPath, germanPath] of Object.entries(FR_PATH_MAP)) {
    addHtmlVariant(map, `/fr/${oldPath}`, withLocale("fr", germanPath));
  }

  // Prefixed DE hubs that still use .html on bookmarks
  for (const hub of DE_HUB_PATHS) {
    addRedirect(map, `/de/${hub}.html`, `/de/${hub}`);
  }

  return map;
}

const PATH_REDIRECTS = buildPathRedirectMap();

/** Snapshot of static path → path redirects (no query handling). */
export function getLegacyPathRedirects(): ReadonlyMap<string, string> {
  return PATH_REDIRECTS;
}

export type StaticWebAppRedirectRoute = {
  route: string;
  redirect: string;
  statusCode: 301;
};

/** Azure SWA rejects `staticwebapp.config.json` larger than 20 KB. */
export const STATIC_WEB_APP_CONFIG_MAX_BYTES = 20 * 1024;

const STATIC_WEB_APP_GLOBAL_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

/**
 * Azure Static Web Apps config payload (headers only).
 * Legacy URL 301s are handled in `src/proxy.ts`, not here.
 */
export function getStaticWebAppConfig(): {
  routes: StaticWebAppRedirectRoute[];
  globalHeaders: typeof STATIC_WEB_APP_GLOBAL_HEADERS;
} {
  return {
    routes: [],
    globalHeaders: STATIC_WEB_APP_GLOBAL_HEADERS,
  };
}

/** Full path → path redirect list (for tests / docs; not written to SWA config). */
export function getStaticWebAppRedirectRoutes(): StaticWebAppRedirectRoute[] {
  return [...PATH_REDIRECTS.entries()]
    .map(([route, redirect]) => ({ route, redirect, statusCode: 301 as const }))
    .sort((a, b) => a.route.localeCompare(b.route));
}

/**
 * Resolve a legacy request to a canonical pathname (no origin, no search).
 * Returns null when the request should pass through unchanged.
 */
export function resolveLegacyRedirect(
  pathname: string,
  searchParams: URLSearchParams = new URLSearchParams(),
): string | null {
  const path = normalizePathname(pathname);

  if (NEWS_DETAIL_PATHS.has(path)) {
    const locale = localeFromPath(path) ?? "de";
    const newsId = firstParam(searchParams, [
      "tx_news_pi1[news]",
      "tx_news_pi1%5Bnews%5D",
    ]);
    const slug = getNewsSlugFromLegacyId(newsId);
    if (slug) return `/${locale}/aktuelles/${slug}`;
    return `/${locale}/aktuelles`;
  }

  if (JOB_DETAIL_PATHS.has(path)) {
    const locale = localeFromPath(path) ?? "de";
    const jobId = firstParam(searchParams, [
      "tx_tanjoboffers_jobdetail[job]",
      "tx_tanjoboffers_jobdetail%5Bjob%5D",
    ]);
    const slug = getJobSlugFromLegacyId(jobId);
    if (slug) return `/${locale}/stellenanzeigen/${slug}`;
    return `/${locale}/stellenanzeigen`;
  }

  return PATH_REDIRECTS.get(path) ?? null;
}
