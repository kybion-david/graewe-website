/** Honeypot field name — bots fill it; humans never see it. */
export const CONTACT_HONEYPOT_FIELD = "website";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type RateBucket = { count: number; resetAt: number };

/** In-memory rate limiter (best-effort per instance; Turnstile is the primary gate). */
const rateBuckets = new Map<string, RateBucket>();

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Returns true if the client is within the allowance and records the attempt.
 * Returns false when the limit is exceeded (caller must reject without sending mail).
 */
export function consumeRateLimit(
  key: string,
  now = Date.now(),
  windowMs = RATE_LIMIT_WINDOW_MS,
  max = RATE_LIMIT_MAX,
): boolean {
  const existing = rateBuckets.get(key);
  if (!existing || now >= existing.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= max) {
    return false;
  }
  existing.count += 1;
  return true;
}

/** Test helper — clear buckets between unit tests. */
export function resetRateLimitState(): void {
  rateBuckets.clear();
}

export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; reason: "missing_token" | "rejected" | "upstream_error" };

/**
 * Verify a Cloudflare Turnstile token server-side.
 * When `secret` is empty, verification is skipped (local/dev without keys).
 */
export async function verifyTurnstileToken(
  token: unknown,
  secret: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileVerifyResult> {
  if (!secret) {
    return { ok: true };
  }

  if (typeof token !== "string" || token.trim().length === 0) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token.trim());

    const res = await fetchImpl(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );

    if (!res.ok) {
      return { ok: false, reason: "upstream_error" };
    }

    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return { ok: false, reason: "rejected" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "upstream_error" };
  }
}
