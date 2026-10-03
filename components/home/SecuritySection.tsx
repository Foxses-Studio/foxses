"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Activity, Database, KeyRound } from "lucide-react";
import { Section } from "./shared";
import { EASE, gsap, MQ, revealOnScroll, useGsap } from "@/lib/motion";

// Section 10 — trust, told through structure rather than badges.
// Everything here is a design principle. When real, verifiable facts exist
// (encryption details, backups, status page, certifications), add them to
// TRUST_POINTS with kind: "fact", or to COMPLIANCE / STATUS_URL — they render
// automatically. Until then nothing is claimed.

interface TrustPoint {
  kind: "principle" | "fact";
  icon: typeof KeyRound;
  title: string;
  line: string;
}

const TRUST_POINTS: TrustPoint[] = [
  { kind: "principle", icon: KeyRound, title: "Access", line: "Designed around controlled access to your workspace." },
  { kind: "principle", icon: Database, title: "Data", line: "Built with business data protection in mind." },
  { kind: "principle", icon: Activity, title: "Reliability", line: "Built for dependable, everyday operations." },
];

/** Verified certifications only — e.g. { name: "SOC 2 Type II", href: "/security" } */
const COMPLIANCE: { name: string; href?: string }[] = [];
/** Public status page, once one exists */
const STATUS_URL: string | null = null;

const LAYERS = [
  { id: "access", label: "Access", short: "Access", note: "Who can reach the workspace." },
  { id: "application", label: "Application", short: "App", note: "Where your team works." },
  { id: "data", label: "Business data", short: "Data", note: "What the workspace keeps." },
];

function LayerLabel({
  layer,
  hovered,
  setHovered,
}: {
  layer: (typeof LAYERS)[number];
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(layer.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(layer.id)}
      onBlur={() => setHovered(null)}
      onClick={() => setHovered((h) => (h === layer.id ? null : layer.id))}
      aria-describedby={`trust-note-${layer.id}`}
      className="absolute left-4 top-3 flex items-center gap-2 whitespace-nowrap rounded-[4px] text-[16px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]/80" aria-hidden="true" />
      <span className="max-sm:hidden">{layer.label}</span>
      <span className="sm:hidden">{layer.short}</span>
      <span
        id={`trust-note-${layer.id}`}
        className={`normal-case tracking-normal text-zinc-300 transition-opacity duration-300 ${hovered === layer.id ? "opacity-100" : "opacity-0"} max-sm:hidden`}
      >
        — {layer.note}
      </span>
    </button>
  );
}

export default function SecuritySection() {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useGsap(ref, (mm, el) => {
    revealOnScroll(el);

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-trust]", start: "top 72%", toggleActions: "play none none none" },
        defaults: { ease: EASE },
      });
      tl.from("[data-trust-layer]", { autoAlpha: 0, duration: 0.7, stagger: 0.18 })
        .from("[data-trust-core]", { autoAlpha: 0, scale: 0.9, duration: 0.5 }, "-=0.2")
        .from("[data-trust-user]", { autoAlpha: 0, x: -10, duration: 0.4, stagger: 0.06 }, "-=0.3");

      // A single request travels inward, pausing briefly at each boundary
      const req = gsap.timeline({ repeat: -1, repeatDelay: 5, paused: true });
      req
        .set("[data-trust-request]", { left: "4%", autoAlpha: 0 })
        .to("[data-trust-request]", { autoAlpha: 1, duration: 0.2 })
        .to("[data-trust-request]", { left: "18%", duration: 0.8, ease: "power2.inOut" })
        .fromTo("[data-trust-ack='access']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, yoyo: true, repeat: 1 })
        .to("[data-trust-request]", { left: "30%", duration: 0.6, ease: "power2.inOut" })
        .fromTo("[data-trust-ack='application']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, yoyo: true, repeat: 1 })
        .to("[data-trust-request]", { left: "56%", duration: 0.7, ease: "power2.inOut" })
        .to("[data-trust-request]", { autoAlpha: 0, duration: 0.25 })
        .fromTo("[data-trust-core-ring]", { scale: 1, autoAlpha: 0.6 }, { scale: 1.5, autoAlpha: 0, duration: 0.8 }, "-=0.2");

      tl.eventCallback("onComplete", () => req.play());
      gsap.timeline({
        scrollTrigger: { trigger: "[data-trust]", start: "top bottom", end: "bottom top", onToggle: (self) => (self.isActive && tl.progress() === 1 ? req.play() : req.pause()) },
      });
    });

    // Light scroll depth on desktop: outer layers settle slightly faster than the core
    mm.add(MQ.desktop, () => {
      gsap.fromTo("[data-trust-depth='outer']", { scale: 1.03 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-trust]", start: "top bottom", end: "center center", scrub: 0.8 } });
      gsap.fromTo("[data-trust-depth='inner']", { scale: 1.06 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-trust]", start: "top bottom", end: "center center", scrub: 0.8 } });
    });
  });

  const layerClass = (id: string) =>
    `transition-colors duration-300 ${hovered === id ? "border-[#f25b2a]/60" : "border-white/[0.12]"}`;

  return (
    <Section ref={ref} id="security" tone="dark" labelledBy="security-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_70%_50%,#000_20%,transparent_75%)]"
      />

      <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-20">
        <div className="flex flex-col justify-center">
          <p data-reveal className="text-[16px] font-medium uppercase tracking-[0.16em] text-[#f25b2a]">Security &amp; reliability</p>
          <h2 id="security-heading" data-reveal className="mt-4 text-[34px] sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.06]">
            Built with trust
            <br />
            <span className="text-[#f25b2a]">at the foundation.</span>
          </h2>

          <ul className="mt-12 border-t border-white/10">
            {TRUST_POINTS.map(({ icon: Icon, title, line }, i) => (
              <li key={title} data-reveal className="flex gap-5 border-b border-white/10 py-5">
                <span className="tabular-nums text-[16px] text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[16px] font-semibold text-white">
                    <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
                    {title}
                  </span>
                  <span className="mt-1 block text-[16px] text-zinc-400">{line}</span>
                </span>
              </li>
            ))}
          </ul>

          {(COMPLIANCE.length > 0 || STATUS_URL) && (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[16px] text-zinc-300">
              {COMPLIANCE.map((c) => (c.href ? <a key={c.name} href={c.href} className="hover:text-[#f25b2a]">{c.name}</a> : <span key={c.name}>{c.name}</span>))}
              {STATUS_URL && <a href={STATUS_URL} className="text-white hover:text-[#f25b2a]">View system status →</a>}
            </div>
          )}
        </div>

        {/* Trust layers */}
        <div data-trust data-reveal="soft" className="relative" aria-label="Layers of the Foxses workspace" role="group">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[680px] sm:aspect-[16/11]">
            {/* incoming users */}
            <div className="absolute inset-y-0 left-0 hidden w-[16%] flex-col justify-center gap-6 sm:flex" aria-hidden="true">
              {["User", "Team", "Workspace"].map((u, i) => (
                <span key={u} data-trust-user className="flex items-center gap-2 text-[16px] text-zinc-500">
                  <span className={`h-2 w-2 rounded-full ${i === 1 ? "bg-[#f25b2a]" : "bg-zinc-600"}`} />
                  {u}
                </span>
              ))}
            </div>
            <span aria-hidden="true" className="absolute left-[3%] right-[55%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-white/15 sm:block" />
            <span data-trust-request aria-hidden="true" className="absolute top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f25b2a] opacity-0 sm:block motion-reduce:hidden" style={{ left: "4%" }} />

            {/* nested boundaries */}
            <div className="absolute inset-0 sm:left-[18%]">
              {(() => {
                const [outer, mid, inner] = LAYERS;
                return (
                  <div data-trust-layer data-trust-depth="outer" className={`relative h-full w-full rounded-[8px] border bg-white/[0.015] ${layerClass(outer.id)}`}>
                    <LayerLabel layer={outer} hovered={hovered} setHovered={setHovered} />
                    <span data-trust-ack="access" aria-hidden="true" className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#f25b2a] opacity-0" />
                    <div className="absolute inset-[13%] top-[16%]">
                      <div data-trust-layer data-trust-depth="inner" className={`relative h-full w-full rounded-[8px] border bg-white/[0.02] ${layerClass(mid.id)}`}>
                        <LayerLabel layer={mid} hovered={hovered} setHovered={setHovered} />
                        <span data-trust-ack="application" aria-hidden="true" className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#f25b2a] opacity-0" />
                        <div className="absolute inset-[14%] top-[22%]">
                          <div data-trust-layer className={`relative flex h-full w-full items-center justify-center rounded-[8px] border bg-[radial-gradient(circle_at_50%_55%,rgba(242,91,42,0.10),transparent_65%)] ${layerClass(inner.id)}`}>
                            <LayerLabel layer={inner} hovered={hovered} setHovered={setHovered} />
                            <div data-trust-core className="relative mt-6 flex flex-col items-center gap-2">
                              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#f25b2a]/40 bg-[#111113] dark:bg-[#09090b]">
                                <span data-trust-core-ring aria-hidden="true" className="absolute inset-0 rounded-full border border-[#f25b2a]/60 opacity-0" />
                                <Image src="/all-logo/foxses_logo.png" alt="" width={28} height={30} className="h-7 w-auto" />
                              </span>
                              <span className="text-[16px] font-semibold text-white">Foxses</span>
                              <span className="text-[16px] text-zinc-500 max-sm:hidden">Business workspace</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
