import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_HONEYPOT_FIELD,
  consumeRateLimit,
  getClientIp,
  isHoneypotFilled,
  resetRateLimitState,
  verifyTurnstileToken,
} from "@/lib/contactSpam";

afterEach(() => {
  resetRateLimitState();
});

describe("contactSpam", () => {
  it("detects a filled honeypot", () => {
    expect(CONTACT_HONEYPOT_FIELD).toBe("website");
    expect(isHoneypotFilled("")).toBe(false);
    expect(isHoneypotFilled("   ")).toBe(false);
    expect(isHoneypotFilled(undefined)).toBe(false);
    expect(isHoneypotFilled("http://spam.example")).toBe(true);
  });

  it("extracts client IP from forwarded headers", () => {
    expect(
      getClientIp(
        new Request("http://localhost/api/contact", {
          headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
        }),
      ),
    ).toBe("203.0.113.10");

    expect(
      getClientIp(
        new Request("http://localhost/api/contact", {
          headers: { "x-real-ip": "198.51.100.7" },
        }),
      ),
    ).toBe("198.51.100.7");

    expect(getClientIp(new Request("http://localhost/api/contact"))).toBe("unknown");
  });

  it("rate-limits after the max attempts in a window", () => {
    const now = 1_000_000;
    expect(consumeRateLimit("ip-1", now, 60_000, 3)).toBe(true);
    expect(consumeRateLimit("ip-1", now + 1, 60_000, 3)).toBe(true);
    expect(consumeRateLimit("ip-1", now + 2, 60_000, 3)).toBe(true);
    expect(consumeRateLimit("ip-1", now + 3, 60_000, 3)).toBe(false);
    // New window resets the bucket
    expect(consumeRateLimit("ip-1", now + 60_001, 60_000, 3)).toBe(true);
    // Separate keys do not share buckets
    expect(consumeRateLimit("ip-2", now + 3, 60_000, 3)).toBe(true);
  });

  it("skips Turnstile verification when no secret is configured", async () => {
    const fetchImpl = vi.fn();
    await expect(verifyTurnstileToken(undefined, undefined, fetchImpl)).resolves.toEqual({
      ok: true,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects missing tokens when a secret is configured", async () => {
    await expect(verifyTurnstileToken("", "secret", vi.fn())).resolves.toEqual({
      ok: false,
      reason: "missing_token",
    });
  });

  it("accepts successful Turnstile siteverify responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await expect(verifyTurnstileToken("token-abc", "secret", fetchImpl)).resolves.toEqual({
      ok: true,
    });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(String(init.body)).toContain("response=token-abc");
  });

  it("rejects failed Turnstile siteverify responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
    });

    await expect(verifyTurnstileToken("bad", "secret", fetchImpl)).resolves.toEqual({
      ok: false,
      reason: "rejected",
    });
  });

  it("maps upstream failures", async () => {
    await expect(
      verifyTurnstileToken(
        "token",
        "secret",
        vi.fn().mockResolvedValue({ ok: false, status: 503 }),
      ),
    ).resolves.toEqual({ ok: false, reason: "upstream_error" });

    await expect(
      verifyTurnstileToken(
        "token",
        "secret",
        vi.fn().mockRejectedValue(new Error("network")),
      ),
    ).resolves.toEqual({ ok: false, reason: "upstream_error" });
  });
});
