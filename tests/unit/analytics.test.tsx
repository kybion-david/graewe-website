import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getUmamiConfig } from "@/lib/analytics";
import { Analytics } from "@/components/analytics/Analytics";

/**
 * `next/script` defers real injection to the Next runtime, which does not exist under
 * jsdom. Rendering a plain <script> instead keeps the assertions on what this component
 * actually decides — whether to emit anything, and with which attributes.
 */
vi.mock("next/script", () => ({
  default: (props: Record<string, unknown>) => <script {...props} />,
}));

const SRC = "https://cloud.umami.is/script.js";
const ID = "00000000-0000-0000-0000-000000000000";

function setEnv(src?: string, websiteId?: string) {
  vi.stubEnv("NEXT_PUBLIC_UMAMI_SRC", src as string);
  vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", websiteId as string);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Umami analytics gating", () => {
  it("loads nothing when neither env var is set", () => {
    setEnv(undefined, undefined);
    expect(getUmamiConfig()).toBeNull();

    const { container } = render(<Analytics />);
    expect(container.querySelector("script")).toBeNull();
  });

  // A half-configured beacon ships a script that can never report anything, while the
  // privacy policy claims analytics are running. Both halves, or neither.
  it("loads nothing when only one of the two env vars is set", () => {
    setEnv(SRC, undefined);
    expect(getUmamiConfig()).toBeNull();
    expect(render(<Analytics />).container.querySelector("script")).toBeNull();

    setEnv(undefined, ID);
    expect(getUmamiConfig()).toBeNull();
    expect(render(<Analytics />).container.querySelector("script")).toBeNull();
  });

  it("treats blank and whitespace-only values as unset", () => {
    setEnv("   ", ID);
    expect(getUmamiConfig()).toBeNull();

    setEnv(SRC, "");
    expect(getUmamiConfig()).toBeNull();
  });

  it("loads the tracker with both values present", () => {
    setEnv(SRC, ID);
    expect(getUmamiConfig()).toEqual({ src: SRC, websiteId: ID });

    const script = render(<Analytics />).container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.getAttribute("src")).toBe(SRC);
    expect(script?.getAttribute("data-website-id")).toBe(ID);
  });

  // Umami is cookieless, so DNT is a courtesy rather than a legal requirement — but the
  // privacy copy tells visitors we honour it, so it must actually be sent.
  it("honours the browser Do Not Track signal", () => {
    setEnv(SRC, ID);
    const script = render(<Analytics />).container.querySelector("script");
    expect(script?.getAttribute("data-do-not-track")).toBe("true");
  });
});

describe("Umami analytics wiring", () => {
  // A component nothing renders is a silent no-op: every test above would still pass.
  it("is mounted in the locale layout", () => {
    const layout = readFileSync(
      resolve(__dirname, "../../src/app/[locale]/layout.tsx"),
      "utf8",
    );
    expect(layout).toMatch(/import \{ Analytics \} from "@\/components\/analytics\/Analytics"/);
    expect(layout).toMatch(/<Analytics \/>/);
  });

  // Next inlines `process.env.NEXT_PUBLIC_*` textually at build time, so the reads have
  // to stay literal. Indirection type-checks fine and yields undefined in the browser.
  it("reads both public env vars as literal expressions", () => {
    const lib = readFileSync(resolve(__dirname, "../../src/lib/analytics.ts"), "utf8");
    expect(lib).toMatch(/process\.env\.NEXT_PUBLIC_UMAMI_SRC/);
    expect(lib).toMatch(/process\.env\.NEXT_PUBLIC_UMAMI_WEBSITE_ID/);
  });

  // Preview deploys share the production deploy job; without this guard they would
  // report into the same Umami site and corrupt the real numbers.
  it("passes the tracker vars only on production pushes", () => {
    const workflow = readFileSync(
      resolve(__dirname, "../../.github/workflows/deploy.yml"),
      "utf8",
    );
    for (const name of ["NEXT_PUBLIC_UMAMI_SRC", "NEXT_PUBLIC_UMAMI_WEBSITE_ID"]) {
      const line = workflow
        .split("\n")
        .find((candidate) => candidate.includes(`${name}:`));
      expect(line, `${name} missing from deploy workflow`).toBeDefined();
      expect(line).toContain("github.event_name == 'push'");
    }
  });
});
