import { useTranslations } from "next-intl";
import { Reveal, MaskText } from "@/components/ui/motion";

export default function Differ() {
  const t = useTranslations("IndustriesPage");

  return (
    <section className="py-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <div className="rounded-2xl bg-ink p-8 ring-1 ring-white/10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="overline-sm-medium mb-sm text-slate-300">
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
              className="body-lg-regular self-center text-slate-100"
            >
              {t("differ.description")}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
