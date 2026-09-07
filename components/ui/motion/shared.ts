/**
 * Shared, framework-pure helpers for the motion primitives.
 *
 * This file is intentionally NOT `"use client"` — it exports only constants,
 * a type, and a pure function, so it can be imported by the client motion
 * islands without pulling anything server-only into the browser bundle.
 */

/** Expo-out easing — matches the `cubic-bezier(.16,1,.3,1)` used throughout the CSS. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Direction an element travels from as it reveals.
 * - `up` / `down` are physical and direction-agnostic (safe in LTR and RTL).
 * - `start` / `end` are LOGICAL: `start` enters from the reading-start edge
 *   (left in LTR, right in RTL) and `end` from the reading-end edge. They are
 *   mirrored automatically via the `isRtl` flag so nothing is hard-coded to a
 *   physical side.
 */
export type RevealDirection = "up" | "down" | "start" | "end" | "none";

/**
 * Resolve the initial x/y translate (in px) for a reveal direction.
 * `start`/`end` flip their horizontal sign under RTL so content always enters
 * from the correct reading edge.
 */
export function directionOffset(
  direction: RevealDirection,
  distance: number,
  isRtl: boolean,
): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "start":
      // start edge = left in LTR (begin offset left, x negative), right in RTL.
      return { x: isRtl ? distance : -distance, y: 0 };
    case "end":
      return { x: isRtl ? -distance : distance, y: 0 };
    case "none":
    default:
      return { x: 0, y: 0 };
  }
}
