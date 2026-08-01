import Script from "next/script";
import { getUmamiConfig } from "@/lib/analytics";

/**
 * Loads the Umami tracker, or nothing at all when it is not configured.
 *
 * `data-do-not-track` makes Umami honour the browser's Do Not Track setting. It is not
 * legally required here — the tracker is cookieless and therefore outside TDDDG §25 —
 * but respecting an explicit opt-out signal costs nothing and matches the site's
 * no-banner, no-profiling stance.
 *
 * `afterInteractive` keeps the tracker off the critical path; measurement is never worth
 * delaying the LCP for.
 */
export function Analytics() {
  const config = getUmamiConfig();

  if (!config) return null;

  return (
    <Script
      src={config.src}
      strategy="afterInteractive"
      data-website-id={config.websiteId}
      data-do-not-track="true"
    />
  );
}
