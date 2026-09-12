import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { MainBackground } from "@/components/ui/background/main";
import { Reveal, Stagger, StaggerItem, MaskText } from "@/components/ui/motion";

type IndexService = {
  id: string;
  number: string;
  family: string;
  title: string;
};

/**
 * Dark hero for the Solutions page. Left column mirrors the home hero
 * (eyebrow → masked title → description → CTAs) driven by one <Stagger>; the
 * right column is an animated 01–08 index whose rows deep-link into the
 * catalogue (`#cat-<id>`), preselecting that service on arrival.
 */
export default function Hero() {
  const t = useTranslations("SolutionsPage");
  const services = t.raw("catalogue.services") as IndexService[];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="mx-auto w-full max-w-360 px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          {/* Left column */}
          <Stagger
            as="div"
            className="flex flex-col items-start"
            stagger={0.14}
            delayChildren={0.05}
            amount={0.3}
          >
            <StaggerItem
              className="mb-8.5 flex items-center gap-3.5"
              distance={40}
            >
              <span className="block h-px w-8.5 bg-brandblue-500" />
              <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
                {t("hero.eyebrow")}
              </span>
            </StaggerItem>

            <MaskText
              as="h1"
              className="max-w-[18ch] text-[44px] font-bold leading-[1.05] tracking-[-.033em] text-white lg:text-[54px]"
              segments={[
                { text: t("hero.titleLead") },
                { text: t("hero.titleAccent"), className: "text-lightblue-300" },
              ]}
              orchestrated
              stagger={0.08}
              duration={0.95}
            />

            <StaggerItem
              as="p"
              className="mt-7.5 max-w-[54ch] text-[16px] leading-[26px] text-slate-200"
            >
              {t("hero.description")}
            </StaggerItem>

            <StaggerItem className="mt-11 flex flex-wrap items-center gap-3.5">
              <Button
                href={t("hero.primaryCta.href")}
                icon={ArrowRight}
                size="large"
                iconPosition="right"
              >
                {t("hero.primaryCta.label")}
              </Button>
              {/* Plain anchor for the in-page hash target (keeps native scroll,
                  no locale prefixing). */}
              <a
                href={t("hero.secondaryCta.href")}
                className="group inline-flex items-center gap-3 rounded-md border border-white/18 px-7.5 py-[20px] text-[13px] font-semibold uppercase tracking-[0.11em] text-white transition-[border-color,background] duration-300 hover:border-white/[.42] hover:bg-white/[.04]"
              >
                {t("hero.secondaryCta.label")}
                <ArrowRight className="size-3 transition-transform duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            </StaggerItem>
          </Stagger>

          {/* Right column: animated service index */}
          <div className="w-full">
            <Reveal
              as="p"
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500"
              direction="up"
              distance={24}
              duration={0.7}
            >
              {t("hero.indexLabel")}
            </Reveal>
            <Stagger
              as="ul"
              className="border-t border-white/10"
              stagger={0.07}
              delayChildren={0.2}
              amount={0.15}
            >
              {services.map((s) => (
                <StaggerItem as="li" key={s.id} distance={28}>
                  <a
                    href={`#cat-${s.id}`}
                    className="group flex items-center gap-5 border-b border-white/10 py-4 transition-colors hover:bg-white/[.02]"
                  >
                    <span className="font-mono text-[13px] tabular-nums text-brandblue-400">
                      {s.number}
                    </span>
                    <span className="flex-1 text-[16px] font-medium text-slate-200 transition-colors group-hover:text-white">
                      {s.title}
                    </span>
                    <span className="hidden text-[12px] uppercase tracking-[0.12em] text-slate-500 sm:block">
                      {s.family}
                    </span>
                    <ArrowRight className="size-4 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brandblue-400 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
      <MainBackground />
    </section>
  );
}
