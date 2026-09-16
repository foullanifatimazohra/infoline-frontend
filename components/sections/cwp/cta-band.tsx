import Image from "next/image";
import Button from "@/components/ui/button";
import { Reveal, Parallax } from "@/components/ui/motion";

/**
 * Closing CTA banner — the shared site-wide banner pattern (smoke photo
 * parallax behind a brand-dark panel), driven by CMS cta panels
 * (serviceProof.cta, caseStudyCoreContent.cta, industryCoreContent.ctaBand).
 * All fields optional: renders nothing without a heading or label.
 */
export type CtaBandData = {
  heading: string | null;
  description: string | null;
  label: string | null;
  url: string | null;
};

/** CMS CTA urls are free text — keep relative paths, fall back to /contact. */
export function safeInternalHref(url: string | null | undefined): string {
  if (url && url.startsWith("/") && !url.startsWith("//")) {
    return url.replace(/\/$/, "") || "/";
  }
  return "/contact";
}

export default function CtaBand({ cta }: { cta: CtaBandData }) {
  if (!cta.heading && !cta.label) return null;

  return (
    <section className="bg-white pb-24 lg:pb-28">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-2xl bg-brandblue-900 p-10 lg:px-11 lg:py-15"
          amount={0.25}
          duration={1.15}
        >
          <Parallax
            className="pointer-events-none absolute inset-x-0 -inset-y-[20%]"
            speed={0.12}
          >
            <Image
              src="/assets/options/bg.jpg"
              alt=""
              fill
              aria-hidden
              sizes="100vw"
              className="object-cover object-top-right"
              priority={false}
            />
          </Parallax>

          <div className="relative z-10 flex flex-col justify-between gap-xl md:items-center lg:flex-row">
            <div>
              {cta.heading ? (
                <h3 className="heading-xl-bold mb-4 max-w-[26ch] text-white lg:text-[36px]">
                  {cta.heading}
                </h3>
              ) : null}
              {cta.description ? (
                <p className="body-lg-regular text-white/80">{cta.description}</p>
              ) : null}
            </div>
            {cta.label ? (
              <Button href={safeInternalHref(cta.url)} iconPosition="right">
                {cta.label}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
