import React from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/home/SiteFooter";
import type { LegalDocument } from "@/lib/legal";
import PolicyBlocks from "./PolicyBlocks";
import PolicyToc from "./PolicyToc";
import LegalMotion from "./LegalMotion";

// Shared shell for every legal page: compact header, sticky contents list,
// and a single readable column. All wording comes from the document.

type Visual = "privacy" | "refund";

interface LegalPageProps {
  doc: LegalDocument;
  /** Small label above the title, e.g. "PRIVACY & SECURITY" */
  eyebrow: string;
  visual: Visual;
  /** Where to break the title onto two lines; ignored unless it rejoins to the exact title */
  titleBreakAfter?: string;
}

function splitTitle(title: string, breakAfter?: string): [string, string] | null {
  if (!breakAfter || !title.startsWith(breakAfter)) return null;
  const rest = title.slice(breakAfter.length).trim();
  return rest ? [breakAfter.trim(), rest] : null;
}

/** Subtle, decorative mark: thin lines into a single orange node */
function HeaderVisual({ visual }: { visual: Visual }) {
  return (
    <svg
      data-legal="visual"
      aria-hidden="true"
      viewBox="0 0 360 240"
      className="pointer-events-none absolute right-0 top-1/2 hidden h-[240px] w-[360px] -translate-y-1/2 md:block lg:right-10 xl:right-14"
    >
      <g className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth={1} fill="none">
        <path d="M0 70 H150" />
        <path d="M0 170 H150" />
        <path d="M150 70 V170" strokeDasharray="3 5" />
        <path d="M290 120 H360" />
      </g>
      <circle cx={150} cy={70} r={3} className="fill-zinc-300 dark:fill-zinc-700" />
      <circle cx={150} cy={170} r={3} className="fill-zinc-300 dark:fill-zinc-700" />
      <circle cx={290} cy={120} r={4} fill="#f25b2a" />
      <g transform="translate(180 72)" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth={1.25} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {visual === "privacy" ? (
          <>
            {/* Shield with lock */}
            <path d="M40 4 L74 16 V46 C74 70 58 86 40 94 C22 86 6 70 6 46 V16 Z" className="fill-white dark:fill-zinc-950" />
            <rect x={28} y={46} width={24} height={20} rx={3} />
            <path d="M33 46 V39 a7 7 0 0 1 14 0 V46" />
            <path d="M40 54 V58" className="stroke-[#f25b2a]" />
          </>
        ) : (
          <>
            {/* Receipt with a return arrow */}
            <path d="M14 4 H66 V92 L57 86 L48 92 L40 86 L32 92 L23 86 L14 92 Z" className="fill-white dark:fill-zinc-950" />
            <path d="M26 24 H54" />
            <path d="M26 36 H54" />
            <path d="M26 48 H42" />
            <path d="M52 70 H30 M36 64 L30 70 L36 76" className="stroke-[#f25b2a]" />
          </>
        )}
      </g>
      <path d="M260 120 H290" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth={1} />
    </svg>
  );
}

export default function LegalPage({ doc, eyebrow, visual, titleBreakAfter }: LegalPageProps) {
  const lines = splitTitle(doc.title, titleBreakAfter);
  const entries = doc.sections.map((s) => ({ id: s.id, number: s.number, title: s.title }));
  const articleId = "policy-article";

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <LegalMotion articleId={articleId}>
        <main className="w-full">
          {/* Header */}
          <header className="relative w-full overflow-hidden border-b border-zinc-200/80 bg-[#fafaf8] dark:border-zinc-800 dark:bg-[#0c0c0e]">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
              <div className="relative flex min-h-[300px] flex-col justify-center py-16 lg:min-h-[360px] lg:border-x lg:border-zinc-200/70 lg:px-10 xl:px-14 dark:lg:border-zinc-800/70">
                <HeaderVisual visual={visual} />
                <p data-legal="label" className="relative text-[16px] font-medium uppercase tracking-[0.16em] text-[#c2410c] dark:text-[#ff8a5c]">
                  {eyebrow}
                </p>
                <h1 id="policy-title" data-legal="title" className="relative mt-5 max-w-[760px] text-[40px] font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-[64px] dark:text-white">
                  {lines ? (
                    <>
                      <span className="block">{lines[0]}</span>
                      <span className="block">{lines[1]}</span>
                    </>
                  ) : (
                    doc.title
                  )}
                </h1>
                {doc.lastUpdated && (
                  <p data-legal="meta" className="relative mt-6 text-[16px] text-zinc-500 dark:text-zinc-400">
                    Last Updated: <time className="text-zinc-700 dark:text-zinc-300">{doc.lastUpdated}</time>
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
            <div
              data-legal="body"
              className="py-10 lg:grid lg:grid-cols-[240px_minmax(0,780px)] lg:justify-center lg:gap-16 lg:border-x lg:border-zinc-200/70 lg:px-10 lg:py-20 xl:gap-24 xl:px-14 dark:lg:border-zinc-800/70"
            >
              <aside className="mb-10 lg:mb-0">
                <PolicyToc entries={entries} />
              </aside>

              <article
                id={articleId}
                aria-labelledby="policy-title"
                className="min-w-0 max-w-[780px] text-[17px] leading-[1.8] text-zinc-700 sm:text-[18px] dark:text-zinc-300"
              >
                {doc.intro.length > 0 && (
                  <div className="pb-10">
                    <PolicyBlocks blocks={doc.intro} />
                  </div>
                )}
                {doc.sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    aria-labelledby={`${s.id}-heading`}
                    className={`scroll-mt-28 focus:outline-none ${i === 0 && doc.intro.length === 0 ? "" : "border-t border-zinc-200 pt-10 dark:border-zinc-800"} pb-10 last:pb-0`}
                  >
                    <h2 id={`${s.id}-heading`} className="flex gap-3 text-[22px] font-semibold leading-snug tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                      {s.number && <span className="shrink-0 tabular-nums text-[#f25b2a]">{s.number}</span>}
                      <span>{s.title}</span>
                    </h2>
                    <div className="mt-5">
                      <PolicyBlocks blocks={s.blocks} />
                    </div>
                  </section>
                ))}
              </article>
            </div>
          </div>
        </main>
      </LegalMotion>
      <SiteFooter />
    </div>
  );
}
