"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "./shared";

/**
 * Counts a numeric string up from zero when it scrolls into view.
 *
 * Handles the real stat formats used on the site — "22", "1,400+", "6M", "68" —
 * by splitting the string into an optional prefix, the numeric core, and a
 * trailing suffix, animating only the number and re-attaching prefix/suffix.
 * Thousands separators are preserved during the count.
 *
 * Locale/RTL-safe: both `en` and `ar` stat values use Latin digits, so no digit
 * localisation is applied and the count reads correctly in either direction.
 *
 * Degrades gracefully:
 * - Unparseable value → renders the raw string (still fades via its parent).
 * - `prefers-reduced-motion` / SSR / no-JS → shows the final value immediately.
 *
 * Like the other motion primitives, the count plays once by default and does
 * not replay when the element scrolls out and back in (pass `once={false}` to
 * restore the replay behaviour).
 */
type Parsed = {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  thousands: boolean;
};

function parse(value: string): Parsed | null {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, numStr, suffix] = m;
  const target = parseFloat(numStr.replace(/,/g, ""));
  if (Number.isNaN(target)) return null;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix, suffix, target, decimals, thousands: numStr.includes(",") };
}

export function CountUp({
  value,
  duration = 1.6,
  className,
  amount = 0.5,
  once = true,
}: {
  value: string;
  duration?: number;
  className?: string;
  /** Fraction visible before the count starts (0–1). */
  amount?: number;
  /** Count a single time (default) instead of replaying on every re-entry. */
  once?: boolean;
}) {
  const parsed = parse(value);
  const reduce = useReducedMotion();
  const enabled = parsed !== null && !reduce;

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount });
  // Start from the real value so SSR / no-JS shows the correct number.
  const [display, setDisplay] = useState(value);

  const format = (n: number) => {
    if (!parsed) return value;
    const { prefix, suffix, decimals, thousands } = parsed;
    const rounded = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString();
    const body = thousands
      ? Number(rounded).toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : rounded;
    return `${prefix}${body}${suffix}`;
  };

  // Reset to zero whenever the element is out of view, so the count replays
  // each time it re-enters. Deferred to a frame callback so it does not set
  // state synchronously inside the effect body.
  useEffect(() => {
    if (!enabled || inView) return;
    const id = requestAnimationFrame(() => setDisplay(format(0)));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, inView]);

  // Count up from zero every time it enters view.
  useEffect(() => {
    if (!enabled || !inView || !parsed) return;
    const controls = animate(0, parsed.target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, inView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
