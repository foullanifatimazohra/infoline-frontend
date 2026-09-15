import { useTranslations } from "next-intl";
import {
  MaskText,
  Stagger,
  StaggerItem,
  CountUp,
} from "@/components/ui/motion";

type Movement = { value: string; title: string; subtitle: string };

/**
 * Case Studies hero — the ink band with a soft radial glow, the page headline on
 * the left and the "headline movement" panel on the right: the three numbers the
 * three case studies below are about to prove, so the page's argument is stated
 * before the reader scrolls.
 */
export default function Hero() {
  const t = useTranslations("CaseStudiesPage");
  const movement = t.raw("hero.movement") as Movement[];

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Radial glow, top start corner — the hero's only art (per Figma). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/5 start-[-14%] aspect-square w-[43%] rounded-full bg-[radial-gradient(circle,#1C97D4_0%,transparent_68%)] opacity-30 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-360 px-6 pb-24 pt-28 lg:px-10 lg:pb-33 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
          {/* Left: eyebrow + headline */}
          <Stagger
            as="div"
            className="flex flex-col items-start"
            stagger={0.14}
            delayChildren={0.05}
            amount={0.3}
          >
            <StaggerItem className="mb-8.5" distance={40}>
              <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
                {t("hero.eyebrow")}
              </span>
            </StaggerItem>

            <MaskText
              as="h1"
              className="max-w-[16ch] text-[44px] font-bold leading-[1.05] tracking-[-.033em] text-white lg:text-[52px]"
              segments={[
                { text: t("hero.titleLead") },
                { text: t("hero.titleAccent") },
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
          </Stagger>

          {/* Right: headline movement panel */}
          <div>
            <Stagger as="div" stagger={0.09} delayChildren={0.25} amount={0.2}>
              <StaggerItem className="mb-2" distance={24}>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">
                  {t("hero.movementLabel")}
                </span>
              </StaggerItem>
              <ul>
                {movement.map((m) => (
                  <StaggerItem as="li" key={m.title} distance={28}>
                    <div className="flex items-center justify-between gap-8 border-b border-white/10 py-4">
                      <CountUp
                        value={m.value}
                        className="text-[32px] font-bold tabular-nums tracking-tight text-lightblue-300 lg:text-[34px]"
                      />
                      <div className="text-end">
                        <div className="body-lg-medium text-white">
                          {m.title}
                        </div>
                        <div className="font-mono text-[11px] mt-2 uppercase tracking-[0.14em] text-slate-300">
                          {m.subtitle}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </ul>
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
