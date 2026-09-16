import { useTranslations } from "next-intl";
import Image from "next/image";
import { ClipReveal, MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

/**
 * "Learn by doing the work" — dark rounded panel: copy + responsibility chips
 * above the team photograph (the panel's visual anchor in the design).
 */
export default function Learn() {
  const t = useTranslations("CareersPage");
  const chips = t.raw("learn.chips") as string[];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <ClipReveal
          className="relative overflow-hidden rounded-2xl bg-ink"
          amount={0.25}
          duration={1.1}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -end-[10%] -top-1/3 aspect-square w-[55%] rounded-full bg-[radial-gradient(circle,#1C97D4_0%,transparent_68%)] opacity-25 blur-3xl"
          />

          <div className="relative p-7 pt-10 lg:p-11">
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
              <div>
                <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
                  {t("learn.eyebrow")}
                </span>
                <MaskText
                  as="h2"
                  className="mt-5 max-w-[22ch] text-[30px] font-bold leading-[1.12] tracking-[-.025em] text-white lg:text-[40px]"
                  segments={[{ text: t("learn.title") }]}
                  stagger={0.05}
                  duration={0.85}
                />
              </div>
              <p className="body-lg-regular max-w-[58ch] text-slate-200">
                {t("learn.body")}
              </p>
            </div>

            <Stagger
              as="ul"
              className="mt-9 flex flex-wrap gap-3"
              stagger={0.08}
              delayChildren={0.1}
              amount={0.2}
            >
              {chips.map((chip) => (
                <StaggerItem
                  as="li"
                  key={chip}
                  distance={20}
                  className="rounded-full border border-white/16 bg-white/[0.05] px-4 py-2.5 text-[13px] font-medium text-slate-100"
                >
                  {chip}
                </StaggerItem>
              ))}
            </Stagger>

            {/* Team photo */}
            <div className="relative mt-10 aspect-[1354/560] overflow-hidden rounded-xl">
              <Image
                src="/assets/careers/team.jpg"
                alt=""
                fill
                aria-hidden
                sizes="(max-width: 1024px) 100vw, 1354px"
                className="object-cover object-[center_30%]"
              />
            </div>
          </div>
        </ClipReveal>
      </div>
    </section>
  );
}
