import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JOB_SLUGS, type JobItem } from "@/lib/jobs";
import { pageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  const intro = t.raw("intro") as string[];
  return pageMetadata(t("title"), intro[1] ?? t("introTitle"), locale, "/stellenanzeigen");
}

/** Shop-floor photography, paired with the alt strings under `jobs.imageAlt`. */
const GALLERY = [
  { src: "/images/jobs/machine-assembly.jpg", altKey: "machineAssembly" },
  { src: "/images/jobs/precision-filing.jpg", altKey: "precisionFiling" },
  { src: "/images/jobs/control-cabinet-wiring.jpg", altKey: "controlCabinetWiring" },
  { src: "/images/jobs/electrical-panel.jpg", altKey: "electricalPanel" },
] as const;

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
    <div>
      {/* Hero banner — the photo is decorative, the h1 below carries the meaning */}
      <div className="relative">
        <Image
          src="/images/jobs/welding.jpg"
          alt=""
          width={1200}
          height={800}
          priority
          className="w-full h-[300px] md:h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/45 to-dark/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-accent inline-flex items-center gap-2 px-4 py-2 mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-bold text-dark text-sm">{t("title")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {t("introTitle")}
            </h1>
            <div className="w-16 h-1 bg-accent mt-4" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Intro — copy alongside a shop-floor photo */}
        <section className="flex flex-col md:flex-row gap-8 lg:gap-10 mb-14">
          <div className="md:w-3/5 space-y-4 text-text leading-relaxed text-[17px]">
            {intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="md:w-2/5">
            {/* Portrait crop on desktop so the photo column tracks the height of the copy */}
            <div className="relative aspect-[4/3] md:aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-grey-100">
              <Image
                src="/images/jobs/cnc-control.jpg"
                alt={t("imageAlt.cncControl")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {t("benefitsHeading")}
          </h2>
          <div className="w-12 h-1 bg-accent mb-5" />
          <p className="text-text leading-relaxed text-[17px] mb-7">{t("benefitsIntro")}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-xl border border-grey-200 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
                  <svg
                    className="h-3.5 w-3.5 text-dark"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-text font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Photo band — full-bleed so the imagery breaks up the text column */}
      <section className="bg-grey-100 py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map(({ src, altKey }) => (
              <div
                key={src}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-200"
              >
                <Image
                  src={src}
                  alt={t(`imageAlt.${altKey}`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Open positions */}
        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {t("openingsHeading")}
          </h2>
          <div className="w-12 h-1 bg-accent mb-5" />

          {items.length === 0 ? (
            <div className="rounded-xl border border-grey-200 bg-grey-100 p-8 text-center">
              <p className="text-text-muted">{t("noJobs")}</p>
            </div>
          ) : (
            <>
              <p className="text-text leading-relaxed text-[17px] mb-6">{t("lookingFor")}</p>
              <ul className="space-y-4">
                {items.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/stellenanzeigen/${job.slug}`}
                      className="group block rounded-xl border border-grey-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-accent transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-dark group-hover:text-accent-dark transition-colors">
                          {job.title}
                        </h3>
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-100 text-dark transition-colors group-hover:bg-accent">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </div>
                      <p className="mt-2 text-text leading-relaxed">{job.summary}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-text-muted group-hover:text-dark transition-colors">
                        {t("viewDetails")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Contact + how to apply */}
        <section className="rounded-2xl border border-grey-200 bg-grey-100 p-6 sm:p-8">
          <p className="text-text leading-relaxed text-[17px] mb-8">{t("closing")}</p>

          <div className="grid gap-8 md:grid-cols-2">
            <address className="not-italic text-dark leading-relaxed">
              <p className="font-bold">{t("contactCompany")}</p>
              <p>{t("contactName")}</p>
              <p className="text-text-muted">{t("contactRole")}</p>
              <a
                href={`mailto:${t("contactEmail")}`}
                className="mt-4 inline-flex items-center gap-2 bg-accent text-dark font-bold px-5 py-3 hover:bg-accent-dark transition-colors shadow-sm hover:shadow-md break-all"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t("contactEmail")}
              </a>
            </address>

            <div>
              <h2 className="text-xl font-bold text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                {t("applyHeading")}
              </h2>
              <p className="text-text leading-relaxed mb-2">{t("applyIntro")}</p>
              {applyInstructions.map((instruction, index) => (
                <p key={index} className="text-text leading-relaxed mb-2">
                  {instruction}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
