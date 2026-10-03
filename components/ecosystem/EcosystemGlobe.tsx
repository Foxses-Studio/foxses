"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { LAND_DOTS } from "@/lib/globe-land-dots";
import {
  GLOBE_ARCS,
  GLOBE_NODES,
  SARA_NODE_ID,
  DATA_NODE_ID,
} from "./globe-data";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const DEG = Math.PI / 180;
const ORANGE = "242, 91, 42";
const AUTO_SPEED = 3.2 * DEG; // radians per second — one turn ≈ 2 minutes
const DEFAULT_TILT = 16 * DEG;
const MIN_TILT = -8 * DEG;
const MAX_TILT = 42 * DEG;
const RESUME_DELAY_MS = 2000;
const HOVER_SPEED_FACTOR = 0.3;
const ARC_SAMPLES = 56;
const INTRO_MS = 1000;

interface Palette {
  dot: string;
  dotAlpha: number;
  grid: string;
  gridAlpha: number;
  outline: string;
  outlineAlpha: number;
  fillInner: string;
  fillOuter: string;
  node: string;
  ring: string;
  leader: string;
}

const LIGHT: Palette = {
  dot: "113, 113, 122",
  dotAlpha: 0.55,
  grid: "24, 24, 27",
  gridAlpha: 0.075,
  outline: "24, 24, 27",
  outlineAlpha: 0.1,
  fillInner: "#ffffff",
  fillOuter: "#f5f3f0",
  node: "82, 82, 91",
  ring: "#ffffff",
  leader: "113, 113, 122",
};

const DARK: Palette = {
  dot: "161, 161, 170",
  dotAlpha: 0.5,
  grid: "255, 255, 255",
  gridAlpha: 0.06,
  outline: "255, 255, 255",
  outlineAlpha: 0.12,
  fillInner: "#1b1b1e",
  fillOuter: "#0e0e10",
  node: "212, 212, 216",
  ring: "#09090b",
  leader: "161, 161, 170",
};

/* ------------------------------------------------------------------ */
/* Precomputed geometry (unit sphere, model space)                     */
/* ------------------------------------------------------------------ */

type Vec3 = [number, number, number];

function toVec(lng: number, lat: number): Vec3 {
  const l = lng * DEG;
  const p = lat * DEG;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
}

const DOT_COUNT = LAND_DOTS.length / 2;
const DOT_VECS = new Float32Array(DOT_COUNT * 3);
for (let i = 0; i < DOT_COUNT; i++) {
  const v = toVec(LAND_DOTS[i * 2], LAND_DOTS[i * 2 + 1]);
  DOT_VECS.set(v, i * 3);
}

function buildLine(points: Vec3[]): Float32Array {
  const arr = new Float32Array(points.length * 3);
  points.forEach((p, i) => arr.set(p, i * 3));
  return arr;
}

const GRID_LINES: Float32Array[] = [];
for (let lat = -60; lat <= 60; lat += 20) {
  const pts: Vec3[] = [];
  for (let lng = -180; lng <= 180; lng += 4) pts.push(toVec(lng, lat));
  GRID_LINES.push(buildLine(pts));
}
for (let lng = -180; lng < 180; lng += 20) {
  const pts: Vec3[] = [];
  for (let lat = -90; lat <= 90; lat += 4) pts.push(toVec(lng, lat));
  GRID_LINES.push(buildLine(pts));
}

const NODE_INDEX: Record<string, number> = {};
GLOBE_NODES.forEach((n, i) => (NODE_INDEX[n.id] = i));
const NODE_VECS = GLOBE_NODES.map((n) => toVec(n.lng, n.lat));
const SARA_INDEX = NODE_INDEX[SARA_NODE_ID];
const DATA_INDEX = NODE_INDEX[DATA_NODE_ID];

interface ArcGeometry {
  from: number;
  to: number;
  points: Float32Array;
  toSara: boolean;
}

// Great-circle arcs lifted off the surface so they read as travelling over the globe
const ARCS: ArcGeometry[] = GLOBE_ARCS.map(({ from, to }) => {
  const a = NODE_VECS[NODE_INDEX[from]];
  const b = NODE_VECS[NODE_INDEX[to]];
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const sinO = Math.sin(omega) || 1;
  const lift = 0.05 + 0.2 * (omega / Math.PI);
  const points = new Float32Array((ARC_SAMPLES + 1) * 3);
  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const t = i / ARC_SAMPLES;
    const wa = Math.sin((1 - t) * omega) / sinO;
    const wb = Math.sin(t * omega) / sinO;
    const h = 1 + lift * Math.sin(Math.PI * t);
    points[i * 3] = (wa * a[0] + wb * b[0]) * h;
    points[i * 3 + 1] = (wa * a[1] + wb * b[1]) * h;
    points[i * 3 + 2] = (wa * a[2] + wb * b[2]) * h;
  }
  return {
    from: NODE_INDEX[from],
    to: NODE_INDEX[to],
    points,
    toSara: to === SARA_NODE_ID || from === SARA_NODE_ID,
  };
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface ArcSlot {
  arc: number;
  start: number;
  duration: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function EcosystemGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saraLabelRef = useRef<HTMLDivElement>(null);
  const dataLabelRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<Palette>(LIGHT);
  const requestDrawRef = useRef<() => void>(() => {});

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    paletteRef.current = resolvedTheme === "dark" ? DARK : LIGHT;
    requestDrawRef.current();
  }, [resolvedTheme]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    // Layout
    let size = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let isMobile = false;
    let visibleLeft = 0;
    let visibleRight = 0;

    // Motion state
    let lambda = 22 * DEG;
    let tilt = DEFAULT_TILT;
    let speed = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastInteraction = -Infinity;
    let pointer: { x: number; y: number } | null = null;
    let hoverNode = -1;

    // Loop state
    let isVisible = false;
    let introStart = -1;
    let rafId = 0;
    let lastFrame = 0;
    let slots: ArcSlot[] = [];

    // Per-frame rotation coefficients
    let cl = 1;
    let sl = 0;
    let ct = 1;
    let st = 0;
    const out = { x: 0, y: 0, z: 0, nx: 0, ny: 0 };

    const project = (x: number, y: number, z: number) => {
      const x1 = x * cl + z * sl;
      const z1 = -x * sl + z * cl;
      const y2 = y * ct - z1 * st;
      out.z = y * st + z1 * ct;
      out.nx = x1;
      out.ny = y2;
      out.x = cx + x1 * R;
      out.y = cy - y2 * R;
      return out;
    };

    // A lifted arc point is visible in front of the sphere or outside its silhouette
    const arcDepth = (z: number, nx: number, ny: number) => {
      if (z > 0) return 0.45 + 0.55 * clamp01(z * 1.6);
      return nx * nx + ny * ny > 1 ? 0.4 : 0.03;
    };

    const resize = () => {
      size = wrapper.clientWidth;
      isMobile = window.innerWidth < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = size / 2;
      cy = size / 2;
      R = size * 0.41;

      // Portion of the canvas actually on screen (globe may bleed past the viewport on mobile)
      const rect = wrapper.getBoundingClientRect();
      visibleLeft = Math.max(0, -rect.left) + 12;
      visibleRight = size - Math.max(0, rect.right - window.innerWidth) - 12;
      requestDraw();
    };

    const pickArc = (exclude: Set<number>) => {
      let total = 0;
      const weights = ARCS.map((arc, i) => {
        if (exclude.has(i)) return 0;
        const m = (ARC_SAMPLES / 2) * 3;
        const p = project(arc.points[m], arc.points[m + 1], arc.points[m + 2]);
        const front = p.z > 0.15 ? 1 : 0.03;
        const w = front * (arc.toSara ? 1.7 : 1);
        total += w;
        return w;
      });
      let r = Math.random() * total;
      for (let i = 0; i < weights.length; i++) {
        r -= weights[i];
        if (r <= 0 && weights[i] > 0) return i;
      }
      return weights.findIndex((w) => w > 0);
    };

    const slotCount = () => (isMobile ? 2 : 3);

    const seedSlots = (now: number) => {
      slots = [];
      const used = new Set<number>();
      for (let i = 0; i < slotCount(); i++) {
        const arc = pickArc(used);
        if (arc < 0) break;
        used.add(arc);
        slots.push({
          arc,
          start: reduced ? -Infinity : now + i * 1500,
          duration: 5200 + Math.random() * 1800,
        });
      }
    };

    // Envelope (0..1) and draw progress for an arc slot
    const slotState = (slot: ArcSlot, now: number) => {
      if (reduced) return { t: 0.5, env: 0.8, prog: 1 };
      const t = (now - slot.start) / slot.duration;
      if (t < 0) return { t, env: 0, prog: 0 };
      const env = Math.min(smooth(0, 0.08, t), 1 - smooth(0.82, 1, t));
      return { t, env, prog: easeOut(clamp01(t / 0.35)) };
    };

    const draw = (now: number) => {
      const pal = paletteRef.current;
      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
      lastFrame = now;

      if (introStart < 0 && isVisible) introStart = now;
      const intro = reduced
        ? 1
        : introStart < 0
          ? 0
          : clamp01((now - introStart) / INTRO_MS);
      const nodesIn = smooth(0.3, 0.7, intro);

      // Rotation: pause on interaction, resume gently after a short delay
      const idle = !dragging && now - lastInteraction > RESUME_DELAY_MS;
      let target = reduced || !idle || intro < 0.6 ? 0 : AUTO_SPEED;
      if (hoverNode >= 0) target *= HOVER_SPEED_FACTOR;
      speed += (target - speed) * Math.min(1, dt * 1.2);
      lambda += speed * dt;
      if (idle && !reduced) tilt += (DEFAULT_TILT - tilt) * Math.min(1, dt * 0.6);

      cl = Math.cos(lambda);
      sl = Math.sin(lambda);
      ct = Math.cos(tilt);
      st = Math.sin(tilt);

      ctx.clearRect(0, 0, size, size);
      const scale = R / 320;

      // Sphere body
      const grad = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.4,
        R * 0.1,
        cx,
        cy,
        R * 1.05
      );
      grad.addColorStop(0, pal.fillInner);
      grad.addColorStop(1, pal.fillOuter);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${pal.outline}, ${pal.outlineAlpha})`;
      ctx.stroke();

      // Graticule — three depth buckets
      const gridPaths = [new Path2D(), new Path2D(), new Path2D()];
      for (const line of GRID_LINES) {
        let px = 0;
        let py = 0;
        let pz = -1;
        for (let i = 0; i < line.length; i += 3) {
          const p = project(line[i], line[i + 1], line[i + 2]);
          if (pz > 0 && p.z > 0) {
            const b = Math.min(2, Math.floor(((pz + p.z) / 2) * 3));
            gridPaths[b].moveTo(px, py);
            gridPaths[b].lineTo(p.x, p.y);
          }
          px = p.x;
          py = p.y;
          pz = p.z;
        }
      }
      [0.3, 0.65, 1].forEach((a, b) => {
        ctx.strokeStyle = `rgba(${pal.grid}, ${pal.gridAlpha * a})`;
        ctx.stroke(gridPaths[b]);
      });

      // Land dot cloud — four depth buckets
      const dotPaths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      const dotRadius = [0.7, 0.85, 1, 1.12].map((r) => r * scale);
      for (let i = 0; i < DOT_COUNT; i++) {
        const p = project(DOT_VECS[i * 3], DOT_VECS[i * 3 + 1], DOT_VECS[i * 3 + 2]);
        if (p.z <= 0.04) continue;
        const b = Math.min(3, Math.floor(p.z * 4));
        dotPaths[b].moveTo(p.x + dotRadius[b], p.y);
        dotPaths[b].arc(p.x, p.y, dotRadius[b], 0, Math.PI * 2);
      }
      [0.2, 0.45, 0.75, 1].forEach((a, b) => {
        ctx.fillStyle = `rgba(${pal.dot}, ${pal.dotAlpha * a})`;
        ctx.fill(dotPaths[b]);
      });

      // Dormant paths — barely there
      const dormant = new Path2D();
      for (const arc of ARCS) {
        let started = false;
        for (let i = 0; i <= ARC_SAMPLES; i += 2) {
          const p = project(arc.points[i * 3], arc.points[i * 3 + 1], arc.points[i * 3 + 2]);
          if (p.z > 0.05) {
            if (started) dormant.lineTo(p.x, p.y);
            else dormant.moveTo(p.x, p.y);
            started = true;
          } else started = false;
        }
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ORANGE}, ${0.07 * nodesIn})`;
      ctx.stroke(dormant);

      // Active slots: refresh finished ones
      if (intro >= 0.6 && slots.length === 0) seedSlots(now);
      if (!reduced) {
        const used = new Set(slots.map((s) => s.arc));
        slots.forEach((slot, i) => {
          if (now - slot.start > slot.duration) {
            used.delete(slot.arc);
            const next = pickArc(used);
            if (next >= 0) {
              used.add(next);
              slots[i] = {
                arc: next,
                start: now + 300 + Math.random() * 900,
                duration: 5200 + Math.random() * 1800,
              };
            }
          }
        });
      }

      // Node activity from active arcs + hover
      const activity = new Float32Array(GLOBE_NODES.length);
      const drawArc = (arc: ArcGeometry, prog: number, alpha: number, width: number) => {
        const last = Math.floor(prog * ARC_SAMPLES);
        ctx.lineWidth = width;
        let prev = project(arc.points[0], arc.points[1], arc.points[2]);
        let px = prev.x;
        let py = prev.y;
        for (let i = 1; i <= last; i++) {
          prev = project(arc.points[i * 3], arc.points[i * 3 + 1], arc.points[i * 3 + 2]);
          const d = arcDepth(prev.z, prev.nx, prev.ny);
          ctx.strokeStyle = `rgba(${ORANGE}, ${alpha * d})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(prev.x, prev.y);
          ctx.stroke();
          px = prev.x;
          py = prev.y;
        }
      };

      const pointOnArc = (arc: ArcGeometry, f: number) => {
        const pos = clamp01(f) * ARC_SAMPLES;
        const i = Math.min(ARC_SAMPLES - 1, Math.floor(pos));
        const k = pos - i;
        const a = i * 3;
        const b = (i + 1) * 3;
        return project(
          arc.points[a] + (arc.points[b] - arc.points[a]) * k,
          arc.points[a + 1] + (arc.points[b + 1] - arc.points[a + 1]) * k,
          arc.points[a + 2] + (arc.points[b + 2] - arc.points[a + 2]) * k
        );
      };

      for (const slot of slots) {
        const arc = ARCS[slot.arc];
        const { t, env, prog } = slotState(slot, now);
        if (env <= 0) continue;
        activity[arc.from] = Math.max(activity[arc.from], env);
        activity[arc.to] = Math.max(activity[arc.to], env * clamp01(prog * 1.5));
        const highlighted = hoverNode === arc.from || hoverNode === arc.to;
        drawArc(arc, prog, (highlighted ? 0.95 : 0.7) * env * nodesIn, 1.25);

        // Data pulse with a short fading trail
        if (!reduced) {
          const f = (t - 0.12) / 0.72;
          if (f > 0 && f < 1) {
            for (let k = 5; k >= 0; k--) {
              const p = pointOnArc(arc, f - k * 0.018);
              const d = arcDepth(p.z, p.nx, p.ny);
              if (d < 0.1) continue;
              ctx.beginPath();
              ctx.arc(p.x, p.y, (k === 0 ? 1.9 : 1.3) * scale, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${ORANGE}, ${(k === 0 ? 1 : 0.4 - k * 0.06) * env * d})`;
              ctx.fill();
            }
          }
        }
      }

      // Hovered node: brighten all of its paths
      if (hoverNode >= 0) {
        activity[hoverNode] = 1;
        for (const arc of ARCS) {
          if (arc.from !== hoverNode && arc.to !== hoverNode) continue;
          if (slots.some((s) => ARCS[s.arc] === arc)) continue;
          drawArc(arc, 1, 0.55, 1.1);
        }
      }

      activity[SARA_INDEX] = Math.max(activity[SARA_INDEX], 0.75);

      // Nodes + hover hit-test
      let nextHover = -1;
      let bestDist = 18 * 18;
      const pulseT = now / 1800;
      for (let i = 0; i < GLOBE_NODES.length; i++) {
        const v = NODE_VECS[i];
        const p = project(v[0], v[1], v[2]);
        if (p.z <= 0.02) continue;
        const depth = clamp01(p.z / 0.4) * nodesIn;
        const act = activity[i];
        const hovered = i === hoverNode;
        const r = (2.1 + act * 0.8 + (hovered ? 1.4 : 0)) * scale;

        if (pointer && !dragging) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = dx * dx + dy * dy;
          if (dist < bestDist && p.z > 0.15) {
            bestDist = dist;
            nextHover = i;
          }
        }

        // Pulse ring on active nodes
        if (act > 0.05 && !reduced) {
          const ph = (pulseT + i * 0.17) % 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + ph * 9 * scale, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${ORANGE}, ${(1 - ph) * 0.35 * act * depth})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pal.node}, ${0.55 * (1 - act) * depth})`;
        ctx.fill();
        if (act > 0) {
          ctx.fillStyle = `rgba(${ORANGE}, ${act * depth})`;
          ctx.fill();
          ctx.globalAlpha = act * depth;
          ctx.lineWidth = 1.25;
          ctx.strokeStyle = pal.ring;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      if (nextHover !== hoverNode) {
        hoverNode = nextHover;
      }

      // Annotations: thin leader line on canvas, label in the DOM
      const placeLabel = (
        el: HTMLDivElement | null,
        nodeIdx: number,
        enabled: boolean
      ) => {
        if (!el) return;
        const v = NODE_VECS[nodeIdx];
        const p = project(v[0], v[1], v[2]);
        const op = enabled ? smooth(0.25, 0.55, p.z) * nodesIn : 0;
        el.style.opacity = String(op);
        if (op <= 0.01) return;
        const dir = p.x >= cx ? 1 : -1;
        const ax = p.x + dir * 34 * scale;
        const ay = p.y - 40 * scale;
        ctx.beginPath();
        ctx.moveTo(p.x + dir * 5 * scale, p.y - 6 * scale);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = `rgba(${pal.leader}, ${0.45 * op})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const w = el.offsetWidth;
        let lx = dir > 0 ? ax + 6 : ax - 6 - w;
        lx = Math.max(visibleLeft, Math.min(visibleRight - w, lx));
        el.style.transform = `translate3d(${lx}px, ${ay - el.offsetHeight / 2}px, 0)`;
      };
      placeLabel(saraLabelRef.current, SARA_INDEX, true);
      placeLabel(dataLabelRef.current, DATA_INDEX, !isMobile);

      if (reduced || !isVisible) rafId = 0;
      else rafId = requestAnimationFrame(draw);
    };

    const requestDraw = () => {
      if (rafId || size === 0) return;
      rafId = requestAnimationFrame(draw);
    };
    requestDrawRef.current = requestDraw;

    // Pointer interaction — drag to rotate (horizontal pans stay with the globe on touch)
    const localPoint = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastInteraction = performance.now();
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        lambda += (dx / R) * 0.9;
        tilt = Math.max(MIN_TILT, Math.min(MAX_TILT, tilt + (dy / R) * 0.6));
        lastInteraction = performance.now();
        requestDraw();
      } else if (e.pointerType === "mouse") {
        pointer = localPoint(e);
        if (reduced) requestDraw();
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      lastInteraction = performance.now();
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = "grab";
    };
    const onLeave = () => {
      pointer = null;
      hoverNode = -1;
      requestDraw();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    const onReducedChange = () => {
      reduced = reducedQuery.matches;
      slots = [];
      requestDraw();
    };
    reducedQuery.addEventListener("change", onReducedChange);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);
    resize();

    // Only animate while the globe is on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastFrame = 0;
          requestDraw();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.05 }
    );
    io.observe(wrapper);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      resizeObserver.disconnect();
      reducedQuery.removeEventListener("change", onReducedChange);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      requestDrawRef.current = () => {};
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      role="img"
      aria-label="A slowly rotating globe with data flowing between connected points, representing one connected Foxses business ecosystem."
      className="relative aspect-square w-full select-none"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 cursor-grab touch-pan-y"
      />

      {/* Minimal annotations (positioned every frame by the canvas loop) */}
      <div
        ref={saraLabelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 opacity-0 whitespace-nowrap rounded-[4px] bg-white/85 dark:bg-zinc-950/85 px-1.5 py-1"
      >
        <span className="flex items-center gap-2 text-[16px] font-semibold text-zinc-900 dark:text-white leading-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" />
          Sara AI
        </span>
        <span className="block pl-3.5 text-[16px] text-zinc-500 dark:text-zinc-400 leading-tight">
          AI across your business
        </span>
      </div>

      <div
        ref={dataLabelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 opacity-0 whitespace-nowrap rounded-[4px] bg-white/85 dark:bg-zinc-950/85 px-1.5 py-1"
      >
        <span className="flex items-center gap-2 text-[16px] font-semibold text-zinc-900 dark:text-white leading-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" />
          Real-time data
        </span>
        <span className="block pl-3.5 text-[16px] text-zinc-500 dark:text-zinc-400 leading-tight">
          Connected workflows
        </span>
      </div>

      {/* Subtle Foxses presence */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[3%] left-1/2 -translate-x-1/2 sm:bottom-[9%] sm:left-auto sm:right-[6%] sm:translate-x-0 flex items-center gap-2"
      >
        <Image
          src="/all-logo/foxses_logo.png"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 object-contain"
        />
        <span className="text-[16px] font-medium text-zinc-500 dark:text-zinc-400">
          Foxses Network
        </span>
      </div>
    </div>
  );
}
