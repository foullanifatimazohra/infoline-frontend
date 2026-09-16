/**
 * WPGraphQL endpoint + fetch wrapper.
 *
 * Handover notes baked in here:
 * - No auth for published content; plain POST JSON.
 * - `extensions.debug` in responses is dev-only noise — ignored.
 * - Nothing is required in the CMS: every ACF field can come back null, so
 *   normalization to safe shapes happens in `normalize.ts`, never in UI code.
 * - Fetches are cached on the server (RSC / React Query prefetch) and plain
 *   browser fetches on the client. If the CMS ever sends CORS errors for
 *   client-side requests (handover §9), route them through `/api/wp` —
 *   see `app/api/wp/route.ts`.
 */

export const WP_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
  "https://green-tarsier-764009.hostingersite.com/graphql";

/** Seconds a CMS response stays fresh in the Next.js data cache (server-side). */
export const WP_REVALIDATE = 300;

type WpError = { message: string };

type WpResponse<T> = {
  data?: T;
  errors?: WpError[];
};

export async function wpFetch<TData>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = WP_REVALIDATE,
): Promise<TData> {
  const isServer = typeof window === "undefined";

  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Server fetches go through the Next.js data cache; browser fetches are
    // handled by React Query's cache instead.
    ...(isServer ? { cache: "force-cache", next: { revalidate } } : {}),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as WpResponse<TData>;

  if (json.errors?.length) {
    throw new Error(
      `WPGraphQL error: ${json.errors.map((e) => e.message).join(" · ")}`,
    );
  }
  if (json.data === undefined || json.data === null) {
    throw new Error("WPGraphQL returned no data");
  }

  return json.data;
}
