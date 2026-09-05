import Industries from "@/components/sections/home/industries";
import Main from "@/components/sections/home/main";
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
    </main>
  );
}
