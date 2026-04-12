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
  },
  {
    key: "spareParts" as const,
    phone: "+49 (7631)794463",
    telHref: "tel:+497631794463",
    email: "service@graewe.com",
  },
  {
    key: "usedMachines" as const,
    phone: "+49 (7631)794430",
    telHref: "tel:+497631794430",
    email: "info@next-machines.com",
  },
  {
    key: "jobs" as const,
    phone: "+49 (7631)794415",
    telHref: "tel:+497631794415",
    email: "jobs@graewe.com",
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
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-10">
        {t("title")}
      </h1>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-dark mb-3">
          {t("address")}
        </h2>
        <address className="not-italic text-text leading-relaxed">
          GRAEWE GmbH Maschinenbau
          <br />
          Max-Planck-Straße 1+2
          <br />
          D-79395 Neuenburg
        </address>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.key}
            className="rounded-lg border border-grey-300 bg-grey-100 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-accent mb-4">
              {t(dept.key)}
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="sr-only">Telefon</dt>
                <dd>
                  <a href={dept.telHref} className="text-text hover:text-dark">
                    {dept.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">E-Mail</dt>
                <dd>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-dark underline underline-offset-2 hover:text-accent"
                  >
                    {dept.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
