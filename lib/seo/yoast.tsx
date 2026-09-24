/**
 * Yoast SEO types + mapping to Next.js Metadata — Phase 4 handover
 * (docs/backend/phase4-seo-api.md).
 *
 * Strategy: the field-by-field approach (handover §3 recommends it over
 * fullHead). Mixing the two produces duplicate tags — never render fullHead
 * alongside this mapper.
 *
 * Handover rules baked in:
 * - Yoast fields return "" (not null) when unset — check falsy.
 * - `seo.title` already carries the site name — never append it again.
 * - metaRobotsNoindex currently reads "noindex" site-wide (dev); building the
 *   robots tag FROM THE FIELD means pages become indexable at launch with
 *   no frontend change.
 * - Empty metaDesc must not render an empty description tag — omit instead.
 * - canonical/schema URLs point at staging until cutover — use as given,
 *   never rewrite hosts in the frontend.
 * - schema.raw is a ready-made JSON string — inject as-is, never rebuild.
 */

import type { Metadata } from "next";

/* ------------------------------- Types ---------------------------------- */

export type SeoImage = { sourceUrl?: string | null; altText?: string | null } | null;

export type YoastSeo = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  metaRobotsNoindex?: string | null;
  metaRobotsNofollow?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: SeoImage;
  opengraphType?: string | null;
  opengraphSiteName?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: SeoImage;
  schema?: { raw?: string | null } | null;
  breadcrumbs?: { text: string; url: string }[] | null;
  breadcrumbTitle?: string | null;
  fullHead?: string | null;
};

/** The seo fragment to paste into any content query (Phase 4 §5). */
export const SEO_FRAGMENT = /* GraphQL */ `
  seo {
    title
    metaDesc
    canonical
    metaRobotsNoindex
    metaRobotsNofollow
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
      altText
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
      altText
    }
    schema {
      raw
    }
  }
`;

/** A translation link used to build hreflang alternates (Phase 4 §6). */
export type SeoTranslation = { uri: string; language: { code: string } };

/** Locales the site ships (keep in sync with i18n/routing.ts). */
export const SITE_LOCALES = ["en", "ar"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

/* ----------------------------- Helpers ---------------------------------- */

/** First non-empty string, else undefined (Yoast returns "" not null). */
function firstNonEmpty(...values: (string | null | undefined)[]) {
  for (const v of values) {
    if (v && v.trim()) return v.trim();
  }
  return undefined;
}

/**
 * Localise a WP uri ("/services/x/") into a site path for this app's routing
 * ("/en/services/x" / "/ar/services/x"). WP URIs are locale-stripped per the
 * Phase 1 handover ("build routing so it can take a locale"); Arabic slugs
 * differ per node — callers pass the translation's own uri, never a /ar
 * prefix of the English one (Phase 4 §6).
 */
export function wpUriToPath(uri: string, locale: SiteLocale) {
  const clean = uri.startsWith("/") ? uri : `/${uri}`;
  // Strip any /ar prefix defensively — the uri must be locale-stripped here.
  const stripped = clean.replace(/^\/ar(?=\/|$)/, "");
  return `/${locale}${stripped.replace(/\/$/, "")}`;
}

/**
 * Absolute URL for the current deployment, built from our own site URL and a
 * node uri — per handover §4 ("build them from your own site URL and the
 * node's uri") rather than rewriting CMS hosts.
 */
export function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return new URL(path, base).toString();
}

/* ------------------------- Metadata mapping ------------------------------ */

export type SeoMetadataInput = {
  seo: YoastSeo | null | undefined;
  /** Locale-stripped WP uri of the node (e.g. "/services/x/"), for canonical fallback. */
  uri?: string;
  locale: SiteLocale;
  /** Translations of this node for hreflang (empty array = no translation). */
  translations?: SeoTranslation[] | null;
  /** Page path of THIS node in this app, e.g. "/en/services/x". */
  path?: string;
};

/**
 * Map a Yoast seo object onto Next.js Metadata — the one place this happens.
 * Field-by-field, per handover §3. Returns undefined-friendly values:
 * callers can spread it straight into their generateMetadata return.
 */
export function yoastToMetadata({
  seo,
  uri,
  locale,
  translations,
  path,
}: SeoMetadataInput): Metadata {
  const title = firstNonEmpty(seo?.title);
  const description = firstNonEmpty(seo?.metaDesc, seo?.opengraphDescription);

  // Robots built FROM THE FIELD (handover §4 — do not hardcode index):
  // dev currently returns "noindex"; at launch it flips to "index".
  const robotsIndex = seo?.metaRobotsNoindex
    ? seo.metaRobotsNoindex.toLowerCase() === "noindex"
      ? "noindex"
      : "index"
    : "index";
  const robotsFollow = seo?.metaRobotsNofollow
    ? seo.metaRobotsNofollow.toLowerCase() === "nofollow"
      ? "nofollow"
      : "follow"
    : "follow";

  // Canonical from the field; fall back to building our own from the uri.
  const canonical =
    firstNonEmpty(seo?.canonical) ??
    (path ? absoluteUrl(path) : undefined) ??
    (uri ? absoluteUrl(wpUriToPath(uri, locale)) : undefined);

  // hreflang alternates from translations (Phase 4 §6): one per translated
  // language plus the node's own language; x-default points at the English
  // page when a translation exists, else just the page itself.
  const ownPath = path ?? (uri ? wpUriToPath(uri, locale) : undefined);
  const languages: Record<string, string> = {};
  if (ownPath) {
    languages[locale] = absoluteUrl(ownPath);
    for (const t of translations ?? []) {
      const code = t.language?.code?.toLowerCase();
      if (code && SITE_LOCALES.includes(code as SiteLocale) && code !== locale) {
        languages[code] = absoluteUrl(wpUriToPath(t.uri, code as SiteLocale));
      }
    }
    if (Object.keys(languages).length > 1) {
      languages["x-default"] =
        locale === "en" ? languages[locale] : languages["en"] ?? languages[locale];
    }
  }

  const ogImage = seo?.opengraphImage?.sourceUrl || undefined;
  const twitterImage = seo?.twitterImage?.sourceUrl || ogImage;

  const metadata: Metadata = {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { alternates: { canonical, languages } } : {}),
    robots: { index: robotsIndex === "index", follow: robotsFollow === "follow" },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      locale: locale === "ar" ? "ar_OM" : "en_US",
      type: (seo?.opengraphType as "website" | "article" | undefined) ?? "website",
      ...(seo?.opengraphSiteName ? { siteName: seo.opengraphSiteName } : {}),
    },
    ...(twitterImage || firstNonEmpty(seo?.twitterTitle)
      ? {
          twitter: {
            ...(firstNonEmpty(seo?.twitterTitle) ? { title: firstNonEmpty(seo?.twitterTitle) } : {}),
            ...(firstNonEmpty(seo?.twitterDescription)
              ? { description: firstNonEmpty(seo?.twitterDescription) }
              : {}),
            ...(twitterImage ? { images: [twitterImage] } : {}),
          },
        }
      : {}),
    // JSON-LD is injected in the page (a <script> tag in the body/head) —
    // Next Metadata cannot carry it. See JsonLd component.
  };

  return metadata;
}

/* --------------------------- JSON-LD ------------------------------------- */

/**
 * Server component-friendly JSON-LD injector for schema.raw.
 * Handover §5: inject as-is; it already contains the full @graph — do not
 * parse, rebuild, or add a second JSON-LD block for the same entities.
 */
export function JsonLd({ raw }: { raw: string | null | undefined }) {
  if (!raw) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  );
}
