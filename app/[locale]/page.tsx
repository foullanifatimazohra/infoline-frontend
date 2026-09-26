import Industries from "@/components/sections/home/industries";
import Insights from "@/components/sections/home/insights";
import Main from "@/components/sections/home/main";
import Options from "@/components/sections/home/options";
import Partners from "@/components/sections/home/partners";
import PartnersLogos from "@/components/sections/home/partners-logos";
import Solutions from "@/components/sections/home/solutions";
import WhatChanges from "@/components/sections/home/what-changes";
import WhyInfoline from "@/components/sections/home/why-infoline";
import {
  getCaseStudies,
  getClients,
  getIndustries,
  getSolutions,
} from "@/lib/wp/api";
import { fetchLocalized } from "@/lib/wp/localized";

/** Derive a short, URL-safe id from a WP uri, e.g.
 *  "/industries/telecom-technology/" → "telecom-technology". */
function slugFromUri(uri: string): string {
  return uri.replace(/^\/industries\//, "").replace(/\/$/, "");
}

// Local fallbacks for when the CMS entry has no image set yet — next/image
// errors on an empty `src`, so these stand in rather than an empty string.
const INDUSTRY_IMAGE_FALLBACK = "/assets/industries/i1.svg";
const INSIGHT_IMAGE_FALLBACK = "/assets/insights/insights.svg";

/** Map an API Solution to the props the home Solutions section expects. */
function toSolutionItem(s: {
  title: string;
  uri: string;
  icon: { src: string } | null;
  problemStatement: string | null;
}) {
  return {
    icon: s.icon?.src ?? null,
    title: s.title,
    description: s.problemStatement ?? "",
    href: s.uri,
  };
}

/** Map an API Industry to the props the home Industries section expects. */
function toIndustryItem(i: {
  title: string;
  uri: string;
  intro: string | null;
  image: { src: string } | null;
}) {
  return {
    id: slugFromUri(i.uri),
    title: i.title,
    image: i.image?.src ?? INDUSTRY_IMAGE_FALLBACK,
    summary: i.intro ?? "",
  };
}

/** Map an API CaseStudy to the props the home Insights section expects. */
function toInsightItem(cs: {
  title: string;
  uri: string;
  image: { src: string } | null;
  industrySectors: { name: string }[] | null;
}) {
  const category = cs.industrySectors?.[0]?.name ?? cs.title ?? "Insights";
  return {
    category: category,
    title: cs.title,
    image: cs.image?.src ?? INSIGHT_IMAGE_FALLBACK,
    href: cs.uri,
  };
}

/** Map an API Client to the props the home PartnersLogos section expects. */
function toLogoItem(c: { name: string; logo: { src: string } | null }) {
  return {
    src: c.logo?.src ?? "",
    alt: c.name ?? "",
    width: 140,
    height: 48,
  };
}

export default async function HomePage() {
  // Pull every content block that lives on this home page from the WPGraphQL
  // backend so the site is driven by the CMS instead of static locale JSON.
  const [solutions, industries, caseStudies, clients] = await Promise.all([
    fetchLocalized((l) => getSolutions(l)),
    fetchLocalized((l) => getIndustries(l)),
    fetchLocalized((l) => getCaseStudies(l)),
    fetchLocalized((l) => getClients(l)),
  ]);

  const solutionItems = solutions.items.map(toSolutionItem);
  const industryItems = industries.items.map(toIndustryItem);
  const insightItems = caseStudies.items.map(toInsightItem);
  const logoItems = clients.map(toLogoItem);

  return (
    <main className="overflow-x-clip">
      <Main />
      <PartnersLogos logos={logoItems} />
      <WhyInfoline />
      <Solutions items={solutionItems} />
      <Industries items={industryItems} />
      <WhatChanges />
      <Partners />
      <Options />
      <Insights items={insightItems} />
    </main>
  );
}
