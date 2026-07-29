import { setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { getJobSlugFromLegacyId } from "@/lib/jobs";

/**
 * Legacy TYPO3 job detail URLs:
 * /stellenanzeigen/stellendetails?tx_tanjoboffers_jobdetail[job]=9&...
 */
export default async function LegacyJobDetailRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const raw =
    query["tx_tanjoboffers_jobdetail[job]"] ??
    query["tx_tanjoboffers_jobdetail%5Bjob%5D"];
  const jobId = Array.isArray(raw) ? raw[0] : raw;
  const slug = getJobSlugFromLegacyId(jobId);

  if (slug) {
    permanentRedirect({ href: `/stellenanzeigen/${slug}`, locale });
  }

  permanentRedirect({ href: "/stellenanzeigen", locale });
}
