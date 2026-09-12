"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";
import { EASE } from "@/components/ui/motion/shared";

type Service = {
  id: string;
  number: string;
  family: string;
  icon: string;
  image: string;
  title: string;
  headline: string;
  summary: string;
  body: string[];
  tags: string[];
  facts: string[];
  metric: { value: string; label: string };
  cta: { label: string; href: string };
};

/**
 * The catalogue — the page's interactive centerpiece. Selecting a service in
 * the left rail swaps the middle detail column (copy) and the right visual
 * (photo + metric) with framer-motion transitions. A shared-layout indicator
 * (`layoutId`) slides between rail items. The hero's index deep-links here via
 * `#cat-<id>`, which this component reads on mount + `hashchange`.
 *
 * Per-service photos are wired to `/assets/solutions/catalogue/<slug>.jpg`; if
 * a file is missing the <Image> hides itself (onError) and the branded
 * gradient + ghosted service icon show through, so it always looks intentional.
 */
export default function Catalogue() {
  const t = useTranslations("SolutionsPage");
  const services = t.raw("catalogue.services") as Service[];
  const coversLabel = t("catalogue.coversLabel");
  const reduce = useReducedMotion();

  const [activeId, setActiveId] = useState(services[0].id);

  // Sync from hero deep-links (#cat-<id>) on mount and on hashchange.
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.startsWith("cat-")) {
        const id = hash.slice(4);
        if (services.some((s) => s.id === id)) setActiveId(id);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [services]);

  const active = services.find((s) => s.id === activeId) ?? services[0];

  // Entrance/exit for the swapping middle column (skipped under reduced motion).
  const detailMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(6px)" },
        transition: { duration: 0.5, ease: EASE },
      };

  return (
    <section id="catalogue" className="scroll-mt-24 bg-white py-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        {/* Header */}
        <Stagger
          as="div"
          className="mb-4xl flex flex-col justify-between gap-lg lg:flex-row lg:items-end"
          stagger={0.15}
        >
          <StaggerItem direction="start">
            <p className="overline-sm-medium mb-sm text-slate-500">
              {t("catalogue.eyebrow")}
            </p>
            <MaskText
              as="h2"
              className="heading-2xl-semibold max-w-[22ch] text-slate-900"
              segments={[{ text: t("catalogue.title") }]}
              amount={0.5}
              duration={0.8}
            />
          </StaggerItem>
          <StaggerItem
            as="p"
            direction="end"
            className="body-lg-regular max-w-[52ch] text-slate-600"
          >
            {t("catalogue.description")}
          </StaggerItem>
        </Stagger>

        {/* Deep-link anchors for the hero index (sit just above the card). */}
        <div aria-hidden className="relative">
          {services.map((s) => (
            <span
              key={s.id}
              id={`cat-${s.id}`}
              className="absolute -top-28 block h-0 w-0"
            />
          ))}
        </div>

        {/* Interactive card */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_24px_60px_-45px_rgba(38,50,56,0.55)] lg:grid-cols-[minmax(0,280px)_1fr_minmax(0,380px)]">
          {/* LEFT RAIL */}
          <div className="border-b border-slate-100 p-2.5 lg:border-e lg:border-b-0">
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {services.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    aria-pressed={isActive}
                    className={`group relative flex shrink-0 items-center gap-3.5 rounded-xl px-4 py-3.5 text-start transition-colors lg:w-full lg:shrink ${
                      isActive
                        ? "text-brandblue-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cat-rail-active"
                        className="absolute inset-0 rounded-xl bg-brandblue-50"
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 420, damping: 38 }
                        }
                      />
                    )}
                    <span
                      className={`relative z-10 font-mono text-[12px] tabular-nums ${
                        isActive ? "text-brandblue-500" : "text-slate-400"
                      }`}
                    >
                      {s.number}
                    </span>
                    <span className="relative z-10 flex flex-col">
                      <span className="text-[14px] font-semibold leading-tight">
                        {s.title}
                      </span>
                      <span
                        className={`text-[11px] uppercase tracking-[0.1em] ${
                          isActive ? "text-brandblue-400" : "text-slate-400"
                        }`}
                      >
                        {s.family}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MIDDLE — detail copy, changes per service */}
          <div className="relative min-h-[440px] p-7 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={active.id} {...detailMotion}>
                <Icon
                  src={active.icon}
                  className="size-10 text-brandblue-500"
                  aria-hidden
                />
                <h3 className="heading-lg-semibold mt-6 text-slate-900">
                  {active.headline}
                </h3>
                <p className="body-lg-regular mt-3 text-slate-600">
                  {active.summary}
                </p>

                <p className="overline-xs-semibold mt-8 text-slate-400">
                  {coversLabel}
                </p>
                <div className="mt-3 space-y-3">
                  {active.body.map((para, i) => (
                    <p key={i} className="body-md-regular text-slate-700">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Channel / capability tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-25 px-3 py-1 text-[12px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Facts */}
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {active.facts.map((fact) => (
                    <li
                      key={fact}
                      className="body-sm-regular flex items-start gap-2 text-slate-600"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-brandblue-500" />
                      {fact}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    href={active.cta.href}
                    icon={ArrowRight}
                    iconPosition="right"
                    size="small"
                    variant="primary"
                  >
                    {active.cta.label}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — visual, changes per service */}
          <div className="relative min-h-[320px] overflow-hidden bg-brandblue-900 lg:min-h-full">
            {/* Gradient base (static). */}
            <div className="absolute inset-0 bg-gradient-to-br from-brandblue-700 via-brandblue-900 to-brandblue-950" />

            {/* Ghosted service-icon watermark (crossfades per service). */}
            <AnimatePresence>
              <motion.div
                key={`wm-${active.id}`}
                aria-hidden
                className="absolute -end-8 -top-8"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.08, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Icon src={active.icon} className="size-64 text-white" aria-hidden />
              </motion.div>
            </AnimatePresence>

            {/* Photo (crossfades per service; hides itself if the file is absent). */}
            <AnimatePresence>
              <motion.div
                key={`img-${active.id}`}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <ServicePhoto src={active.image} />
                {/* Legibility scrim behind the metric badge. */}
                <div className="absolute inset-0 bg-gradient-to-t from-brandblue-950/70 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Metric badge (changes per service). */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`metric-${active.id}`}
                  className="inline-flex flex-col rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span className="text-[30px] font-bold leading-none text-white">
                    {active.metric.value}
                  </span>
                  <span className="mt-1 text-[12px] uppercase tracking-[0.12em] text-brandblue-100">
                    {active.metric.label}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * next/image that removes itself if the source 404s, revealing the fallback.
 * Remounted per service via the parent's key, so `failed` resets on its own.
 */
function ServicePhoto({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt=""
      fill
      aria-hidden
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 380px"
      onError={() => setFailed(true)}
    />
  );
}
