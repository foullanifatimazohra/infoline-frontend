import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/query-client/get-query-client";
import { prefetchSolution, type WpLocale } from "@/lib/wp";
import SolutionTemplate from "@/components/sections/cwp/solution";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const wpLocale: WpLocale = locale === "ar" ? "ar" : "en";
  const solution = await prefetchSolution(
    getQueryClient(),
    `/solutions/${slug}/`,
    wpLocale,
  );

  return {
    title: solution?.title ?? "Solution",
    description: solution?.problemStatement ?? undefined,
  };
}

export default async function SolutionPage({ params }: Props) {
  const { locale, slug } = await params;
  const wpLocale = locale === "ar" ? "ar" : "en";

  const queryClient = getQueryClient();
  const solution = await prefetchSolution(
    queryClient,
    `/solutions/${slug}/`,
    wpLocale,
  );

  if (!solution) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SolutionTemplate solution={solution} />
    </HydrationBoundary>
  );
}
