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
 * Standard entrance: every `[data-reveal]` element inside the section rises
 * slightly and fades in, in DOM order, once the section reaches the viewport.
 * `data-reveal="soft"` uses a smaller movement (for large visuals).
 */
export function revealOnScroll(el: HTMLElement, start = "top 78%") {
  if (prefersReducedMotion()) return;
  const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", el);
  if (!items.length) return;
  gsap.from(items, {
    autoAlpha: 0,
    y: (_, target: HTMLElement) => (target.dataset.reveal === "soft" ? 14 : 20),
    duration: 0.8,
    ease: EASE,
    stagger: 0.07,
    scrollTrigger: { trigger: el, start, once: true },
  });
}

/** Desktop / mobile / reduced-motion query keys used with gsap.matchMedia */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
};
