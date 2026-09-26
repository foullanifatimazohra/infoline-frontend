import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/careers/hero";
import Capability from "@/components/sections/careers/capability";
import Learn from "@/components/sections/careers/learn";
import Traits from "@/components/sections/careers/traits";
import Vacancies from "@/components/sections/careers/vacancies";
import Apply from "@/components/sections/careers/apply";
import Cta from "@/components/sections/careers/cta";
import { getCareers } from "@/lib/wp/api";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CareersPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.title")}`,
    description: t("hero.description"),
  };
}

export default async function CareersPage() {
  const { items: careers } = await getCareers("en");

  return (
    <main className="overflow-x-clip">
      <Hero />
      <Capability />
      <Learn />
      <Traits />
      <Vacancies careers={careers} />
      <Apply />
      <Cta />
    </main>
  );
}
