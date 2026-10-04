"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bell, LayoutDashboard, LayoutGrid, Search, Settings } from "lucide-react";
import { Eyebrow, Heading, PRODUCT_META, PRODUCT_ORDER, Section, tabKeyHandler, useSwap, type ProductKey } from "./shared";
import { Badge, Initials, Metric, Panel, Row, Rows } from "./ui-kit";
import { EASE, gsap, MQ, revealOnScroll, useGsap } from "@/lib/motion";
import { AutoProgress, useAutoplayPause } from "./AutoProgress";

// Section 8 — a guided look inside a Foxses workspace *concept*.
// The shell stays put; only the main content changes between steps.

type StepId = "overview" | "operations" | "finance" | "support";

interface Hotspot {
  /** position inside the content area, desktop only */
  x: string;
  y: string;
  title: string;
  text: string;
}

interface Step {
  id: StepId;
  label: string;
  headline: string;
  nav: "overview" | ProductKey;
  hotspots: Hotspot[];
}

const STEPS: Step[] = [
  {
    id: "overview",
    label: "Overview",
    headline: "Everything important, easier to find.",
    nav: "overview",
    hotspots: [
      { x: "30%", y: "22%", title: "Your business at a glance", text: "Key numbers from each tool in one place." },
      { x: "33%", y: "45%", title: "Your apps", text: "Every Foxses tool, one click away." },
      { x: "88%", y: "45%", title: "Recent activity", text: "What changed, across the workspace." },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    headline: "Keep everyday work organized.",
    nav: "inventory",
    hotspots: [
      { x: "22%", y: "20%", title: "Inventory visibility", text: "Stock levels without digging." },
      { x: "38%", y: "64%", title: "Operational activity", text: "Recent stock changes, in order." },
      { x: "84%", y: "30%", title: "Structured information", text: "Submissions collected through Foxses Forms." },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    headline: "Keep billing clear and organized.",
    nav: "invoice",
    hotspots: [
      { x: "20%", y: "20%", title: "Invoice visibility", text: "Every invoice and where it stands." },
      { x: "90%", y: "54%", title: "Payment status", text: "Paid, pending or overdue — at a glance." },
      { x: "40%", y: "54%", title: "Customer context", text: "The customer stays attached to the bill." },
    ],
  },
  {
    id: "support",
    label: "Support",
    headline: "Support with more context.",
    nav: "support",
    hotspots: [
      { x: "18%", y: "30%", title: "Customer conversations", text: "Requests stay organized in one inbox." },
      { x: "88%", y: "34%", title: "Relevant context", text: "Related order, invoice and status beside the chat." },
      { x: "16%", y: "12%", title: "Ticket status", text: "Open, pending and resolved — always clear." },
    ],
  },
];

/* ---------------- Step content (sample data) ---------------- */

function OverviewContent() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[16px] text-zinc-500 dark:text-zinc-400">Good morning, Alex</p>
        <p className="text-[24px] font-semibold tracking-tight">Business overview</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[8px] border border-zinc-200 p-4 dark:border-zinc-800 md:grid-cols-4">
        <Metric label="Products" value="248" />
        <Metric label="Open invoices" value="12" accent />
        <Metric label="Team" value="24" />
        <Metric label="Open tickets" value="8" />
      </div>
      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <Panel title="Your apps" className="max-md:hidden">
          <div className="grid grid-cols-3 gap-2 p-3">
            {PRODUCT_ORDER.map((p) => {
              const { short, icon: Icon } = PRODUCT_META[p];
              return (
                <span key={p} className="flex flex-col items-start gap-2 rounded-[6px] px-3 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#fff6f0] dark:bg-[#f25b2a]/10">
                    <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} />
                  </span>
                  <span className="text-[16px] font-medium">{short}</span>
                </span>
              );
            })}
          </div>
        </Panel>
        <Panel title="Recent activity">
          <Rows>
            <Row primary="Order #FX-1048" secondary="Recorded" end={<span className="text-[16px] text-zinc-400">09:42</span>} />
            <Row primary="Invoice INV-1048" secondary="Marked paid" end={<span className="text-[16px] text-zinc-400">09:48</span>} />
            <Row primary="Inventory updated" secondary="Stock count" end={<span className="text-[16px] text-zinc-400">10:05</span>} />
            <Row className="max-md:hidden" primary="Ticket #1839" secondary="Resolved" end={<span className="text-[16px] text-zinc-400">10:20</span>} />
          </Rows>
        </Panel>
      </div>
    </div>
  );
}

function OperationsContent() {
  return (
    <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4 rounded-[8px] border border-zinc-200 p-4 dark:border-zinc-800">
          <Metric label="Products" value="248" />
          <Metric label="In stock" value="194" />
          <Metric label="Low stock" value="37" accent />
        </div>
        <Panel title="Recent stock activity">
          <Rows>
            <Row primary="Cotton T-shirt · Black" secondary="+120 received" end={<Badge tone="success">In stock</Badge>} />
            <Row primary="Canvas tote bag" secondary="−6 shipped" end={<Badge tone="warning">Low</Badge>} />
            <Row primary="Ceramic mug" secondary="Count updated" end={<Badge tone="success">In stock</Badge>} />
          </Rows>
        </Panel>
      </div>
      <Panel title="Forms" aside="Today" className="max-md:hidden">
        <div className="px-4 py-4">
          <p className="text-[32px] font-semibold leading-none tabular-nums">12</p>
          <p className="mt-1 text-[16px] text-zinc-500 dark:text-zinc-400">recent submissions</p>
        </div>
        <Rows>
          <Row primary="Supplier intake" secondary="Northwind Supply" />
          <Row primary="Damage report" secondary="Main warehouse" />
        </Rows>
      </Panel>
    </div>
  );
}

function FinanceContent() {
  const invoices: [string, string, string, string, "success" | "neutral" | "warning"][] = [
    ["INV-1048", "Alex Morgan", "$120.00", "Paid", "success"],
    ["INV-1047", "Acme Studio", "$350.00", "Pending", "neutral"],
    ["INV-1046", "Northstar", "$89.00", "Overdue", "warning"],
    ["INV-1045", "Greenline Cafe", "$420.00", "Paid", "success"],
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 divide-x divide-zinc-200 rounded-[8px] border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {[["Paid", "18"], ["Pending", "7"], ["Overdue", "2"]].map(([k, v], i) => (
          <div key={k} className="px-4 py-3"><Metric label={k} value={v} accent={i === 2} /></div>
        ))}
      </div>
      <Panel title="Recent invoices">
        <table className="w-full text-left text-[16px]">
          <thead className="text-zinc-500 dark:text-zinc-400">
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-4 py-2 font-normal">Invoice</th>
              <th className="py-2 font-normal">Customer</th>
              <th className="py-2 text-right font-normal max-sm:hidden">Amount</th>
              <th className="px-4 py-2 text-right font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(([id, c, a, s, t]) => (
              <tr key={id} className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40">
                <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{id}</td>
                <td className="py-2.5 font-medium">{c}</td>
                <td className="py-2.5 text-right tabular-nums max-sm:hidden">{a}</td>
                <td className="px-4 py-2.5 text-right"><Badge tone={t}>{s}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function SupportContent() {
  return (
    <div className="grid gap-5 md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_210px]">
      <Panel>
        <div className="flex gap-3 border-b border-zinc-100 px-4 py-2.5 text-[16px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-white">Open 8</span>
          <span>Pending 3</span>
          <span className="max-md:hidden">Resolved</span>
        </div>
        <Rows>
          <Row className="bg-zinc-50 dark:bg-zinc-800/40" primary="Where's my invoice?" secondary="Alex Morgan · #1842" />
          <Row primary="Update shipping address" secondary="Hana Ito" />
          <Row className="max-md:hidden" primary="Account access" secondary="Leo Martin" />
        </Rows>
      </Panel>
      <Panel title="#1842 · Alex Morgan" className="max-md:hidden">
        <div className="space-y-3 p-4 text-[16px]">
          <p className="max-w-[90%] rounded-[8px] bg-zinc-100 px-3 py-2 leading-snug dark:bg-zinc-800">
            Where can I find my invoice?
          </p>
          <p className="ml-auto max-w-[90%] rounded-[8px] border border-zinc-200 px-3 py-2 leading-snug dark:border-zinc-700">
            INV-1048 is paid — I&apos;ve sent you a copy.
          </p>
        </div>
      </Panel>
      <Panel title="Context" className="max-xl:hidden">
        <dl className="space-y-3 p-4 text-[16px]">
          <div><dt className="text-zinc-500 dark:text-zinc-400">Related order</dt><dd className="font-medium">#FX-1048</dd></div>
          <div><dt className="text-zinc-500 dark:text-zinc-400">Invoice</dt><dd className="font-medium">INV-1048</dd></div>
          <div><dt className="text-zinc-500 dark:text-zinc-400">Payment</dt><dd><Badge tone="success">Paid</Badge></dd></div>
        </dl>
      </Panel>
    </div>
  );
}

const CONTENT: Record<StepId, React.ComponentType> = {
  overview: OverviewContent,
  operations: OperationsContent,
  finance: FinanceContent,
  support: SupportContent,
};

/* ---------------- Section ---------------- */

export default function TourSection() {
  const ref = useRef<HTMLElement>(null);
  const { selected, shown, leaving, select } = useSwap(0, 160);
  const [openSpot, setOpenSpot] = useState<number | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const { paused: autoPaused, hoverProps } = useAutoplayPause(areaRef);
  const paused = autoPaused || openSpot !== null || launcherOpen;

  const step = STEPS[shown];
  const Content = CONTENT[step.id];

  const choose = (i: number) => {
    setOpenSpot(null);
    select(i);
  };

  // Click outside closes annotations and the launcher
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-tour-pop]")) {
        setOpenSpot(null);
        setLauncherOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  useGsap(ref, (mm, el) => {
    revealOnScroll(el);
    mm.add(MQ.motion, () => {
      gsap.from("[data-tour-window]", {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        ease: EASE,
        scrollTrigger: { trigger: "[data-tour-window]", start: "top 85%", toggleActions: "play none none none" },
      });
    });
    mm.add(MQ.desktop, () => {
      // Very light depth: the offset layers settle as the window scrolls into place
      gsap.fromTo(
        "[data-tour-depth]",
        { y: 18 },
        { y: 0, ease: "none", scrollTrigger: { trigger: "[data-tour-window]", start: "top bottom", end: "center center", scrub: 0.8 } }
      );
    });
  });

  const motion = leaving ? "opacity-0 translate-y-1.5 transition-all duration-150" : "fx-enter";
  const progress = selected / (STEPS.length - 1);

  return (
    <Section ref={ref} id="tour" tone="warm" labelledBy="tour-heading">
      <div className="mx-auto max-w-[760px] text-center">
        <Eyebrow>Foxses in action</Eyebrow>
        <Heading id="tour-heading" lead="See how Foxses" accent="comes together." />
      </div>

      <div ref={areaRef} {...hoverProps}>
      {/* Tour steps */}
      <div className="mx-auto mt-14 max-w-[760px] lg:mt-16" data-reveal>
        <div className="relative">
          <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[7px] h-px bg-zinc-200 dark:bg-zinc-800 max-sm:hidden">
            <span
              className="absolute inset-y-0 left-0 bg-[#f25b2a] transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div
            role="tablist"
            aria-label="Tour steps"
            onKeyDown={tabKeyHandler(STEPS.length, selected, choose, "horizontal")}
            className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0"
          >
            {STEPS.map((s, i) => {
              const active = i === selected;
              return (
                <button
                  key={s.id}
                  id={`tour-tab-${s.id}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls="tour-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => choose(i)}
                  className={`group flex flex-col items-center gap-3 rounded-[6px] pb-1 max-sm:gap-1.5 max-sm:pt-2.5 max-sm:ring-1 ${active ? "max-sm:bg-white max-sm:ring-[#f25b2a]/40 dark:max-sm:bg-zinc-900" : "max-sm:ring-zinc-200 dark:max-sm:ring-zinc-800"} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]`}
                >
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center max-sm:hidden">
                    <span
                      className={`relative h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                        i <= selected ? "border-[#f25b2a] bg-[#f25b2a]" : "border-zinc-300 bg-[#fafaf8] dark:border-zinc-700 dark:bg-[#0c0c0e]"
                      } ${active ? "ring-4 ring-[#f25b2a]/15" : ""}`}
                    />
                  </span>
                  <span className="flex items-baseline gap-1.5 text-[16px]">
                    <span className={`tabular-nums max-sm:hidden ${active ? "text-[#f25b2a]" : "text-zinc-400"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={active ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"}>
                      {s.label}
                    </span>
                  </span>
                  <span className="h-[2px] w-12 overflow-hidden rounded-full bg-zinc-200/0">
                    {active && (
                      <AutoProgress cycleKey={selected} duration={7000} paused={paused} onDone={() => choose((selected + 1) % STEPS.length)} className="h-full w-full" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step headline */}
      <div className="mx-auto mt-10 max-w-[1240px]">
        <p key={step.id} className={`text-[16px] text-zinc-500 dark:text-zinc-400 ${motion}`}>
          <span className="tabular-nums text-[#f25b2a]">{String(shown + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}</span>
          <span className="mx-2 text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-lg font-semibold text-zinc-900 dark:text-white">{step.headline}</span>
        </p>
      </div>

      {/* Application window */}
      <div className="relative mx-auto mt-6 max-w-[1240px]">
        <div data-tour-depth aria-hidden="true" className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[8px] border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/40 max-lg:hidden" />
        <div data-tour-depth aria-hidden="true" className="absolute -bottom-5 left-[8%] right-[8%] h-px bg-[#f25b2a]/40 max-lg:hidden" />

        <div
          data-tour-window
          className="relative overflow-visible rounded-[8px] border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        >
          {/* Top bar */}
          <div className="flex h-14 items-center gap-3 rounded-t-[8px] border-b border-zinc-200 px-4 dark:border-zinc-800">
            <Image src="/all-logo/foxses_logo.png" alt="" width={22} height={24} className="h-6 w-auto" />
            <span className="text-[16px] font-semibold">Foxses</span>
            <span className="text-[16px] text-zinc-400 max-sm:hidden">Workspace concept</span>

            <div className="relative ml-auto" data-tour-pop>
              <button
                type="button"
                onClick={() => setLauncherOpen((o) => !o)}
                aria-expanded={launcherOpen}
                aria-controls="tour-launcher"
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-zinc-200 px-3 text-[16px] transition-colors hover:border-[#f25b2a]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] dark:border-zinc-700"
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Products
              </button>
              {launcherOpen && (
                <div
                  id="tour-launcher"
                  className="fx-enter absolute right-0 top-11 z-30 w-[260px] rounded-[8px] border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {PRODUCT_ORDER.map((p) => {
                    const { name, icon: Icon } = PRODUCT_META[p];
                    return (
                      <span key={p} className="flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[16px] hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
                        <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <Search className="h-4 w-4 text-zinc-400 max-sm:hidden" aria-hidden="true" />
            <Bell className="h-4 w-4 text-zinc-400 max-sm:hidden" aria-hidden="true" />
            <Initials>AM</Initials>
          </div>

          <div className="flex">
            {/* Sidebar — visual context only */}
            <aside aria-hidden="true" className="w-[64px] shrink-0 border-r border-zinc-200 bg-zinc-50/70 px-2 py-4 dark:border-zinc-800 dark:bg-zinc-950/40 max-md:hidden xl:w-[210px] xl:px-3">
              {[{ key: "overview", label: "Overview", icon: LayoutDashboard }, ...PRODUCT_ORDER.map((p) => ({ key: p, label: PRODUCT_META[p].short, icon: PRODUCT_META[p].icon }))].map(({ key, label, icon: Icon }) => {
                const active = key === step.nav;
                return (
                  <span
                    key={key}
                    className={`mb-0.5 flex items-center justify-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[16px] transition-colors xl:justify-start ${
                      active
                        ? "bg-white font-medium text-zinc-900 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-white dark:ring-zinc-800"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#f25b2a]" : ""}`} strokeWidth={1.75} />
                    <span className="hidden xl:inline">{label}</span>
                  </span>
                );
              })}
              <span className="mt-6 flex items-center justify-center gap-2.5 px-2.5 py-2 text-[16px] text-zinc-500 dark:text-zinc-400 xl:justify-start">
                <Settings className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden xl:inline">Settings</span>
              </span>
            </aside>

            {/* Main content — the only part that changes */}
            <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${STEPS[selected].id}`} className="relative min-w-0 flex-1">
              <div className="relative min-h-[460px] p-4 sm:p-6 lg:min-h-[520px] lg:p-8">
                <div key={step.id} className={motion} aria-hidden="true">
                  <Content />
                </div>

                {/* Desktop hotspots */}
                <div key={`spots-${step.id}`} className={`pointer-events-none absolute inset-0 max-lg:hidden ${motion}`}>
                  {step.hotspots.map((h, i) => {
                    const open = openSpot === i;
                    const alignRight = parseFloat(h.x) > 60;
                    return (
                      <div key={h.title} className="pointer-events-auto absolute z-20" style={{ left: h.x, top: h.y }} data-tour-pop>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-label={`${i + 1}. ${h.title}`}
                          onClick={() => setOpenSpot(open ? null : i)}
                          className="group relative -ml-3 -mt-3 flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]"
                        >
                          <span aria-hidden="true" className="absolute h-6 w-6 rounded-full bg-[#f25b2a]/20 motion-safe:animate-[ping_2.4s_ease-out_3]" />
                          <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#f25b2a]">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                          {!open && (
                            <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-zinc-900 px-2 py-0.5 text-[16px] text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900 ${alignRight ? "right-8" : "left-8"}`}>
                              {h.title}
                            </span>
                          )}
                        </button>
                        {open && (
                          <div
                            role="note"
                            className={`fx-enter absolute top-5 w-[250px] rounded-[8px] border border-zinc-200 bg-white p-3 text-left dark:border-zinc-700 dark:bg-zinc-900 ${alignRight ? "right-0" : "left-0"}`}
                          >
                            <p className="text-[16px] font-semibold">{h.title}</p>
                            <p className="mt-1 text-[16px] leading-snug text-zinc-600 dark:text-zinc-400">{h.text}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: annotations as inline callouts */}
        <ol key={`notes-${step.id}`} className={`mt-6 space-y-3 lg:hidden ${motion}`}>
          {step.hotspots.map((h, i) => (
            <li key={h.title} className="flex gap-3 text-[16px]">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f25b2a] text-white">{i + 1}</span>
              <span>
                <span className="font-semibold text-zinc-900 dark:text-white">{h.title}</span>
                <span className="text-zinc-600 dark:text-zinc-400"> — {h.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </Section>
  );
}
