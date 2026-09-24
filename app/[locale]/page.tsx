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
  getServices,
} from "@/lib/wp/api";

/** Derive a short, URL-safe id from a WP uri, e.g.
 *  "/industries/telecom-technology/" → "telecom-technology". */
function slugFromUri(uri: string): string {
  return uri.replace(/^\/industries\//, "").replace(/\/$/, "");
}

/** Map an API Solution to the props the home Solutions section expects. */
function toSolutionItem(s: { title: string; uri: string; icon: { src: string } | null; problemStatement: string | null }) {
  return {
    icon: s.icon?.src ?? null,
    title: s.title,
    description: s.problemStatement ?? "",
    href: s.uri,
  };
}

/** Map an API Industry to the props the home Industries section expects. */
function toIndustryItem(i: { title: string; uri: string; intro: string | null; image: { src: string } | null }) {
  return {
    id: slugFromUri(i.uri),
    title: i.title,
    image: i.image?.src ?? "",
    summary: i.intro ?? "",
  };
}

/** Map an API CaseStudy to the props the home Insights section expects. */
function toInsightItem(cs: { title: string; uri: string; image: { src: string } | null; industrySectors: { name: string }[] | null }) {
  const category =
    cs.industrySectors?.[0]?.name ?? cs.title ?? "Insights";
  return {
    category: category,
    title: cs.title,
    image: cs.image?.src ?? "",
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
  const [services, solutions, industries, caseStudies, clients] = await Promise.all([
    getServices("en"),
    getSolutions("en"),
    getIndustries("en"),
    getCaseStudies("en"),
    getClients("en"),
  ]);

  // ------------------------------------------------ Console logs
  // Print everything we fetched so it can be checked directly in the DevTools
  // console while developing and debugging.
  console.log("=== HOME PAGE — WPGraphQL fetched content ===");
  console.log("[services]", services);
  console.log("[solutions]", solutions);
  console.log("[industries]", industries);
  console.log("[caseStudies]", caseStudies);
  console.log("[clients]", clients);

  const solutionItems = services.items.map((s) => toSolutionItem({ title: s.title, uri: s.uri, problemStatement: s.problemStatement } as any));
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
