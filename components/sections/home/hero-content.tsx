"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Wraps the hero text column with two independent motion layers:
 *  - Scroll parallax: drifts opposite HeroVisual's image parallax so the
 *    two columns feel like they sit at different depths while scrolling.
 *  - Idle motion: a slow breathing bob + very light cursor tilt so the
 *    hero still feels alive when the user isn't scrolling.
 * Disabled on mobile and for prefers-reduced-motion.
 */
export default function HeroContent({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced = useReducedMotion();
  const enabled = isDesktop && !prefersReduced;

  const wrapRef = useRef<HTMLDivElement>(null);

  // Scroll parallax — opposite direction to HeroVisual's yImg ([-4%, 4%]),
  // so the columns visibly separate on scroll.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const yScroll = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  // Pointer tilt — same spring feel as the floating cards, kept tiny
  // so text stays crisp.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 100, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 100, damping: 22, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [1.5, -1.5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-1.5, 1.5]);

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
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={resetMove}
      style={enabled ? { y: yScroll } : undefined}
      className="relative"
    >
      <motion.div
        style={
          enabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined
        }
        animate={enabled ? { y: [0, -6, 0] } : undefined}
        transition={
          enabled
            ? { duration: 7, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
