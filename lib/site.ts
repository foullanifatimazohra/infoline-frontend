import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://infoline.om");

export const SITE_NAME = "Infoline";

/**
 * Canonical + hreflang alternates for a locale-stripped path, e.g. "/about"
 * or "" for the homepage. Every configured locale (see i18n/routing.ts) gets
 * an hreflang entry pointing at its own URL; x-default points at the
 * default locale so search engines have a fallback for unmatched languages.
 */
export function localeAlternates(locale: string, path: string = "") {
  const clean = path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}${clean}`]),
  );

  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}
