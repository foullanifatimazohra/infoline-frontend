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
 * Floating glass elements over the hero photo.
 * - `start` / `top` use CSS logical positioning (insetInlineStart / insetBlockStart)
 *   so they automatically mirror to the correct side when `dir="rtl"` is set
 *   on <html>. No JS branching needed for layout.
 * - `depth` = pointer-parallax strength (px), `float` = idle bob amplitude (px).
 * - Assets are expected to already include the glass-card chrome (blur, border,
 *   inner glow) baked in from Figma — this component only handles motion.
 */
const CARDS = [
  {
    src: "/assets/hero/f4.svg",
    w: 64,
    h: 64,
    top: "28%",
    start: "17%",
    depth: 22,
    float: 8,
    delay: 0,
  },
  {
    src: "/assets/hero/f4.svg",
    w: 56,
    h: 56,
    top: "45%",
    start: "2%",
    depth: 26,
    float: 10,
    delay: 0.4,
  },
  {
    src: "/assets/hero/f4.svg",
    w: 56,
    h: 56,
    top: "60%",
    start: "7%",
    depth: 20,
    float: 9,
    delay: 0.8,
  },
  {
    src: "/assets/hero/f3.svg",
    w: 150,
    h: 110,
    top: "38%",
    start: "24%",
    depth: 38,
    float: 13,
    delay: 0.2,
  },
  {
    src: "/assets/hero/f2.svg",
    w: 110,
    h: 110,
    top: "49%",
    start: "52%",
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

  // Pointer parallax (normalized -0.5..0.5, spring-smoothed).
  // Relative to the component's own bounding box, so it needs no
  // RTL handling — cursor-follow feels correct in either direction.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  // Scroll parallax for background layers.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const yGlow = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const yArc = useTransform(scrollYProgress, [0, 1], [40, -30]);
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
      {/* Hero photo — never flip real photography for RTL */}
      <motion.div
        style={enabled ? { y: yImg } : undefined}
        className="lg:absolute relative inset-0"
      >
        <Image
          src="/assets/hero/arc.svg"
          alt="Infoline customer operations team reviewing live performance dashboards"
          width={647}
          height={560}
          priority
          className="object-contain h-full  object-bottom"
        />
      </motion.div>

      {/* Floating glass cards */}
      {/* {CARDS.map((card) => (
        <FloatingCard
          key={card.src}
          card={card}
          sx={sx}
          sy={sy}
          enabled={enabled}
        />
      ))} */}
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
  // Pointer depth: each card shifts opposite the cursor by its own strength.
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
      {/* Idle bob lives on a child so it never fights the pointer transform */}
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
          className="h-auto w-[clamp(48px,6vw,150px)] drop-shadow-[0_18px_40px_rgba(28,151,212,0.28)]"
        />
      </motion.div>
    </motion.div>
  );
}
