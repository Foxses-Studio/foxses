"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "react-icons/fa6";

// Product Definition for Minimal Annotations
interface ProductNode {
  id: string;
  name: string;
  subtext: string;
  lat: number;
  lng: number;
  isSaraAI?: boolean;
}

const HUB_CORE = { name: "Foxses Core", lng: -0.1276, lat: 51.5074 };

const FOXSES_PRODUCTS: ProductNode[] = [
  {
    id: "sara-ai",
    name: "Sara AI",
    subtext: "Intelligence across your business",
    lat: 51.5074,
    lng: -0.1276,
    isSaraAI: true,
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

// Annotation Sets (Only 3 visible at a time)
const ANNOTATION_SETS = [
  ["sara-ai", "inventory", "invoice"],
  ["sara-ai", "hr", "support"],
  ["sara-ai", "forms", "cloud"],
  ["sara-ai", "inventory", "support"],
];

// Connection Arcs across Globe
const ECOSYSTEM_ARCS = [
  {
    id: "inv-invc",
    from: [-74.006, 40.7128] as [number, number],
    to: [-46.6333, -23.5505] as [number, number],
  },
  {
    id: "invc-sara",
    from: [-46.6333, -23.5505] as [number, number],
    to: [-0.1276, 51.5074] as [number, number],
  },
  {
    id: "hr-sara",
    from: [18.4241, -33.9249] as [number, number],
    to: [-0.1276, 51.5074] as [number, number],
  },
  {
    id: "supp-sara",
    from: [55.2708, 25.2048] as [number, number],
    to: [-0.1276, 51.5074] as [number, number],
  },
  {
    id: "forms-supp",
    from: [103.8198, 1.3521] as [number, number],
    to: [55.2708, 25.2048] as [number, number],
  },
  {
    id: "cloud-sara",
    from: [151.2093, -33.8688] as [number, number],
    to: [-0.1276, 51.5074] as [number, number],
  },
];

export default function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  // Periodically transition active annotation set (every 4.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSetIndex((prev) => (prev + 1) % ANNOTATION_SETS.length);
    }, 4500);
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

  // Smooth Auto-Rotation for MapLibre 3D Globe
  useEffect(() => {
    let animationFrameId: number;

    const rotateGlobe = () => {
      const map = mapRef.current;
      if (map && !map.isMoving() && !map.isRotating()) {
        const center = map.getCenter();
        center.lng += 0.12;
        map.setCenter(center);
      }
      animationFrameId = requestAnimationFrame(rotateGlobe);
    };

    rotateGlobe();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const currentActiveSet = ANNOTATION_SETS[activeSetIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 py-12 sm:py-16 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors duration-300"
    >
      {/* Background Grid Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-matrix opacity-25 dark:opacity-35 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_45%,#000_60%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 text-center">
        {/* SECTION HEADER */}
        <div
          className={`transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Small Outlined Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1 text-[16px] font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 shadow-none mb-4">
            <FaNetworkWired className="h-3.5 w-3.5 text-[#f25b2a]" />
            <span>CONNECTED ECOSYSTEM</span>
          </div>

          {/* Headline */}
          <h2 className="mx-auto max-w-4xl text-3xl font-semibold text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
            Everything Connected. <br className="hidden sm:inline" />
            <span className="text-[#f25b2a] font-bold">One Foxses Ecosystem.</span>
          </h2>

          {/* Subtitle Description */}
          <p className="mx-auto max-w-2xl text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
            Your apps, teams, data, and workflows — connected through one intelligent business platform.
          </p>
        </div>

        {/* DOMINANT HERO GLOBE USING MapLibre Map & MapArc */}
        <div
          className={`relative mt-10 sm:mt-12 w-full max-w-[950px] mx-auto h-[480px] sm:h-[580px] lg:h-[660px] flex items-center justify-center transition-all duration-1000 transform ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
          }`}
        >
          {/* Structural Vertical dashed guidelines around Globe */}
          <div className="absolute inset-y-0 left-8 right-8 pointer-events-none hidden md:flex justify-between border-x border-dashed border-zinc-200/50 dark:border-zinc-800/50 z-10" />

          {/* Map Component Container */}
          <div className="relative w-full h-full rounded-[16px] overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
            <Map
              ref={mapRef}
              center={[10, 20]}
              zoom={1.2}
              projection={{ type: "globe" }}
              className="w-full h-full"
            >
              {/* Curved Animated Map Arcs */}
              <MapArc
                data={ECOSYSTEM_ARCS}
                curvature={0.25}
                paint={{
                  "line-color": "#f25b2a",
                  "line-width": 2.5,
                  "line-opacity": 0.9,
                  "line-dasharray": [2, 2],
                }}
                interactive={false}
              />

              {/* FOXSES CORE HUB MARKER */}
              <MapMarker longitude={HUB_CORE.lng} latitude={HUB_CORE.lat}>
                <MarkerContent>
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-[#f25b2a]/50 shadow-xs flex items-center justify-center backdrop-blur-md">
                      <Image
                        src="/all-logo/foxses-logo-icon.png"
                        alt="Foxses Icon"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="mt-1 text-[16px] font-bold tracking-widest text-zinc-900 dark:text-white uppercase drop-shadow-xs">
                      FOXSES CORE
                    </span>
                  </div>
                </MarkerContent>
              </MapMarker>

              {/* PRODUCT ANNOTATIONS / MARKERS */}
              {FOXSES_PRODUCTS.map((product) => {
                const isActiveInSet = currentActiveSet.includes(product.id);

                return (
                  <MapMarker
                    key={product.id}
                    longitude={product.lng}
                    latitude={product.lat}
                  >
                    <MarkerContent>
                      <div className="group flex items-center gap-1.5 cursor-pointer">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-[#f25b2a] shadow-xs animate-pulse" />
                        {isActiveInSet && (
                          <MarkerLabel
                            position="top"
                            className="bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-[6px] px-2.5 py-1 text-left backdrop-blur-md shadow-xs"
                          >
                            <span className="block text-[16px] font-semibold text-zinc-900 dark:text-white leading-tight">
                              {product.name}
                            </span>
                            <span className="block text-[14px] text-zinc-500 dark:text-zinc-400 font-normal leading-tight">
                              {product.subtext}
                            </span>
                          </MarkerLabel>
                        )}
                      </div>
                    </MarkerContent>
                  </MapMarker>
                );
              })}
            </Map>
          </div>
        </div>

        {/* CLOUDFLARE-STYLE STRUCTURAL 3-COLUMN CAPABILITY ROW */}
        <div className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-zinc-200/80 dark:border-zinc-800 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            
            {/* Column 1: OPERATIONS */}
            <div className="md:border-r border-zinc-200/60 dark:border-zinc-800/60 md:pr-6">
              <div className="flex items-center gap-2 mb-2">
                <FaBoxesPacking className="h-4 w-4 text-[#f25b2a]" />
                <h3 className="text-[16px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
                  OPERATIONS
                </h3>
              </div>
              <p className="text-[16px] text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                Inventory, forms and everyday workflows stay synchronized automatically.
              </p>
            </div>

            {/* Column 2: FINANCE */}
            <div className="md:border-r border-zinc-200/60 dark:border-zinc-800/60 md:px-6">
              <div className="flex items-center gap-2 mb-2">
                <FaFileInvoiceDollar className="h-4 w-4 text-[#f25b2a]" />
                <h3 className="text-[16px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
                  FINANCE
                </h3>
              </div>
              <p className="text-[16px] text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                Billing, invoicing and business transaction data move together seamlessly.
              </p>
            </div>

            {/* Column 3: PEOPLE & SUPPORT */}
            <div className="md:pl-6">
              <div className="flex items-center gap-2 mb-2">
                <FaUsersGear className="h-4 w-4 text-[#f25b2a]" />
                <h3 className="text-[16px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
                  PEOPLE & SUPPORT
                </h3>
              </div>
              <p className="text-[16px] text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                HR records and customer support tickets work from the same connected ecosystem.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
