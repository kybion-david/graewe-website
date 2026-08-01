import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { locales } from "@/i18n/routing";
import { globalErrorCopy } from "@/app/globalErrorCopy";

/**
 * `src/app/globalErrorCopy.ts` inlines the error-page copy instead of importing
 * the message catalogs — importing them dragged all five locales (248 KB raw /
 * 75 KB gzip) into a client chunk loaded on every page.
 *
 * The JSON files remain the source of truth; these tests fail if the inlined
 * map drifts, or if a locale is added without inlining its copy.
 */

function errorMessagesFor(locale: string): Record<string, string> {
  const json = readFileSync(
    path.resolve(__dirname, `../../src/messages/${locale}.json`),
    "utf8",
  );
  return JSON.parse(json).error;
}

describe("global-error inlined copy", () => {
  it.each(locales)("exactly matches the %s catalog", (locale) => {
    expect(globalErrorCopy[locale]).toEqual(errorMessagesFor(locale));
  });

  it("covers every routed locale and nothing else", () => {
    expect(Object.keys(globalErrorCopy).sort()).toEqual([...locales].sort());
  });

  it("is not reintroduced by any client component", () => {
    // The regression class is broader than global-error.tsx: *any* "use client"
    // module that statically imports a catalog pulls all five locales into a
    // client chunk. Server components are fine — their imports stay server-side.
    const srcDir = path.resolve(__dirname, "../../src");
    const staticCatalogImport = /^\s*import\s[^;]*["'][^"']*messages\/\w+\.json["']/m;
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (/\.tsx?$/.test(entry.name)) {
          const source = readFileSync(full, "utf8");
          if (/^\s*["']use client["']/m.test(source) && staticCatalogImport.test(source)) {
            offenders.push(path.relative(srcDir, full));
          }
        }
      }
    };
    walk(srcDir);

    expect(
      offenders,
      "client components must not statically import src/messages/*.json — it " +
        "bundles all five locales (~74 KB gzip) into a chunk loaded on every page",
    ).toEqual([]);
  });
});
