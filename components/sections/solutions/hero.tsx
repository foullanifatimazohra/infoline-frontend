import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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

export default function Hero() {
  const t = useTranslations("SolutionsPage");
  const services = t.raw("catalogue.services") as IndexService[];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="mx-auto w-full max-w-360 px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_.7fr] lg:gap-20">
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
              <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
                {t("hero.eyebrow")}
              </span>
            </StaggerItem>

            <MaskText
              as="h1"
              className="max-w-[21ch] text-[44px] font-bold leading-[1.05] tracking-[-.033em] text-white lg:text-[48px]"
              segments={[
                { text: t("hero.titleLead") },
                {
                  text: t("hero.titleAccent"),
                },
              ]}
              orchestrated
              stagger={0.08}
              duration={0.95}
            />

            <StaggerItem
              as="p"
              className="mt-7.5 max-w-[60ch] text-[16px] leading-[24px] text-slate-200"
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
              <Button
                variant="secondary"
                size="large"
                href={t("hero.secondaryCta.href")}
              >
                {t("hero.secondaryCta.label")}
              </Button>
            </StaggerItem>
          </Stagger>

          {/* Right column: animated service index */}
          <div className="w-full">
            <Stagger
              as="ul"
              className=""
              stagger={0.07}
              delayChildren={0.2}
              amount={0.15}
            >
              {services.map((s) => (
                <StaggerItem as="li" key={s.id} distance={28}>
                  <Link
                    href={`#cat-${s.id}`}
                    className="group flex items-center gap-5 border-b border-white/5 py-3 transition-colors hover:bg-white/[.02 hover:transform hover:translate-x-3"
                  >
                    <span className="font-mono text-[13px] tabular-nums text-slate-400 group-hover:text-brandblue-400">
                      {s.number}
                    </span>
                    <span className="flex-1 body-sm-regular text-slate-200 transition-colors group-hover:text-white">
                      {s.title}
                    </span>
                  </Link>
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
