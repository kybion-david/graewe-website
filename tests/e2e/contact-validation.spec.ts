import { test, expect } from "@playwright/test";

test.describe("Contact form validation a11y (ISSUE-039)", () => {
  test("shows text errors with aria-invalid, not colour alone", async ({ page }) => {
    await page.goto("/de/kontakt");

    await page.getByRole("button", { name: /Absenden/ }).click();

    const name = page.locator("#contact-name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", "contact-name-error");
    await expect(page.locator("#contact-name-error")).toHaveText(
      /Dieses Feld ist erforderlich/,
    );

    const email = page.locator("#contact-email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-email-error")).toBeVisible();

    await email.fill("not-valid");
    await page.getByRole("button", { name: /Absenden/ }).click();
    await expect(page.locator("#contact-email-error")).toHaveText(
      /gültige E-Mail-Adresse/,
    );
  });
});
