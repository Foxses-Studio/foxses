"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Boxes, Network, ReceiptText, Sparkles } from "lucide-react";

// Canvas globe is client-only and loaded separately from the main bundle
const EcosystemGlobe = dynamic(() => import("@/components/ecosystem/EcosystemGlobe"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full" />,
});

const SIGNALS = ["Operations", "Finance", "People", "Customers", "AI"];

const CAPABILITIES = [
  {
    icon: Boxes,
    title: "Operations",
    description: "Inventory, forms and workflows stay connected as your business moves.",
  },
  {
    icon: ReceiptText,
    title: "Finance & Customers",
    description: "Invoices, payments and customer activity stay synchronized.",
  },
  {
    icon: Sparkles,
    title: "People & Intelligence",
    description: "Your teams and Sara AI work from the same connected business context.",
  },
];

export default function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll entrance — trigger once roughly a quarter of the section is in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = (delay: string) =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${delay} ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4 motion-reduce:opacity-100 motion-reduce:translate-y-0"
    }`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ecosystem-heading"
      className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors duration-300"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="lg:border-x border-zinc-200/70 dark:border-zinc-800/70">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]">
            {/* LEFT — copy */}
            <div className="flex flex-col justify-center pt-16 sm:pt-20 lg:py-20 lg:pl-10 lg:pr-12 xl:pl-14">
              <p
                className={`inline-flex items-center gap-2 text-[16px] font-medium uppercase tracking-[0.16em] text-[#f25b2a] ${reveal("delay-0")}`}
              >
                <Network className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Connected Ecosystem
              </p>

              <h2
                id="ecosystem-heading"
                className={`mt-5 max-w-[560px] text-4xl sm:text-5xl lg:text-[56px] xl:text-6xl font-semibold tracking-tight leading-[1.06] text-zinc-900 dark:text-white ${reveal("delay-100")}`}
              >
                Your business,
                <br />
                connected from
                <br />
                <span className="text-[#f25b2a] font-bold">one place.</span>
              </h2>

              <p
                className={`mt-6 max-w-[500px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed ${reveal("delay-200")}`}
              >
                Foxses brings your operations, finance, people, customers, data and
                AI together in one connected business ecosystem.
              </p>

              <ul
                className={`mt-8 flex flex-wrap gap-x-6 gap-y-3 ${reveal("delay-300")}`}
                aria-label="Connected areas"
              >
                {SIGNALS.map((signal) => (
                  <li
                    key={signal}
                    className="inline-flex items-center gap-2 text-[16px] text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" aria-hidden="true" />
                    {signal}
                  </li>
                ))}
              </ul>

              <a
                href="/products"
                className={`group mt-9 inline-flex w-fit items-center gap-2 rounded-[4px] text-[16px] font-medium text-zinc-900 dark:text-white hover:text-[#f25b2a] dark:hover:text-[#f25b2a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f25b2a] transition-colors ${reveal("delay-300")}`}
              >
                Explore the ecosystem
                <ArrowRight
                  className="h-4 w-4 text-[#f25b2a] transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* RIGHT — globe */}
            <div className="relative lg:border-l border-zinc-200/70 dark:border-zinc-800/70">
              {/* Quiet technical texture + barely-there warm focus, only behind the globe */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-dot-matrix opacity-40 dark:opacity-50 [mask-image:radial-gradient(circle_at_50%_50%,#000_10%,transparent_62%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,91,42,0.06),transparent_45%)]" />
              </div>

              <div className="relative flex items-center justify-center py-6 sm:py-10 lg:py-8">
                <div
                  className={`shrink-0 w-[140vw] ml-[calc(50%-70vw)] mr-[calc(50%-70vw)] sm:mx-auto sm:w-full sm:max-w-[600px] lg:max-w-[760px] transition-all duration-[900ms] ease-out delay-200 motion-reduce:transition-none ${
                    isVisible
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[0.97] motion-reduce:opacity-100 motion-reduce:scale-100"
                  }`}
                >
                  <EcosystemGlobe />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM — capability strip, built into the section structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-zinc-200/70 dark:border-zinc-800/70 divide-y md:divide-y-0 md:divide-x divide-zinc-200/70 dark:divide-zinc-800/70">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="py-7 md:px-8 lg:px-10 xl:px-14 first:md:pl-0 lg:first:pl-10 xl:first:pl-14">
                <h3 className="flex items-center gap-2.5 text-[16px] font-semibold uppercase tracking-[0.12em] text-zinc-900 dark:text-white">
                  <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
                  {title}
                </h3>
                <p className="mt-2 max-w-[380px] text-[16px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
