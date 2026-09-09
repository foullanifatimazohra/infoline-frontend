"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./shared";

/**
 * Media / panel reveal: as the element enters the viewport a solid "curtain"
 * that covers it retracts bottom-to-top, uncovering the panel with a cinematic
 * wipe. An optional inner layer eases out of a slight zoom so images "settle"
 * into place.
 *
 * Why a curtain instead of an animated `clip-path`: framer-motion interpolates
 * transforms rock-solidly, whereas animating a `clip-path: inset(… round …)`
 * string is fragile — if it fails to interpolate the element stays stuck at its
 * clipped initial value and never appears. The curtain wipes the *whole* panel
 * (background included) and, because the panel keeps its own `overflow-hidden`
 * rounding, the curtain is clipped to the same rounded corners for free.
 *
 * The panel content is always rendered (only visually covered), so a reveal can
 * never leave it permanently hidden. Composes with hover zoom: the wipe is a
 * separate overlay, so a `group-hover:scale` on a child image is untouched.
 * Respects `prefers-reduced-motion` (plain fade, no curtain).
 *
 * The host element must be a positioned, clipping box — pass `relative
 * overflow-hidden` (and any rounding) in `className`, as the curtain is an
 * absolutely-positioned overlay.
 */
export function ClipReveal({
  children,
  className,
  duration = 1.15,
  delay = 0,
  once = false,
  amount = 0.3,
  zoom = true,
  curtainClassName = "bg-white",
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  once?: boolean;
  /** Fraction visible before it triggers (0–1). */
  amount?: number;
  /** Ease an inner layer out of a slight zoom as it reveals. */
  zoom?: boolean;
  /**
   * Utility classes for the curtain fill. Default `bg-white` blends into a light
   * section; set it to match the surrounding page so the panel appears to rise
   * out of the background.
   */
  curtainClassName?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount }}
        transition={{ duration: 0.4, ease: "easeOut", delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {zoom ? (
        <motion.div
          style={{ height: "100%", width: "100%", willChange: "transform" }}
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once, amount }}
          transition={{ duration: duration + 0.2, ease: EASE, delay }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}

      {/* Curtain: covers the panel, then retracts upward to uncover it from the
          bottom up. `pointer-events-none` so it never blocks the content beneath
          even mid-animation. */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-20 ${curtainClassName}`}
        style={{ transformOrigin: "top", willChange: "transform" }}
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once, amount }}
        transition={{ duration, ease: EASE, delay }}
      />
    </div>
  );
}
