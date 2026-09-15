import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/case-studies/hero";
import Chapters from "@/components/sections/case-studies/chapters";
import Cta from "@/components/sections/case-studies/cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CaseStudiesPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.titleLead")} ${t("hero.titleAccent")}`,
    description: t("hero.description"),
  };
}

export default function CaseStudiesPage() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Chapters />
      <Cta />
    </main>
  );
}
