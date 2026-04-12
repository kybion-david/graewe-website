import type { ProductCategory } from "./products";

function galleryPaths(
  category: ProductCategory,
  slug: string,
  filenames: string[]
): string[] {
  return filenames.map((name) => `/images/products/${category}/${slug}/${name}`);
}

function galleryJpgs(category: ProductCategory, slug: string, count: number): string[] {
  return galleryPaths(
    category,
    slug,
    Array.from({ length: count }, (_, i) => `gallery-${i + 1}.jpg`)
  );
}

function galleryPngs(category: ProductCategory, slug: string, count: number): string[] {
  return galleryPaths(
    category,
    slug,
    Array.from({ length: count }, (_, i) => `gallery-${i + 1}.png`)
  );
}

export const productImages: Record<string, Record<string, string[]>> = {
  rohrextrusion: {
    extruder: galleryJpgs("rohrextrusion", "extruder", 5),
    "kalibrier-und-kuehlbaeder": galleryJpgs("rohrextrusion", "kalibrier-und-kuehlbaeder", 4),
    abzuege: galleryJpgs("rohrextrusion", "abzuege", 4),
    trenneinrichtungen: galleryJpgs("rohrextrusion", "trenneinrichtungen", 4),
    "vollautomatische-wickler": galleryJpgs("rohrextrusion", "vollautomatische-wickler", 4),
    "halbautomatische-wickler": galleryJpgs("rohrextrusion", "halbautomatische-wickler", 4),
    muffenmaschinen: galleryJpgs("rohrextrusion", "muffenmaschinen", 4),
    sondermaschinen: galleryJpgs("rohrextrusion", "sondermaschinen", 4),
  },
  profilextrusion: {
    extruder: [],
    kalibriertische: galleryPngs("profilextrusion", "kalibriertische", 4),
    abzuege: galleryJpgs("profilextrusion", "abzuege", 4),
    trenneinrichtungen: galleryJpgs("profilextrusion", "trenneinrichtungen", 3),
    wickler: galleryJpgs("profilextrusion", "wickler", 4),
    sondermaschinen: galleryJpgs("profilextrusion", "sondermaschinen", 4),
  },
  plattenextrusion: {
    extruder: galleryJpgs("plattenextrusion", "extruder", 5),
    "laengstrenn-einrichtungen": galleryPaths("plattenextrusion", "laengstrenn-einrichtungen", [
      "gallery-1.jpg",
      "gallery-2.jpg",
      "gallery-3.png",
    ]),
    "quertrenn-einrichtungen": galleryJpgs("plattenextrusion", "quertrenn-einrichtungen", 3),
    plattenstapler: galleryPngs("plattenextrusion", "plattenstapler", 3),
    sondermaschinen: [],
  },
};

export function getProductImages(category: ProductCategory, slug: string): string[] {
  return productImages[category]?.[slug] ?? [];
}
