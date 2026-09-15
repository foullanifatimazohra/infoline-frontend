import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Parallax,
  Stagger,
  StaggerItem,
  MaskText,
} from "@/components/ui/motion";

// Three rounded windows from the Figma export, used as a CSS mask source.
// White = visible, transparent = cut away. Kept as a data URI so it ships with
// the component and never triggers an extra request.
const WHO_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='519' height='412' viewBox='0 0 519 412'%3E%3Crect x='0' y='0' width='167' height='352' rx='20' fill='%23fff'/%3E%3Crect x='176' y='60' width='167' height='352' rx='20' fill='%23fff'/%3E%3Crect x='352' y='0' width='167' height='352' rx='20' fill='%23fff'/%3E%3C/svg%3E\")";

export default function WhoWeAre() {
  const t = useTranslations("AboutPage");
  const paragraphs = t.raw("whoWeAre.paragraphs") as string[];
  const p = paragraphs[0];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="relative mx-auto grid w-full max-w-360 grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Copy */}
        <Stagger as="div" stagger={0.12}>
          <StaggerItem
            as="p"
            direction="start"
            className="overline-sm-medium text-slate-400"
          >
            {t("whoWeAre.eyebrow")}
          </StaggerItem>
          <MaskText
            as="h2"
            className="mt-4 heading-2xl-semibold max-w-[30ch] text-slate-900"
            segments={[
              { text: t("whoWeAre.titleLead") },
              { text: t("whoWeAre.titleAccent") },
            ]}
            amount={0.5}
            duration={0.85}
          />

          <StaggerItem
            as="p"
            direction="start"
            className="mt-6 max-w-[56ch] body-lg-regular text-slate-700"
          >
            {p}
          </StaggerItem>
        </Stagger>

        {/* One photo, divided across three rounded windows by a CSS mask. */}
        <Parallax speed={0.08}>
          <div
            className="group relative w-full overflow-hidden"
            style={{
              aspectRatio: "519 / 412",
              maskImage: WHO_MASK,
              WebkitMaskImage: WHO_MASK,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskMode: "alpha",
            }}
          >
            <Image
              src="/assets/about/who-full.jpg"
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        </Parallax>
      </div>
    </section>
  );
}
