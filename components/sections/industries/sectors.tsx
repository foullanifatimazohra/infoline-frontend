import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";
import { MaskText, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

type Sector = {
  id: string;
  number: string;
  icon: string;
  image: string;
  title: string;
  headline: string;
  summary: string;
  tags: string[];
  cta: { label: string; href: string };
};

/**
 * The sector stack — the page's centrepiece. Each sector is a pinned card that
 * scales down as the next card scrolls up to cover it, producing a fanned
 * "scaling stack" deck.
 *
 * The whole effect is expressed with Tailwind utilities on the card:
 * `lg:sticky lg:top-[6.5rem]` pins it, `lg:animate-stack-recede` (registered in
 * globals.css `@theme`) plus the arbitrary `[animation-timeline:view()]` /
 * `[animation-range:exit-crossing]` utilities drive the scroll-linked scale.
 * Everything is scoped to `lg:` and `motion-reduce:` turns it off, so on mobile
 * or with reduced motion the cards render as a normal vertical stack.
 *
 * The hero's index deep-links here via `#sec-<id>` — each card carries that id
 * and `scroll-mt` so a pinned card lands just below the header.
 *
 * Layout alternates image ⇄ content per card for editorial rhythm; under RTL the
 * logical order is preserved automatically by grid + logical properties.
 */
export default function Sectors() {
  const t = useTranslations("IndustriesPage");
  const sectors = t.raw("sectors.items") as Sector[];

  return (
    <section className="bg-white py-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        {/* Header */}
        <Stagger
          as="div"
          className="mb-4xl flex flex-col justify-between gap-lg lg:flex-row lg:items-end"
          stagger={0.15}
        >
          <StaggerItem direction="start">
            <p className="overline-sm-medium mb-sm text-slate-500">
              {t("sectors.eyebrow")}
            </p>
            <MaskText
              as="h2"
              className="heading-2xl-semibold max-w-[22ch] text-slate-900"
              segments={[{ text: t("sectors.title") }]}
              amount={0.5}
              duration={0.8}
            />
          </StaggerItem>
          <StaggerItem
            as="p"
            direction="end"
            className="body-lg-regular max-w-[52ch] text-slate-600"
          >
            {t("sectors.description")}
          </StaggerItem>
        </Stagger>

        {/* The stack */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {sectors.map((s, i) => {
            const imageFirst = i % 2 === 0;
            return (
              <article
                key={s.id}
                id={`sec-${s.id}`}
                className="scroll-mt-[6.5rem] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_24px_60px_-45px_rgba(38,50,56,0.55)] lg:sticky lg:top-[6.5rem] lg:origin-top lg:will-change-transform lg:animate-stack-recede lg:[animation-timeline:view()] lg:[animation-range:exit-crossing] motion-reduce:[animation:none]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Visual */}
                  <div
                    className={`relative min-h-[240px] overflow-hidden bg-brandblue-900 lg:min-h-[420px] ${
                      imageFirst ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brandblue-950/60 via-transparent to-transparent" />
                    {/* Ghosted service-icon watermark. */}
                    <Icon
                      src={s.icon}
                      aria-hidden
                      className="absolute -end-6 -top-6 size-40 text-white/10"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex flex-col justify-center p-7 lg:p-11 ${
                      imageFirst ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="mb-5 flex items-center gap-3.5">
                      <span className="font-mono text-[13px] tabular-nums text-brandblue-500">
                        {s.number}
                      </span>
                      <span className="block h-px w-8 bg-brandblue-200" />
                      <Icon
                        src={s.icon}
                        aria-hidden
                        className="size-6 text-brandblue-500"
                      />
                    </div>

                    <h3 className="heading-lg-semibold text-slate-900">
                      {s.title}
                    </h3>
                    <p className="body-lg-medium mt-2 text-brandblue-600">
                      {s.headline}
                    </p>
                    <p className="body-md-regular mt-4 max-w-[54ch] text-slate-600">
                      {s.summary}
                    </p>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-25 px-3 py-1 text-[12px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8">
                      <Button
                        href={s.cta.href}
                        icon={ArrowRight}
                        iconPosition="right"
                        size="small"
                        variant="primary"
                      >
                        {s.cta.label}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
