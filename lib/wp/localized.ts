import { getLocale } from "next-intl/server";
import type { WpLocale } from "./api";

/**
 * Fetch CMS content in the visitor's locale, falling back to English.
 *
 * Every WP fetcher already accepts a locale, but pages were calling them with
 * a hard-coded "en", so /ar rendered English CMS content. WPML is not fully
 * populated yet, so an Arabic listing may legitimately come back empty — in
 * that case we fall back to the English result rather than render a blank
 * section. Once Arabic entries exist in the CMS they are picked up with no
 * code change.
 */
export async function fetchLocalized<T>(
  fetcher: (locale: WpLocale) => Promise<T>,
  isEmpty: (value: T) => boolean = defaultIsEmpty,
): Promise<T> {
  const locale: WpLocale = (await getLocale()) === "ar" ? "ar" : "en";
  const value = await fetcher(locale);
  if (locale !== "en" && isEmpty(value)) return fetcher("en");
  return value;
}

function defaultIsEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && "items" in value) {
    const items = (value as { items: unknown }).items;
    return Array.isArray(items) && items.length === 0;
  }
  return false;
}
