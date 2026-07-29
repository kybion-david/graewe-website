import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  productCategories,
  categoryTranslationKeys,
  type ProductCategory,
} from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sitemapPage" });
  return { title: t("title") };
}

const companyLinks = [
  { href: "/unternehmen/wer-ist-graewe", key: "whoIsGraewe" as const },
  { href: "/unternehmen/was-macht-graewe", key: "whatDoesGraewe" as const },
  { href: "/unternehmen/wofuer-steht-graewe", key: "whatDoesGraeweStandFor" as const },
  { href: "/unternehmen/die-graewe-gruppe", key: "graeweGroup" as const },
];

const otherLinks = [
  { href: "/success-stories", key: "successStories" as const },
  { href: "/aktuelles", key: "news" as const },
  { href: "/produktrechner", key: "calculator" as const },
  { href: "/gebrauchtmaschinen", key: "usedMachines" as const },
  { href: "/downloads", key: "downloads" as const },
  { href: "/team", key: "team" as const },
  { href: "/kontakt", key: "contact" as const },
  { href: "/stellenanzeigen", key: "jobs" as const },
];

const legalLinks = [
  { href: "/impressum", key: "imprint" as const },
  { href: "/datenschutz", key: "privacy" as const },
  { href: "/cookies", key: "cookies" as const },
];

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sitemapPage" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tProducts = await getTranslations({ locale, namespace: "products" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  const categories = Object.keys(productCategories) as ProductCategory[];

  return (
    <div className="max-w-4xl mx-auto py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">{t("title")}</h1>
      <div className="w-16 h-1 bg-accent mb-4" />
      <p className="text-text-muted mb-10">{t("intro")}</p>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {tNav("home")}
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-text hover:text-accent transition-colors">
                {tNav("home")}
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {tNav("company")}
          </h2>
          <ul className="space-y-2 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-text hover:text-accent transition-colors">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {tNav("products")}
          </h2>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <Link
                  href={`/produkte/${category}`}
                  className="font-semibold text-dark hover:text-accent transition-colors"
                >
                  {tNav(
                    categoryTranslationKeys[category] as
                      | "pipeExtrusion"
                      | "profileExtrusion"
                      | "sheetExtrusion"
                  )}
                </Link>
                <ul className="mt-2 ml-4 space-y-1.5 text-sm border-l border-grey-200 pl-4">
                  {productCategories[category].map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/produkte/${category}/${sub.slug}`}
                        className="text-text hover:text-accent transition-colors"
                      >
                        {tProducts(`subcategories.${sub.translationKey}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {t("other")}
          </h2>
          <ul className="space-y-2 text-sm columns-1 sm:columns-2 gap-8">
            {otherLinks.map((link) => (
              <li key={link.href} className="break-inside-avoid">
                <Link href={link.href} className="text-text hover:text-accent transition-colors">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {t("legal")}
          </h2>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-text hover:text-accent transition-colors">
                  {tLegal(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
