import { useTranslations } from "next-intl";
import { Reveal, MaskText } from "@/components/ui/motion";

/**
 * Dark editorial band between the hero and the sector stack. Two columns on
 * desktop: a masked question on the reading-start side, its answer on the
 * reading-end side. Stacks to one column on mobile.
 */
export default function Differ() {
  const t = useTranslations("IndustriesPage");

  return (
    <section className="bg-brandblue-900 py-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <div className="rounded-2xl bg-brandblue-950/40 p-8 ring-1 ring-white/10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="overline-sm-medium mb-sm text-brandblue-200">
                {t("differ.eyebrow")}
              </p>
              <MaskText
                as="h2"
                className="heading-2xl-semibold max-w-[16ch] text-white"
                segments={[{ text: t("differ.title") }]}
                amount={0.5}
                duration={0.8}
              />
            </div>
            <Reveal
              as="p"
              direction="up"
              distance={32}
              className="body-lg-regular self-center text-brandblue-100"
            >
              {t("differ.description")}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
