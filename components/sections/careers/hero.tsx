import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

/**
 * Careers hero — full-bleed office photo under an ink wash, centred copy and
 * the "View open roles" button dropping the reader to the vacancies table.
 */
export default function Hero() {
  const t = useTranslations("CareersPage");

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Background photo + dark wash */}
      <Image
        src="/assets/careers/hero-bg.jpg"
        alt=""
        fill
        priority
        aria-hidden
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-ink/85 bg-[radial-gradient(ellipse_60%_55%_at_50%_18%,rgba(28,151,212,0.28),transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-360 flex-col items-center px-6 pb-24 pt-40 text-center lg:pb-28 lg:pt-52">
        <Stagger
          as="div"
          className="flex flex-col items-center"
          stagger={0.14}
          delayChildren={0.05}
          amount={0.3}
        >
          <StaggerItem className="mb-6" distance={32}>
            <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
              {t("hero.eyebrow")}
            </span>
          </StaggerItem>

          <MaskText
            as="h1"
            className="max-w-[24ch] text-[38px] font-bold leading-[1.08] tracking-[-.03em] text-white lg:text-[54px]"
            segments={[{ text: t("hero.title") }]}
            stagger={0.05}
            duration={0.9}
          />

          <StaggerItem
            as="p"
            className="mt-6 max-w-[62ch] text-[15px] leading-[24px] text-slate-200 lg:text-[16px]"
          >
            {t("hero.description")}
          </StaggerItem>

          <StaggerItem className="mt-10">
            <Button href={t("hero.cta.href")} size="large" variant="primary">
              {t("hero.cta.label")}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Button>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
