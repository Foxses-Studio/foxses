"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface TocEntry {
  id: string;
  number: string | null;
  title: string;
}

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
  // Move keyboard focus with the jump so the next Tab continues from the section
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/**
 * Tracks which section is being read. Watches each section's heading as it
 * crosses a band just below the sticky navbar; the active section stays put
 * while reading between headings.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    const headingOf = (id: string) => document.getElementById(`${id}-heading`) ?? document.getElementById(id);
    const io = new IntersectionObserver(
      () => {
        // The last heading that has reached the reading line is the current section
        let current: string | null = ids[0] ?? null;
        for (const id of ids) {
          const el = headingOf(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
        }
        setActive(current);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 1] }
    );
    ids.forEach((id) => {
      const el = headingOf(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Entry({
  entry,
  active,
  onPick,
  className = "",
}: {
  entry: TocEntry;
  active: boolean;
  onPick: (id: string) => void;
  className?: string;
}) {
  return (
    <li className={className}>
      <a
        href={`#${entry.id}`}
        aria-current={active ? "location" : undefined}
        onClick={(e) => {
          e.preventDefault();
          onPick(entry.id);
        }}
        className={`group relative flex gap-3 rounded-[4px] py-1.5 pl-4 text-[16px] leading-snug transition-colors duration-200 ${focusRing} ${
          active ? "text-[#c2410c] dark:text-[#ff8a5c]" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[#f25b2a] transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`}
        />
        {entry.number && <span className="w-6 shrink-0 tabular-nums text-zinc-400 dark:text-zinc-500">{entry.number.replace(/\.$/, "")}</span>}
        <span className={active ? "font-medium" : ""}>{entry.title}</span>
      </a>
    </li>
  );
}

export default function PolicyToc({ entries }: { entries: TocEntry[] }) {
  const [ids] = useState(() => entries.map((e) => e.id));
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: sticky list */}
      <nav aria-label="Table of contents" className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar lg:block">
        <p className="mb-4 text-[16px] font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">Contents</p>
        <ol className="border-l border-zinc-200 dark:border-zinc-800">
          {entries.map((e) => (
            <Entry key={e.id} entry={e} active={active === e.id} onPick={scrollToSection} />
          ))}
        </ol>
      </nav>

      {/* Mobile / tablet: collapsible */}
      <nav aria-label="Table of contents" className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="policy-toc-mobile"
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between rounded-[8px] px-4 py-3.5 text-left text-[16px] font-medium text-zinc-900 dark:text-white ${focusRing}`}
        >
          Contents
          <ChevronDown aria-hidden="true" className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        <div
          id="policy-toc-mobile"
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <ol className="mx-4 overflow-hidden border-l border-zinc-200 dark:border-zinc-800" inert={!open}>
            {entries.map((e, i) => (
              <Entry
                key={e.id}
                entry={e}
                active={active === e.id}
                className={i === entries.length - 1 ? "pb-4" : ""}
                onPick={(id) => {
                  setOpen(false);
                  // Scroll once the panel has collapsed, or the page shifts under the jump
                  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.setTimeout(() => scrollToSection(id), reduce ? 0 : 320);
                }}
              />
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
