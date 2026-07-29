import { afterEach, describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import {
  getContactEmailAddresses,
  isResendConfigured,
  sendContactEmail,
} from "@/lib/contactEmail";

afterEach(() => {
  sendMock.mockReset();
});

describe("contactEmail (ISSUE-032)", () => {
  it("detects missing Resend API key", () => {
    expect(isResendConfigured(undefined)).toBe(false);
    expect(isResendConfigured("")).toBe(false);
    expect(isResendConfigured("   ")).toBe(false);
    expect(isResendConfigured("re_test")).toBe(true);
  });

  it("refuses to claim success when Resend is unset", async () => {
    const result = await sendContactEmail(
      {
        to: "info@graewe.com",
        from: "website@graewe.com",
        replyTo: "visitor@example.com",
        subject: "Test",
        html: "<p>Hi</p>",
      },
      undefined,
    );

    expect(result).toEqual({
      ok: false,
      code: "email_unavailable",
      message: "Email provider is not configured",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends via Resend when configured", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });

    const result = await sendContactEmail(
      {
        to: "info@graewe.com",
        from: "website@graewe.com",
        replyTo: "visitor@example.com",
        subject: "Kontaktanfrage von Jane Doe",
        html: "<p>Hello</p>",
      },
      "re_test_key",
    );

    expect(result).toEqual({ ok: true, id: "email_123" });
    expect(sendMock).toHaveBeenCalledWith({
      from: "website@graewe.com",
      to: "info@graewe.com",
      replyTo: "visitor@example.com",
      subject: "Kontaktanfrage von Jane Doe",
      html: "<p>Hello</p>",
    });
  });

  it("returns email_send_failed when Resend reports an error", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Domain not verified", name: "validation_error" },
    });

    const result = await sendContactEmail(
      {
        to: "info@graewe.com",
        from: "website@graewe.com",
        replyTo: "visitor@example.com",
        subject: "Test",
        html: "<p>Hi</p>",
      },
      "re_test_key",
    );

    expect(result).toEqual({
      ok: false,
      code: "email_send_failed",
      message: "Domain not verified",
    });
  });

  it("reads contact addresses from env with defaults", () => {
    expect(getContactEmailAddresses({})).toEqual({
      to: "info@graewe.com",
      from: "website@graewe.com",
    });
    expect(
      getContactEmailAddresses({
        CONTACT_EMAIL_TO: "sales@graewe.com",
        CONTACT_EMAIL_FROM: "noreply@graewe.com",
      }),
    ).toEqual({
      to: "sales@graewe.com",
      from: "noreply@graewe.com",
    });
  });
});
