"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/** Pin line in px — Tailwind `top-28`, clear of the 85px header. */
const PIN = 112;
/** Scroll distance over which an incoming card eases into its fanned pose. */
const RUNWAY = 300;
/**
 * Resting pose of each card once pinned (LTR). Offsets and tilts differ so
 * every earlier card still peeks out from under the ones that land on it.
 */
const FAN = [
  { x: -80, rotate: 0 },
  { x: -16, rotate: 6 },
  { x: 48, rotate: -6 },
  { x: 80, rotate: 4 },
];

/**
 * "Why join" Scroll Stack. On desktop every card pins (`sticky`) at the same
 * line and, over the last {@link RUNWAY}px before it pins, slides and tilts
 * into its own fanned pose, so the pile builds up layer by layer. All cards
 * share the list as their containing block and release together when it ends.
 * Progress is scroll-linked, so scrolling back unwinds the stack.
 *
 * Below `lg` and under `prefers-reduced-motion` the cards are a plain column.
 * RTL mirrors the horizontal offsets and tilts.
 */
export default function WhyJoinStack({ chips }: { chips: string[] }) {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isRtl = useLocale() === "ar";
  const enabled = isDesktop && !reduce;

  // The empty `::after` item (not padding — sticky is bounded by the content
  // box) lets the last card pin too, holding the finished pile for one gap.
  return (
    <ul className="mt-9 flex w-full max-w-[265px] flex-col gap-9 lg:motion-safe:gap-[120px] lg:motion-safe:after:content-['']">
      {chips.map((chip, i) => (
        <StackCard
          key={chip}
          chip={chip}
          index={i}
          enabled={enabled}
          dir={isRtl ? -1 : 1}
        />
      ))}
    </ul>
  );
}

function StackCard({
  chip,
  index,
  enabled,
  dir,
}: {
  chip: string;
  index: number;
  enabled: boolean;
  dir: 1 | -1;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // 0 while the card is RUNWAY px below the pin line, 1 once it pins (a pinned
  // card measures at the pin line, so it holds 1 until the stack releases).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${PIN + RUNWAY}px`, `start ${PIN}px`],
  });
  const fan = FAN[index % FAN.length];
  const x = useTransform(scrollYProgress, [0, 1], [0, fan.x * dir]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, fan.rotate * dir]);
  const brand = index % 2 === 1;

  return (
    <li ref={ref} className="lg:top-28 lg:motion-safe:sticky">
      <motion.div
        style={enabled ? { x, rotate, willChange: "transform" } : undefined}
        className={`flex min-h-[210px] flex-col gap-6 rounded-[20px] px-6 pt-5 pb-8 text-start ${
          brand
            ? "bg-brandblue-500 text-white"
            : "bg-[#d7eaf4] text-brandblue-600"
        }`}
      >
        <Image
          src={`/assets/careers/learn/${index + 1}.svg`}
          alt=""
          aria-hidden
          width={36}
          height={36}
          className="size-9 flex-none"
        />
        <p className="text-[28px] leading-8 font-medium">{chip}</p>
      </motion.div>
    </li>
  );
}
