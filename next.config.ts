import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // WPGraphQL media is served from the CMS host — allow next/image optimization.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "green-tarsier-764009.hostingersite.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
