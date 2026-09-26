import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Same default as lib/wp/client.ts — the CMS host that serves media via
// WPGraphQL `sourceUrl` fields, which next/image refuses to load unless
// its hostname is explicitly allow-listed here.
const wpGraphqlEndpoint =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
  "https://green-tarsier-764009.hostingersite.com/graphql";
const wpHostname = new URL(wpGraphqlEndpoint).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: wpHostname }],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
