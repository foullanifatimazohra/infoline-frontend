import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/button";

type Pillar = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
};

const pillars: Pillar[] = [
  {
    eyebrow: "For clients",
    title: "Work with a trusted operations partner",
    description:
      "Tell us what needs to improve across CX, quality, workforce, reporting or technology.",
    cta: "Talk to our team",
    href: "/clients",
  },
  {
    eyebrow: "For vendors",
    title: "Introduce your capability",
    description:
      "Introduce your company, capability, Oman presence and contact details to Procurement.",
    cta: "Become a vendor",
    href: "/vendors",
  },
  {
    eyebrow: "For partners",
    title: "Build something together",
    description:
      "If your platform or capability complements our portfolio, let's explore the opportunity together.",
    cta: "Explore a partnership",
    href: "/partners",
  },
];

export default function Options() {
  return (
    <section className="bg-white py-6xl">
      <div className="max-w-7xl px-6 lg:px-10 mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-4xl">
          <div>
            <p className="overline-sm-medium text-slate-500 mb-sm">Solutions</p>
            <h2 className="heading-2xl-semibold text-slate-900 max-w-[23ch]">
              Three ways we take work off your operation.
            </h2>
          </div>
          <p className="body-lg-regular text-slate-600 max-w-[54ch]">
            Pick the problem closest to yours. Each pillar groups the services
            that solve it, with the proof that we have solved it before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`rounded-xl max-h-[268px] py-10 px-[28px] bg-white flex flex-col solutions-card-shadow`}
            >
              <p className="overline-sm-medium text-slate-300 mb-5">
                {pillar.eyebrow}
              </p>
              <h3 className="heading-lg-semibold text-slate-900 mb-4">
                {pillar.title}
              </h3>
              <p className="body-md-regular text-slate-700 mb-2xl">
                {pillar.description}
              </p>
              <Link
                href={pillar.href}
                className="mt-auto overline-sm-medium text-brandblue-500 hover:text-brandblue-700 transition-colors inline-flex items-center gap-xs"
              >
                {pillar.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-brandblue-900 mt-2xl lg:py-15 lg:px-11 p-10">
          {/* Layer 1: background image */}
          <Image
            src="/assets/options/bg.svg"
            alt=""
            fill
            aria-hidden="true"
            className="pointer-events-none object-cover object-bottom-left"
            priority={false}
          />
          {/* Layer 2: gradient overlay on top of the image, for text legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/85" />
          {/* Layer 3: content */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-xl">
            <div>
              <h3 className="heading-xl-bold lg:text-[36px] mb-4 text-white">
                Start with the outcome you need
              </h3>
              <p className="body-lg-regular text-brandblue-100">
                Tell us what needs to improve. We will start from the operation,
                not from a product
              </p>
            </div>
            <Button
              href="/contact"
              size="small"
              className="shrink-0 rounded-lg bg-white !text-ink px-2xl py-md overline-xs-semibold hover:bg-white transition-colors"
            >
              Talk to an expert
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
