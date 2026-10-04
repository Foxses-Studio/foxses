"use client";

import React, { useEffect, useState, type RefObject } from "react";

// Autoplay for tabbed sections. A thin bar fills over `duration`; when its CSS
// animation ends, `onDone` advances the tab. Pausing the animation (hover, off
// screen, hidden tab) pauses the timer with it, and reduced motion disables the
// animation entirely — so nothing advances on its own.

/** Paused while the area is hovered, off screen or the browser tab is hidden */
export function useAutoplayPause(ref: RefObject<HTMLElement | null>) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);

  return {
    paused: hovered || !inView || hidden,
    hoverProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}

export function AutoProgress({
  cycleKey,
  duration,
  paused,
  onDone,
  className = "",
}: {
  /** changes whenever the active item changes, restarting the timer */
  cycleKey: string | number;
  duration: number;
  paused: boolean;
  onDone: () => void;
  className?: string;
}) {
  return (
    <span
      key={cycleKey}
      aria-hidden="true"
      data-paused={paused}
      onAnimationEnd={(e) => {
        if (e.animationName === "fx-progress") onDone();
      }}
      className={`fx-progress block bg-[#f25b2a] ${className}`}
      style={{ animationDuration: `${duration}ms` }}
    />
  );
}
