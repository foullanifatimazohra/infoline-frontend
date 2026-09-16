import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/query-client/get-query-client";
import { prefetchService, type WpLocale } from "@/lib/wp";
import ServiceTemplate from "@/components/sections/cwp/service";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const wpLocale: WpLocale = locale === "ar" ? "ar" : "en";
  const service = await prefetchService(
    getQueryClient(),
    `/services/${slug}/`,
    wpLocale,
  );

  return {
    title: service?.title ?? "Service",
    description: service?.problemStatement ?? undefined,
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const wpLocale = locale === "ar" ? "ar" : "en";

  const queryClient = getQueryClient();
  const service = await prefetchService(queryClient, `/services/${slug}/`, wpLocale);

  if (!service) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServiceTemplate service={service} />
    </HydrationBoundary>
  );
}
