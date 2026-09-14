import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import {
  Parallax,
  Stagger,
  StaggerItem,
  MaskText,
} from "@/components/ui/motion";

export default function Hero() {
  const t = useTranslations("AboutPage");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {/* Background layers */}
      <div className="absolute inset-0 -z-1 overflow-hidden">
        {/* Far, static sky */}
        <Image
          src="/assets/about/mask.svg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Mid skyline — drifts on scroll. Oversized so the drift never bares an edge. */}
        <Parallax
          className="absolute inset-x-0 z-10 -inset-y-[18%]"
          speed={0.15}
        >
          <Image
            src="/assets/about/skyline.png"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />
        </Parallax>
        {/* Legibility washes */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
      </div>

      {/* Foreground copy */}
      <div className="relative mx-auto w-full max-w-360 px-6 py-28 lg:px-10 lg:py-32">
        <Stagger
          as="div"
          className="flex  flex-col items-center"
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
            className="text-[44px] max-w-[20ch] text-center font-bold leading-[1.05] tracking-[-.033em] text-white lg:text-[48px]"
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
            className="mt-7.5 max-w-[52ch] text-[16px] leading-[26px] text-slate-200"
          >
            {t("hero.description")}
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
