import { describe, expect, it } from "vitest";
import { getNewsSlugFromLegacyId } from "@/lib/news";
import {
  resolveLegacyRedirect,
  getLegacyPathRedirects,
} from "@/lib/legacyRedirects";

describe("legacyRedirects", () => {
  it("maps TYPO3 news IDs to article slugs", () => {
    expect(getNewsSlugFromLegacyId("22")).toBe(
      "kalibriertische-profilextrusion",
    );
    expect(getNewsSlugFromLegacyId("40")).toBe("jubilaeum");
    expect(getNewsSlugFromLegacyId("99")).toBeUndefined();
  });

  it("redirects unprefixed DE hubs and .html variants to /de", () => {
    expect(resolveLegacyRedirect("/unternehmen/wer-ist-graewe")).toBe(
      "/de/unternehmen/wer-ist-graewe",
    );
    expect(resolveLegacyRedirect("/kontakt.html")).toBe("/de/kontakt");
    expect(resolveLegacyRedirect("/index.php")).toBe("/de");
  });

  it("redirects the old DE calibration typo slug for all locales", () => {
    expect(
      resolveLegacyRedirect("/produkte/rohrextrusion/kalibier-und-kuehlbaeder"),
    ).toBe("/de/produkte/rohrextrusion/kalibrier-und-kuehlbaeder");
    expect(
      resolveLegacyRedirect(
        "/produkte/rohrextrusion/kalibier-und-kuehlbaeder.html",
      ),
    ).toBe("/de/produkte/rohrextrusion/kalibrier-und-kuehlbaeder");

    for (const locale of ["de", "en", "fr", "ru", "es"] as const) {
      expect(
        resolveLegacyRedirect(
          `/${locale}/produkte/rohrextrusion/kalibier-und-kuehlbaeder`,
        ),
      ).toBe(`/${locale}/produkte/rohrextrusion/kalibrier-und-kuehlbaeder`);
      expect(
        resolveLegacyRedirect(
          `/${locale}/produkte/rohrextrusion/kalibier-und-kuehlbaeder.html`,
        ),
      ).toBe(`/${locale}/produkte/rohrextrusion/kalibrier-und-kuehlbaeder`);
    }
  });

  it("redirects product overview hubs to the new overview page", () => {
    expect(resolveLegacyRedirect("/produkte")).toBe("/de/produkte");
    expect(resolveLegacyRedirect("/produkte.html")).toBe("/de/produkte");
    expect(resolveLegacyRedirect("/en/products")).toBe("/en/produkte");
    expect(resolveLegacyRedirect("/fr/produits")).toBe("/fr/produkte");
    expect(resolveLegacyRedirect("/ru/products")).toBe("/ru/produkte");
    expect(resolveLegacyRedirect("/es/products")).toBe("/es/produkte");
  });

  it("redirects old EN/FR translated paths to German slugs", () => {
    expect(resolveLegacyRedirect("/en/company/who-is-graewe")).toBe(
      "/en/unternehmen/wer-ist-graewe",
    );
    expect(
      resolveLegacyRedirect(
        "/en/products/pipe-extrusion/fully-automatic-coilers",
      ),
    ).toBe("/en/produkte/rohrextrusion/vollautomatische-wickler");
    expect(resolveLegacyRedirect("/fr/entreprise/qui-est-graewe")).toBe(
      "/fr/unternehmen/wer-ist-graewe",
    );
    expect(resolveLegacyRedirect("/fr/calculateur")).toBe("/fr/produktrechner");
    expect(resolveLegacyRedirect("/ru/job-advertisements")).toBe(
      "/ru/stellenanzeigen",
    );
    expect(resolveLegacyRedirect("/es/data-privacy")).toBe("/es/datenschutz");
    expect(resolveLegacyRedirect("/en/imprint")).toBe("/en/impressum");
    expect(resolveLegacyRedirect("/en/data-privacy")).toBe("/en/datenschutz");
    expect(resolveLegacyRedirect("/fr/mentions-legales")).toBe("/fr/impressum");
    expect(resolveLegacyRedirect("/fr/vos-informations-personelles")).toBe(
      "/fr/datenschutz",
    );
  });

  it("resolves news detail query URLs in one hop", () => {
    const params = new URLSearchParams({
      "tx_news_pi1[news]": "22",
    });
    expect(
      resolveLegacyRedirect("/aktuelles/news-detailansicht", params),
    ).toBe("/de/aktuelles/kalibriertische-profilextrusion");
    expect(resolveLegacyRedirect("/en/news/news-detail", params)).toBe(
      "/en/aktuelles/kalibriertische-profilextrusion",
    );
    expect(
      resolveLegacyRedirect("/fr/nouveautes/nouveautes-detail", params),
    ).toBe("/fr/aktuelles/kalibriertische-profilextrusion");
  });

  it("resolves job detail query URLs on old localized paths", () => {
    const params = new URLSearchParams({
      "tx_tanjoboffers_jobdetail[job]": "9",
    });
    expect(
      resolveLegacyRedirect("/en/job-advertisements/job-details", params),
    ).toBe("/en/stellenanzeigen/elektriker-elektroniker");
    expect(
      resolveLegacyRedirect("/stellenanzeigen/stellendetails", params),
    ).toBe("/de/stellenanzeigen/elektriker-elektroniker");
  });

  it("falls back to listing pages when IDs are unknown", () => {
    expect(
      resolveLegacyRedirect(
        "/aktuelles/news-detailansicht",
        new URLSearchParams({ "tx_news_pi1[news]": "999" }),
      ),
    ).toBe("/de/aktuelles");
    expect(
      resolveLegacyRedirect(
        "/en/job-advertisements/job-details",
        new URLSearchParams({ "tx_tanjoboffers_jobdetail[job]": "999" }),
      ),
    ).toBe("/en/stellenanzeigen");
  });

  it("leaves canonical rebuild paths alone", () => {
    expect(resolveLegacyRedirect("/de/unternehmen/wer-ist-graewe")).toBeNull();
    expect(resolveLegacyRedirect("/en/produkte/rohrextrusion")).toBeNull();
    expect(resolveLegacyRedirect("/de/produkte")).toBeNull();
    expect(resolveLegacyRedirect("/en/produkte")).toBeNull();
  });

  it("exposes a large static path matrix for SWA", () => {
    expect(getLegacyPathRedirects().size).toBeGreaterThan(100);
  });
});
