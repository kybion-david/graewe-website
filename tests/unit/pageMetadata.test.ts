import { describe, expect, it } from "vitest";
import {
  pageMetadata,
  productMetaDescription,
  truncateMetaDescription,
} from "@/lib/pageMetadata";

describe("truncateMetaDescription", () => {
  it("returns short text unchanged", () => {
    expect(truncateMetaDescription("Short copy.")).toBe("Short copy.");
  });

  it("collapses whitespace and ellipsizes long text at a word boundary", () => {
    const long =
      "Graewe entwickelt innovative Extrudertechnik für die Kunststoffindustrie mit Maschinen für Rohre Profile und Platten weltweit.";
    const result = truncateMetaDescription(long, 80);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(80);
    expect(result).not.toMatch(/\s…$/);
  });
});

describe("pageMetadata", () => {
  it("sets title, description, openGraph, and locale alternates", () => {
    const meta = pageMetadata(
      "Team",
      "Ansprechpartner bei GRAEWE.",
      "en",
      "/team",
    );
    expect(meta.title).toBe("Team");
    expect(meta.description).toBe("Ansprechpartner bei GRAEWE.");
    expect(meta.openGraph).toMatchObject({
      title: "Team",
      description: "Ansprechpartner bei GRAEWE.",
    });
    expect(meta.alternates?.canonical).toBe("/en/team");
    expect(meta.alternates?.languages).toMatchObject({
      de: "/de/team",
      en: "/en/team",
      "x-default": "/de/team",
    });
  });
});

describe("productMetaDescription", () => {
  it("prefixes title so shared section bodies stay unique", () => {
    const body =
      "Fa. Graewe stellt selber keine Extruder und Extrusionswerkzeuge her.";
    const pipe = productMetaDescription({
      title: "Rohrextrusion Extruder",
      sections: [{ content: body }],
    });
    const profile = productMetaDescription({
      title: "Profilextrusion Extruder",
      sections: [{ content: body }],
    });
    expect(pipe).toContain("Rohrextrusion Extruder");
    expect(profile).toContain("Profilextrusion Extruder");
    expect(pipe).not.toBe(profile);
  });
});
