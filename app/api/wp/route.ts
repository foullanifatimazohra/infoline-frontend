import { NextRequest, NextResponse } from "next/server";
import { WP_GRAPHQL_ENDPOINT } from "@/lib/wp/client";

/**
 * Same-origin proxy for WPGraphQL. The handover (§9) flags CORS as not yet
 * verified from third-party origins — client-side hooks can go through this
 * route instead of hitting the CMS directly if that ever bites. Server
 * components keep fetching the endpoint directly (no CORS applies there).
 *
 * Skipped by the next-intl middleware via the /api matcher exclusion.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  try {
    const upstream = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // Next.js data cache on the edge/node runtime:
      next: { revalidate: 300 },
    });

    const json = await upstream.text();
    return new NextResponse(json, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return NextResponse.json(
      { errors: [{ message: String(error) }] },
      { status: 502 },
    );
  }
}
