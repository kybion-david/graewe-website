import { test, expect } from "@playwright/test";

/**
 * ISSUE-032: email provider unset / misconfigured must never show success.
 * Live inbox verification (form → CONTACT_EMAIL_TO) is a pre-cutover checklist
 * item in infra/DNS_CUTOVER.md after GitHub/Azure secrets are set.
 */
test.describe("Contact form email gate", () => {
  test("shows error (not success) when API reports email_unavailable", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Email provider is not configured",
          code: "email_unavailable",
        }),
      });
    });

    await page.goto("/de/kontakt");

    await page.getByLabel(/Nachname/).fill("Muster");
    await page.getByLabel(/Vorname/).fill("Max");
    await page.getByLabel(/E-Mail/).fill("max.muster@example.com");
    await page.getByLabel(/Nachricht/).fill("E2E check — bitte ignorieren.");

    await page.getByRole("button", { name: /Absenden/ }).click();

    const form = page.locator("form");
    await expect(
      form.getByText(/Kontaktformular ist vorübergehend nicht verfügbar/),
    ).toBeVisible({ timeout: 10_000 });
    await expect(form.getByText(/erfolgreich gesendet/)).toHaveCount(0);
  });

  test("API returns 503 when RESEND_API_KEY is unset", async ({ request }) => {
    test.skip(
      Boolean(process.env.RESEND_API_KEY?.trim()),
      "RESEND_API_KEY is set in this environment",
    );

    const res = await request.post("/api/contact", {
      data: {
        name: "Muster",
        firstName: "Max",
        email: "max.muster@example.com",
        phone: "",
        message: "API gate check",
        website: "",
      },
    });

    expect(res.status()).toBe(503);
    const body = await res.json();
    expect(body.code).toBe("email_unavailable");
    expect(body.success).toBeUndefined();
  });
});
