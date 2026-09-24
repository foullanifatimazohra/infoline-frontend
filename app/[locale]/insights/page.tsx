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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("InsightsPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.titleLead")} ${t("hero.titleAccent")}`,
    description: t("hero.description"),
  };
}

export default async function InsightsPage() {
  const t = await getTranslations();
  const insights = t.raw("Insights.items") as Insight[];

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
