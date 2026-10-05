"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, MQ, useGsap } from "@/lib/motion";

// Custom 404 for routes that aren't built yet. Minimal copy, one visual:
// an oversized low-contrast "404" with a few structural lines.

export default function NotFoundView() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (mm) => {
    mm.add(MQ.motion, () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-nf='number']", { autoAlpha: 0, y: 40, duration: 1 })
        .from("[data-nf='line']", { scaleX: 0, duration: 0.9, stagger: 0.08, ease: "power2.inOut" }, 0.1)
        .from("[data-nf='icon']", { autoAlpha: 0, scale: 0.9, duration: 0.5 }, 0.35)
        .from("[data-nf='copy']", { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.45);
    });
  });

  return (
    <section
      ref={ref}
      aria-labelledby="nf-heading"
      className="relative w-full overflow-hidden border-b border-zinc-200/80 bg-[#fafaf8] text-zinc-900 dark:border-zinc-800 dark:bg-[#0c0c0e] dark:text-white"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="relative flex min-h-[calc(100svh-73px)] items-center justify-center border-zinc-200/70 py-24 dark:border-zinc-800/70 lg:border-x">
          {/* Oversized number */}
          <span
            data-nf="number"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[44vw] font-bold leading-none tracking-[-0.06em] text-zinc-900/[0.045] sm:text-[34vw] lg:text-[420px] dark:text-white/[0.04]"
          >
            404
          </span>

          {/* Structural lines */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span data-nf="line" className="absolute left-0 right-[58%] top-[30%] h-px origin-left bg-zinc-200 dark:bg-zinc-800" />
            <span data-nf="line" className="absolute left-[58%] right-0 top-[70%] h-px origin-right bg-zinc-200 dark:bg-zinc-800" />
            <span className="absolute left-[42%] top-[30%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f25b2a]" />
            <span className="absolute left-[58%] top-[70%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f25b2a] bg-[#fafaf8] dark:bg-[#0c0c0e]" />
          </div>

          <div className="relative mx-auto max-w-[560px] text-center">
            <span
              data-nf="icon"
              className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#f25b2a]/30 bg-white dark:bg-zinc-950"
            >
              <Image src="/all-logo/foxses_logo.png" alt="" width={30} height={32} className="h-8 w-auto" />
            </span>
            <p data-nf="copy" className="font-mono text-[16px] tracking-[0.2em] text-[#f25b2a]">
              404
            </p>
            <h1 id="nf-heading" data-nf="copy" className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              This page isn&apos;t ready yet.
            </h1>
            <p data-nf="copy" className="mt-4 text-[16px] text-zinc-600 dark:text-zinc-400 sm:text-lg">
              We&apos;re still building this part of Foxses.
            </p>
            <div data-nf="copy" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
              <Link
                href="/"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#f25b2a] px-7 text-[16px] font-medium text-white transition-colors hover:bg-[#d84b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] sm:w-auto"
              >
                Back to Home
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
              <Link
                href="/#products"
                className="group inline-flex items-center gap-2 rounded-[4px] text-[16px] font-medium text-zinc-900 transition-colors hover:text-[#f25b2a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f25b2a] dark:text-white"
              >
                Explore Products
                <span aria-hidden="true" className="text-[#f25b2a] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
