import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return { title: t("title") };
}

const departments = [
  {
    key: "service" as const,
    phone: "+49 (7631)794440",
    telHref: "tel:+497631794440",
    email: "info@graewe.com",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.58-3.43a1 1 0 01-.42-.83V5.58a2 2 0 012-2h10a2 2 0 012 2v5.33a1 1 0 01-.42.83l-5.58 3.43a2 2 0 01-2 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3" />
      </svg>
    ),
  },
  {
    key: "spareParts" as const,
    phone: "+49 (7631)794463",
    telHref: "tel:+497631794463",
    email: "service@graewe.com",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    key: "usedMachines" as const,
    phone: "+49 (7631)794430",
    telHref: "tel:+497631794430",
    email: "info@next-machines.com",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
  {
    key: "jobs" as const,
    phone: "+49 (7631)794415",
    telHref: "tel:+497631794415",
    email: "jobs@graewe.com",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
          {t("title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-10" />

        {/* Address */}
        <section className="mb-12 bg-grey-100 rounded-xl p-6 inline-block">
          <h2 className="text-sm font-bold text-grey-400 uppercase tracking-widest mb-3">
            {t("address")}
          </h2>
          <address className="not-italic text-dark leading-relaxed font-medium">
            GRAEWE GmbH Maschinenbau
            <br />
            Max-Planck-Straße 1+2
            <br />
            D-79395 Neuenburg
          </address>
        </section>

        {/* Department cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.key}
              className="group rounded-xl border border-grey-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent-dark shrink-0 group-hover:bg-accent/20 transition-colors">
                  {dept.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark mb-3">
                    {t(dept.key)}
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-grey-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <dt className="sr-only">Telefon</dt>
                      <dd>
                        <a href={dept.telHref} className="text-dark hover:text-accent-dark transition-colors">
                          {dept.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-grey-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <dt className="sr-only">E-Mail</dt>
                      <dd>
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-dark font-medium hover:text-accent-dark transition-colors"
                        >
                          {dept.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
