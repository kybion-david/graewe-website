import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ProductSidebar } from "@/components/layout/ProductSidebar";
import {
  productCategories,
  categoryTranslationKeys,
  type ProductCategory,
} from "@/lib/products";

const categoryOrder: ProductCategory[] = [
  "rohrextrusion",
  "profilextrusion",
  "plattenextrusion",
];

const homeDescKeys: Record<ProductCategory, string> = {
  rohrextrusion: "pipeExtrusionDesc",
  profilextrusion: "profileExtrusionDesc",
  plattenextrusion: "sheetExtrusionDesc",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("overview.metaTitle"),
    description: t("overview.intro"),
  };
}

export default async function ProductsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  const detailsList = t.raw("overview.detailsList") as string[];

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
              {t("overview.title")}
            </h1>
            <div className="w-12 h-1 bg-accent mb-6" />
            {t("overview.subtitle") ? (
              <p className="text-lg font-medium text-dark mb-4">
                {t("overview.subtitle")}
              </p>
            ) : null}
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              {t("overview.intro")}
            </p>

            <div className="bg-grey-100 rounded-xl p-6 mb-10">
              <p className="font-semibold text-dark mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                {t("overview.detailsHeading")}
              </p>
              <ul className="space-y-2.5">
                {detailsList.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-text-muted"
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-text-muted mb-10">
              {t("overview.usedMachinesNote")}{" "}
              <Link
                href="/gebrauchtmaschinen"
                className="font-semibold text-dark underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-dark transition-colors"
              >
                {t("overview.usedMachinesLink")}
              </Link>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryOrder.map((category) => {
                const navKey = categoryTranslationKeys[category] as
                  | "pipeExtrusion"
                  | "profileExtrusion"
                  | "sheetExtrusion";
                const subCount = productCategories[category].length;

                return (
                  <Link
                    key={category}
                    href={`/produkte/${category}`}
                    className="group block rounded-xl border border-grey-200 bg-white p-6 hover:border-accent/40 hover:shadow-md transition-all duration-300"
                  >
                    <h2 className="text-lg font-bold text-dark mb-2 group-hover:text-accent-dark transition-colors">
                      {tNav(navKey)}
                    </h2>
                    <p className="text-sm text-text-muted leading-relaxed mb-4">
                      {tHome(homeDescKeys[category])}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-dark">
                      <span className="w-5 h-[2px] bg-accent" />
                      {t("overview.exploreCategory")}
                      <span className="text-grey-400 font-normal">
                        ({subCount})
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
