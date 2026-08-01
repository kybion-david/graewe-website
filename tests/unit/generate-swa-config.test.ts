import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getStaticWebAppConfig,
  getStaticWebAppRedirectRoutes,
  STATIC_WEB_APP_CONFIG_MAX_BYTES,
} from "@/lib/legacyRedirects";

const configPath = resolve(__dirname, "../../staticwebapp.config.json");

/**
 * These tests *verify* the committed `staticwebapp.config.json`; they must never
 * write it. An earlier version called `writeFileSync` here, which meant running
 * `npm run test` silently rewrote the committed file from the generator — and
 * because the generator was missing `Strict-Transport-Security`, running the
 * suite deleted the HSTS header from the repo. It also made the assertions
 * tautological: they checked what the test had just written.
 */
describe("staticwebapp.config.json", () => {
  const serialized = `${JSON.stringify(getStaticWebAppConfig(), null, 2)}\n`;

  it("matches the generator in src/lib/legacyRedirects.ts", () => {
    const committed = readFileSync(configPath, "utf8");
    expect(
      committed,
      "staticwebapp.config.json is out of date with getStaticWebAppConfig(). " +
        "Update the committed file to match the generator — do not make this " +
        "test write it.",
    ).toBe(serialized);
  });

  it("declares the security headers Azure must send", () => {
    const committed = JSON.parse(readFileSync(configPath, "utf8")) as {
      routes: unknown[];
      globalHeaders?: Record<string, string>;
      responseOverrides?: unknown;
    };

    expect(committed.responseOverrides).toBeUndefined();
    expect(committed.routes).toEqual([]);
    expect(committed.globalHeaders?.["X-Content-Type-Options"]).toBe("nosniff");
    // Azure injects HSTS on *.azurestaticapps.net; after DNS cutover to
    // www.graewe.com we cannot rely on that, so it must be declared here.
    expect(committed.globalHeaders?.["Strict-Transport-Security"]).toBe(
      "max-age=31536000; includeSubDomains",
    );
  });

  it("stays under Azure's 20 KB limit with headers only (no 404→home rewrite)", () => {
    expect(Buffer.byteLength(serialized, "utf8")).toBeLessThan(
      STATIC_WEB_APP_CONFIG_MAX_BYTES,
    );
  });

  it("keeps the full legacy path matrix available for proxy redirects", () => {
    const routes = getStaticWebAppRedirectRoutes();
    expect(routes.length).toBeGreaterThan(100);
    expect(routes.some((r) => r.route === "/en/company/who-is-graewe")).toBe(
      true,
    );
    expect(routes.some((r) => r.route === "/sitemap")).toBe(true);
    expect(routes.some((r) => r.route === "/cookies")).toBe(true);
    expect(
      routes.some(
        (r) =>
          r.route === "/produkte/rohrextrusion/kalibier-und-kuehlbaeder" &&
          r.redirect === "/de/produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
      ),
    ).toBe(true);
    expect(
      routes.some(
        (r) =>
          r.route === "/en/produkte/rohrextrusion/kalibier-und-kuehlbaeder" &&
          r.redirect ===
            "/en/produkte/rohrextrusion/kalibrier-und-kuehlbaeder",
      ),
    ).toBe(true);
  });
});
