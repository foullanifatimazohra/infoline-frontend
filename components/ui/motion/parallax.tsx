"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Scroll-linked vertical parallax. As the element passes through the viewport
 * it drifts on the Y axis, creating depth against the rest of the page.
 *
 * Gated to desktop (pointer-precise, larger screens) and disabled under
 * `prefers-reduced-motion`, mirroring the hero's approach. The Y axis is
 * direction-agnostic, so it is inherently RTL-safe.
 *
 * IMPORTANT (no gaps): the moving layer must be LARGER than the frame that
 * clips it (e.g. `-inset-y-[12%]` or a static `scale-110` on an inner image),
 * otherwise the translation exposes an edge. Call sites size the layer.
 */
export function Parallax({
  children,
  as = "div",
  className,
  /**
   * Drift as a fraction of the element's own height across a full scroll pass.
   * 0.15 → moves from +15% to -15% (upward as the user scrolls down).
   */
  speed = 0.15,
}: {
  children: ReactNode;
  as?: "div" | "span";
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const enabled = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pct = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${pct}%`, `${-pct}%`]);

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      style={enabled ? { y, willChange: "transform" } : undefined}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
