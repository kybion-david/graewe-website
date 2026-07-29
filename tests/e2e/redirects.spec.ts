import { test, expect } from "@playwright/test";

test.describe("Legacy redirects", () => {
  test("unprefixed DE hub redirects to /de", async ({ page }) => {
    const response = await page.goto("/unternehmen/wer-ist-graewe", {
      waitUntil: "networkidle",
    });
    expect(response?.ok()).toBeTruthy();
    expect(page.url()).toContain("/de/unternehmen/wer-ist-graewe");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("old EN translated path redirects to German slug", async ({ page }) => {
    await page.goto("/en/company/who-is-graewe", { waitUntil: "networkidle" });
    expect(page.url()).toContain("/en/unternehmen/wer-ist-graewe");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("old FR calculator path redirects", async ({ page }) => {
    await page.goto("/fr/calculateur", { waitUntil: "networkidle" });
    expect(page.url()).toContain("/fr/produktrechner");
  });

  test("news query URL redirects to article slug", async ({ page }) => {
    await page.goto(
      "/aktuelles/news-detailansicht?tx_news_pi1[news]=40",
      { waitUntil: "networkidle" },
    );
    expect(page.url()).toContain("/de/aktuelles/jubilaeum");
  });

  test("product overview hubs redirect to locale produkte page", async ({
    page,
  }) => {
    await page.goto("/produkte", { waitUntil: "networkidle" });
    expect(page.url()).toMatch(/\/de\/produkte\/?$/);
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/en/products", { waitUntil: "networkidle" });
    expect(page.url()).toMatch(/\/en\/produkte\/?$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("typo calibration slug redirects to corrected path", async ({ page }) => {
    await page.goto("/produkte/rohrextrusion/kalibier-und-kuehlbaeder", {
      waitUntil: "networkidle",
    });
    expect(page.url()).toContain(
      "/de/produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
    );

    await page.goto("/en/produkte/rohrextrusion/kalibier-und-kuehlbaeder", {
      waitUntil: "networkidle",
    });
    expect(page.url()).toContain(
      "/en/produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
    );
  });
});
