import { describe, expect, it } from "vitest";
import {
  JOB_SLUGS,
  findJobItem,
  getJobSlugFromLegacyId,
  isJobSlug,
  type JobItem,
} from "@/lib/jobs";

const sampleItems: JobItem[] = [
  {
    slug: "elektriker-elektroniker",
    title: "Elektriker",
    summary: "Summary",
    tasks: ["A"],
    profile: ["B"],
    benefits: ["C"],
    applyNote: "Apply",
    applyEmail: "jobs@graewe.com",
  },
];

describe("jobs", () => {
  it("exposes the three live openings", () => {
    expect(JOB_SLUGS).toEqual([
      "elektriker-elektroniker",
      "sps-programmierer",
      "konstrukteur-elektronik",
    ]);
  });

  it("maps TYPO3 job IDs to slugs", () => {
    expect(getJobSlugFromLegacyId("9")).toBe("elektriker-elektroniker");
    expect(getJobSlugFromLegacyId("8")).toBe("sps-programmierer");
    expect(getJobSlugFromLegacyId("42")).toBe("konstrukteur-elektronik");
    expect(getJobSlugFromLegacyId("99")).toBeUndefined();
    expect(getJobSlugFromLegacyId(undefined)).toBeUndefined();
  });

  it("validates slugs and finds items", () => {
    expect(isJobSlug("sps-programmierer")).toBe(true);
    expect(isJobSlug("unknown")).toBe(false);
    expect(findJobItem(sampleItems, "elektriker-elektroniker")?.title).toBe(
      "Elektriker",
    );
    expect(findJobItem(sampleItems, "missing")).toBeUndefined();
  });
});
