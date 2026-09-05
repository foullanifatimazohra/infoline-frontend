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

/** Floating glass cards. `depth` = pointer-parallax strength (px),
 *  `float` = idle bob amplitude (px). Positions are % of the frame —
 *  tweak to taste; negatives let a card bleed left over the copy. */
const CARDS = [
  {
    src: "/hero/card-1.svg",
    w: 134,
    h: 147,
    top: "8%",
    left: "-6%",
    depth: 30,
    float: 10,
    delay: 0,
  },
  {
    src: "/hero/card-2.svg",
    w: 111,
    h: 131,
    top: "44%",
    left: "-12%",
    depth: 46,
    float: 14,
    delay: 0.6,
  },
  {
    src: "/hero/card-3.svg",
    w: 117,
    h: 131,
    top: "66%",
    left: "4%",
    depth: 38,
    float: 12,
    delay: 1.2,
  },
] as const;

export default function HeroVisual() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced = useReducedMotion();
  const enabled = isDesktop && !prefersReduced;

  const wrapRef = useRef<HTMLDivElement>(null);

  // Pointer parallax (normalized -0.5..0.5, spring-smoothed).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  // Scroll parallax for the background layers.
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
      className="relative h-[420px] w-full lg:h-[560px]"
    >
      {/* Soft radial glow */}
      <motion.div
        style={enabled ? { y: yGlow } : undefined}
        className="pointer-events-none absolute -inset-x-24 -top-24 -bottom-10 -z-10"
      >
        <Image
          src="/hero/glow.svg"
          alt=""
          aria-hidden
          fill
          priority
          className="object-contain object-center opacity-80"
        />
      </motion.div>

      {/* Bottom arc */}
      <motion.div
        style={enabled ? { y: yArc } : undefined}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
      >
        <Image
          src="/hero/arc.svg"
          alt=""
          aria-hidden
          width={674}
          height={155}
          className="h-auto w-full"
        />
      </motion.div>

      {/* Hero photo */}
      <motion.div
        style={enabled ? { y: yImg } : undefined}
        className="absolute inset-0"
      >
        <Image
          src="/hero/team.svg"
          alt="Infoline customer operations team reviewing live performance dashboards"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* Floating glass cards */}
      {CARDS.map((card, i) => (
        <FloatingCard
          key={card.src}
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
  // Pointer depth: each card shifts opposite the cursor by its own strength.
  const x = useTransform(sx, (v) => -v * card.depth);
  const y = useTransform(sy, (v) => -v * card.depth);

  return (
    <motion.div
      style={{
        top: card.top,
        left: card.left,
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
          className="h-auto w-[clamp(78px,7vw,134px)] drop-shadow-[0_18px_40px_rgba(28,151,212,0.28)]"
        />
      </motion.div>
    </motion.div>
  );
}
