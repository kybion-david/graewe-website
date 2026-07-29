import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Layout contract for ISSUE-036: at 320px the header content box is only
 * 288px wide (viewport − px-4). Logo + language + menu must stay compact
 * below the `sm` breakpoint. Full scrollWidth e2e coverage is ISSUE-047.
 */
describe("header mobile layout (ISSUE-036)", () => {
  const header = readFileSync(
    resolve(__dirname, "../../src/components/layout/Header.tsx"),
    "utf8",
  );
  const languageSwitcher = readFileSync(
    resolve(__dirname, "../../src/components/ui/LanguageSwitcher.tsx"),
    "utf8",
  );

  it("keeps the unscrolled logo ≤ 150px below sm", () => {
    const match = header.match(/: "w-\[(\d+)px\] sm:w-\[220px\]"/);
    expect(match, "expected unscrolled mobile logo width class").toBeTruthy();
    expect(Number(match![1])).toBeLessThanOrEqual(150);
  });

  it("keeps the scrolled logo ≤ 130px below sm", () => {
    const match = header.match(/\? "w-\[(\d+)px\] sm:w-\[180px\]"/);
    expect(match, "expected scrolled mobile logo width class").toBeTruthy();
    expect(Number(match![1])).toBeLessThanOrEqual(130);
  });

  it("uses tighter control spacing below sm", () => {
    expect(header).toMatch(/gap-1\.5 sm:gap-4/);
    expect(header).toMatch(/px-3 sm:px-5/);
  });

  it("hides the language globe icon below sm to save width", () => {
    expect(languageSwitcher).toMatch(/hidden sm:block/);
  });
});
