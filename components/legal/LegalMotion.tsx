"use client";

import React, { useEffect, useRef } from "react";
import { gsap, MQ, useGsap } from "@/lib/motion";

// Legal pages stay still: one short entrance on load, plus a thin
// reading-progress line for the policy article. Nothing animates on scroll.

export default function LegalMotion({ articleId, children }: { articleId: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGsap(ref, (mm) => {
    mm.add(MQ.motion, () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-legal='visual']", { autoAlpha: 0, duration: 0.7 })
        .from("[data-legal='label']", { autoAlpha: 0, duration: 0.4 }, 0)
        .from("[data-legal='title']", { autoAlpha: 0, y: 14, duration: 0.6 }, 0.05)
        .from("[data-legal='meta']", { autoAlpha: 0, duration: 0.4 }, 0.2)
        .from("[data-legal='body']", { autoAlpha: 0, y: 10, duration: 0.5 }, 0.25);
    });
  });

  useEffect(() => {
    const article = document.getElementById(articleId);
    const bar = barRef.current;
    if (!article || !bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [articleId]);

  return (
    <div ref={ref}>
      <span
        ref={barRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] block h-[2px] origin-left bg-[#f25b2a]"
        style={{ transform: "scaleX(0)" }}
      />
      {children}
    </div>
  );
}
