/**
 * Frontend-facing types for the WPGraphQL content models.
 *
 * Shapes here are the *normalized* contract: ACF nullability (handover §3) is
 * resolved in `normalize.ts` — repeaters/relationships become arrays, missing
 * optionals become `null`. UI code never sees raw WPGraphQL shapes.
 *
 * Field/type names are frozen per handover §8; changes must be announced.
 */

export type ImageField = { src: string; alt: string };

export type Cta = {
  label: string | null;
  url: string | null;
};

export type CtaBand = Cta & { description: string | null };

/** A full CTA panel: heading + description + button (serviceProof.cta, caseStudy.cta). */
export type CtaPanel = {
  heading: string | null;
  description: string | null;
  label: string | null;
  url: string | null;
};

export type Term = { name: string; slug: string };

/** Minimal link pair for relationship fields (`relatedServices`, etc.). */
export type Ref = { title: string; uri: string };

/* ------------------------------------------------------------------ */
/* Service — serviceCoreContent + serviceProof                         */
/* ------------------------------------------------------------------ */

export type ServiceApproachStep = { title: string; description: string };
export type ServiceFaq = { question: string; answer: string };

/**
 * serviceProof.results — { result, metricName, clientDescription }.
 * Deliberately NOT the same type as CaseStudyResult (handover §3).
 */
export type ServiceResult = {
  result: string;
  metricName: string;
  clientDescription: string;
};

export type Service = {
  title: string;
  uri: string;
  problemStatement: string | null;
  image: ImageField | null;
  expertCta: Cta;
  faqCta: Cta;
  approachSteps: ServiceApproachStep[];
  capabilities: string[];
  proof: {
    results: ServiceResult[];
    relatedCaseStudies: Ref[];
    faqs: ServiceFaq[];
    cta: CtaPanel;
  };
  pillars: Term[];
  sectors: Term[];
};

export type ServiceListItem = {
  title: string;
  uri: string;
  pillars: Term[];
  problemStatement: string | null;
};

/* ------------------------------------------------------------------ */
/* Case study — caseStudyCoreContent                                   */
/* ------------------------------------------------------------------ */

export type CaseStudyHeroMetric = { metric: string; measure: string };

/**
 * caseStudyCoreContent.results — { measure, before, after }.
 * Deliberately NOT the same type as ServiceResult (handover §3).
 */
export type CaseStudyResult = { measure: string; before: string; after: string };

export type CaseStudy = {
  title: string;
  uri: string;
  industrySectors: Term[];
  featuredResult: string | null;
  resultMetric: string | null;
  clientName: string | null;
  engagementLength: string | null;
  scale: string | null;
  heroMetrics: CaseStudyHeroMetric[];
  image: ImageField | null;
  challenge: string | null;
  approach: string | null;
  results: CaseStudyResult[];
  quote: {
    text: string | null;
    name: string | null;
    title: string | null;
    organisation: string | null;
  };
  cta: CtaPanel;
  relatedServices: Ref[];
};

/* ------------------------------------------------------------------ */
/* Solution / pillar — solutionContent                                 */
/* ------------------------------------------------------------------ */

export type Solution = {
  title: string;
  uri: string;
  icon: ImageField | null;
  pillarLabel: string | null;
  problemStatement: string | null;
  /** Plain text repeater, NOT a relationship — entries have no page links yet. */
  services: string[];
  cta: Cta;
};

/* ------------------------------------------------------------------ */
/* Industry — industryCoreContent                                      */
/* ------------------------------------------------------------------ */

export type Industry = {
  title: string;
  uri: string;
  intro: string | null;
  image: ImageField | null;
  cta: Cta;
  procurementItems: { title: string; description: string }[];
  sectorServices: {
    services: Ref[];
    description: string | null;
  }[];
  faqs: ServiceFaq[];
  ctaBand: {
    heading: string | null;
    description: string | null;
  };
  proof: { metric: string | null; point: string | null };
};

/* ------------------------------------------------------------------ */
/* Client — clientContent                                              */
/* ------------------------------------------------------------------ */

export type Client = {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  logo: ImageField | null;
};

/* ------------------------------------------------------------------ */
/* Career                                                              */
/* ------------------------------------------------------------------ */

/**
 * Careers post type. The model is minimal today — standard WP fields only
 * (title/slug/date/language; no ACF group yet, handover §7 "Careers fields:
 * not ready"). Discipline/location columns come from frontend defaults until
 * the CMS adds the field group; extend this type then.
 */
export type Career = {
  slug: string;
  title: string;
  /** Publication date (ISO) — usable for ordering roles by recency. */
  date: string | null;
  /** WP uri, e.g. "/careers/customer-experience-specialist/". */
  uri: string;
};

/* ------------------------------------------------------------------ */
/* Hubs / options pages                                                */
/* ------------------------------------------------------------------ */

export type Hubs = {
  caseStudies: {
    heading: string;
    intro: string;
    ctaHeading: string | null;
  } & CtaBand;
  industries: {
    heading: string;
    intro: string;
    ctaHeading: string | null;
  } & CtaBand;
  solutions: { heading: string; intro: string };
};
