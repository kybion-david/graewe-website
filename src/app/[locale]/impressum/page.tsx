import type { ReactNode } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprintPage" });
  return pageMetadata(t("title"), t("metaDescription"), locale, "/impressum");
}

function Section({
  title,
  children,
  muted,
}: {
  title: string;
  children: ReactNode;
  muted?: boolean;
}) {
  if (muted) {
    return (
      <section className="bg-grey-100 rounded-xl p-6">
        <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded-full" />
          {title}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-dark mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "imprintPage" });
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

        <Section title={t("addressTitle")} muted>
          <p className="whitespace-pre-line">{t("addressBody")}</p>
          <p className="mt-3 whitespace-pre-line">{t("contactBody")}</p>
        </Section>

        <Section title={t("managementTitle")} muted>
          <p className="whitespace-pre-line">{t("managementBody")}</p>
          <p className="mt-3 whitespace-pre-line">{t("registryBody")}</p>
        </Section>

        <Section title={t("copyrightTitle")}>
          <p>{t("copyrightBody")}</p>
        </Section>

        <Section title={t("privacyTitle")}>
          <p>{t("privacyBody")}</p>
        </Section>

        <Section title={t("securityTitle")}>
          <p>{t("securityBody")}</p>
        </Section>

        <Section title={t("techTitle")}>
          <p>{t("techBody")}</p>
        </Section>

        <Section title={t("logsTitle")}>
          <p>{t("logsBody")}</p>
        </Section>

        <Section title={t("cookiesTitle")}>
          <p>{t("cookiesBody")}</p>
        </Section>

        <Section title={t("disclaimerTitle")}>
          <p>{t("disclaimerBody")}</p>
        </Section>
      </div>
    </div>
  );
}
