import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/careers/hero";
import Capability from "@/components/sections/careers/capability";
import Learn from "@/components/sections/careers/learn";
import Traits from "@/components/sections/careers/traits";
import Vacancies from "@/components/sections/careers/vacancies";
import Cta from "@/components/sections/careers/cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CareersPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.title")}`,
    description: t("hero.description"),
  };
}

export default function CareersPage() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Capability />
      <Learn />
      <Traits />
      <Vacancies />
      <Cta />
    </main>
  );
}
