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
    await expect(
      page.getByLabel("Außendurchmesser OD [mm]")
    ).toBeVisible();

    await page.click("button:text('Wickelendposition')");
    await expect(page.getByLabel("Länge L [m]")).toBeVisible();
  });

  test("shows large labeled Wickelbild diagrams and live results", async ({
    page,
  }) => {
    await page.goto("/de/produktrechner");

    const unevenDiagram = page.getByAltText("Wickelbild ungleiche Lagen");
    const evenDiagram = page.getByAltText("Wickelbild gleiche Lagen versetzt");
    await expect(unevenDiagram).toBeVisible();
    await expect(evenDiagram).toBeVisible();

    // Diagrams must be large enough to read OD/ID/H/W labels (not tiny icons).
    const box = await unevenDiagram.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(180);

    await expect(page.getByText("N/V").first()).toBeVisible();

    await page.getByLabel("Rohrdurchmesser d [mm]").fill("20");
    await page.getByLabel("Länge L [m]").fill("100");
    await page.getByLabel("Innendurchmesser ID [mm]").fill("300");
    await page.getByLabel("Rohranzahl pro Lage [oE]").fill("10");

    await expect(page.getByText("Ungleiche Lagen")).toBeVisible();
    await expect(page.getByText("Gleiche Lagen versetzt")).toBeVisible();
  });

  test("shows validation errors for empty inputs", async ({ page }) => {
    await page.goto("/de/produktrechner");
    await page.getByLabel("Rohranzahl pro Lage [oE]").fill("");
    await page.click("button:text('Berechnen')");

    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(
      page.getByText("Dieses Feld ist erforderlich.").first()
    ).toBeVisible();
  });
});
