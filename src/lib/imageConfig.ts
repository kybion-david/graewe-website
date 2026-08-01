/**
 * Widths `next/image` is allowed to generate, in ascending order (Next requires sorted).
 *
 * Next's default runs to 3840, but every source image under `public/images/` is at most
 * 1600px wide and the optimizer never upscales — so `w=1920`, `w=2048` and `w=3840` all
 * return byte-identical output. Each one is still a separate entry in the optimizer cache
 * (`.next/cache/images`, keyed on url+width+quality+Accept), so the extra widths only ever
 * cost redundant cold encodes on the LCP path and split the cache hit rate three ways.
 *
 * 1920 is kept as the top entry so the single 1600px source (news/kalibriertische-1.jpg)
 * can still be served at its native resolution on high-DPR displays.
 *
 * `tests/unit/imageConfig.test.ts` measures the real images and fails if this array stops
 * matching them — either because a wider image was added, or because a redundant width
 * crept back in.
 */
export const IMAGE_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920] as const;
