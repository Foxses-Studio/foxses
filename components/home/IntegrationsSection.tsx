"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Cable, CreditCard, HardDrive, MessageSquare, Store, Webhook } from "lucide-react";
import { Eyebrow, Heading, Lede, Section } from "./shared";
import { EASE, gsap, MQ, revealOnScroll, useGsap } from "@/lib/motion";
import { AutoProgress, useAutoplayPause } from "./AutoProgress";

// Section 9 — Foxses connecting outward.
// Only Foxses Pay is live today (public npm package). Everything else is a
// category marked "Planned" — no third-party logos, no integration counts.

export type Status = "available" | "planned";

const FOXSES_PAY_URL = "https://www.npmjs.com/package/@foxses/pay";

interface Endpoint {
  id: string;
  label: string;
  icon: typeof CreditCard;
  status: Status;
  detail: string;
  /** vertical position (0–100) of the endpoint and its port on the hub */
  y: number;
}

const ENDPOINTS: Endpoint[] = [
  { id: "payments", label: "Payments", icon: CreditCard, status: "available", detail: "Stripe, bKash, Nagad and SSLCommerz through one API with Foxses Pay.", y: 16 },
  { id: "commerce", label: "Commerce", icon: Store, status: "planned", detail: "Connecting storefronts with Foxses is planned.", y: 39 },
  { id: "communication", label: "Communication", icon: MessageSquare, status: "planned", detail: "Connecting messaging tools with Foxses is planned.", y: 62 },
  { id: "storage", label: "Storage", icon: HardDrive, status: "planned", detail: "Connecting file storage with Foxses is planned.", y: 85 },
];

const CAPABILITIES: { icon: typeof CreditCard; title: string; line: string; status: Status; href?: string }[] = [
  { icon: CreditCard, title: "Foxses Pay", line: "One API for multiple payment providers.", status: "available", href: FOXSES_PAY_URL },
  { icon: Cable, title: "Integrations", line: "Connect the services you already run on.", status: "planned" },
  { icon: Webhook, title: "APIs & webhooks", line: "Build your own connections.", status: "planned" },
];

function StatusMark({ status, dark = false }: { status: Status; dark?: boolean }) {
  return status === "available" ? (
    <span className="inline-flex items-center gap-1.5 text-[16px] text-zinc-700 dark:text-zinc-300">
      <span className="h-2 w-2 rounded-full bg-[#f25b2a]" aria-hidden="true" /> Available
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1.5 text-[16px] ${dark ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
      <span className="h-2 w-2 rounded-full border border-zinc-400" aria-hidden="true" /> Planned
    </span>
  );
}

export default function IntegrationsSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>("payments");
  const current = ENDPOINTS.find((e) => e.id === active) ?? ENDPOINTS[0];
  const hubRef = useRef<HTMLDivElement>(null);
  const { paused, hoverProps } = useAutoplayPause(hubRef);
  const nextEndpoint = () => {
    const i = ENDPOINTS.findIndex((e) => e.id === active);
    setActive(ENDPOINTS[(i + 1) % ENDPOINTS.length].id);
  };
  const timer = (
    <AutoProgress cycleKey={active} duration={4500} paused={paused} onDone={nextEndpoint} className="h-full w-full" />
  );

  useGsap(ref, (mm, el) => {
    revealOnScroll(el);
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-hub]", start: "top 75%", toggleActions: "play none none none" },
        defaults: { ease: EASE },
      });
      tl.from("[data-hub-module]", { autoAlpha: 0, scale: 0.97, duration: 0.6 })
        .fromTo("[data-hub-line]", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.08, clearProps: "strokeDasharray,strokeDashoffset" }, "-=0.2")
        .from("[data-hub-endpoint]", { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.06 }, "-=0.5");

      // One quiet pulse on the live connection, every few seconds while visible
      const pulse = gsap.timeline({ repeat: -1, repeatDelay: 4, paused: true });
      pulse.fromTo("[data-hub-pulse]", { strokeDashoffset: 1.02, autoAlpha: 1 }, { strokeDashoffset: -0.02, duration: 1.4, ease: "power1.inOut" });
      gsap.timeline({ scrollTrigger: { trigger: "[data-hub]", start: "top 80%", end: "bottom top", onToggle: (self) => (self.isActive ? pulse.play() : pulse.pause()) } });
      tl.eventCallback("onComplete", () => pulse.play());
    });
  });

  return (
    <Section ref={ref} id="integrations" tone="white" labelledBy="integrations-heading">
      {/* Very faint technical grid, fading at the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_65%_50%,#000_30%,transparent_80%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
      />

      <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-20">
        {/* Copy */}
        <div className="flex flex-col justify-center">
          <Eyebrow>Integrations</Eyebrow>
          <Heading id="integrations-heading" lead="Connect the tools" accent="you already use." />
          <Lede>Payments already connect through Foxses Pay. More is on the way.</Lede>

          <ul className="mt-10 border-t border-zinc-200 dark:border-zinc-800">
            {CAPABILITIES.map(({ icon: Icon, title, line, status, href }) => (
              <li key={title} data-reveal className="flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-zinc-200 py-4 dark:border-zinc-800">
                <Icon className="mt-1 h-4 w-4 shrink-0 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold">{title}</p>
                  <p className="text-[16px] text-zinc-600 dark:text-zinc-400">{line}</p>
                </div>
                <span className="flex items-center gap-4 max-sm:basis-full max-sm:pl-8">
                <StatusMark status={status} />
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} on npm (opens in a new tab)`}
                    className="text-[16px] text-[#f25b2a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]"
                  >
                    npm ↗
                  </a>
                )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Connection hub — desktop & tablet */}
        <div ref={hubRef} {...hoverProps} data-hub data-reveal="soft" className="relative">
          <div className="relative hidden h-[460px] sm:block">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 760 460" preserveAspectRatio="none">
              {ENDPOINTS.map((e) => {
                const on = e.id === active;
                // coordinates in a 760×460 box: endpoints end at 30% width, ports sit on the module's left edge (58%)
                const y1 = e.y * 4.6;
                const y2 = (30 + e.y * 0.4) * 4.6;
                const d = `M 228 ${y1} C 350 ${y1}, 350 ${y2}, 441 ${y2}`;
                return (
                  <g key={e.id}>
                    <path
                      data-hub-line
                      d={d}
                      pathLength={1}
                      fill="none"
                      strokeWidth={on ? 1.5 : 1}
                      className={`transition-all duration-300 ${on ? "stroke-[#f25b2a]" : "stroke-zinc-300 dark:stroke-zinc-700"} ${active && !on ? "opacity-60" : ""}`}
                    />
                    {e.status === "available" && (
                      <path
                        data-hub-pulse
                        d={d}
                        pathLength={1}
                        fill="none"
                        stroke="#f25b2a"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray="0.02 1"
                        strokeDashoffset={1.02}
                        className="motion-reduce:hidden"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Endpoints */}
            {ENDPOINTS.map((e) => {
              const on = e.id === active;
              const Icon = e.icon;
              return (
                <button
                  key={e.id}
                  type="button"
                  data-hub-endpoint
                  aria-pressed={on}
                  aria-label={`${e.label}: ${e.status === "available" ? "available" : "planned"}`}
                  onClick={() => setActive(e.id)}
                  onMouseEnter={() => setActive(e.id)}
                  onFocus={() => setActive(e.id)}
                  className={`absolute left-0 flex w-[30%] -translate-y-1/2 items-center gap-2.5 rounded-[8px] border bg-white px-3 py-2.5 text-left text-[16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] dark:bg-zinc-950 ${
                    on ? "border-[#f25b2a]/50 text-zinc-900 dark:text-white" : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                  }`}
                  style={{ top: `${e.y}%` }}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${on ? "text-[#f25b2a]" : ""}`} strokeWidth={1.75} aria-hidden="true" />
                  <span className="truncate font-medium">{e.label}</span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto h-2 w-2 shrink-0 rounded-full ${e.status === "available" ? "bg-[#f25b2a]" : "border border-zinc-400"}`}
                  />
                </button>
              );
            })}

            {/* Foxses module with ports */}
            <div data-hub-module className="absolute left-[58%] right-0 top-[30%] h-[40%] rounded-[8px] border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950">
              {ENDPOINTS.map((e) => (
                <span
                  key={e.id}
                  aria-hidden="true"
                  className={`absolute -left-[5px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 bg-white transition-colors dark:bg-zinc-950 ${
                    e.id === active ? "border-[#f25b2a] bg-[#f25b2a] dark:bg-[#f25b2a]" : "border-zinc-300 dark:border-zinc-600"
                  }`}
                  style={{ top: `${e.y}%` }}
                />
              ))}
              <div className="flex h-full flex-col justify-center gap-3 px-6">
                <Image src="/all-logo/foxses_logo.png" alt="" width={28} height={30} className="h-8 w-auto self-start" />
                <p className="leading-tight">
                  <span className="block text-lg font-semibold">Foxses</span>
                  <span className="text-[16px] text-zinc-500 dark:text-zinc-400">Connected business platform</span>
                </p>
              </div>
            </div>

            {/* Detail */}
            <div aria-live="polite" className="absolute bottom-0 left-[58%] right-0 rounded-[8px] border border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
              <div key={current.id} className="fx-enter">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[16px] font-semibold">{current.label}</span>
                  <StatusMark status={current.status} />
                </div>
                <p className="mt-1 text-[16px] leading-snug text-zinc-600 dark:text-zinc-400">{current.detail}</p>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-b-[8px]">{timer}</span>
            </div>
          </div>

          {/* Mobile — simplified hub + tappable rows */}
          <div className="sm:hidden">
            <div className="mx-auto flex w-[220px] items-center gap-3 rounded-[8px] border border-zinc-300 bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-950">
              <Image src="/all-logo/foxses_logo.png" alt="" width={24} height={26} className="h-7 w-auto" />
              <span className="text-lg font-semibold">Foxses</span>
            </div>
            <div aria-hidden="true" className="mx-auto h-6 w-px bg-zinc-300 dark:bg-zinc-700" />
            <ul className="rounded-[8px] border border-zinc-200 dark:border-zinc-800">
              {ENDPOINTS.map((e) => {
                const on = e.id === active;
                const Icon = e.icon;
                return (
                  <li key={e.id} className="border-b border-zinc-200 last:border-0 dark:border-zinc-800">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(e.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[16px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f25b2a]"
                    >
                      <Icon className={`h-4 w-4 ${on ? "text-[#f25b2a]" : "text-zinc-400"}`} strokeWidth={1.75} aria-hidden="true" />
                      <span className={`flex-1 font-medium ${on ? "" : "text-zinc-600 dark:text-zinc-400"}`}>{e.label}</span>
                      <StatusMark status={e.status} />
                    </button>
                    {on && <p className="fx-enter px-4 pb-3 pl-11 text-[16px] text-zinc-600 dark:text-zinc-400">{e.detail}</p>}
                    {on && <span className="block h-[2px] overflow-hidden">{timer}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

    </Section>
  );
}
