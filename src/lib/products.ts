export type ProductCategory = "rohrextrusion" | "profilextrusion" | "plattenextrusion";

export interface ProductSubcategory {
  slug: string;
  translationKey: string;
}

export const productCategories: Record<ProductCategory, ProductSubcategory[]> = {
  rohrextrusion: [
    { slug: "extruder", translationKey: "extruder" },
    { slug: "kalibrier-und-kuehlbaeder", translationKey: "calibrationBaths" },
    { slug: "abzuege", translationKey: "haul-offs" },
    { slug: "trenneinrichtungen", translationKey: "cuttingDevices" },
    { slug: "vollautomatische-wickler", translationKey: "automaticWinders" },
    { slug: "halbautomatische-wickler", translationKey: "semiAutomaticWinders" },
    { slug: "muffenmaschinen", translationKey: "socketMachines" },
    { slug: "sondermaschinen", translationKey: "specialMachines" },
  ],
  profilextrusion: [
    { slug: "extruder", translationKey: "extruder" },
    { slug: "kalibriertische", translationKey: "calibrationTables" },
    { slug: "abzuege", translationKey: "haul-offs" },
    { slug: "trenneinrichtungen", translationKey: "cuttingDevices" },
    { slug: "wickler", translationKey: "winders" },
    { slug: "sondermaschinen", translationKey: "specialMachines" },
  ],
  plattenextrusion: [
    { slug: "extruder", translationKey: "extruder" },
    { slug: "laengstrenn-einrichtungen", translationKey: "longitudinalCutting" },
    { slug: "quertrenn-einrichtungen", translationKey: "transverseCutting" },
    { slug: "plattenstapler", translationKey: "sheetStackers" },
    { slug: "sondermaschinen", translationKey: "specialMachines" },
  ],
};

export const categoryTranslationKeys: Record<ProductCategory, string> = {
  rohrextrusion: "pipeExtrusion",
  profilextrusion: "profileExtrusion",
  plattenextrusion: "sheetExtrusion",
};

export function getAllProductSlugs(): { category: ProductCategory; product: string }[] {
  const slugs: { category: ProductCategory; product: string }[] = [];
  for (const [category, subcategories] of Object.entries(productCategories)) {
    for (const sub of subcategories) {
      slugs.push({ category: category as ProductCategory, product: sub.slug });
    }
  }
  return slugs;
}
