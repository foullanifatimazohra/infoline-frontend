import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { Reveal, Parallax } from "@/components/ui/motion";

/**
 * Partner call-to-action banner. Reuses the home "Options" banner pattern:
 * a <Reveal>-wrapped brandblue panel with a parallax background image and a
 * white CTA button.
 */
export default function PartnerCta() {
  const t = useTranslations("SolutionsPage");

  return (
    <section className="bg-white pb-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-2xl bg-brandblue-900 p-10 lg:px-11 lg:py-15"
          amount={0.25}
          duration={1.15}
        >
          {/* Background image — drifts on scroll (desktop only), oversized so the
              parallax translation never exposes an edge. */}
          <Parallax
            className="pointer-events-none absolute inset-x-0 -inset-y-[20%]"
            speed={0.12}
          >
            <Image
              src="/assets/options/bg.jpg"
              alt=""
              fill
              aria-hidden
              className="object-cover object-top-right"
              priority={false}
            />
          </Parallax>

          <div className="relative z-10 flex flex-col justify-between lg:gap-45 gap-4 md:items-center lg:flex-row">
            <div>
              <p className="overline-xs-medium mb-4 text-slate-100">
                {t("partner.eyebrow")}
              </p>
              <h3 className="heading-xl-bold mb-4 max-w-[30ch] text-white lg:text-[36px]">
                {t("partner.title")}
              </h3>
            </div>
            <div className="flex flex-col lg:items-start gap-sm">
              <p className="body-lg-regular max-w-[60ch] text-white">
                {t("partner.description")}
              </p>
              <Button
                href={t("partner.cta.href")}
                size="small"
                variant="primary"
                className="mt-6"
              >
                {t("partner.cta.label")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
