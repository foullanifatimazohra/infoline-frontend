import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/motion";

type Row = { without: string; with: string; impact: string };

export default function WhatChanges() {
  const t = useTranslations("WhatChanges");
  const rows = t.raw("rows") as Row[];

  return (
    <section className="bg-[#f2f5f7] py-20 text-[#0a1014] sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        {/* Header */}
        <Stagger
          as="div"
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          stagger={0.15}
        >
          <StaggerItem direction="start">
            <p className="text-[12px] overline-sm-medium uppercase tracking-[0.28em] text-slate-400">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-[60ch] heading-2xl-semibold leading-tight tracking-tight sm:text-[42px]">
              {t("title")}
            </h2>
          </StaggerItem>
          <StaggerItem
            as="p"
            direction="end"
            className="max-w-[55ch] body-lg-regular leading-relaxed text-slate-700"
          >
            {t("description")}
          </StaggerItem>
        </Stagger>

        {/* Comparison */}
        <Stagger
          as="div"
          className="relative mt-14 grid justify-center grid-cols-1 gap-y-10 lg:grid-cols-3 lg:gap-y-0"
          stagger={0.16}
          amount={0.25}
        >
          <StaggerItem>
            <Column
              variant="without"
              heading={t("columns.without")}
              cells={rows.map((r) => r.without)}
            />
          </StaggerItem>
          <StaggerItem>
            <Column
              variant="with"
              heading={t("columns.with")}
              cells={rows.map((r) => r.with)}
              footer={
                <Button
                  href={t("cta.href")}
                  icon={ArrowRight}
                  size="small"
                  iconPosition="right"
                >
                  {t("cta.label")}
                </Button>
              }
            />
          </StaggerItem>
          <StaggerItem>
            <Column
              variant="impact"
              heading={t("columns.impact")}
              cells={rows.map((r) => r.impact)}
            />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

type Variant = "without" | "with" | "impact";

const HEADING_H = "flex h-8 px-6  items-center gap-2";
// Row line only: top border on every cell, blue tint that deepens on column hover.
const CELL =
  "min-h-[76px] flex items-center border-t border-brandblue-500/15 transition-colors duration-300 lg:group-hover:border-brandblue-500/40 lg:group-hover:text-brandblue-600 text-slate-600";

function Column({
  variant,
  heading,
  cells,
  footer,
}: {
  variant: Variant;
  heading: string;
  cells: string[];
  footer?: React.ReactNode;
}) {
  const isFeatured = variant === "with";
  return (
    <div className="group relative">
      {/* Raised card — lifts/fades in on hover of this column */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-x-0 -top-6 bottom-0 rounded-2xl ${isFeatured ? "bg-gradient-to-b from-white to-[#eaf6fd] opacity-0 shadow-[0_30px_60px_-30px_rgba(28,151,212,0.45)] ring-1 ring-brandblue-500/20 transition-all duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)] lg:-inset-x-0 lg:translate-y-2 translate-y-0 opacity-100" : ""} `}
      />

      <div className="relative z-10">
        {/* Heading */}
        <div className={HEADING_H}>
          <span className="inline-block size-1.5 rounded-full transition-colors duration-300 border border-slate-400 bg-transparent border-brandblue-500 lg:group-hover:bg-brandblue-500" />
          <span className="overline-sm-medium uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 lg:group-hover:text-brandblue-500">
            {heading}
          </span>
        </div>

        {/* Cells */}
        <ul>
          {cells.map((cell, i) => (
            <li key={i} className={CELL}>
              <span className="px-6 py-5 body-lg-medium leading-snug">
                {cell}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA — only where a footer is provided; revealed on hover */}
        {footer && isFeatured && (
          <div className=" px-6 py-6 transition-all duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)]  lg:pt-0  max-h-32 pt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
