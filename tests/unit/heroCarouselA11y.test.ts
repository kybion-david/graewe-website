import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * A11y contracts for ISSUE-043: pause control, ≥24×24 px dot hit targets,
 * and autoplay that respects hover/focus/visibility/reduced-motion.
 */
describe("hero carousel a11y (ISSUE-043)", () => {
  const source = readFileSync(
    resolve(__dirname, "../../src/components/home/HeroCarousel.tsx"),
    "utf8",
  );

  it("exposes a pause/play control", () => {
    expect(source).toMatch(/pauseAria/);
    expect(source).toMatch(/playAria/);
    expect(source).toMatch(/aria-pressed=\{userPaused\}/);
  });

  it("pauses autoplay on hover, focus, hidden tab, and reduced motion", () => {
    expect(source).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(source).toMatch(/visibilitychange/);
    expect(source).toMatch(/document\.hidden/);
    expect(source).toMatch(/onMouseEnter/);
    expect(source).toMatch(/onFocusCapture/);
    expect(source).toMatch(
      /!userPaused && !hovered && !focusWithin && !reducedMotion && !tabHidden/,
    );
  });

  it("gives dot controls a ≥24×24 px hit area", () => {
    expect(source).toMatch(/h-6 min-w-6/);
    expect(source).toMatch(/h-1 w-6 sm:w-8/);
  });

  it("marks the region as a carousel and hides inactive slides", () => {
    expect(source).toMatch(/aria-roledescription=\{t\("roleDescription"\)\}/);
    expect(source).toMatch(/aria-hidden=\{index !== current\}/);
  });

  it("stacks slide copy in one grid cell so controls keep a stable height", () => {
    expect(source).toMatch(/className="relative mb-6 grid sm:mb-0"/);
    expect(source).toMatch(/col-start-1 row-start-1/);
  });

  it("keeps hover-pause off the hero section itself", () => {
    // The <section> spans ~69% of a laptop viewport. A section-wide
    // mouseenter froze autoplay whenever the pointer merely rested over the
    // copy, the image, or the surrounding whitespace, so hover-pause belongs
    // on the control clusters only.
    const sectionTag = source.slice(
      source.indexOf("<section"),
      source.indexOf("<h1"),
    );
    expect(sectionTag).not.toMatch(/onMouseEnter/);
    // Taps fire mouseenter without a matching mouseleave on touch devices.
    expect(source).toMatch(/hover: hover/);
  });

  it("pauses on keyboard focus only, so clicking a control cannot latch autoplay off", () => {
    expect(source).toMatch(/:focus-visible/);
  });
});
