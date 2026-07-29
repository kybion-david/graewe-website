import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { JOB_SLUGS, type JobItem } from "@/lib/jobs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("title") };
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "jobs" });
  const items = (t.raw("items") as JobItem[]).filter((item) =>
    (JOB_SLUGS as readonly string[]).includes(item.slug),
  );
  const intro = t.raw("intro") as string[];
  const benefits = t.raw("benefits") as string[];
  const applyInstructions = t.raw("applyInstructions") as string[];

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
          {t("title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-10" />

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold text-dark">{t("introTitle")}</h2>
          {intro.map((paragraph, index) => (
            <p key={index} className="text-text leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark mb-4">{t("openingsHeading")}</h2>
          <p className="text-text leading-relaxed mb-4">{t("benefitsIntro")}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-text mb-6">
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          {items.length === 0 ? (
            <div className="rounded-xl border border-grey-200 bg-grey-100 p-8 text-center">
              <p className="text-text-muted">{t("noJobs")}</p>
            </div>
          ) : (
            <>
              <p className="font-medium text-dark mb-4">{t("lookingFor")}</p>
              <ul className="space-y-3 mb-8">
                {items.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/stellenanzeigen/${job.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-grey-200 bg-white px-5 py-4 shadow-sm hover:shadow-md hover:border-accent/40 transition-all"
                    >
                      <span className="font-semibold text-dark group-hover:text-accent-dark transition-colors">
                        {job.title}
                      </span>
                      <span className="shrink-0 text-sm font-medium text-text-muted group-hover:text-dark">
                        {t("viewDetails")} →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="mb-12 space-y-4">
          <p className="text-text leading-relaxed">{t("closing")}</p>
          <address className="not-italic rounded-xl bg-grey-100 p-6 text-dark leading-relaxed">
            <p className="font-bold">{t("contactCompany")}</p>
            <p>{t("contactName")}</p>
            <p className="text-text-muted">{t("contactRole")}</p>
            <p className="mt-2">
              <a
                href={`mailto:${t("contactEmail")}`}
                className="font-medium text-dark hover:text-accent-dark transition-colors"
              >
                {t("contactEmail")}
              </a>
            </p>
          </address>
        </section>

        <section>
          <h2 className="text-xl font-bold text-dark mb-3">{t("applyHeading")}</h2>
          <p className="text-text leading-relaxed mb-3">{t("applyIntro")}</p>
          {applyInstructions.map((instruction, index) => (
            <p key={index} className="text-text leading-relaxed mb-2">
              {instruction}
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
