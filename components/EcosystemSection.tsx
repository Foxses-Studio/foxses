"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import * as MapLibreGL from "maplibre-gl";
import {
  Map,
  MapArc,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/components/ui/map";
import {
  FaBoxesPacking,
  FaFileInvoiceDollar,
  FaUsersGear,
  FaNetworkWired,
  FaArrowRight,
} from "react-icons/fa6";

// Product Definition for Globe Nodes
interface ProductNode {
  id: string;
  name: string;
  subtext: string;
  lat: number;
  lng: number;
}

const HUB_CORE = { name: "Foxses Core", lng: -0.1276, lat: 51.5074 };

const FOXSES_PRODUCTS: ProductNode[] = [
  {
    id: "sara-ai",
    name: "Sara AI",
    subtext: "Intelligence across your business",
    lat: 51.5074,
    lng: -0.1276,
  },
  {
    id: "inventory",
    name: "Inventory",
    subtext: "Real-time stock & warehouse",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "invoice",
    name: "Invoice",
    subtext: "Automated billing & payments",
    lat: -23.5505,
    lng: -46.6333,
  },
  {
    id: "hr",
    name: "HR",
    subtext: "People & payroll workflows",
    lat: -33.9249,
    lng: 18.4241,
  },
  {
    id: "forms",
    name: "Forms",
    subtext: "Smart data collection",
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    id: "support",
    name: "Support",
    subtext: "Helpdesk & customer tickets",
    lat: 25.2048,
    lng: 55.2708,
  },
  {
    id: "cloud",
    name: "Cloud",
    subtext: "Enterprise infrastructure",
    lat: -33.8688,
    lng: 151.2093,
  },
];

// Connection Arcs across Globe (source/target reference product ids)
const ECOSYSTEM_ARCS = [
  { id: "inv-invc", source: "inventory", target: "invoice", from: [-74.006, 40.7128] as [number, number], to: [-46.6333, -23.5505] as [number, number] },
  { id: "invc-sara", source: "invoice", target: "sara-ai", from: [-46.6333, -23.5505] as [number, number], to: [-0.1276, 51.5074] as [number, number] },
  { id: "hr-sara", source: "hr", target: "sara-ai", from: [18.4241, -33.9249] as [number, number], to: [-0.1276, 51.5074] as [number, number] },
  { id: "supp-sara", source: "support", target: "sara-ai", from: [55.2708, 25.2048] as [number, number], to: [-0.1276, 51.5074] as [number, number] },
  { id: "forms-supp", source: "forms", target: "support", from: [103.8198, 1.3521] as [number, number], to: [55.2708, 25.2048] as [number, number] },
  { id: "cloud-sara", source: "cloud", target: "sara-ai", from: [151.2093, -33.8688] as [number, number], to: [-0.1276, 51.5074] as [number, number] },
];

// Static paint objects (kept at module level so map layers are not rebuilt each render)
const BASE_ARC_PAINT = {
  "line-color": "#f25b2a",
  "line-width": 1.5,
  "line-opacity": 0.35,
  "line-dasharray": [2, 2],
};

const ACTIVE_ARC_PAINT = {
  "line-color": "#f25b2a",
  "line-width": 3,
  "line-opacity": 1,
};

const CAPABILITIES = [
  {
    icon: FaBoxesPacking,
    title: "Operations",
    stat: "Inventory · Forms",
    description: "Inventory, forms and everyday workflows stay synchronized automatically.",
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Finance",
    stat: "Invoice · Billing",
    description: "Billing, invoicing and business transaction data move together seamlessly.",
  },
  {
    icon: FaUsersGear,
    title: "People & Support",
    stat: "HR · Helpdesk",
    description: "HR records and customer support tickets work from the same connected ecosystem.",
  },
];

const CYCLE_INTERVAL_MS = 4000;
const USER_PAUSE_MS = 9000;

export default function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);
  const isPausedRef = useRef(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProduct = FOXSES_PRODUCTS[activeIndex];
  const activeArcs = useMemo(
    () =>
      ECOSYSTEM_ARCS.filter(
        (arc) => arc.source === activeProduct.id || arc.target === activeProduct.id
      ),
    [activeProduct.id]
  );

  // Auto-cycle through products unless the user recently interacted
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      setActiveIndex((prev) => (prev + 1) % FOXSES_PRODUCTS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Scroll Entrance Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth Auto-Rotation for MapLibre 3D Globe (paused after a user selection)
  useEffect(() => {
    let animationFrameId: number;

    const rotateGlobe = () => {
      const map = mapRef.current;
      if (
        map &&
        !isPausedRef.current &&
        !map.isMoving() &&
        !map.isRotating()
      ) {
        const center = map.getCenter();
        center.lng += 0.12;
        map.setCenter(center);
      }
      animationFrameId = requestAnimationFrame(rotateGlobe);
    };

    rotateGlobe();
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const handleSelect = (index: number) => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, USER_PAUSE_MS);
    setActiveIndex(index);

    const product = FOXSES_PRODUCTS[index];
    mapRef.current?.easeTo({
      center: [product.lng, product.lat],
      duration: 1200,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-zinc-50/60 dark:bg-zinc-950 py-16 sm:py-24 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors duration-300"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
        {/* SECTION HEADER — split layout */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-16 items-end transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-[6px] border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1 text-[16px] font-medium uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300 mb-5">
              <FaNetworkWired className="h-4 w-4 text-[#f25b2a]" />
              <span>Connected Ecosystem</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.08] text-zinc-900 dark:text-white">
              Everything connected.
              <br />
              <span className="text-[#f25b2a]">One Foxses ecosystem.</span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your apps, teams, data, and workflows — connected through one
              intelligent business platform. Pick a product to see how it links
              into the rest of Foxses.
            </p>
          </div>
        </div>

        {/* MAIN FRAME: product list + globe */}
        <div
          className={`mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-[400px_1fr] border border-zinc-200 dark:border-zinc-800 rounded-[8px] overflow-hidden bg-white dark:bg-zinc-900/40 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* LEFT: Interactive product list */}
          <div className="order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-[16px] font-semibold uppercase tracking-[0.14em] text-zinc-900 dark:text-white">
                Products
              </span>
              <span className="text-[16px] text-zinc-500 dark:text-zinc-400 tabular-nums">
                {String(activeIndex + 1).padStart(2, "0")} / {String(FOXSES_PRODUCTS.length).padStart(2, "0")}
              </span>
            </div>

            <ul className="flex-1 divide-y divide-zinc-200 dark:divide-zinc-800">
              {FOXSES_PRODUCTS.map((product, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(index)}
                      aria-pressed={isActive}
                      className={`group relative w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors duration-200 ${
                        isActive
                          ? "bg-[#f25b2a]/[0.06] dark:bg-[#f25b2a]/10"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* Active indicator bar */}
                      <span
                        className={`absolute left-0 top-0 h-full w-[3px] bg-[#f25b2a] transition-opacity duration-200 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />

                      <span
                        className={`text-[16px] tabular-nums font-medium ${
                          isActive ? "text-[#f25b2a]" : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block text-[16px] font-semibold text-zinc-900 dark:text-white leading-snug">
                          {product.name}
                        </span>
                        <span className="block text-[16px] text-zinc-500 dark:text-zinc-400 leading-snug truncate">
                          {product.subtext}
                        </span>
                      </span>

                      <FaArrowRight
                        className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                          isActive
                            ? "text-[#f25b2a] translate-x-0 opacity-100"
                            : "text-zinc-400 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: Globe */}
          <div className="order-1 lg:order-2 relative flex flex-col">
            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="inline-flex items-center gap-2 text-[16px] font-medium text-zinc-900 dark:text-white">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#f25b2a] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#f25b2a]" />
                </span>
                Live network
              </span>
              <span className="text-[16px] text-zinc-500 dark:text-zinc-400">
                {activeProduct.name} · {activeArcs.length}{" "}
                {activeArcs.length === 1 ? "connection" : "connections"}
              </span>
            </div>

            <div className="relative h-[400px] sm:h-[520px] lg:h-full lg:min-h-[560px]">
              {/* Corner brackets */}
              <span className="pointer-events-none absolute left-4 top-4 z-10 h-5 w-5 border-l-2 border-t-2 border-[#f25b2a]/60" />
              <span className="pointer-events-none absolute right-4 top-4 z-10 h-5 w-5 border-r-2 border-t-2 border-[#f25b2a]/60" />
              <span className="pointer-events-none absolute left-4 bottom-4 z-10 h-5 w-5 border-l-2 border-b-2 border-[#f25b2a]/60" />
              <span className="pointer-events-none absolute right-4 bottom-4 z-10 h-5 w-5 border-r-2 border-b-2 border-[#f25b2a]/60" />

              <Map
                ref={mapRef}
                center={[10, 20]}
                zoom={1.2}
                projection={{ type: "globe" }}
                className="w-full h-full"
              >
                {/* All connections (subtle) */}
                <MapArc
                  id="ecosystem-base"
                  data={ECOSYSTEM_ARCS}
                  curvature={0.25}
                  paint={BASE_ARC_PAINT}
                  interactive={false}
                />

                {/* Connections of the active product (highlighted) */}
                <MapArc
                  id="ecosystem-active"
                  data={activeArcs}
                  curvature={0.25}
                  paint={ACTIVE_ARC_PAINT}
                  interactive={false}
                />

                {/* FOXSES CORE HUB MARKER */}
                <MapMarker longitude={HUB_CORE.lng} latitude={HUB_CORE.lat}>
                  <MarkerContent>
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-zinc-900 border border-[#f25b2a]/60 flex items-center justify-center">
                        <Image
                          src="/all-logo/foxses-logo-icon.png"
                          alt="Foxses Icon"
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                  </MarkerContent>
                </MapMarker>

                {/* PRODUCT MARKERS */}
                {FOXSES_PRODUCTS.map((product, index) => {
                  const isActive = index === activeIndex;
                  // Sara AI shares the hub location; skip its dot to avoid overlap
                  if (product.id === "sara-ai" && !isActive) return null;

                  return (
                    <MapMarker
                      key={product.id}
                      longitude={product.lng}
                      latitude={product.lat}
                    >
                      <MarkerContent>
                        <button
                          type="button"
                          onClick={() => handleSelect(index)}
                          aria-label={product.name}
                          className="flex items-center"
                        >
                          <span
                            className={`block rounded-full border-2 border-white dark:border-zinc-900 bg-[#f25b2a] transition-all duration-300 ${
                              isActive ? "w-4 h-4" : "w-3 h-3 opacity-70"
                            }`}
                          />
                          {isActive && (
                            <MarkerLabel
                              position="top"
                              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[6px] px-2.5 py-1 text-left whitespace-nowrap"
                            >
                              <span className="block text-[16px] font-semibold leading-tight">
                                {product.name}
                              </span>
                            </MarkerLabel>
                          )}
                        </button>
                      </MarkerContent>
                    </MapMarker>
                  );
                })}
              </Map>
            </div>
          </div>

          {/* BOTTOM: Capability row spanning both columns */}
          <div className="order-3 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 border-t border-zinc-200 dark:border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
            {CAPABILITIES.map(({ icon: Icon, title, stat, description }) => (
              <div key={title} className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <Icon className="h-4 w-4 text-[#f25b2a]" />
                  </span>
                  <span className="text-[16px] text-zinc-500 dark:text-zinc-400">
                    {stat}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-[16px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
