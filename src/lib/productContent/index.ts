import type { ProductCategory } from "../products";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import ru from "./ru.json";

export interface ProductSection {
  heading?: string;
  content?: string;
  items?: string[];
}

export interface ProductDetail {
  title: string;
  sections: ProductSection[];
  cta?: { text: string; link: string };
}

type ProductContentMap = Record<
  string,
  Record<string, Record<string, ProductDetail>>
>;

/**
 * Product body copy per locale.
 * Supported locales: de, en, fr, ru, es.
 * Unknown locales fall back to German (`de`) so product pages still render.
 */
const content: ProductContentMap = { de, en, fr, ru, es };

export function getProductDetail(
  locale: string,
  category: ProductCategory,
  slug: string,
): ProductDetail | undefined {
  const lang = locale in content ? locale : "de";
  return content[lang]?.[category]?.[slug];
}
