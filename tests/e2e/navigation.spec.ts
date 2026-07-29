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
    await page.goto("/de/produkte");
    await expect(page).toHaveURL(/\/de\/produkte\/?$/);
    await expect(page.locator("h1")).toBeVisible();

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

  test("contact form labels are localized (no DE English regression)", async ({
    page,
  }) => {
    await page.goto("/de/kontakt");
    const form = page.locator("form");
    await expect(form.getByLabel(/Nachname/)).toBeVisible();
    await expect(form.getByLabel(/Vorname/)).toBeVisible();
    await expect(form.getByLabel(/E-Mail/)).toBeVisible();
    await expect(form.getByLabel(/^Telefon$/)).toBeVisible();
    await expect(form.getByLabel(/Nachricht/)).toBeVisible();
    await expect(form.getByText("Pflichtfeld")).toBeVisible();
    await expect(form.getByText("First Name")).toHaveCount(0);
    await expect(form.getByText("Required field")).toHaveCount(0);

    await page.goto("/en/kontakt");
    const enForm = page.locator("form");
    await expect(enForm.getByLabel(/Last Name/)).toBeVisible();
    await expect(enForm.getByLabel(/First Name/)).toBeVisible();
    await expect(enForm.getByLabel(/^Phone$/)).toBeVisible();
    await expect(enForm.getByLabel(/^Message$/)).toBeVisible();
    await expect(enForm.getByText("Required field")).toBeVisible();
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

  test("impressum and privacy are localized for EN", async ({ page }) => {
    await page.goto("/en/impressum");
    await expect(page.locator("h1")).toContainText("Legal Notice");
    await expect(page.getByRole("heading", { name: "Address" })).toBeVisible();
    await page.goto("/en/datenschutz");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
    await expect(
      page.getByText("legally binding text", { exact: false }),
    ).toBeVisible();
  });

  test("can navigate to HTML sitemap", async ({ page }) => {
    await page.goto("/de/sitemap");
    await expect(page.locator("h1")).toContainText("Sitemap");
    await expect(page.getByRole("link", { name: "Rohrextrusion" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Extruder" }).first()).toBeVisible();
  });

  test("can navigate to cookies page", async ({ page }) => {
    await page.goto("/de/cookies");
    await expect(page.locator("h1")).toContainText("Cookies");
  });

  test("footer links to sitemap and cookies", async ({ page }) => {
    await page.goto("/de");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Sitemap" })).toHaveAttribute("href", "/de/sitemap");
    await expect(footer.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/de/cookies");
  });

  test("menu opens and shows navigation links", async ({ page }) => {
    await page.goto("/de");
    await page.click("text=MENÜ");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByText("Unternehmen")).toBeVisible();
    await expect(nav.getByText("Produkte")).toBeVisible();
    await expect(nav.getByText("Kontakt")).toBeVisible();
  });
});
