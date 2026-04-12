import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <p className="text-accent font-medium mb-2">{t("title")}</p>
            <h1 className="text-3xl font-bold text-dark mb-2">{t("subtitle")}</h1>
            <h2 className="text-lg text-text-muted mb-8">{t("sendMessage")}</h2>
            <ContactForm />
          </div>

          {/* Address */}
          <div className="lg:pt-12">
            <div className="bg-grey-100 rounded-lg p-8">
              <h3 className="font-semibold text-dark mb-4">{t("address")}</h3>
              <div className="text-text-muted space-y-1 whitespace-pre-line">
                {t("addressLines")}
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <p>
                  <span className="text-text-muted">Tel.:</span>{" "}
                  <a href="tel:+4976317944-0" className="text-dark hover:text-accent transition-colors">
                    +49 (0) 7631 79 44-0
                  </a>
                </p>
                <p>
                  <span className="text-text-muted">Fax:</span>{" "}
                  <span>+49 (0) 7631 79 44-22</span>
                </p>
                <p>
                  <span className="text-text-muted">E-Mail:</span>{" "}
                  <a href="mailto:info@graewe.com" className="text-dark hover:text-accent transition-colors">
                    info@graewe.com
                  </a>
                </p>
                <p>
                  <span className="text-text-muted">Internet:</span>{" "}
                  <a href="https://www.graewe.com" className="text-dark hover:text-accent transition-colors">
                    www.graewe.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
