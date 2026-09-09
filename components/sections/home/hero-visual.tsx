"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Positions are % of the HeroVisual wrapper (top-left origin), tuned against
 * the design screenshot. chart.svg and percentage.svg carry their own
 * self-playing SMIL <animate> loops (line-draw + pulsing rings), so they
 * animate automatically once mounted — no framer-motion needed for that part.
 */
const CARDS = [
  {
    src: "/assets/hero/f2.svg", // headset icon
    w: 67,
    h: 80,
    top: "18%",
    start: "8%",
    depth: 22,
    float: 8,
    delay: 0,
  },
  {
    src: "/assets/hero/f3.svg", // waveform icon
    w: 62,
    h: 65,
    top: "41%",
    start: "0%",
    depth: 26,
    float: 10,
    delay: 0.4,
  },
  {
    src: "/assets/hero/f4.svg", // terminal icon
    w: 67,
    h: 75,
    top: "57%",
    start: "5%",
    depth: 20,
    float: 9,
    delay: 0.8,
  },
  {
    src: "/assets/hero/chart.svg", // animated line chart card
    w: 220,
    h: 160,
    top: "41%",
    start: "24%",
    depth: 38,
    float: 13,
    delay: 0.2,
  },
  {
    src: "/assets/hero/percentage.svg", // animated 80% circle card
    w: 150,
    h: 160,
    top: "55%",
    start: "54%",
    depth: 34,
    float: 12,
    delay: 1,
  },
] as const;

export default function HeroVisual() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced = useReducedMotion();
  const enabled = isDesktop && !prefersReduced;

  const wrapRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  const yImg = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const resetMove = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={resetMove}
      className="relative h-full w-full"
    >
      <motion.div
        style={enabled ? { y: yImg } : undefined}
        className="lg:absolute w-full relative inset-0"
      >
        <Image
          src="/assets/hero/arc.svg"
          alt="Infoline customer operations team reviewing live performance dashboards"
          width={680}
          height={550}
          priority
          className="object-contain w-auto object-bottom"
        />
      </motion.div>

      {/* Desktop: absolute + parallax + idle bob. Hidden below lg. */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {CARDS.map((card, i) => (
          <FloatingCard
            key={`${card.src}-${i}`}
            card={card}
            sx={sx}
            sy={sy}
            enabled={enabled}
          />
        ))}
      </div>

      {/* Mobile / tablet: plain static row, no absolute positioning, no motion. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:hidden">
        {CARDS.map((card, i) => (
          <Image
            key={`${card.src}-static-${i}`}
            src={card.src}
            alt=""
            aria-hidden
            width={card.w}
            height={card.h}
            className="h-auto w-[clamp(48px,18vw,120px)] drop-shadow-[0_18px_40px_rgba(28,151,212,0.28)]"
          />
        ))}
      </div>
    </div>
  );
}

function FloatingCard({
  card,
  sx,
  sy,
  enabled,
}: {
  card: (typeof CARDS)[number];
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  enabled: boolean;
}) {
  const x = useTransform(sx, (v) => -v * card.depth);
  const y = useTransform(sy, (v) => -v * card.depth);

  return (
    <motion.div
      style={{
        insetBlockStart: card.top,
        insetInlineStart: card.start,
        ...(enabled ? { x, y } : {}),
      }}
      className="absolute"
    >
      <motion.div
        animate={enabled ? { y: [0, -card.float, 0] } : undefined}
        transition={
          enabled
            ? {
                duration: 5 + card.float / 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay,
              }
            : undefined
        }
      >
        <Image
          src={card.src}
          alt=""
          aria-hidden
          width={card.w}
          height={card.h}
          className="h-auto w-[clamp(48px,10vw,220px)] drop-shadow-[0_18px_40px_rgba(28,151,212,0.28)]"
        />
      </motion.div>
    </motion.div>
  );
}
