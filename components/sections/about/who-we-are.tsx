import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Parallax,
  Stagger,
  StaggerItem,
  MaskText,
} from "@/components/ui/motion";

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
              {
                text: t("whoWeAre.titleAccent"),
              },
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

        {/* One photo divided across three rounded masks — self-contained SVG
            (image inlined as base64) matching the Figma export exactly. */}
        <Parallax speed={0.08}>
          <Image
            src="/assets/about/who.svg"
            alt=""
            aria-hidden
            width={519}
            height={412}
            className="h-auto w-full"
          />
        </Parallax>
      </div>
    </section>
  );
}
