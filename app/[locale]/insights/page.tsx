import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/insights/hero";
import Callout from "@/components/sections/insights/callout";
import Themes from "@/components/sections/insights/themes";
import Proof from "@/components/sections/insights/proof";
import Formats from "@/components/sections/insights/formats";
import FeaturedProof from "@/components/sections/insights/featured-proof";
import Cta from "@/components/sections/insights/cta";
import type { Insight } from "@/lib/insights";
import { getBlogPosts } from "@/lib/wp/api";
import { fetchLocalized } from "@/lib/wp/localized";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("InsightsPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.titleLead")} ${t("hero.titleAccent")}`,
    description: t("hero.description"),
  };
}

export default async function InsightsPage() {
  const posts = await fetchLocalized((l) => getBlogPosts(l, 3));
  // Real blog posts, not the static `Insights.items` locale JSON — that data
  // hardcoded /blog/<slug> links to posts that don't exist in the CMS.
  const insights: Insight[] = posts.map((p) => ({
    category: p.category || "Insights",
    title: p.title,
    image: p.image,
    href: `/blog/${p.slug}`,
  }));

  return (
    <main className="overflow-x-clip">
      <Hero />
      <Callout />
      <Themes />
      <Proof />
      <Formats insights={insights} />
      <FeaturedProof />
      <Cta />
    </main>
  );
}
