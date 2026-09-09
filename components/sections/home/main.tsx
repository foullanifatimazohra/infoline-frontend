import { useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Proof from "./proof";
import HeroVisual from "./hero-visual";
import HeroContent from "./hero-content";
import { MainBackground } from "@/components/ui/background/main";
import { Stagger, StaggerItem, MaskText } from "@/components/ui/motion";

export default function Main() {
  const t = useTranslations("Main");

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-h-screen pt-20 grid items-center gap-4 lg:grid-cols-[1fr_1fr]">
        <HeroContent>
          <Stagger
            as="div"
            className="flex flex-col lg:pl-10 pl-6 rtl:[pl-0 lg:pr-10 pr-6 lg:pl-0] items-start gap-0 py-14 lg:py-25"
            stagger={0.14}
            delayChildren={0.05}
            amount={0.35}
          >
            <StaggerItem
              className="mb-8.5 flex items-center gap-3.5"
              distance={40}
            >
              <span className="block h-px w-8.5 bg-brandblue-500" />
              <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
                {t("eyebrow")}
              </span>
            </StaggerItem>

            <MaskText
              as="h1"
              className="max-w-[20ch] text-white text-[48px] font-bold leading-[1.06] tracking-[-.033em]"
              segments={[
                { text: t("titleLead") },
                { text: t("titleAccent"), className: "text-lightblue-300" },
              ]}
              orchestrated
              stagger={0.08}
              duration={0.95}
            />

            <StaggerItem
              as="p"
              className="mt-7.5 max-w-[60ch] text-[16px] leading-[24px] text-slate-200"
            >
              {t("description")}
            </StaggerItem>

            <StaggerItem className="mt-11 flex max-md:justify-start flex-wrap items-center gap-3.5">
              <Button
                href={t("primaryCta.href")}
                icon={ArrowRight}
                size="large"
                iconPosition="right"
              >
                {t("primaryCta.label")}
              </Button>
              <Button
                variant="secondary"
                size="large"
                href={t("secondaryCta.href")}
              >
                {t("secondaryCta.label")}
              </Button>
            </StaggerItem>

            <StaggerItem
              as="p"
              className="mt-6.5 font-mono text-[13px] leading-[1.6] text-slate-500"
              distance={32}
            >
              {t("responseNote")}
            </StaggerItem>
          </Stagger>
        </HeroContent>

        <HeroVisual />
      </div>
      <MainBackground />
      <Proof />
    </section>
  );
}
