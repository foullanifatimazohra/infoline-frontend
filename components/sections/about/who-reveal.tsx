"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Who-we-are reveal — the Lightship-style "SVG mask scroll" adapted to the
 * Figma three-window frame (who-mask.svg).
 *
 * Structure: a tall section (300vh) provides the scroll runway while an inner
 * sticky frame stays pinned for the full pass. ONE photo sits behind the
 * frame; the three-window mask is a separate layer that starts small and
 * scales up with scroll progress until the windows swallow the viewport and
 * the photo reads full-bleed. The copy rides above and fades out as the mask
 * takes over. Desktop + motion-safe only; otherwise it renders as a static
 * masked image (same fallback contract as <Parallax>).
 *
 * The mask layer is oversized (inset -50%) so the scale-up never exposes an
 * edge, and `preserveAspectRatio="none"` on the mask SVG lets the windows
 * stretch with the frame at every scale.
 */
export function WhoReveal({
  children,
}: {
  /** Foreground copy (server-rendered) — fades out as the mask grows. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const enabled = isDesktop && !reduce;

  // Runway: 0 → 1 across the 300vh section while the inner frame is pinned.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Mask scale: windows start at the composed Figma size (≈55% of the frame
  // width) and grow to 6x — enough for the corner windows to leave the
  // viewport at any aspect ratio — while the photo behind stays static.
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 6]);
  // Copy and mask wash fade once the reveal is well underway.
  const fade = useTransform(scrollYProgress, [0.1, 0.45], [1, 0]);
  // Photo eases toward centre framing as it becomes the full background.
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* ONE photo behind everything */}
        <motion.div
          className="absolute inset-0"
          style={enabled ? { scale: imgScale } : undefined}
        >
          <Image
            src="/assets/about/who-full.jpg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Mask layer: starts as the three Figma windows, scales up on scroll.
            Oversized (inset -50%) so scaling never exposes an edge. */}
        <motion.div
          aria-hidden
          className="who-window-mask pointer-events-none absolute inset-[-50%]"
          style={
            enabled
              ? { scale, willChange: "transform" }
              : { transform: "scale(1)" }
          }
        />

        {/* Foreground copy — fades as the reveal takes over */}
        <motion.div
          className="relative mx-auto w-full max-w-360 px-6 lg:px-10"
          style={enabled ? { opacity: fade } : undefined}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
