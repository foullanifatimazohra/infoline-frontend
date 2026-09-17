import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MaskText, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import Button from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import CtaBand, { safeInternalHref } from "./cta-band";
import FaqList from "./faq-list";
import ProofStats from "./proof-stats";
import type { Industry } from "@/lib/wp";

/**
 * Industry detail template — rendered from industryCoreContent.
 * Every block optional; all-null repeaters render nothing (handover §6).
 */
export default function IndustryTemplate({ industry }: { industry: Industry }) {
  const c = industry;
  const hasProcurement = c.procurementItems.length > 0;
  const hasServices = c.sectorServices.length > 0;
  const hasFaqs = c.faqs.length > 0;
  console.log("industry", industry);
  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="bg-[#0a1014] py-20 text-white lg:py-28">
        <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
          <Stagger as="div" className="max-w-[56ch]" stagger={0.14}>
            <StaggerItem>
              <MaskText
                as="h1"
                className="text-4xl font-bold tracking-tight sm:text-5xl"
                segments={[{ text: c.title }]}
                amount={0.5}
                duration={0.8}
              />
            </StaggerItem>
            {c.intro ? (
              <StaggerItem
                as="p"
                className="body-xl-regular mt-6 leading-relaxed text-slate-300"
              >
                {c.intro}
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

      {/* Proof strip */}
      {c.proof.metric || c.proof.point ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <ProofStats
              columns={2}
              stats={[
                { value: c.proof.metric ?? "", label: c.proof.point },
              ].filter((s) => s.value)}
            />
          </div>
        </section>
      ) : null}

      {/* Procurement items */}
      {hasProcurement ? (
        <section className="bg-slate-25 py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                Procurement essentials
              </h2>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-4xl grid grid-cols-1 gap-4 md:grid-cols-3"
              stagger={0.1}
            >
              {c.procurementItems.map((item) => (
                <StaggerItem
                  as="li"
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="heading-md-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="body-md-regular mt-2 text-slate-600">
                    {item.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Sector services */}
      {hasServices ? (
        <section className="bg-white py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                How we serve this sector
              </h2>
            </Reveal>
            <Stagger as="ul" className="mt-4xl flex flex-col" stagger={0.1}>
              {c.sectorServices.map((row, i) =>
                row.services.map((s) => {
                  const slug = s.uri.split("/").filter(Boolean).pop() ?? "";
                  return (
                    <StaggerItem
                      as="li"
                      key={`${s.uri}-${i}`}
                      className="border-t border-slate-200 py-8"
                    >
                      <Link
                        href={`/services/${slug}`}
                        className="group flex items-center justify-between gap-6"
                      >
                        <span className="heading-lg-semibold text-slate-900 group-hover:text-brandblue-600">
                          {s.title}
                        </span>
                        <ArrowRight className="size-5 shrink-0 text-brandblue-500 rtl:rotate-180" />
                      </Link>
                      {row.description ? (
                        <p className="body-lg-regular mt-2 max-w-[65ch] text-slate-600">
                          {row.description}
                        </p>
                      ) : null}
                    </StaggerItem>
                  );
                }),
              )}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Security & delivery FAQs */}
      {hasFaqs ? (
        <section className="bg-slate-25 py-6xl">
          <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
            <Reveal>
              <h2 className="heading-2xl-semibold max-w-[24ch] text-slate-900">
                Security and delivery questions
              </h2>
            </Reveal>
            <div className="mt-4xl">
              <FaqList items={c.faqs} />
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        cta={{
          heading: c.ctaBand.heading,
          description: c.ctaBand.description,
          label: c.cta.label,
          url: c.cta.url,
        }}
      />
    </main>
  );
}
