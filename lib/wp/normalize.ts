import type { ImageField } from "./types";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/** ACF image → nullable `{ src, alt }`. */
export function normalizeImage(
  image:
    | {
        node?: { sourceUrl?: string | null; altText?: string | null } | null;
      }
    | null
    | undefined,
): ImageField | null {
  const src = image?.node?.sourceUrl;
  if (!src) return null;
  return { src, alt: image?.node?.altText || "" };
}

/* ------------------------------------------------------------------ */
/* Service                                                             */
/* ------------------------------------------------------------------ */

import type {
  Service,
  ServiceApproachStep,
  ServiceResult,
  ServiceFaq,
  Term,
} from "./types";

type RawService = {
  title: string | null;
  uri: string | null;
  serviceCoreContent: {
    problemStatement: string | null;
    serviceImage: Parameters<typeof normalizeImage>[0];
    expertCtaLabel: string | null;
    expertCtaUrl: string | null;
    faqCtaLabel: string | null;
    faqCtaUrl: string | null;
    approachSteps:
      | { title: string | null; description: string | null }[]
      | null;
    capabilities: { capability: string | null }[] | null;
  } | null;
  serviceProof: {
    results:
      | { result: string | null; metricName: string | null; clientDescription: string | null }[]
      | null;
    relatedCaseStudy: { nodes: { title: string | null; uri: string | null }[] } | null;
    faqs: { question: string | null; answer: string | null }[] | null;
    ctaHeading: string | null;
    ctaDescription: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
  } | null;
  pillars: { nodes: { name: string | null; slug: string | null }[] } | null;
  sectors: { nodes: { name: string | null; slug: string | null }[] } | null;
};

/** Repeaters return `null` when empty (handover §3) — always coalesce to `[]`. */
export function normalizeService(raw: RawService | null): Service | null {
  if (!raw?.uri) return null;
  const core = raw.serviceCoreContent;
  const proof = raw.serviceProof;

  return {
    title: raw.title ?? "",
    uri: raw.uri,
    problemStatement: core?.problemStatement ?? null,
    image: normalizeImage(core?.serviceImage),
    expertCta: { label: core?.expertCtaLabel ?? null, url: core?.expertCtaUrl ?? null },
    faqCta: { label: core?.faqCtaLabel ?? null, url: core?.faqCtaUrl ?? null },
    approachSteps: (core?.approachSteps ?? []) as ServiceApproachStep[],
    capabilities: (core?.capabilities ?? []).flatMap((c) =>
      c.capability ? [c.capability] : [],
    ),
    proof: {
      results: (proof?.results ?? []) as ServiceResult[],
      relatedCaseStudies: (proof?.relatedCaseStudy?.nodes ?? []).flatMap((n) =>
        n.uri ? [{ title: n.title ?? "", uri: n.uri }] : [],
      ),
      faqs: (proof?.faqs ?? []) as ServiceFaq[],
      cta: {
        heading: proof?.ctaHeading ?? null,
        description: proof?.ctaDescription ?? null,
        label: proof?.ctaLabel ?? null,
        url: proof?.ctaUrl ?? null,
      },
    },
    pillars: (raw.pillars?.nodes ?? []) as Term[],
    sectors: (raw.sectors?.nodes ?? []) as Term[],
  };
}

/* ------------------------------------------------------------------ */
/* Case study                                                          */
/* ------------------------------------------------------------------ */

import type { CaseStudy } from "./types";

type RawCaseStudy = {
  title: string | null;
  uri: string | null;
  industrySectors: { nodes: { name: string | null; slug: string | null }[] } | null;
  caseStudyCoreContent: {
    featuredResult: string | null;
    resultMetric: string | null;
    clientName: string | null;
    engagementLength: string | null;
    scale: string | null;
    heroMetrics: { metric: string | null; measure: string | null }[] | null;
    heroImage: Parameters<typeof normalizeImage>[0];
    challenge: string | null;
    approach: string | null;
    results: { measure: string | null; before: string | null; after: string | null }[] | null;
    clientQuote: string | null;
    quoteName: string | null;
    quoteTitle: string | null;
    quoteOrganisation: string | null;
    ctaHeading: string | null;
    ctaDescription: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    relatedServices: { nodes: { title: string | null; uri: string | null }[] } | null;
  } | null;
};

export function normalizeCaseStudy(raw: RawCaseStudy | null): CaseStudy | null {
  if (!raw?.uri) return null;
  const core = raw.caseStudyCoreContent;

  return {
    title: raw.title ?? "",
    uri: raw.uri,
    industrySectors: (raw.industrySectors?.nodes ?? []) as Term[],
    featuredResult: core?.featuredResult ?? null,
    resultMetric: core?.resultMetric ?? null,
    clientName: core?.clientName ?? null,
    engagementLength: core?.engagementLength ?? null,
    scale: core?.scale ?? null,
    heroMetrics: (core?.heroMetrics ?? []).flatMap((m) =>
      m.metric || m.measure ? [{ metric: m.metric ?? "", measure: m.measure ?? "" }] : [],
    ),
    image: normalizeImage(core?.heroImage),
    challenge: core?.challenge ?? null,
    approach: core?.approach ?? null,
    // NOTE: these are caseStudyCoreContent.results → { measure, before, after }.
    // Do not share a card component with serviceProof.results (different type).
    results: (core?.results ?? []).flatMap((r) =>
      r.measure || r.before || r.after
        ? [{ measure: r.measure ?? "", before: r.before ?? "", after: r.after ?? "" }]
        : [],
    ),
    quote: {
      text: core?.clientQuote ?? null,
      name: core?.quoteName ?? null,
      title: core?.quoteTitle ?? null,
      organisation: core?.quoteOrganisation ?? null,
    },
    cta: {
      heading: core?.ctaHeading ?? null,
      description: core?.ctaDescription ?? null,
      label: core?.ctaLabel ?? null,
      url: core?.ctaUrl ?? null,
    },
    relatedServices: (core?.relatedServices?.nodes ?? []).flatMap((n) =>
      n.uri ? [{ title: n.title ?? "", uri: n.uri }] : [],
    ),
  };
}

/* ------------------------------------------------------------------ */
/* Solution / pillar                                                   */
/* ------------------------------------------------------------------ */

import type { Solution } from "./types";

type RawSolution = {
  title: string | null;
  uri: string | null;
  solutionContent: {
    icon: Parameters<typeof normalizeImage>[0];
    pillarLabel: string | null;
    problemStatement: string | null;
    services: { service: string | null }[] | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
  } | null;
};

export function normalizeSolution(raw: RawSolution | null): Solution | null {
  if (!raw?.uri) return null;
  const content = raw.solutionContent;

  return {
    title: raw.title ?? "",
    uri: raw.uri,
    icon: normalizeImage(content?.icon),
    pillarLabel: content?.pillarLabel ?? null,
    problemStatement: content?.problemStatement ?? null,
    // Handover §3: plain text repeater (not a relationship) — no page links.
    services: (content?.services ?? []).flatMap((s) =>
      s.service ? [s.service] : [],
    ),
    cta: { label: content?.ctaLabel ?? null, url: content?.ctaUrl ?? null },
  };
}

/* ------------------------------------------------------------------ */
/* Industry                                                            */
/* ------------------------------------------------------------------ */

import type { Industry } from "./types";

type RawIndustry = {
  title: string | null;
  uri: string | null;
  industryCoreContent: {
    industryIntro: string | null;
    heroImage: Parameters<typeof normalizeImage>[0];
    ctaLabel: string | null;
    ctaUrl: string | null;
    procurementItems: { itemTitle: string | null; itemDescription: string | null }[] | null;
    sectorServices:
      | { service: { nodes: { title: string | null; uri: string | null }[] } | null; serviceDescription: string | null }[]
      | null;
    securityFaqs: { question: string | null; answer: string | null }[] | null;
    ctaHeading: string | null;
    ctaDescription: string | null;
    proofMetric: string | null;
    proofPoint: string | null;
  } | null;
};

export function normalizeIndustry(raw: RawIndustry | null): Industry | null {
  if (!raw?.uri) return null;
  const core = raw.industryCoreContent;

  return {
    title: raw.title ?? "",
    uri: raw.uri,
    intro: core?.industryIntro ?? null,
    image: normalizeImage(core?.heroImage),
    cta: { label: core?.ctaLabel ?? null, url: core?.ctaUrl ?? null },
    procurementItems: (core?.procurementItems ?? []).flatMap((p) =>
      p.itemTitle || p.itemDescription
        ? [{ title: p.itemTitle ?? "", description: p.itemDescription ?? "" }]
        : [],
    ),
    sectorServices: (core?.sectorServices ?? []).map((s) => ({
      services: (s.service?.nodes ?? []).flatMap((n) =>
        n.uri ? [{ title: n.title ?? "", uri: n.uri }] : [],
      ),
      description: s.serviceDescription ?? null,
    })),
    faqs: (core?.securityFaqs ?? []) as ServiceFaq[],
    ctaBand: {
      heading: core?.ctaHeading ?? null,
      description: core?.ctaDescription ?? null,
    },
    proof: { metric: core?.proofMetric ?? null, point: core?.proofPoint ?? null },
  };
}

/* ------------------------------------------------------------------ */
/* Client                                                              */
/* ------------------------------------------------------------------ */

import type { Client } from "./types";

type RawClient = {
  id: string | null;
  databaseId: number | null;
  slug: string | null;
  title: string | null;
  clientContent: {
    clientName: string | null;
    clientLogo: Parameters<typeof normalizeImage>[0];
  } | null;
};

export function normalizeClient(raw: RawClient | null): Client | null {
  if (!raw) return null;
  return {
    id: raw.id ?? "",
    databaseId: raw.databaseId ?? 0,
    slug: raw.slug ?? "",
    name: raw.clientContent?.clientName ?? raw.title ?? "",
    logo: normalizeImage(raw.clientContent?.clientLogo),
  };
}
