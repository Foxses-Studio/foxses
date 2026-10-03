"use client";

import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Heading, PRODUCT_META, Section, TextLink, type ProductKey } from "./shared";
import { EASE, gsap, MQ, revealOnScroll, useGsap } from "@/lib/motion";

// Section 12 — pricing preview.
// No Foxses prices, trial terms or billing periods are confirmed yet, so this
// shows the pricing *model* only (Option B). When pricing is final, fill in
// PRICING below: a route enables the CTA, per-product prices can drive a
// configurator — nothing is shown until it is real.

interface ProductPrice {
  product: ProductKey;
  amount: number;
  currency: string;
  period: "month" | "year";
}

const PRICING: { href: string | null; prices: ProductPrice[] } = {
  href: null,
  prices: [],
};

const STAGES: { label: string; line: string; products: ProductKey[] }[] = [
  { label: "Start", line: "Pick the tools you need today.", products: ["inventory"] },
  { label: "Add", line: "Bring in more as work expands.", products: ["inventory", "invoice"] },
  { label: "Grow", line: "Build the setup around your business.", products: ["inventory", "invoice", "hr", "support"] },
];

function Chip({ product }: { product: ProductKey }) {
  const { short, icon: Icon } = PRODUCT_META[product];
  return (
    <span data-price-chip className="inline-flex items-center gap-1.5 rounded-[6px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[16px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
      <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
      {short}
    </span>
  );
}

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (mm, el) => {
    revealOnScroll(el);
    mm.add(MQ.motion, () => {
      const stages = gsap.utils.toArray<HTMLElement>("[data-price-stage]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-price-track]", start: "top 75%", toggleActions: "play none none none" }, defaults: { ease: EASE } });
      stages.forEach((stage, i) => {
        tl.from(stage, { autoAlpha: 0, y: 14, duration: 0.5 }, i * 0.15).from(
          stage.querySelectorAll("[data-price-chip]"),
          { autoAlpha: 0, y: 6, duration: 0.35, stagger: 0.05 },
          i * 0.15 + 0.2
        );
      });
    });
  });

  return (
    <Section ref={ref} id="pricing" tone="warm" labelledBy="pricing-heading">
      <div className="mx-auto max-w-[760px] text-center">
        <Eyebrow>Simple pricing</Eyebrow>
        <Heading id="pricing-heading" lead="Start with what you need." accent="Grow when you're ready." />
      </div>

      <ol data-price-track className="mt-16 grid grid-cols-1 border-y border-zinc-200 dark:border-zinc-800 md:grid-cols-3 lg:mt-20">
        {STAGES.map((s, i) => (
          <li
            key={s.label}
            data-price-stage
            className={`relative flex flex-col gap-5 py-8 sm:py-10 md:px-8 lg:px-10 ${i > 0 ? "border-t border-zinc-200 dark:border-zinc-800 md:border-l md:border-t-0" : "md:pl-0"}`}
          >
            {i < STAGES.length - 1 && (
              <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-[#fafaf8] text-[#f25b2a] dark:border-zinc-800 dark:bg-[#0c0c0e] md:flex">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
            <div>
              <p className="flex items-baseline gap-3">
                <span className="tabular-nums text-[16px] text-[#f25b2a]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-2xl font-semibold tracking-tight">{s.label}</span>
              </p>
              <p className="mt-2 text-[16px] text-zinc-600 dark:text-zinc-400">{s.line}</p>
            </div>
            <div className="mt-auto flex flex-wrap content-end gap-2 sm:min-h-[92px]" aria-label={`Example setup: ${s.products.map((p) => PRODUCT_META[p].short).join(", ")}`}>
              {s.products.map((p) => (
                <Chip key={p} product={p} />
              ))}
            </div>
          </li>
        ))}
      </ol>

      {PRICING.href && (
        <div className="mt-12 text-center" data-reveal>
          <TextLink href={PRICING.href}>Explore pricing</TextLink>
        </div>
      )}
    </Section>
  );
}
