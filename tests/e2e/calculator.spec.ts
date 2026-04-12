import { test, expect } from "@playwright/test";

test.describe("Produktrechner", () => {
  test("calculator page loads with tabs", async ({ page }) => {
    await page.goto("/de/produktrechner");
    await expect(page.locator("button:text('Wickelendposition')")).toBeVisible();
    await expect(page.locator("button:text('Wickellänge')")).toBeVisible();
  });

  test("can switch between calculator modes", async ({ page }) => {
    await page.goto("/de/produktrechner");
    await page.click("button:text('Wickellänge')");
    await expect(page.locator("text=Außendurchmesser OD")).toBeVisible();

    await page.click("button:text('Wickelendposition')");
    await expect(page.locator("text=Länge L")).toBeVisible();
  });

  test("winding position calculates results", async ({ page }) => {
    await page.goto("/de/produktrechner");

    await page.fill('input[type="number"]:nth-of-type(1)', "20");
    await page.locator('input[type="number"]').nth(1).fill("100");
    await page.locator('input[type="number"]').nth(2).fill("300");
    await page.locator('input[type="number"]').nth(3).fill("10");

    await page.click("button:text('Berechnen')");

    await expect(page.locator("text=Ungleiche Lagen")).toBeVisible();
    await expect(page.locator("text=Gleiche Lagen versetzt")).toBeVisible();
  });
});
