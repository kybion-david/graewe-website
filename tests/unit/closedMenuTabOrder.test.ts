import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ISSUE-037: closed overlays must leave the tab order (inert / hidden),
 * not merely opacity-0 + pointer-events-none.
 */
describe("closed menu tab order (ISSUE-037)", () => {
  const header = readFileSync(
    resolve(__dirname, "../../src/components/layout/Header.tsx"),
    "utf8",
  );
  const mobileMenu = readFileSync(
    resolve(__dirname, "../../src/components/layout/MobileMenu.tsx"),
    "utf8",
  );
  const languageSwitcher = readFileSync(
    resolve(__dirname, "../../src/components/ui/LanguageSwitcher.tsx"),
    "utf8",
  );
  const overlayHook = readFileSync(
    resolve(__dirname, "../../src/hooks/useDismissibleOverlay.ts"),
    "utf8",
  );

  it("marks closed desktop dropdown, mobile menu, and language list as inert", () => {
    expect(header).toMatch(/inert=\{!menuOpen \? true : undefined\}/);
    expect(mobileMenu).toMatch(/inert=\{!isOpen \? true : undefined\}/);
    expect(languageSwitcher).toMatch(/inert=\{!open \? true : undefined\}/);
  });

  it("uses dismissible overlay for Escape, focus return, and focus trap", () => {
    expect(overlayHook).toContain('event.key === "Escape"');
    expect(overlayHook).toContain("trapFocus");
    expect(overlayHook).toContain("restore?.focus()");
    expect(mobileMenu).toContain("trapFocus: true");
    expect(header).toContain("useDismissibleOverlay");
    expect(languageSwitcher).toContain("useDismissibleOverlay");
  });
});
