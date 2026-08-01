import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { IMAGE_DEVICE_SIZES } from "./src/lib/imageConfig";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [...IMAGE_DEVICE_SIZES],
  },
};

export default withNextIntl(nextConfig);
