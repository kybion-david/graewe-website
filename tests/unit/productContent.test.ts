import { describe, expect, it } from "vitest";
import { getAllProductSlugs } from "@/lib/products";
import { getProductDetail } from "@/lib/productContent";

const LOCALES = ["de", "en", "fr", "ru", "es"] as const;

describe("getProductDetail", () => {
  it("returns native body content for all locales and product slugs", () => {
    for (const locale of LOCALES) {
      for (const { category, product } of getAllProductSlugs()) {
        const detail = getProductDetail(locale, category, product);
        expect(detail, `${locale}/${category}/${product}`).toBeDefined();
        expect(detail!.title.length).toBeGreaterThan(0);
        expect(detail!.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it("does not serve German body text under FR/RU/ES chrome", () => {
    const de = getProductDetail("de", "rohrextrusion", "extruder")!;
    for (const locale of ["fr", "ru", "es"] as const) {
      const detail = getProductDetail(locale, "rohrextrusion", "extruder")!;
      expect(detail.title).not.toBe(de.title);
      expect(detail.sections[0]?.content).not.toBe(de.sections[0]?.content);
    }
  });

  it("falls back to German for unknown locales", () => {
    const de = getProductDetail("de", "rohrextrusion", "extruder");
    const unknown = getProductDetail("xx", "rohrextrusion", "extruder");
    expect(unknown).toEqual(de);
  });
});
