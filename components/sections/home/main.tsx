import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Main() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="relative mx-auto grid min-h-165 max-w-340 items-center gap-16 px-6 md:px-12 lg:grid-cols-[1.2fr_.80fr]">
        <div className="flex flex-col items-start gap-0 py-16 lg:py-26">
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

        <div className="relative -mb-px h-[420px] ">
          <div className="absolute inset-0 border border-white/[.1]" />
          <div className="absolute inset-3.5 flex items-center justify-center bg-slate-800/60 text-center text-sm text-slate-400">
            Hero photograph
          </div>
          {/* <div className="absolute -left-11 bottom-13 max-w-[262px] bg-white px-6.5 py-5.5 shadow-[0_30px_60px_-28px_rgba(0,0,0,.55)]">
            <p className="m-0 font-mono text-[30px] font-semibold leading-none tracking-[-.02em] text-brandblue-600">
             <CountUp value="2.4M" flagged /> 
            </p>
            <p className="mt-3 text-[13px] leading-[1.6] text-slate-600">
              customer contacts handled a year across voice, chat and digital
              care.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
