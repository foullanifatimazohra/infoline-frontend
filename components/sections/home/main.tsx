import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function Main() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div
        className="pointer-events-none absolute -left-40 -top-[220px] h-[820px] w-[820px] animate-[il-drift_18s_ease-in-out_infinite] rounded-full blur-[24px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(28,151,212,.30), rgba(28,151,212,0) 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[320px] right-[12%] h-[680px] w-[680px] animate-[il-drift_24s_ease-in-out_infinite] rounded-full blur-[30px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,188,212,.14), rgba(0,188,212,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto grid min-h-165 max-w-340 items-center gap-16 px-6 md:px-12 lg:grid-cols-[1.06fr_.94fr]">
        <div className="flex flex-col items-start gap-0 py-16 lg:py-26">
          <div className="mb-8.5 flex items-center gap-3.5">
            <span className="block h-px w-8.5 bg-brandblue-500" />
            <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
              Hero — one message, one primary action
            </span>
          </div>

          <h1 className="heading-hero-bold m-0 max-w-[19ch] text-[44px] font-bold leading-[1.06] tracking-[-.033em] text-white sm:text-[52px] lg:text-[66px]">
            Outsourced customer experience and IT operations for Oman&apos;s{" "}
            {/* <span className="text-lightblue-300">institutions</span>. */}
          </h1>

          <p className="mt-7.5 max-w-[52ch] text-[17.5px] leading-[1.7] text-slate-200">
            ISO 9001:2015 and COPC certified. Three pillars — customer
            experience and BPO, technology and enterprise solutions, people and
            finance outsourcing — run as one contracted operation.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-3.5">
            <Button className="inline-flex items-center gap-3 rounded-xs bg-brandblue-500 px-8.5 py-4.75 text-[13px] font-semibold uppercase tracking-[0.11em] text-white shadow-[0_14px_40px_-16px_rgba(28,151,212,.95)] transition-[background,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-brandblue-600 hover:shadow-[0_22px_52px_-18px_rgba(28,151,212,1)]">
              Talk to an Expert
            </Button>
            <Link
              href="#solutions"
              className="inline-flex items-center gap-3 rounded-xs border border-white/18 px-7.5 py-4.75 text-[13px] font-semibold uppercase tracking-[0.11em] text-slate-100 transition-[border-color,color,background] duration-300 hover:border-white/[.42] hover:bg-white/[.04] hover:text-white"
            >
              Explore Solutions
            </Link>
          </div>

          <Button className="mt-6.5 font-mono text-[13px] leading-[1.6] text-slate-500">
            We respond within 1 business day.
          </Button>
        </div>

        <div className="relative -mb-px h-[420px] sm:h-[500px] lg:h-[560px]">
          <div className="absolute inset-0 border border-white/[.1]" />
          <div className="absolute inset-3.5 flex items-center justify-center bg-slate-800/60 text-center text-sm text-slate-400">
            Hero photograph — Infoline delivery floor, Muscat
          </div>
          <div className="absolute -left-11 bottom-13 max-w-[262px] bg-white px-6.5 py-5.5 shadow-[0_30px_60px_-28px_rgba(0,0,0,.55)]">
            <p className="m-0 font-mono text-[30px] font-semibold leading-none tracking-[-.02em] text-brandblue-600">
              {/* <CountUp value="2.4M" flagged /> */}
            </p>
            <p className="mt-3 text-[13px] leading-[1.6] text-slate-600">
              customer contacts handled a year across voice, chat and digital
              care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
