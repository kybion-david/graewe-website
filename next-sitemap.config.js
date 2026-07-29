const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.graewe.com"
).replace(/\/$/, "");

const locales = ["de", "en", "fr", "ru", "es"];
const defaultLocale = "de";
const localePattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

function stripLocalePrefix(pathname) {
  const match = pathname.match(localePattern);
  if (!match) return pathname === "/" ? "" : pathname;
  const rest = pathname.slice(match[0].length);
  return rest || "";
}

function localizedPath(locale, pathWithoutLocale) {
  return `${siteUrl}/${locale}${pathWithoutLocale}`;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/api/*"],
  transform: async (config, path) => {
    const pathWithoutLocale = stripLocalePrefix(path);
    const alternateRefs = [
      ...locales.map((locale) => ({
        href: localizedPath(locale, pathWithoutLocale),
        hreflang: locale,
        hrefIsAbsolute: true,
      })),
      {
        href: localizedPath(defaultLocale, pathWithoutLocale),
        hreflang: "x-default",
        hrefIsAbsolute: true,
      },
    ];

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    };
  },
};
