"use client";

import { useEffect, useRef } from "react";

/**
 * Magnetic CTA effect: pointer-tracking translation (max ~5px) with a
 * 420ms spring-back on leave. Ported from `data-magnetic`.
 */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (ev.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (ev.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate3d(${(dx * 5).toFixed(2)}px,${(dy * 4 - 2).toFixed(2)}px,0)`;
    };
    const onLeave = () => {
      el.style.transition =
        "transform .42s cubic-bezier(.34,1.4,.5,1), background .3s ease, box-shadow .3s ease";
      el.style.transform = "translate3d(0,0,0)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}
