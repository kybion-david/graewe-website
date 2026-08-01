import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { IMAGE_DEVICE_SIZES } from "@/lib/imageConfig";

/**
 * `IMAGE_DEVICE_SIZES` is only correct relative to the images actually in the repo:
 * `next/image` never upscales, so any width at or above the widest source produces
 * byte-identical output. These tests measure the real files so the array cannot
 * silently drift out of step with them.
 */

/** All of `public/`, not just `public/images/` — `deviceSizes` applies to every optimized image. */
const PUBLIC_DIR = path.join(__dirname, "../../public");

const RASTER_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** Intrinsic width in px, read from the file header. Returns null for unsupported types. */
function intrinsicWidth(file: string): number | null {
  const buf = readFileSync(file);

  if (buf.length > 24 && buf.subarray(1, 4).toString("latin1") === "PNG") {
    return buf.readUInt32BE(16);
  }

  if (buf.length > 10 && buf.subarray(0, 3).toString("latin1") === "GIF") {
    return buf.readUInt16LE(6);
  }

  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    // JPEG: walk the segment chain to the SOFn frame header, which carries the dimensions.
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buf[offset + 1];
      const isFrameHeader =
        marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isFrameHeader) return buf.readUInt16BE(offset + 7);
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
  }

  return null;
}

const rasterFiles = walk(PUBLIC_DIR).filter((file) =>
  RASTER_EXTENSIONS.includes(path.extname(file).toLowerCase()),
);

const measured = rasterFiles.map((file) => ({ file, width: intrinsicWidth(file) }));
const sourceWidths = measured
  .map(({ width }) => width)
  .filter((width): width is number => width !== null && width > 0);

const widestSource = Math.max(...sourceWidths);

describe("IMAGE_DEVICE_SIZES", () => {
  it("reads a plausible set of source images", () => {
    // Guards the guards: a broken parser would make every assertion below vacuous.
    expect(rasterFiles.length).toBeGreaterThan(100);
    expect(widestSource).toBeGreaterThan(0);
  });

  it("measures every raster asset, with no format silently skipped", () => {
    // Without this, adding a .webp/.avif the parser cannot read would drop it from
    // `widestSource` and quietly weaken every assertion below.
    const unreadable = measured
      .filter(({ width }) => width === null || width <= 0)
      .map(({ file }) => path.relative(PUBLIC_DIR, file));
    expect(unreadable).toEqual([]);
  });

  it("is sorted ascending with no duplicates, as Next requires", () => {
    const sorted = [...IMAGE_DEVICE_SIZES].sort((a, b) => a - b);
    expect([...IMAGE_DEVICE_SIZES]).toEqual(sorted);
    expect(new Set(IMAGE_DEVICE_SIZES).size).toBe(IMAGE_DEVICE_SIZES.length);
  });

  it("can serve the widest source image at native resolution", () => {
    // If this fails, an image wider than every configured size was added: raise the top
    // entry to cover it, or the image will be downscaled on high-DPR displays.
    expect(Math.max(...IMAGE_DEVICE_SIZES)).toBeGreaterThanOrEqual(widestSource);
  });

  it("has no redundant width above the widest source", () => {
    // Two or more entries >= the widest source means at least one produces byte-identical
    // output to another, buying nothing but an extra cold encode and a split cache.
    const atOrAboveSource = IMAGE_DEVICE_SIZES.filter((size) => size >= widestSource);
    expect(atOrAboveSource).toHaveLength(1);
  });
});
