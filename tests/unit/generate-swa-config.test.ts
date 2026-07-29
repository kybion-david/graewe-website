import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getStaticWebAppConfig,
  getStaticWebAppRedirectRoutes,
  STATIC_WEB_APP_CONFIG_MAX_BYTES,
} from "@/lib/legacyRedirects";

const configPath = resolve(__dirname, "../../staticwebapp.config.json");

describe("staticwebapp.config.json", () => {
  it("stays under Azure's 20 KB limit with headers only (no 404→home rewrite)", () => {
    const config = getStaticWebAppConfig();
    const serialized = `${JSON.stringify(config, null, 2)}\n`;
    writeFileSync(configPath, serialized);

    const committed = JSON.parse(readFileSync(configPath, "utf8")) as {
      routes: unknown[];
      globalHeaders?: Record<string, string>;
      responseOverrides?: unknown;
    };

    expect(committed.responseOverrides).toBeUndefined();
    expect(committed.routes).toEqual([]);
    expect(committed.globalHeaders?.["X-Content-Type-Options"]).toBe("nosniff");
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
