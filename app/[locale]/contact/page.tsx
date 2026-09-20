import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/contact/hero";
import RouteCards from "@/components/sections/contact/route-cards";
import TrustStrip from "@/components/sections/contact/trust-strip";
import Form from "@/components/sections/contact/form";
import { RouteProvider } from "@/components/sections/contact/route-context";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ContactPage");

  return {
    title: `${t("hero.eyebrow")} — ${t("hero.titleLead")} ${t("hero.titleAccent")}`,
    description: t("hero.description"),
  };
}

export default async function ContactPage() {
  // Root-scope reads must happen on the server — client `t.raw` across
  // namespaces throws MISSING_MESSAGE in the browser.
  const rootT = await getTranslations();
  const services = rootT.raw("Solutions.items") as { title: string }[];

  return (
    <main className="overflow-x-clip">
      <RouteProvider>
        <Hero />
        <RouteCards />
        <TrustStrip />
        <Form services={services} />
      </RouteProvider>
    </main>
  );
}
