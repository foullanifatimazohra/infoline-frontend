import Hero from "@/components/sections/industries/hero";
import Differ from "@/components/sections/industries/differ";
import Sectors from "@/components/sections/industries/sectors";
import Cta from "@/components/sections/industries/cta";
import Faq from "@/components/sections/industries/faq";
import Clients from "@/components/sections/industries/clients";

export default function IndustriesPage() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Differ />
      <Sectors />
      <Cta />
      <Faq />
      <Clients />
    </main>
  );
}
