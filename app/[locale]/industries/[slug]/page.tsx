import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/query-client/get-query-client";
import { prefetchIndustry, type WpLocale } from "@/lib/wp";
import IndustryTemplate from "@/components/sections/cwp/industry";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const wpLocale: WpLocale = locale === "ar" ? "ar" : "en";
  const industry = await prefetchIndustry(
    getQueryClient(),
    `/industry/${slug}/`,
    wpLocale,
  );

  return {
    title: industry?.title ?? "Industry",
    description: industry?.intro ?? undefined,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { locale, slug } = await params;
  const wpLocale = locale === "ar" ? "ar" : "en";

  const queryClient = getQueryClient();
  const industry = await prefetchIndustry(queryClient, `/industry/${slug}/`, wpLocale);

  if (!industry) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IndustryTemplate industry={industry} />
    </HydrationBoundary>
  );
}
