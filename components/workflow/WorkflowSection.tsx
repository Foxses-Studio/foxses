"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Workflow } from "lucide-react";
import { STAGES } from "./workflow-data";
import { STAGE_VIEWS } from "./StageViews";

const STEP_MS = 3200;
const LEAVE_MS = 180;
const LAST = STAGES.length - 1;
const END_HOLD_MS = 5000;
const RESUME_MS = 10000;

type Mode = "idle" | "playing" | "done" | "stopped";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<number | null>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const reduced = useReducedMotion();
  const stage = STAGES[shown];
  const View = STAGE_VIEWS[stage.id];

  // Move to a stage: the stepper updates at once, the interface swaps after a short fade
  const goTo = useCallback(
    (i: number) => {
      setStep(i);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      if (reduced) {
        setShown(i);
        setLeaving(false);
        return;
      }
      setLeaving(true);
      leaveTimer.current = setTimeout(() => {
        setShown(i);
        setLeaving(false);
      }, LEAVE_MS);
    },
    [reduced]
  );

  // Manual navigation pauses autoplay; it picks up again after a quiet moment
  const choose = (i: number) => {
    setMode("stopped");
    goTo(Math.max(0, Math.min(LAST, i)));
  };

  // Entrance + viewport tracking (autoplay pauses off screen)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsVisible(true);
          setMode((m) => (m === "idle" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "playing" : m));
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  // Autoplay: loops through every stage, resting a little longer on Support
  const paused = hovering || !inView || tabHidden;
  useEffect(() => {
    if (paused || reduced) return;
    if (mode === "stopped") {
      const t = setTimeout(() => setMode("playing"), RESUME_MS);
      return () => clearTimeout(t);
    }
    if (mode !== "playing") return;
    const t = setTimeout(() => goTo(step >= LAST ? 0 : step + 1), step >= LAST ? END_HOLD_MS : STEP_MS);
    return () => clearTimeout(t);
  }, [mode, paused, reduced, step, goTo]);

  // On narrow screens keep the active stage centred in the scrollable stepper
  useEffect(() => {
    const scroller = stepperRef.current;
    const btn = scroller?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!scroller || !btn || scroller.scrollWidth <= scroller.clientWidth) return;
    scroller.scrollTo({
      left: btn.offsetLeft - scroller.clientWidth / 2 + btn.offsetWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [step, reduced]);

  const onStepKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? Math.min(LAST, step + 1) : Math.max(0, step - 1);
    choose(next);
    canvasRef.current?.querySelector<HTMLButtonElement>(`[data-step="${next}"]`)?.focus();
  };

  const progress = step / LAST;
  const reveal = (extra = "") =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${extra} ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0"
    }`;
  const viewMotion = leaving
    ? "opacity-0 -translate-x-2.5 transition-all duration-150 ease-in"
    : "fx-slide-in";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="workflow-heading"
      className="relative w-full overflow-hidden bg-[#111113] text-white dark:bg-[#09090b] border-b border-zinc-800"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="lg:border-x border-white/[0.07] py-20 sm:py-28 lg:py-32 lg:px-10 xl:px-14">
          {/* HEADER — left-aligned to change rhythm after the centered products header */}
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div>
              <p
                className={`inline-flex items-center gap-2 text-[16px] font-medium uppercase tracking-[0.16em] text-[#f25b2a] ${reveal()}`}
              >
                <Workflow className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Connected Workflows
              </p>
              <h2
                id="workflow-heading"
                className={`mt-4 text-[34px] sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.06] ${reveal("delay-100")}`}
              >
                One action.
                <br />
                <span className="text-[#f25b2a] font-bold">Everything stays in sync.</span>
              </h2>
            </div>
            <p
              className={`max-w-[520px] text-[16px] sm:text-lg leading-relaxed text-zinc-400 lg:pb-2 ${reveal("delay-200")}`}
            >
              Move from customer activity to operations, billing and support without losing the
              context your team needs.
            </p>
          </div>

          {/* WORKFLOW CANVAS */}
          <div
            ref={canvasRef}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`mx-auto mt-12 sm:mt-16 max-w-[1240px] overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.025] transition-all duration-700 delay-300 ease-out motion-reduce:transition-none ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98] motion-reduce:opacity-100 motion-reduce:scale-100"
            }`}
          >
            {/* Stepper */}
            <div className="border-b border-white/10 px-2 py-5 sm:px-6 sm:py-7">
              <div
                ref={stepperRef}
                role="group"
                aria-label="Workflow stages"
                onKeyDown={onStepKeyDown}
                className="relative -mx-2 overflow-x-auto no-scrollbar px-2 sm:mx-0 sm:overflow-visible sm:px-0"
              >
                <div className="relative grid min-w-[640px] grid-cols-6 sm:min-w-0">
                  {/* One connection path: neutral track, orange progress, travelling pulse */}
                  <div aria-hidden="true" className="pointer-events-none absolute left-[8.333%] right-[8.333%] top-[18px]">
                    <div
                      className={`h-px origin-left bg-white/15 transition-transform duration-1000 ease-out motion-reduce:transition-none ${
                        isVisible ? "scale-x-100" : "scale-x-0 motion-reduce:scale-x-100"
                      }`}
                    />
                    <div
                      className="absolute left-0 top-0 h-px bg-[#f25b2a] transition-[width] duration-1000 ease-in-out motion-reduce:transition-none"
                      style={{ width: `${progress * 100}%` }}
                    />
                    <span
                      className="absolute top-0 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-1000 ease-in-out motion-reduce:hidden"
                      style={{ left: `${progress * 100}%` }}
                    >
                      <span className="relative flex h-2.5 w-2.5">
                        {mode === "playing" && !paused && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f25b2a] opacity-50" />
                        )}
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#f25b2a] ring-4 ring-[#111113] dark:ring-[#09090b]" />
                      </span>
                    </span>
                  </div>

                  {STAGES.map((s, i) => {
                    const Icon = s.icon;
                    const active = i === step;
                    const done = i < step;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        data-step={i}
                        onClick={() => choose(i)}
                        aria-current={active ? "step" : undefined}
                        aria-label={`Step ${i + 1} of ${STAGES.length}: ${s.label}${done ? " (completed)" : ""}`}
                        className="group relative flex flex-col items-center gap-2.5 rounded-[6px] px-1 pb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]"
                      >
                        <span
                          className={`relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
                            active
                              ? "border-[#f25b2a] bg-[#f25b2a] text-white"
                              : done
                                ? "border-[#f25b2a]/50 bg-[#1a1210] text-[#f25b2a] dark:bg-[#140d0b]"
                                : "border-white/15 bg-[#161618] text-zinc-500 group-hover:text-zinc-300 dark:bg-[#0f0f11]"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span className="flex items-baseline gap-1.5 text-[16px] leading-none">
                          <span className={`tabular-nums ${active ? "text-[#f25b2a]" : "text-zinc-600"}`}>{pad(i + 1)}</span>
                          <span
                            className={`transition-colors ${
                              active ? "font-semibold text-white" : done ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          >
                            {s.label}
                          </span>
                        </span>
                        {/* Non-colour active indicator */}
                        <span
                          aria-hidden="true"
                          className={`h-0.5 w-6 rounded-full transition-opacity ${active ? "bg-white opacity-100" : "opacity-0"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stage: shared context + the one active interface */}
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
              <aside className="hidden border-r border-white/10 px-6 py-8 lg:block" aria-label="Shared context">
                <p className="text-[16px] font-medium uppercase tracking-[0.14em] text-zinc-500">Shared context</p>
                <ul className="mt-5 space-y-4">
                  {STAGES.map((s, i) => (
                    <li
                      key={s.id}
                      className={`transition-all duration-500 motion-reduce:transition-none ${
                        i <= step ? "opacity-100 translate-x-0" : "opacity-25 translate-x-1"
                      }`}
                    >
                      <span className="block text-[16px] text-zinc-500">{s.context.label}</span>
                      <span className={`block text-[16px] font-medium ${i <= step ? "text-white" : "text-zinc-600"}`}>
                        {i <= step ? s.context.value : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div
                className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
                onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchStart.current === null) return;
                  const dx = e.changedTouches[0].clientX - touchStart.current;
                  touchStart.current = null;
                  if (Math.abs(dx) > 50) choose(step + (dx < 0 ? 1 : -1));
                }}
              >
                <div key={shown} className={`mx-auto max-w-[720px] ${viewMotion}`}>
                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[16px] text-zinc-300">
                      <stage.icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
                      {stage.product ?? `${stage.label} activity`}
                    </span>
                    <span className="text-[16px] text-zinc-400">{stage.microcopy}</span>
                  </div>

                  <div
                    role="img"
                    aria-label={`${stage.label} stage: illustrative ${stage.product ?? stage.label.toLowerCase()} view for order #FX-1048`}
                    className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <div aria-hidden="true" className="flex min-h-[330px] flex-col">
                      <View />
                    </div>
                  </div>
                </div>

                {/* Mobile progress + prev/next */}
                <div className="mt-5 flex items-center justify-between sm:hidden">
                  <button
                    type="button"
                    onClick={() => choose(step - 1)}
                    disabled={step === 0}
                    aria-label="Previous stage"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 text-zinc-300 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-[16px] text-zinc-400" aria-live="polite">
                    <span className="tabular-nums text-white">
                      {pad(step + 1)} / {pad(STAGES.length)}
                    </span>{" "}
                    · {STAGES[step].label}
                  </span>
                  <button
                    type="button"
                    onClick={() => choose(step + 1)}
                    disabled={step === LAST}
                    aria-label="Next stage"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 text-zinc-300 disabled:opacity-30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Event log — visually secondary */}
            <div className="border-t border-white/10 px-4 py-5 sm:px-6">
              <ol aria-label="Event log" className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
                {STAGES.map((s, i) => {
                  const reached = i <= step;
                  return (
                    <li
                      key={s.id}
                      className={`flex gap-2.5 text-[16px] leading-snug transition-opacity duration-500 ${
                        reached ? "opacity-100" : "opacity-30 max-sm:hidden"
                      } ${reached && i < step - 2 ? "max-sm:hidden" : ""}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                          i === step ? "bg-[#f25b2a]" : reached ? "bg-zinc-500" : "bg-zinc-700"
                        }`}
                      />
                      <span>
                        <span className="font-mono tabular-nums text-zinc-500">{reached ? s.event.time : "--:--"}</span>
                        <span className={`block ${reached ? "text-zinc-300" : "text-zinc-600"}`}>
                          {reached ? s.event.text : s.label}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Closing statement */}
          <div className={`mx-auto mt-14 max-w-[1240px] text-center sm:mt-16 ${reveal("delay-300")}`}>
            <p className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Your tools shouldn&apos;t work in isolation.
            </p>
            <p className="mx-auto mt-3 max-w-[560px] text-[16px] sm:text-lg leading-relaxed text-zinc-400">
              Foxses keeps your business context connected as work moves from one team to another.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
