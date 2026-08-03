import { test, expect } from "@playwright/test";

/** Representative routes from ISSUE-036 / ISSUE-047 acceptance. */
const ROUTES = [
  "/de",
  "/de/team",
  "/de/kontakt",
  "/de/downloads",
  "/de/aktuelles",
  "/de/produkte",
  "/de/sitemap",
  "/de/cookies",
  "/de/produkte/rohrextrusion/extruder",
  "/de/stellenanzeigen",
  "/de/produktrechner",
  "/en/kontakt",
  "/ru",
];

test.describe("Viewport overflow", () => {
  for (const route of ROUTES) {
    test(`${route} has no horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");

      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(
        scrollWidth,
        `${route}: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`,
      ).toBeLessThanOrEqual(innerWidth);
    });
  }
});
