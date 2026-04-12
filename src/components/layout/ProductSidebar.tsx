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
    <aside className="w-full lg:w-64 shrink-0">
      <nav className="sticky top-4 space-y-5">
        {categories.map(({ key, navKey }) => {
          const isCategoryActive = pathname.includes(`/produkte/${key}`);
          return (
            <div key={key}>
              <Link
                href={`/produkte/${key}`}
                className={`font-bold text-sm block py-1 transition-colors flex items-center gap-1.5 ${
                  isCategoryActive ? "text-accent-dark" : "text-dark hover:text-accent-dark"
                }`}
              >
                <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {tNav(navKey)}
              </Link>
              {isCategoryActive && (
                <ul className="mt-1 ml-5 space-y-0.5 text-sm border-l border-grey-300 pl-3">
                  {productCategories[key].map((sub) => {
                    const isActive = pathname === `/produkte/${key}/${sub.slug}`;
                    return (
                      <li key={sub.slug}>
                        <Link
                          href={`/produkte/${key}/${sub.slug}`}
                          className={`block py-1 transition-colors ${
                            isActive
                              ? "text-dark font-medium"
                              : "text-text-muted hover:text-dark"
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
      </nav>
    </aside>
  );
}
