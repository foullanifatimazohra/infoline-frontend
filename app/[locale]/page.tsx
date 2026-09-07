import Industries from "@/components/sections/home/industries";
import Insights from "@/components/sections/home/insights";
import Main from "@/components/sections/home/main";
import Options from "@/components/sections/home/options";
import Partners from "@/components/sections/home/partners";
import PartnersLogos from "@/components/sections/home/partners-logos";
import Solutions from "@/components/sections/home/solutions";
import WhatChanges from "@/components/sections/home/what-changes";
import WhyInfoline from "@/components/sections/home/why-infoline";
export default function HomePage() {
  return (
    <main>
      <Main />
      <PartnersLogos />
      <WhyInfoline />
      <Solutions />
      <Industries />
      <WhatChanges />
      <Partners />
      <Options />
      <Insights />
    </main>
  );
}
