"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { ArrowRight } from "lucide-react";
import { TextLink } from "./shared";
import { EASE, gsap, MQ, useGsap } from "@/lib/motion";

// Section 14 — the closing statement. One message, one action.
// "Get Started" mirrors the navbar's current onboarding placeholder until a
// real signup route exists; swap `startOnboarding` for that route then.

function startOnboarding() {
  Swal.fire({
    title: "Get Started",
    text: "Create your Foxses account.",
    icon: "info",
    confirmButtonText: "Continue",
    confirmButtonColor: "#f25b2a",
  });
}

// Lines enter from the edges and stop short of the copy
const LEFT_LINES = ["M0 90 L235 250", "M0 360 L170 360", "M0 640 L235 480"];
const RIGHT_LINES = ["M1200 70 L965 250", "M1200 360 L1030 360", "M1200 650 L965 480"];

export default function FinalCtaSection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (mm) => {
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-cta-copy]", start: "top 80%", once: true }, defaults: { ease: EASE } });
      tl.fromTo("[data-cta-line]", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.05, ease: "power2.inOut" })
        .from("[data-cta-icon]", { autoAlpha: 0, scale: 0.9, duration: 0.5 }, 0.2)
        .from("[data-cta-step]", { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.09 }, 0.3)
        .from("[data-cta-node]", { autoAlpha: 0, duration: 0.4, stagger: 0.04 }, 0.9);
    });
    // Desktop: the outer geometry draws inward as the section reaches centre, then settles
    mm.add(MQ.desktop, () => {
      const st = { trigger: "[data-cta-copy]", start: "top bottom", end: "center center", scrub: 0.8 };
      gsap.fromTo("[data-cta-side='left']", { x: -40 }, { x: 0, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-cta-side='right']", { x: 40 }, { x: 0, ease: "none", scrollTrigger: st });
    });
  });

  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative w-full overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-[#fafaf8] to-white text-zinc-900 dark:border-zinc-800 dark:from-[#0c0c0e] dark:to-zinc-950 dark:text-white"
    >
      {/* Brand geometry — decorative */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice">
        <g data-cta-side="left">
          {LEFT_LINES.map((d) => (
            <path key={d} data-cta-line d={d} pathLength={1} fill="none" className="stroke-zinc-300/80 dark:stroke-zinc-700/80" strokeWidth={1} />
          ))}
          <circle data-cta-node cx={235} cy={250} r={3.5} fill="#f25b2a" />
          <circle data-cta-node cx={235} cy={480} r={3} className="fill-zinc-400 dark:fill-zinc-600" />
          <text x={24} y={78} className="fill-zinc-400 text-[14px] uppercase tracking-[0.2em] max-sm:hidden dark:fill-zinc-600">Operations</text>
          <text x={24} y={660} className="fill-zinc-400 text-[14px] uppercase tracking-[0.2em] max-sm:hidden dark:fill-zinc-600">Finance</text>
        </g>
        <g data-cta-side="right">
          {RIGHT_LINES.map((d) => (
            <path key={d} data-cta-line d={d} pathLength={1} fill="none" className="stroke-zinc-300/80 dark:stroke-zinc-700/80" strokeWidth={1} />
          ))}
          <circle data-cta-node cx={965} cy={480} r={3.5} fill="#f25b2a" />
          <circle data-cta-node cx={965} cy={250} r={3} className="fill-zinc-400 dark:fill-zinc-600" />
          <text x={1176} y={58} textAnchor="end" className="fill-zinc-400 text-[14px] uppercase tracking-[0.2em] max-sm:hidden dark:fill-zinc-600">People</text>
          <text x={1176} y={672} textAnchor="end" className="fill-zinc-400 text-[14px] uppercase tracking-[0.2em] max-sm:hidden dark:fill-zinc-600">Customers</text>
        </g>
      </svg>

      <div className="relative mx-auto flex min-h-[720px] max-w-[1600px] items-center justify-center px-4 py-28 sm:px-8 lg:min-h-[800px] lg:px-12">
        <div data-cta-copy className="mx-auto max-w-[1000px] text-center">
          <span data-cta-icon className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#f25b2a]/30 bg-white dark:bg-zinc-950">
            <Image src="/all-logo/foxses_logo.png" alt="" width={30} height={32} className="h-8 w-auto" />
          </span>
          <h2 id="cta-heading" className="text-[40px] sm:text-6xl lg:text-[80px] font-semibold tracking-tight leading-[1.02]">
            <span data-cta-step className="block">Your business.</span>
            <span data-cta-step className="block">One connected place.</span>
            <span data-cta-step className="mt-3 block text-[30px] font-bold text-[#f25b2a] sm:text-5xl lg:text-[60px]">
              Start building it with Foxses.
            </span>
          </h2>

          <div data-cta-step className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
            <button
              type="button"
              onClick={startOnboarding}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#f25b2a] px-7 text-[16px] font-medium text-white transition-colors hover:bg-[#d84b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true" />
            </button>
            <TextLink href="#products">Explore Products</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
