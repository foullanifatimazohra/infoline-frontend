import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MaskText, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { Link } from "@/i18n/navigation";
import CtaBand from "./cta-band";
import ProofStats from "./proof-stats";
import type { CaseStudy } from "@/lib/wp";

/**
 * Case study detail template — rendered from caseStudyCoreContent.
 * Fully optional-field tolerant (handover §6: "Minimal case study — every
 * field null" must not throw).
 */
export default function CaseStudyTemplate({ caseStudy }: { caseStudy: CaseStudy }) {
  const c = caseStudy;
  const sector = c.industrySectors[0]?.name ?? null;
  const meta = [c.clientName, c.engagementLength, c.scale].filter(Boolean);
  const hasResults = c.results.length > 0;

  return (
    <main className="overflow-x-clip">
      {/* Hero — ink band with featured result */}
      <section className="bg-[#0a1014] py-20 text-white lg:py-28">
        <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
          <Stagger as="div" className="max-w-[56ch]" stagger={0.14}>
            <StaggerItem>
              {sector ? (
                <p className="overline-sm-medium uppercase tracking-[0.28em] text-slate-300">
                  {sector}
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
            {meta.length > 0 ? (
              <StaggerItem className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {meta.map((m) => (
                  <span key={m} className="body-lg-regular text-slate-300">
                    {m}
                  </span>
                ))}
              </StaggerItem>
            ) : null}
            {c.featuredResult ? (
              <StaggerItem className="mt-10">
                <p className="heading-2xl-semibold text-brandblue-400">
                  {c.resultMetric ? `${c.resultMetric}: ` : ""}
                  {c.featuredResult}
                </p>
              </StaggerItem>
            ) : null}
            {c.heroMetrics.length > 0 ? (
              <StaggerItem className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {c.heroMetrics.map((m) => (
                  <span key={m.measure} className="body-lg-regular text-slate-300">
                    <span className="body-xl-semibold text-white">{m.metric}</span>{" "}
                    {m.measure}
                  </span>
                ))}
              </StaggerItem>
            ) : null}
          </Stagger>
        </div>
      </section>

      {/* Hero image — only when the CMS has one */}
      {c.image ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={c.image.src}
                  alt={c.image.alt || c.title}
                  fill
                  sizes="(min-width: 1024px) 1152px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Story: challenge → approach */}
      {c.challenge || c.approach ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-4xl md:grid-cols-2">
              {c.challenge ? (
                <Reveal>
                  <p className="overline-sm-medium mb-sm uppercase tracking-[0.28em] text-slate-400">
                    Challenge
                  </p>
                  <p className="body-xl-regular text-slate-900">{c.challenge}</p>
                </Reveal>
              ) : null}
              {c.approach ? (
                <Reveal>
                  <p className="overline-sm-medium mb-sm uppercase tracking-[0.28em] text-slate-400">
                    Approach
                  </p>
                  <p className="body-xl-regular text-slate-900">{c.approach}</p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Results before/after */}
      {hasResults ? (
        <section className="bg-slate-25 py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">Results</h2>
            </Reveal>
            <div className="mt-4xl">
              <ProofStats
                columns={c.results.length === 2 ? 2 : 3}
                stats={c.results.map((r) => ({
                  value: `${r.before} → ${r.after}`,
                  label: r.measure,
                }))}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Quote */}
      {c.quote.text ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal className="rounded-2xl bg-slate-25 p-10 lg:p-14">
              <blockquote>
                <p className="heading-lg-semibold max-w-[40ch] text-slate-900">
                  “{c.quote.text}”
                </p>
                <footer className="body-lg-regular mt-6 text-slate-600">
                  {c.quote.name}
                  {c.quote.title ? ` — ${c.quote.title}` : ""}
                  {c.quote.organisation ? `, ${c.quote.organisation}` : ""}
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Related services */}
      {c.relatedServices.length > 0 ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                Services used in this engagement
              </h2>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-4xl grid grid-cols-1 gap-4 md:grid-cols-2"
              stagger={0.1}
            >
              {c.relatedServices.map((s) => {
                const slug = s.uri.split("/").filter(Boolean).pop() ?? "";
                return (
                  <StaggerItem as="li" key={s.uri}>
                    <Link
                      href={`/services/${slug}`}
                      className="group flex items-center justify-between gap-6 rounded-2xl border border-slate-200 p-6 transition-colors hover:border-brandblue-500/60"
                    >
                      <span className="heading-md-semibold text-slate-900 group-hover:text-brandblue-600">
                        {s.title}
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

      <CtaBand cta={c.cta} />
    </main>
  );
}
