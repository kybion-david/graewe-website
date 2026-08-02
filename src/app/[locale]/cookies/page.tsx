import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiesPage" });
  return pageMetadata(t("title"), t("intro"), locale, "/cookies");
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cookiesPage" });

  return (
    <div className="max-w-4xl mx-auto py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">{t("title")}</h1>
      <div className="w-16 h-1 bg-accent mb-10" />

      <div className="space-y-8 text-text leading-relaxed">
        <p>{t("intro")}</p>

        <section className="bg-grey-100 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {t("essentialTitle")}
          </h2>
          <p>{t("essentialBody")}</p>
        </section>

        <section className="bg-grey-100 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {t("analyticsTitle")}
          </h2>
          <p>{t("analyticsBody")}</p>
        </section>

        <p>
          {t("privacyLead")}{" "}
          <Link href="/datenschutz" className="text-dark font-semibold underline decoration-accent underline-offset-2 hover:text-accent transition-colors">
            {t("privacyLink")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
