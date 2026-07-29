import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getStaticWebAppRedirectRoutes } from "@/lib/legacyRedirects";

const configPath = resolve(__dirname, "../../staticwebapp.config.json");

describe("staticwebapp.config.json", () => {
  it("stays in sync with the legacy redirect map (no 404→home rewrite)", () => {
    const routes = getStaticWebAppRedirectRoutes();
    const config = {
      routes,
      globalHeaders: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      },
    };

    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const committed = JSON.parse(readFileSync(configPath, "utf8")) as {
      routes: typeof routes;
      responseOverrides?: unknown;
    };

    expect(committed.responseOverrides).toBeUndefined();
    expect(committed.routes).toEqual(routes);
    expect(committed.routes.length).toBeGreaterThan(100);
    expect(
      committed.routes.some((r) => r.route === "/en/company/who-is-graewe"),
    ).toBe(true);
  });
});
