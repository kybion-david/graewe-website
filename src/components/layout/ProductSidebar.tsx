"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  productCategories,
  type ProductCategory,
} from "@/lib/products";

export function ProductSidebar() {
  const t = useTranslations("products");
  const tNav = useTranslations("nav");
  const pathname = usePathname();

  const categories: { key: ProductCategory; navKey: string }[] = [
    { key: "rohrextrusion", navKey: "pipeExtrusion" },
    { key: "profilextrusion", navKey: "profileExtrusion" },
    { key: "plattenextrusion", navKey: "sheetExtrusion" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <nav className="sticky top-24 space-y-1">
        <div className="bg-grey-100 rounded-xl p-5">
          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4">
            {tNav("products")}
          </p>

          {categories.map(({ key, navKey }) => {
            const isCategoryActive = pathname.includes(`/produkte/${key}`);
            return (
              <div key={key} className="mb-3 last:mb-0">
                <Link
                  href={`/produkte/${key}`}
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isCategoryActive
                      ? "bg-accent text-dark"
                      : "text-dark hover:bg-grey-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                      isCategoryActive ? "bg-dark" : "bg-grey-300"
                    }`}
                  />
                  {tNav(navKey)}
                </Link>
                {isCategoryActive && (
                  <ul className="mt-1 ml-7 space-y-0.5">
                    {productCategories[key].map((sub) => {
                      const isActive = pathname === `/produkte/${key}/${sub.slug}`;
                      return (
                        <li key={sub.slug}>
                          <Link
                            href={`/produkte/${key}/${sub.slug}`}
                            className={`block py-1.5 px-3 text-sm rounded-md transition-all duration-200 ${
                              isActive
                                ? "text-dark font-medium bg-white shadow-sm"
                                : "text-text-muted hover:text-dark hover:bg-white/50"
                            }`}
                          >
                            {t(`subcategories.${sub.translationKey}`)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
