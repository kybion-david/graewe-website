import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductSidebar } from "@/components/layout/ProductSidebar";
import { ProductDetailContent } from "@/components/products/ProductDetailContent";
import { productCategories } from "@/lib/products";
import { getProductImages } from "@/lib/productImages";
import { getProductDetail } from "@/lib/productContent";
import { locales } from "@/i18n/routing";

const CATEGORY = "profilextrusion" as const;

export function generateStaticParams() {
  const params: { locale: string; product: string }[] = [];
  for (const locale of locales) {
    for (const sub of productCategories[CATEGORY]) {
      params.push({ locale, product: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}): Promise<Metadata> {
  const { locale, product } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const sub = productCategories[CATEGORY].find((s) => s.slug === product);
  if (!sub) return { title: "Product" };
  return { title: t(`subcategories.${sub.translationKey}`) };
}

export default async function ProfileExtrusionProductPage({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}) {
  const { locale, product } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });

  const sub = productCategories[CATEGORY].find((s) => s.slug === product);
  if (!sub) notFound();

  const detail = getProductDetail(locale, CATEGORY, product);
  const images = getProductImages(CATEGORY, product);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductSidebar />
          <div className="flex-1">
            {detail ? (
              <ProductDetailContent
                detail={detail}
                images={images}
                contactLabel={t("contactPerson")}
              />
            ) : (
              <>
                <h1 className="text-3xl font-bold text-dark mb-6">
                  {t(`subcategories.${sub.translationKey}`)}
                </h1>
                <div className="bg-grey-100 rounded-lg p-8 text-center text-text-muted">
                  <p>Product details coming soon.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
