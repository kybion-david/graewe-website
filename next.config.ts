import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: isGitHubPages ? "/graewe-website" : "",
  images: isGitHubPages
    ? { unoptimized: true }
    : { formats: ["image/avif", "image/webp"] },
  trailingSlash: isGitHubPages,
};

export default withNextIntl(nextConfig);
