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
 * Positions are eyeballed against the Figma/design screenshot as % of the
 * HeroVisual wrapper (top-left origin). Fine-tune live in devtools if the
 * final image asset's crop/whitespace differs slightly from the mock.
 */
const CARDS = [
  {
    src: "/assets/hero/f2.svg", // headset icon — above the shoulders, left of the chart card
    w: 64,
    h: 64,
    top: "18%",
    start: "10%",
    depth: 22,
    float: 3,
    delay: 0,
  },
  {
    src: "/assets/hero/f3.svg", // waveform icon — left edge, mid height
    w: 56,
    h: 56,
    top: "30%",
    start: "0%",
    depth: 26,
    float: 10,
    delay: 0.4,
  },
  {
    src: "/assets/hero/f4.svg", // terminal icon — below waveform, slightly right
    w: 56,
    h: 56,
    top: "45%",
    start: "3%",
    depth: 20,
    float: 9,
    delay: 0.8,
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
        className="lg:absolute w-full h-full relative inset-0"
      >
        <Image
          src="/assets/hero/arc.svg"
          alt="Infoline customer operations team reviewing live performance dashboards"
          width={680}
          height={550}
          priority
          className="object-contain w-full object-bottom"
        />
      </motion.div>

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
          className="h-auto w-[clamp(48px,6vw,235px)] drop-shadow-[0_18px_40px_rgba(28,151,212,0.28)]"
        />
      </motion.div>
    </motion.div>
  );
}
