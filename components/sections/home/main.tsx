import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Proof from "./proof";
import HeroVisual from "./hero-visual";

export default function Main() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:px-12 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col items-start gap-0 py-14 lg:py-20">
          <div className="mb-8.5 flex items-center gap-3.5">
            <span className="block h-px w-8.5 bg-brandblue-500" />
            <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
              Operating in Oman since 2004
            </span>
          </div>

          <h1 className="max-w-[20ch] text-white text-[48px] font-bold leading-[1.06] tracking-[-.033em]">
            Oman&apos;s trusted partner for{" "}
            <span className="text-lightblue-300">customer operations.</span>
          </h1>

          <p className="mt-7.5 max-w-[60ch] text-[16px] leading-[24px] text-slate-200">
            Trusted CX operations, managed services and technology from Oman,
            built around clear accountability and measurable outcomes.
          </p>

          <div className="mt-11 flex max-md:justify-start flex-wrap items-center gap-3.5">
            <Button
              href="/"
              icon={ArrowRight}
              size="large"
              iconPosition="right"
            >
              Talk to an Expert
            </Button>
            <Button variant="secondary" size="large" href="/solutions">
              Explore Solutions
            </Button>
          </div>

          <p className="mt-6.5 font-mono text-[13px] leading-[1.6] text-slate-500">
            We respond within 1 business day.
          </p>
        </div>

        <HeroVisual />
      </div>
      <Proof />
    </section>
  );
}
