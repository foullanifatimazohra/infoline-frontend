"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Bluxart-inspired follower cursor.
 * A crisp dot tracks the pointer 1:1 while a larger ring follows with spring
 * lag. The ring scales up and the dot fades when hovering interactive targets.
 *
 * Styling lives in globals.css (.cursor-root / .cursor-ring / .cursor-dot).
 * The native cursor is hidden only while this island is active on a fine
 * pointer: it sets [data-custom-cursor] on <html>, which globals.css keys off.
 */
export default function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring lags behind with a soft spring for that trailing feel.
  const ringX = useSpring(dotX, { stiffness: 220, damping: 22, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 22, mass: 0.6 });

  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip entirely on touch / coarse pointers.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const root = document.documentElement;
    root.setAttribute("data-custom-cursor", "");

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, label, [data-cursor="interactive"]';

    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      // setState bails out when unchanged, so this is a no-op after the first.
      setVisible(true);

      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest(interactiveSelector)));
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      root.removeAttribute("data-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [dotX, dotY]);

  return (
    <div className="cursor-root" aria-hidden>
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: pressed ? 0.7 : hovering ? 1.8 : 1,
          opacity: visible ? (hovering ? 1 : 0.6) : 0,
          borderColor: hovering
            ? "var(--color-brandaccent-300)"
            : "var(--color-brandaccent-500)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: pressed ? 1.6 : hovering ? 0.3 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </div>
  );
}
