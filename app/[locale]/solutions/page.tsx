import Hero from "@/components/sections/solutions/hero";
import Catalogue from "@/components/sections/solutions/catalogue";
import PartnerCta from "@/components/sections/solutions/partner-cta";
import Faq from "@/components/sections/solutions/faq";
import Clients from "@/components/sections/solutions/clients";

export default function SolutionsPage() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Catalogue />
      <PartnerCta />
      <Faq />
      <Clients />
    </main>
  );
}
