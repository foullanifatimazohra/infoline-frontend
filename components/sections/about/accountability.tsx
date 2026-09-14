import { useTranslations } from "next-intl";
import Image from "next/image";
import { Reveal, MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

export default function Accountability() {
  const t = useTranslations("AboutPage");
  const points = t.raw("accountability.points") as string[];
  const descriptions = t.raw("accountability.descriptions") as string[];

  return (
    <section className="relative overflow-hidden bg-slate-25">
      {/* Faint radial backdrop */}
      <Image
        src="/assets/about/acc-bg.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute w-full h-full top-0 inset-0"
        fill
      />
      <div className="py-24 text-ink lg:py-32">
        <div className="relative mx-auto w-full px-6 text-center lg:px-10">
          <Reveal
            as="p"
            direction="up"
            distance={24}
            duration={0.7}
            className="overline-sm-medium text-brandblue-500"
          >
            {t("accountability.eyebrow")}
          </Reveal>
          <MaskText
            as="h2"
            className="mx-auto mt-5 heading-2xl-semibold max-w-[22ch] text-slate-900"
            segments={[{ text: t("accountability.title") }]}
            amount={0.5}
            duration={0.85}
          />

          {descriptions.map((description, i) => (
            <Reveal
              as="p"
              key={i}
              direction="up"
              distance={28}
              delay={0.1}
              className="mx-auto mt-6 max-w-[62ch] body-lg-regular text-slate-600"
            >
              {description}
            </Reveal>
          ))}

          <Stagger
            as="ul"
            className="mt-11 flex flex-wrap justify-center gap-3.5"
            stagger={0.1}
            amount={0.3}
          >
            {points.map((point) => (
              <StaggerItem
                as="li"
                key={point}
                className="inline-flex about_chips_border items-center gap-2.5 rounded-full bg-white px-5 py-3"
              >
                <span className="body-sm-medium text-slate-700">{point}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
