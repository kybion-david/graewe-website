import { test, expect } from "@playwright/test";

test.describe("Language Switching", () => {
  test("root redirects to a locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(de|en|fr|ru|es)$/);
  });

  test("German page has correct lang attribute", async ({ page }) => {
    await page.goto("/de");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });

  test("English page has correct lang attribute", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("language dropdown button is visible", async ({ page }) => {
    await page.goto("/de");
    await expect(page.locator("header")).toContainText("DE");
    await expect(page.locator("text=MENÜ")).toBeVisible();
  });

  test("can navigate directly to English page", async ({ page }) => {
    await page.goto("/en/kontakt");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toBeVisible();
  });
});
