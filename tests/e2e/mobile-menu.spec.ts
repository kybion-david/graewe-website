import { test, expect } from "@playwright/test";

test.describe("Mobile drawer menu", () => {
  test("open → tap link navigates and closes; same-page link closes", async ({
    page,
  }) => {
    await page.goto("/de");

    const menuButton = page.getByRole("button", { name: "Navigationsmenü" });
    await menuButton.click();

    const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Kontakt" }).click();
    await expect(page).toHaveURL(/\/de\/kontakt\/?$/);
    await expect(drawer).toBeHidden();

    await menuButton.click();
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Kontakt" }).click();
    await expect(page).toHaveURL(/\/de\/kontakt\/?$/);
    await expect(drawer).toBeHidden();
  });
});
