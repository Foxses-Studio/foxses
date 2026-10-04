"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Shared GSAP setup for homepage sections.
// Content is fully visible without JavaScript; animations only ever start
// from a hidden state once GSAP is running, and are skipped for reduced motion.

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASE = "power3.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs `setup` inside a gsap.context scoped to `scope`, and reverts every tween
 * and ScrollTrigger it created on unmount. `setup` receives a gsap.matchMedia
 * instance so sections can define desktop/mobile/reduced-motion variants.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, el: HTMLElement) => void,
  deps: unknown[] = []
) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    const ctx = gsap.context(() => setup(mm, el), el);
    return () => {
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Standard entrance: each `[data-reveal]` element rises slightly and fades in
 * as it reaches the viewport (batched, so neighbours stagger together).
 * `data-reveal="soft"` uses a smaller movement (for large visuals).
 *
 * Triggers are never `once` — self-killing triggers during a refresh (e.g.
 * when the browser restores scroll on reload) corrupt ScrollTrigger's list.
 */
export function revealOnScroll(el: HTMLElement, start = "top 88%") {
  if (prefersReducedMotion()) return;
  const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", el);
  if (!items.length) return;
  gsap.set(items, { autoAlpha: 0, y: (_: number, t: HTMLElement) => (t.dataset.reveal === "soft" ? 16 : 22) });
  ScrollTrigger.batch(items, {
    start,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.85, ease: EASE, stagger: 0.08, overwrite: true }),
  });
}

/** Desktop / mobile / reduced-motion query keys used with gsap.matchMedia */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
};
