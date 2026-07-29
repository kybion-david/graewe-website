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
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return pageMetadata(t("title"), t("intro1"));
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  const bindingNote = t("bindingNote");

  return (
    <div className="max-w-4xl mx-auto py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
        {t("title")}
      </h1>
      <div className="w-16 h-1 bg-accent mb-10" />
      <div className="space-y-8 text-text leading-relaxed">
        {bindingNote ? (
          <p className="text-text-muted text-sm">{bindingNote}</p>
        ) : null}

        <p>{t("intro1")}</p>
        <p>{t("intro2")}</p>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("collectionTitle")}
          </h2>
          <p>{t("collectionP1")}</p>
          <p className="mt-3">{t("collectionP2")}</p>
          <p className="mt-3">{t("collectionP3")}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("usageTitle")}
          </h2>
          <p>{t("usageP1")}</p>
          <p className="mt-3">{t("usageP2")}</p>
          <p className="mt-3">{t("usageP3")}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("cookiesTitle")}
          </h2>
          <p>
            {t("cookiesLead")}{" "}
            <Link
              href="/cookies"
              className="font-semibold underline decoration-accent underline-offset-2 hover:text-accent transition-colors"
            >
              {t("cookiesLink")}
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("linksTitle")}
          </h2>
          <p>{t("linksBody")}</p>
          <p className="mt-3">{t("linksMapBody")}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("newsletterTitle")}
          </h2>
          <p>{t("newsletterBody")}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("infoRightsTitle")}
          </h2>
          <p>{t("infoRightsBody")}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            {t("securityTitle")}
          </h2>
          <p>{t("securityBody")}</p>
        </section>
      </div>
    </div>
  );
}
