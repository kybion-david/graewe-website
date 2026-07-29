import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCategories } from "@/components/home/ProductCategories";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { truncateMetaDescription } from "@/lib/pageMetadata";
import { buildLocaleAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const description = truncateMetaDescription(t("description"));
  return {
    description,
    openGraph: { description },
    alternates: buildLocaleAlternates(locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroCarousel />
      <ProductCategories />
      <NewsTeaser />
    </>
  );
}
