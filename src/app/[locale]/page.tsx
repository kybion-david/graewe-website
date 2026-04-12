import { setRequestLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCategories } from "@/components/home/ProductCategories";
import { NewsTeaser } from "@/components/home/NewsTeaser";

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
