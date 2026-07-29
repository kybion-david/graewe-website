import { defineConfig, devices } from "@playwright/test";

const mobileSpecs = /\/(viewport-overflow|mobile-menu)\.spec\.ts/;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: mobileSpecs,
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      testMatch: mobileSpecs,
    },
    {
      name: "mobile-320",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 320, height: 568 },
      },
      testMatch: mobileSpecs,
    },
  ],
  webServer: {
    // Must match production: output "standalone" → node .next/standalone/server.js
    // (npm run start). Do not use next start.
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    env: {
      PATH: `/opt/homebrew/bin:${process.env.PATH}`,
    },
  },
});
