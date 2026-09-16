import { ArrowRight } from "lucide-react";
import { MaskText, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import Button from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import CtaBand, { safeInternalHref } from "./cta-band";
import ProofStats from "./proof-stats";
import FaqList from "./faq-list";
import type { Service } from "@/lib/wp";

/**
 * Service detail template — rendered from serviceCoreContent + serviceProof.
 * Every block is optional and collapses when the CMS fields are empty
 * (handover §6: "Quality & Analytics — every repeater empty" must not throw).
 */
export default function ServiceTemplate({ service }: { service: Service }) {
  const c = service;
  const hasApproach = c.approachSteps.length > 0;
  const hasCapabilities = c.capabilities.length > 0;
  const hasProof = c.proof.results.length > 0;
  const hasFaqs = c.proof.faqs.length > 0;
  const hasRelated = c.proof.relatedCaseStudies.length > 0;
  const terms = [...c.pillars, ...c.sectors];

  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="bg-[#0a1014] py-20 text-white lg:py-28">
        <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
          <Stagger as="div" className="max-w-[52ch]" stagger={0.14}>
            <StaggerItem>
              {terms.length > 0 ? (
                <p className="overline-sm-medium uppercase tracking-[0.28em] text-slate-300">
                  {terms.map((t) => t.name).join(" · ")}
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
            {c.expertCta.label ? (
              <StaggerItem className="mt-8">
                <Button href={safeInternalHref(c.expertCta.url)} iconPosition="right">
                  {c.expertCta.label}
                </Button>
              </StaggerItem>
            ) : null}
          </Stagger>
        </div>
      </section>

      {/* Capabilities */}
      {hasCapabilities ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                What the service covers
              </h2>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-4xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.07}
            >
              {c.capabilities.map((cap) => (
                <StaggerItem
                  as="li"
                  key={cap}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <span className="body-lg-semibold text-slate-900">{cap}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Approach */}
      {hasApproach ? (
        <section className="bg-slate-25 py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                How we deliver
              </h2>
            </Reveal>
            <Stagger as="ol" className="mt-4xl flex flex-col" stagger={0.1}>
              {c.approachSteps.map((step) => (
                <StaggerItem
                  as="li"
                  key={step.title}
                  className="flex flex-col gap-2 border-t border-slate-200 py-8 md:flex-row md:gap-12"
                >
                  <h3 className="heading-lg-semibold max-w-[24ch] shrink-0 text-slate-900 md:w-1/3">
                    {step.title}
                  </h3>
                  <p className="body-lg-regular max-w-[65ch] text-slate-600">
                    {step.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Proof */}
      {hasProof ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <ProofStats
              columns={c.proof.results.length === 2 ? 2 : 3}
              stats={c.proof.results.map((r) => ({
                value: r.result,
                label: [r.metricName, r.clientDescription].filter(Boolean).join(" — "),
              }))}
            />
          </div>
        </section>
      ) : null}

      {/* FAQs + FAQ CTA */}
      {hasFaqs ? (
        <section className="bg-slate-25 py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                Common questions
              </h2>
            </Reveal>
            <div className="mt-4xl">
              <FaqList items={c.proof.faqs} />
            </div>
            {c.faqCta.label ? (
              <div className="mt-4xl">
                <Button
                  href={safeInternalHref(c.faqCta.url)}
                  variant="secondary"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {c.faqCta.label}
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Related case studies */}
      {hasRelated ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                Proven in the field
              </h2>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-4xl grid grid-cols-1 gap-4 md:grid-cols-2"
              stagger={0.1}
            >
              {c.proof.relatedCaseStudies.map((cs) => {
                const slug = cs.uri.split("/").filter(Boolean).pop() ?? "";
                return (
                  <StaggerItem as="li" key={cs.uri}>
                    <Link
                      href={`/case-studies/${slug}`}
                      className="group flex items-center justify-between gap-6 rounded-2xl border border-slate-200 p-6 transition-colors hover:border-brandblue-500/60"
                    >
                      <span className="heading-md-semibold text-slate-900 group-hover:text-brandblue-600">
                        {cs.title}
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

      <CtaBand cta={c.proof.cta} />
    </main>
  );
}
