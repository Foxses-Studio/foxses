"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Eyebrow, Heading, PRODUCT_META, Section, type ProductKey } from "./shared";
import { EASE, gsap, MQ, revealOnScroll, useGsap } from "@/lib/motion";

// Section 7 — brand values in one architectural grid. Copy is positioning,
// not proof: no prices, savings or comparisons.

const VALUES = [
  { title: "One connected platform", line: "Your business tools, working inside one ecosystem." },
  { title: "Simple by design", line: "Software that makes everyday work easier, not harder." },
  { title: "Built to grow with you", line: "Start with what you need. Add more when you're ready." },
  { title: "Built for better value", line: "Essential tools in one place, without the extra overhead." },
];

const CONNECTED: ProductKey[] = ["inventory", "invoice", "hr", "forms", "support"];

/* 01 — product lines converging on one Foxses node */
function ConnectedVisual() {
  const ys = [12, 31, 50, 69, 88];
  return (
    <div className="relative h-[170px] w-full max-w-[420px]" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 170" preserveAspectRatio="none">
        {ys.map((y) => (
          <path
            key={y}
            data-why-line
            d={`M ${0.34 * 420} ${y * 1.7} C ${0.55 * 420} ${y * 1.7}, ${0.62 * 420} 85, ${0.8 * 420 - 22} 85`}
            fill="none"
            pathLength={1}
            className="stroke-zinc-300 transition-colors duration-500 group-hover:stroke-[#f25b2a]/60 dark:stroke-zinc-700"
            strokeWidth={1}
          />
        ))}
      </svg>
      {CONNECTED.map((p, i) => {
        const { short, icon: Icon } = PRODUCT_META[p];
        return (
          <span
            key={p}
            className="absolute left-0 flex -translate-y-1/2 items-center gap-1.5 text-[16px] text-zinc-500 dark:text-zinc-400"
            style={{ top: `${ys[i]}%` }}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {short}
          </span>
        );
      })}
      <span data-why-node className="absolute left-[80%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f25b2a]/40 bg-white dark:bg-zinc-950">
          <Image src="/all-logo/foxses_logo.png" alt="" width={22} height={24} className="h-6 w-auto" />
        </span>
      </span>
    </div>
  );
}

/* 02 — scattered fragments give way to one clean workspace */
function SimpleVisual() {
  const fragments = [
    "left-[2%] top-[8%] w-[30%] h-[26%]",
    "left-[64%] top-[2%] w-[28%] h-[22%]",
    "left-[6%] top-[64%] w-[24%] h-[28%]",
    "left-[70%] top-[66%] w-[26%] h-[26%]",
    "left-[38%] top-[80%] w-[20%] h-[16%]",
  ];
  return (
    <div className="relative h-[170px] w-full max-w-[420px]" aria-hidden="true">
      {fragments.map((f) => (
        <span
          key={f}
          data-why-fragment
          className={`absolute rounded-[6px] border border-dashed border-zinc-300 opacity-50 transition-opacity duration-500 group-hover:opacity-20 dark:border-zinc-700 ${f}`}
        />
      ))}
      <span data-why-clean className="absolute left-[26%] top-[22%] h-[52%] w-[48%] overflow-hidden rounded-[6px] border border-zinc-900/80 bg-white dark:border-zinc-200 dark:bg-zinc-950">
        <span className="block h-[3px] w-full bg-[#f25b2a]" />
        <span className="mx-[10%] mt-[10%] block h-[8%] w-[40%] rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <span className="mx-[10%] mt-[6%] block h-[8%] w-[70%] rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
        <span className="mx-[10%] mt-[6%] block h-[8%] w-[55%] rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
      </span>
    </div>
  );
}

/* 03 — one track, progress filling from start to connect */
function GrowVisual() {
  const stages = ["Start", "Add", "Expand", "Connect"];
  return (
    <div className="relative w-full max-w-[420px] pt-12" aria-hidden="true">
      <div className="relative mx-[6%] h-px bg-zinc-200 dark:bg-zinc-800">
        <span data-why-progress className="absolute inset-y-0 left-0 w-full origin-left scale-x-[0.68] bg-[#f25b2a] transition-transform duration-500 group-hover:scale-x-100" />
      </div>
      <div className="relative -mt-[7px] flex justify-between px-[6%]">
        {stages.map((s, i) => (
          <span key={s} className="flex w-0 flex-col items-center">
            <span
              data-why-stage
              className={`h-3.5 w-3.5 rounded-full border-2 ${
                i < 3 ? "border-[#f25b2a] bg-[#f25b2a]" : "border-[#f25b2a] bg-white dark:bg-zinc-950"
              }`}
            />
            <span className="mt-3 whitespace-nowrap text-[16px] text-zinc-500 dark:text-zinc-400">{s}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* 04 — separate tools settling into one Foxses container */
function ValueVisual() {
  const tools: ProductKey[] = ["inventory", "invoice", "hr", "support"];
  return (
    <div className="relative flex h-[170px] w-full max-w-[420px] items-center justify-center" aria-hidden="true">
      <div className="relative w-[78%] rounded-[8px] border border-zinc-300 px-4 pb-4 pt-3 dark:border-zinc-700">
        <span className="mb-3 flex items-center gap-2 text-[16px] font-medium">
          <Image src="/all-logo/foxses_logo.png" alt="" width={16} height={18} className="h-4 w-auto" />
          Foxses
        </span>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((p, i) => {
            const { short, icon: Icon } = PRODUCT_META[p];
            return (
              <span
                key={p}
                data-why-tool={i}
                className="flex items-center gap-1.5 rounded-[6px] bg-zinc-100 px-2.5 py-1.5 text-[16px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} />
                {short}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const VISUALS = [ConnectedVisual, SimpleVisual, GrowVisual, ValueVisual];

export default function WhySection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (mm, el) => {
    revealOnScroll(el);

    mm.add(MQ.motion, () => {
      // Structure first, then each value and its visual, once
      gsap.from("[data-why-hline]", { scaleX: 0, duration: 1, ease: "power3.inOut", scrollTrigger: { trigger: "[data-why-grid]", start: "top 80%", toggleActions: "play none none none" } });
      gsap.from("[data-why-vline]", { scaleY: 0, duration: 1, ease: "power3.inOut", scrollTrigger: { trigger: "[data-why-grid]", start: "top 80%", toggleActions: "play none none none" } });
      gsap.from("[data-why-cell]", { autoAlpha: 0, y: 16, duration: 0.7, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: "[data-why-grid]", start: "top 75%", toggleActions: "play none none none" } });

      const cells = gsap.utils.toArray<HTMLElement>("[data-why-cell]");
      cells.forEach((cell, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: cell, start: "top 70%", toggleActions: "play none none none" }, defaults: { ease: EASE } });
        if (i === 0) {
          tl.fromTo(cell.querySelectorAll("[data-why-line]"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.06 })
            .from(cell.querySelector("[data-why-node]"), { scale: 0.6, autoAlpha: 0, duration: 0.5 }, "-=0.35");
        } else if (i === 1) {
          tl.from(cell.querySelectorAll("[data-why-fragment]"), { scale: 1.08, autoAlpha: 0, duration: 0.8, stagger: 0.05, clearProps: "opacity,visibility,transform" })
            .from(cell.querySelector("[data-why-clean]"), { autoAlpha: 0, y: 8, duration: 0.6 }, "-=0.5");
        } else if (i === 2) {
          tl.fromTo(cell.querySelector("[data-why-progress]"), { scaleX: 0 }, { scaleX: 0.68, duration: 1, ease: "power2.inOut", clearProps: "transform" })
            .from(cell.querySelectorAll("[data-why-stage]"), { scale: 0.4, duration: 0.3, stagger: 0.2 }, 0);
        } else {
          tl.from(cell.querySelectorAll("[data-why-tool]"), {
            x: (j: number) => (j % 2 === 0 ? -28 : 28),
            y: (j: number) => (j < 2 ? -14 : 14),
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.05,
          });
        }
      });
    });
  });

  return (
    <Section ref={ref} id="why" tone="white" labelledBy="why-heading">
      <div className="max-w-[760px]">
        <Eyebrow>Why Foxses</Eyebrow>
        <Heading id="why-heading" lead="Built simpler." accent="Designed to work together." />
      </div>

      <div data-why-grid className="relative mt-16 lg:mt-20">
        <span data-why-hline aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-zinc-200 dark:bg-zinc-800" />
        <span data-why-hline aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-zinc-200 dark:bg-zinc-800" />
        <span data-why-hline aria-hidden="true" className="absolute inset-x-0 top-1/2 hidden h-px origin-left bg-zinc-200 dark:bg-zinc-800 md:block" />
        <span data-why-vline aria-hidden="true" className="absolute inset-y-0 left-1/2 hidden w-px origin-top bg-zinc-200 dark:bg-zinc-800 md:block" />
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f25b2a] md:block" />

        <div className="grid grid-cols-1 md:grid-cols-2">
          {VALUES.map((v, i) => {
            const Visual = VISUALS[i];
            return (
              <article
                key={v.title}
                data-why-cell
                className={`group relative flex flex-col gap-8 py-12 transition-colors duration-500 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 md:py-14 lg:py-16
                  ${i % 2 === 0 ? "md:pr-10 lg:pr-14" : "md:pl-10 lg:pl-14"}
                  ${i > 0 ? "border-t border-zinc-200 dark:border-zinc-800 md:border-t-0" : ""}`}
              >
                <div className="flex items-start gap-6">
                  <span className="text-[56px] font-semibold leading-none tracking-tighter text-zinc-900/[0.08] tabular-nums dark:text-white/[0.08]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-2xl sm:text-[28px] font-semibold tracking-tight leading-tight">{v.title}</h3>
                    <p className="mt-2 max-w-[400px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-400">{v.line}</p>
                    <span
                      aria-hidden="true"
                      className="mt-5 block h-px w-8 bg-[#f25b2a] transition-all duration-500 group-hover:w-14"
                    />
                  </div>
                </div>
                <div className="md:pl-[86px]">
                  <Visual />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
