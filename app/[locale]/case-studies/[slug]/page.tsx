import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/query-client/get-query-client";
import { prefetchCaseStudy, type WpLocale } from "@/lib/wp";
import CaseStudyTemplate from "@/components/sections/cwp/case-study";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const wpLocale: WpLocale = locale === "ar" ? "ar" : "en";
  const caseStudy = await prefetchCaseStudy(
    getQueryClient(),
    `/case_studies/${slug}/`,
    wpLocale,
  );

  return {
    title: caseStudy?.title ?? "Case study",
    description: caseStudy?.challenge ?? undefined,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  const wpLocale = locale === "ar" ? "ar" : "en";

  const queryClient = getQueryClient();
  const caseStudy = await prefetchCaseStudy(
    queryClient,
    `/case_studies/${slug}/`,
    wpLocale,
  );

  if (!caseStudy) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CaseStudyTemplate caseStudy={caseStudy} />
    </HydrationBoundary>
  );
}
