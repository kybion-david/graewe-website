import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads with header and footer", async ({ page }) => {
    await page.goto("/de");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("text=MENÜ")).toBeVisible();
  });

  test("can navigate to company pages", async ({ page }) => {
    await page.goto("/de/unternehmen/wer-ist-graewe");
    await expect(page.locator("h1")).toContainText("Graewe");
  });

  test("can navigate to product pages", async ({ page }) => {
    await page.goto("/de/produkte/rohrextrusion");
    await expect(page.locator("h1")).toContainText("Rohrextrusion");
  });

  test("can navigate to product detail pages", async ({ page }) => {
    await page.goto("/de/produkte/rohrextrusion/extruder");
    await expect(page.locator("h1")).toContainText("Extruder");
  });

  test("can navigate to contact page", async ({ page }) => {
    await page.goto("/de/kontakt");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
  });

  test("can navigate to calculator page", async ({ page }) => {
    await page.goto("/de/produktrechner");
    await expect(page.locator("h1")).toContainText("Produktrechner");
  });

  test("can navigate to success stories", async ({ page }) => {
    await page.goto("/de/success-stories");
    await expect(page.locator("h1")).toContainText("Success Stories");
  });

  test("can navigate to impressum", async ({ page }) => {
    await page.goto("/de/impressum");
    await expect(page.locator("h1")).toContainText("Impressum");
  });

  test("menu opens and shows navigation links", async ({ page }) => {
    await page.goto("/de");
    await page.click("text=MENÜ");
    await expect(page.getByRole("banner").getByText("Unternehmen")).toBeVisible();
    await expect(page.getByRole("banner").getByText("Produkte")).toBeVisible();
    await expect(page.getByRole("banner").getByText("Kontakt")).toBeVisible();
  });
});
