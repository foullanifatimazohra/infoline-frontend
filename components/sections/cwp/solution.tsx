import { ArrowRight } from "lucide-react";
import { MaskText, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import Button from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import CtaBand, { safeInternalHref } from "./cta-band";
import type { Solution } from "@/lib/wp";

/**
 * Solution (pillar) detail template — rendered from solutionContent.
 * The pillar's service list is a plain text repeater in the CMS, so cards
 * link to /services/<slugified text> — a heuristic that matches the current
 * seeds; real relationship links are blocked upstream (handover §3).
 */
export default function SolutionTemplate({ solution }: { solution: Solution }) {
  const c = solution;

  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="bg-[#0a1014] py-20 text-white lg:py-28">
        <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
          <Stagger as="div" className="max-w-[52ch]" stagger={0.14}>
            <StaggerItem>
              {c.pillarLabel ? (
                <p className="overline-sm-medium uppercase tracking-[0.28em] text-slate-300">
                  {c.pillarLabel}
                </p>
              ) : null}
              <MaskText
                as="h1"
                className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl"
                segments={[{ text: c.title }]}
                amount={0.5}
                duration={0.8}
              />
            </StaggerItem>
            {c.problemStatement ? (
              <StaggerItem
                as="p"
                className="body-xl-regular mt-6 leading-relaxed text-slate-300"
              >
                {c.problemStatement}
              </StaggerItem>
            ) : null}
            {c.cta.label ? (
              <StaggerItem className="mt-8">
                <Button href={safeInternalHref(c.cta.url)} iconPosition="right">
                  {c.cta.label}
                </Button>
              </StaggerItem>
            ) : null}
          </Stagger>
        </div>
      </section>

      {/* Services in this pillar — slugified text links */}
      {c.services.length > 0 ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                Services in this pillar
              </h2>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-4xl grid grid-cols-1 gap-4 md:grid-cols-2"
              stagger={0.1}
            >
              {c.services.map((name) => {
                const slug = name
                  .toLowerCase()
                  .replace(/&/g, "and")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                return (
                  <StaggerItem as="li" key={name}>
                    <Link
                      href={`/services/${slug}`}
                      className="group flex items-center justify-between gap-6 rounded-2xl border border-slate-200 p-6 transition-colors hover:border-brandblue-500/60"
                    >
                      <span className="heading-md-semibold text-slate-900 group-hover:text-brandblue-600">
                        {name}
                      </span>
                      <ArrowRight className="size-5 shrink-0 text-brandblue-500 rtl:rotate-180" />
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      ) : null}

      <CtaBand
        cta={{
          heading: null,
          description: null,
          label: c.cta.label,
          url: c.cta.url,
        }}
      />
    </main>
  );
}
