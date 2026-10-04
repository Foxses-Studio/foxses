"use client";

import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Heading, Section } from "./shared";
import { revealOnScroll, useGsap } from "@/lib/motion";

// Section 13 — resources, driven by data so it can later come from a CMS.
// Only one real resource exists today (Foxses Pay on npm); the library
// categories are shown honestly as "Coming soon". No dates, authors or read
// times are rendered unless a resource actually has them.

type ResourceType = "product-guide" | "business-guide" | "documentation" | "developer" | "updates";

interface Resource {
  type: ResourceType;
  title: string;
  description: string;
  href: string | null;
  external?: boolean;
  publishedAt?: string;
  featured?: boolean;
}

const TYPE_LABEL: Record<ResourceType, string> = {
  "product-guide": "Product guides",
  "business-guide": "Business resources",
  documentation: "Documentation",
  developer: "Developer tools",
  updates: "Product updates",
};

const RESOURCES: Resource[] = [
  {
    type: "developer",
    title: "Foxses Pay",
    description: "Setup and usage for the unified payments package.",
    href: "https://www.npmjs.com/package/@foxses/pay",
    external: true,
    featured: true,
  },
];

/** Library areas that are being written — shown only while they have no published entries */
const PLANNED: { type: ResourceType; line: string }[] = [
  { type: "product-guide", line: "How to use each Foxses product." },
  { type: "documentation", line: "Setup and product reference." },
  { type: "business-guide", line: "Practical ideas for running the business." },
];

function FeaturedVisual() {
  // Typographic, not a fake screenshot — the real install command and providers
  return (
    <div aria-hidden="true" className="relative aspect-[16/8] overflow-hidden rounded-[8px] border border-zinc-200 bg-[#fafaf8] transition-transform duration-500 group-hover:scale-[1.015] dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.05)_1px,transparent_1px)] bg-[size:40px_100%] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
        <p className="w-fit rounded-[6px] border border-zinc-200 bg-white px-3 py-2 font-mono text-[16px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          <span className="text-zinc-400">$</span> npm install @foxses/pay
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[16px] text-zinc-500 dark:text-zinc-400">
          {["Stripe", "bKash", "Nagad", "SSLCommerz"].map((p) => (
            <span key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" />
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesSection() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, (_mm, el) => revealOnScroll(el));

  const featured = RESOURCES.find((r) => r.featured && r.href) ?? null;
  const published = RESOURCES.filter((r) => r !== featured && r.href);
  const planned = PLANNED.filter((p) => !RESOURCES.some((r) => r.type === p.type && r.href));

  return (
    <Section ref={ref} id="resources" tone="white" labelledBy="resources-heading">
      <div className="max-w-[760px]">
        <Eyebrow>Resources</Eyebrow>
        <Heading id="resources-heading" lead="Learn. Build." accent="Grow with Foxses." />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-zinc-200 pt-12 dark:border-zinc-800 lg:mt-20 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:gap-16">
        {featured && (
          <article data-reveal="soft">
            <a
              href={featured.href ?? undefined}
              {...(featured.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group block rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f25b2a]"
            >
              <FeaturedVisual />
              <p className="mt-8 text-[16px] font-medium uppercase tracking-[0.14em] text-[#f25b2a]">{TYPE_LABEL[featured.type]}</p>
              <h3 className="mt-3 flex items-start gap-3 text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.1]">
                {featured.title}
                <ArrowUpRight className="mt-2 h-7 w-7 shrink-0 text-[#f25b2a] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </h3>
              <p className="mt-3 max-w-[520px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-400">{featured.description}</p>
              {featured.external && <span className="sr-only"> (opens on npm in a new tab)</span>}
            </a>
          </article>
        )}

        <div>
          <ul className="border-t border-zinc-200 dark:border-zinc-800 lg:border-t-0">
            {published.map((r) => (
              <li key={r.title} data-reveal className="border-b border-zinc-200 dark:border-zinc-800">
                <a
                  href={r.href ?? undefined}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-start gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] uppercase tracking-[0.14em] text-zinc-400">{TYPE_LABEL[r.type]}</span>
                    <span className="mt-2 block text-xl font-semibold transition-transform duration-300 group-hover:translate-x-1">{r.title}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f25b2a]" aria-hidden="true" />
                </a>
              </li>
            ))}
            {planned.map((p, i) => (
              <li key={p.type} data-reveal className={`flex flex-wrap items-start gap-x-4 gap-y-2 py-6 ${i === 0 && published.length === 0 ? "lg:pt-0" : ""} border-b border-zinc-200 dark:border-zinc-800`}>
                <span className="tabular-nums text-[16px] text-zinc-300 dark:text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-semibold">{TYPE_LABEL[p.type]}</span>
                  <span className="mt-1 block text-[16px] text-zinc-600 dark:text-zinc-400">{p.line}</span>
                </span>
                <span className="shrink-0 rounded-[4px] border border-zinc-200 px-2 py-0.5 text-[16px] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 max-sm:ml-9">
                  Coming soon
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
