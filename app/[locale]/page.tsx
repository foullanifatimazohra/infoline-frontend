import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getLocale } from "next-intl/server";
import { getQueryClient } from "@/providers/query-client/get-query-client";
import {
  prefetchClients,
  prefetchIndustries,
  prefetchSolutions,
  type WpLocale,
} from "@/lib/wp";
import Industries from "@/components/sections/home/industries";
import Insights from "@/components/sections/home/insights";
import Main from "@/components/sections/home/main";
import Options from "@/components/sections/home/options";
import Partners from "@/components/sections/home/partners";
import PartnersLogos from "@/components/sections/home/partners-logos";
import Solutions from "@/components/sections/home/solutions";
import WhatChanges from "@/components/sections/home/what-changes";
import WhyInfoline from "@/components/sections/home/why-infoline";

export default async function HomePage() {
  // CMS content is locale-aware (handover §7); Arabic maps to the WPML `ar` tree.
  const locale: WpLocale = (await getLocale()) === "ar" ? "ar" : "en";
  const queryClient = getQueryClient();

  // Prefetch the three CMS-backed sections in parallel. If the CMS is down the
  // page still renders — the sections fall back to the designed locale content.
  await Promise.allSettled([
    prefetchClients(queryClient, locale),
    prefetchSolutions(queryClient, locale),
    prefetchIndustries(queryClient, locale),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="overflow-x-clip">
        <Main />
        <PartnersLogos />
        <WhyInfoline />
        <Solutions />
        <Industries />
        <WhatChanges />
        <Partners />
        <Options />
        <Insights />
      </main>
    </HydrationBoundary>
  );
}
