import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getQueryClient } from "@/providers/query-client/get-query-client";
import { prefetchCareers, type WpLocale } from "@/lib/wp";
import Hero from "@/components/sections/careers/hero";
import Capability from "@/components/sections/careers/capability";
import Learn from "@/components/sections/careers/learn";
import Traits from "@/components/sections/careers/traits";
import Vacancies from "@/components/sections/careers/vacancies";
import Cta from "@/components/sections/careers/cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CareersPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.title")}`,
    description: t("hero.description"),
  };
}

export default async function CareersPage() {
  // Vacancies come live from the CMS `careers` post type, locale-aware.
  const locale: WpLocale = (await getLocale()) === "ar" ? "ar" : "en";
  const queryClient = getQueryClient();

  // If the CMS is down the page still renders — Vacancies falls back to the
  // designed locale roles.
  await Promise.allSettled([prefetchCareers(queryClient, locale)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="overflow-x-clip">
        <Hero />
        <Capability />
        <Learn />
        <Traits />
        <Vacancies />
        <Cta />
      </main>
    </HydrationBoundary>
  );
}
