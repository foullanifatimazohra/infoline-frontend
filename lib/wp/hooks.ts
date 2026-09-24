"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  getService,
  getServices,
  getCaseStudy,
  getCaseStudies,
  getSolution,
  getSolutions,
  getIndustry,
  getIndustries,
  getClients,
  getCareers,
  getHubs,
  type WpLocale,
} from "./api";
import { wpKeys } from "./keys";
import type {
  CaseStudy,
  Client,
  Hubs,
  Industry,
  Service,
  Solution,
} from "./types";

/**
 * Client-side hooks. Every hook derives the locale from next-intl automatically
 * (handover §7: locale-aware even while English-only). For SSR/RSC prefetching
 * call the `get*` fetchers directly — see lib/wp/server.ts.
 *
 * Cache shape equals fetcher shape: list hooks return the `Paginated<T>`
 * envelope (`data.items` in components) so RSC-prefetched data and client-side
 * refetches always match. Single fetchers may resolve `null` (uri not found).
 */

/** The list shape used by `getCaseStudies` (a pick of CaseStudy). */
export type CaseStudyListItem = Pick<
  CaseStudy,
  | "title"
  | "uri"
  | "industrySectors"
  | "featuredResult"
  | "resultMetric"
  | "heroMetrics"
  | "image"
>;

type WpQueryOptions<T> = Omit<
  UseQueryOptions<T, Error, T, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

function useWpLocale(): WpLocale {
  const locale = useLocale();
  return locale === "ar" ? "ar" : "en";
}

export function useService(uri: string, options?: WpQueryOptions<Service | null>) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.service(uri, locale),
    queryFn: () => getService(uri, locale),
    enabled: options?.enabled ?? Boolean(uri),
  });
}

export function useServices(
  options?: WpQueryOptions<ReturnType<typeof getServices>>,
) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.services(locale),
    queryFn: () => getServices(locale),
  });
}

export function useCaseStudy(
  uri: string,
  options?: WpQueryOptions<CaseStudy | null>,
) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.caseStudy(uri, locale),
    queryFn: () => getCaseStudy(uri, locale),
    enabled: options?.enabled ?? Boolean(uri),
  });
}

export function useCaseStudies(
  sectorSlug?: string,
  options?: WpQueryOptions<Awaited<ReturnType<typeof getCaseStudies>>>,
) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.caseStudies(locale, sectorSlug),
    queryFn: () => getCaseStudies(locale, sectorSlug),
  });
}

export function useSolution(uri: string, options?: WpQueryOptions<Solution | null>) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.solution(uri, locale),
    queryFn: () => getSolution(uri, locale),
    enabled: options?.enabled ?? Boolean(uri),
  });
}

export function useSolutions(
  options?: WpQueryOptions<Awaited<ReturnType<typeof getSolutions>>>,
) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.solutions(locale),
    queryFn: () => getSolutions(locale),
  });
}

export function useIndustry(uri: string, options?: WpQueryOptions<Industry | null>) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.industry(uri, locale),
    queryFn: () => getIndustry(uri, locale),
    enabled: options?.enabled ?? Boolean(uri),
  });
}

export function useIndustries(
  options?: WpQueryOptions<Awaited<ReturnType<typeof getIndustries>>>,
) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.industries(locale),
    queryFn: () => getIndustries(locale),
  });
}

export function useClients(options?: WpQueryOptions<Client[]>) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.clients(locale),
    queryFn: () => getClients(locale),
  });
}

export function useCareers(
  options?: WpQueryOptions<Awaited<ReturnType<typeof getCareers>>>,
) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.careers(locale),
    queryFn: () => getCareers(locale),
  });
}

export function useHubs(options?: WpQueryOptions<Hubs>) {
  const locale = useWpLocale();
  return useQuery({
    ...options,
    queryKey: wpKeys.hubs(locale),
    queryFn: () => getHubs(),
  });
}
