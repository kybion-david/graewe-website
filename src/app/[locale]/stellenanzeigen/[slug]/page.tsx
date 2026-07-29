import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { JOB_SLUGS, findJobItem, isJobSlug, type JobItem } from "@/lib/jobs";
import { pageMetadata } from "@/lib/pageMetadata";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    JOB_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  const items = t.raw("items") as JobItem[];
  const item = findJobItem(items, slug);
  const intro = t.raw("intro") as string[];
  return pageMetadata(
    item?.title ?? t("title"),
    item?.summary ?? intro[1] ?? t("title"),
  );
}

function JobList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-dark mb-3">{heading}</h2>
      <ul className="list-disc pl-5 space-y-1.5 text-text">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isJobSlug(slug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "jobs" });
  const items = t.raw("items") as JobItem[];
  const job = findJobItem(items, slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/stellenanzeigen"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-dark transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToList")}
        </Link>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">{job.title}</h1>
          <div className="w-12 h-1 bg-accent mb-8" />

          <p className="text-text text-[17px] leading-relaxed mb-8">{job.summary}</p>

          <JobList heading={t("relatedTitlesHeading")} items={job.relatedTitles ?? []} />
          <JobList heading={t("tasksHeading")} items={job.tasks} />
          <JobList heading={t("profileHeading")} items={job.profile} />
          <JobList heading={t("benefitsHeading")} items={job.benefits} />

          <section className="rounded-xl border border-grey-200 bg-grey-100 p-6 sm:p-8">
            <p className="text-text leading-relaxed mb-5">{job.applyNote}</p>
            <a
              href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(job.title)}`}
              className="inline-flex items-center gap-2 bg-accent text-dark font-bold px-6 py-3 hover:bg-accent-dark transition-colors shadow-sm hover:shadow-md"
            >
              {t("applyCta")}
            </a>
            <p className="mt-3 text-sm text-text-muted">
              <a
                href={`mailto:${job.applyEmail}`}
                className="hover:text-dark transition-colors"
              >
                {job.applyEmail}
              </a>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
