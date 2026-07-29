import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ISSUE-049: product gallery lightbox must be a real dialog
 * (role, aria-modal, Escape/focus trap via useDismissibleOverlay,
 * body scroll lock, non-overlapping controls, swipe).
 */
describe("product lightbox dialog (ISSUE-049)", () => {
  const source = readFileSync(
    resolve(__dirname, "../../src/components/products/ProductDetailContent.tsx"),
    "utf8",
  );

  it("uses dialog semantics and dismissible overlay", () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain("lightboxAria");
    expect(source).toContain("useDismissibleOverlay");
    expect(source).toContain("trapFocus: true");
    expect(source).toContain("triggerRef");
  });

  it("locks body scroll and supports swipe navigation", () => {
    expect(source).toContain('document.body.style.overflow = "hidden"');
    expect(source).toContain("onTouchStart");
    expect(source).toContain("onTouchEnd");
    expect(source).toContain("SWIPE_THRESHOLD_PX");
  });

  it("keeps prev/next controls out of the image plane", () => {
    expect(source).not.toMatch(/absolute left-4/);
    expect(source).not.toMatch(/absolute right-4/);
    expect(source).toContain("shrink-0 flex items-center justify-center");
  });
});
