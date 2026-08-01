/**
 * Umami web analytics configuration.
 *
 * Umami is cookieless — it stores nothing on the visitor's device — so it does not
 * trigger the consent requirement in TDDDG §25 and the site stays banner-free. If this
 * is ever swapped for a tool that writes cookies or localStorage, a consent gate has to
 * come with it, and `cookiesPage` / `privacyPage` copy has to change again.
 *
 * Both values come from the Umami dashboard (Settings → Websites → Tracking code).
 * `SRC` is configurable rather than hardcoded because the host differs per Cloud region
 * and per self-hosted install.
 */
export type UmamiConfig = {
  src: string;
  websiteId: string;
};

/**
 * Resolves the tracker config, or `null` when analytics should not load.
 *
 * Returning `null` unless *both* values are present is deliberate: a half-configured
 * beacon is worse than none — it ships a script to every visitor that can never report
 * anything, while the privacy policy claims analytics are running. Local dev and PR
 * preview builds leave both unset, so they never pollute production stats.
 *
 * The `process.env.NEXT_PUBLIC_*` reads must stay as literal, fully-written expressions:
 * Next substitutes them textually at build time, so any indirection (destructuring,
 * computed keys, a helper that takes the name as an argument) yields `undefined` in the
 * browser bundle.
 */
export function getUmamiConfig(): UmamiConfig | null {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC?.trim();
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();

  if (!src || !websiteId) return null;

  return { src, websiteId };
}
