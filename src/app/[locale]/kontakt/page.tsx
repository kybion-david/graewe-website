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
    <div className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form side */}
          <div>
            <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">
              {t("title")}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
              {t("subtitle")}
            </h1>
            <div className="w-12 h-1 bg-accent mb-4" />
            <p className="text-text-muted mb-8">{t("sendMessage")}</p>
            <ContactForm />
          </div>

          {/* Address side */}
          <div className="lg:pt-12">
            <div className="bg-grey-100 rounded-xl p-8 shadow-sm">
              <h3 className="font-bold text-dark mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                {t("address")}
              </h3>
              <div className="text-text-muted space-y-1 whitespace-pre-line mb-6">
                {t("addressLines")}
              </div>
              <div className="space-y-3 text-sm border-t border-grey-200 pt-5">
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </span>
                  <a href="tel:+4976317944-0" className="text-dark hover:text-accent-dark transition-colors">
                    +49 (0) 7631 79 44-0
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-grey-200 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-grey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 7.131s0 0 0 0" />
                    </svg>
                  </span>
                  <span className="text-text-muted">+49 (0) 7631 79 44-22</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <a href="mailto:info@graewe.com" className="text-dark hover:text-accent-dark transition-colors">
                    info@graewe.com
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
