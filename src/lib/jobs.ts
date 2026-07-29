/**
 * Job openings — slugs and TYPO3 legacy ID mapping.
 * Localized titles/bodies live in `src/messages/{locale}.json` under `jobs.items`.
 */

export const JOB_SLUGS = [
  "elektriker-elektroniker",
  "sps-programmierer",
  "konstrukteur-elektronik",
] as const;

export type JobSlug = (typeof JOB_SLUGS)[number];

/** Old TYPO3 `tx_tanjoboffers_jobdetail[job]` IDs → new slugs */
export const JOB_LEGACY_IDS: Record<string, JobSlug> = {
  "9": "elektriker-elektroniker",
  "8": "sps-programmierer",
  "42": "konstrukteur-elektronik",
};

export type JobItem = {
  slug: JobSlug;
  title: string;
  summary: string;
  relatedTitles?: string[];
  tasks: string[];
  profile: string[];
  benefits: string[];
  applyNote: string;
  applyEmail: string;
};

export function isJobSlug(value: string): value is JobSlug {
  return (JOB_SLUGS as readonly string[]).includes(value);
}

export function getJobSlugFromLegacyId(jobId: string | undefined): JobSlug | undefined {
  if (!jobId) return undefined;
  return JOB_LEGACY_IDS[jobId];
}

export function findJobItem(items: JobItem[], slug: string): JobItem | undefined {
  return items.find((item) => item.slug === slug);
}
