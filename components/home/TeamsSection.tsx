"use client";

import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Heading, ProductTag, Section, tabKeyHandler, useSwap, type ProductKey } from "./shared";
import { Badge, Frame, Initials, Metric, Panel, Row, Rows } from "./ui-kit";
import { revealOnScroll, useGsap } from "@/lib/motion";

// Section 6 — organised around roles, not products.
// The "Owners" view is a workspace concept, not a shipped unified dashboard.

type RoleId = "owners" | "operations" | "finance" | "people" | "support";

interface Role {
  id: RoleId;
  label: string;
  short: string;
  headline: string[];
  line: string;
  products: ProductKey[];
  frame: string;
}

const ROLES: Role[] = [
  {
    id: "owners",
    label: "Business Owners",
    short: "Owners",
    headline: ["See the whole business", "without switching tools."],
    line: "Operations, billing, people and customers — side by side.",
    products: ["inventory", "invoice", "hr", "support"],
    frame: "Workspace concept · Owner view",
  },
  {
    id: "operations",
    label: "Operations",
    short: "Operations",
    headline: ["Everyday operations,", "organized and visible."],
    line: "Stock and incoming information in one view.",
    products: ["inventory", "forms"],
    frame: "Operations view",
  },
  {
    id: "finance",
    label: "Finance",
    short: "Finance",
    headline: ["Billing that's", "easy to follow."],
    line: "Invoices and payment status, with the customer behind them.",
    products: ["invoice"],
    frame: "Finance view",
  },
  {
    id: "people",
    label: "HR & People",
    short: "HR",
    headline: ["Your people,", "in one organized place."],
    line: "Employee records and attendance without the spreadsheets.",
    products: ["hr"],
    frame: "People view",
  },
  {
    id: "support",
    label: "Customer Support",
    short: "Support",
    headline: ["Help customers", "with the context in view."],
    line: "Requests, conversations and related records together.",
    products: ["support"],
    frame: "Support view",
  },
];

/* ---------------- Role workspaces (illustrative data) ---------------- */

function OwnersView() {
  return (
    <div className="p-4 sm:p-6">
      <p className="text-[16px] text-zinc-500 dark:text-zinc-400">Good morning, Alex</p>
      <p className="text-[22px] font-semibold tracking-tight">Business overview</p>
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 rounded-[8px] border border-zinc-200 p-4 dark:border-zinc-800 sm:grid-cols-4">
        <Metric label="Products" value="248" />
        <Metric label="Open invoices" value="12" accent />
        <Metric label="Team" value="24" />
        <Metric label="Open tickets" value="8" />
      </div>
      <Panel title="Recent activity" className="mt-4">
        <Rows>
          <Row className="fx-arrive" primary="Support ticket updated" secondary="Alex Morgan · #1842" end={<span className="text-[16px] text-zinc-400">Now</span>} />
          <Row primary="Invoice INV-1048 marked paid" secondary="Foxses Invoice" end={<span className="text-[16px] text-zinc-400">09:48</span>} />
          <Row primary="Order #FX-1048 recorded" secondary="Business Starter Package" end={<span className="text-[16px] text-zinc-400">09:42</span>} />
          <Row className="max-sm:hidden" primary="New employee added" secondary="Finance" end={<span className="text-[16px] text-zinc-400">Mon</span>} />
        </Rows>
      </Panel>
    </div>
  );
}

function OperationsView() {
  return (
    <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <Panel title="Stock status" aside="248 products">
          <div className="px-4 py-4">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
              <span className="fx-fill-x h-full w-[78%] bg-zinc-800 dark:bg-zinc-300" />
              <span className="fx-fill-x h-full w-[15%] bg-[#f25b2a]" style={{ animationDelay: "500ms" }} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-[16px]">
              <div><dt className="text-zinc-500 dark:text-zinc-400">In stock</dt><dd className="font-semibold tabular-nums">194</dd></div>
              <div><dt className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400"><span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" />Low</dt><dd className="font-semibold tabular-nums">37</dd></div>
              <div><dt className="text-zinc-500 dark:text-zinc-400">Out</dt><dd className="font-semibold tabular-nums">17</dd></div>
            </dl>
          </div>
        </Panel>
        <Panel title="Needs restocking">
          <Rows>
            <Row primary="Canvas tote bag" secondary="BG-2210" end={<Badge tone="warning">18 left</Badge>} />
            <Row primary="Steel water bottle" secondary="WB-1190" end={<Badge tone="warning">9 left</Badge>} />
          </Rows>
        </Panel>
      </div>
      <Panel title="Form submissions" aside="Today" className="max-md:hidden">
        <Rows>
          <Row primary="Supplier intake" secondary="Northwind Supply" end={<span className="text-[16px] text-zinc-400">10:02</span>} />
          <Row primary="Stock count" secondary="Store room" end={<span className="text-[16px] text-zinc-400">09:15</span>} />
          <Row primary="Damage report" secondary="Main warehouse" end={<span className="text-[16px] text-zinc-400">08:40</span>} />
          <Row primary="Supplier intake" secondary="Harbor Goods" end={<span className="text-[16px] text-zinc-400">Mon</span>} />
        </Rows>
      </Panel>
    </div>
  );
}

function FinanceView() {
  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-3 divide-x divide-zinc-200 rounded-[8px] border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {[
          ["Paid", "18"],
          ["Pending", "7"],
          ["Overdue", "2"],
        ].map(([k, v], i) => (
          <div key={k} className="px-4 py-3">
            <Metric label={k} value={v} accent={i === 2} />
          </div>
        ))}
      </div>
      <Panel title="Recent invoices" className="mt-4">
        <Rows>
          <Row
            primary="INV-1048 · Alex Morgan"
            secondary="Due Oct 18"
            end={
              <span className="flex items-center gap-3">
                <span className="tabular-nums max-sm:hidden">$120.00</span>
                <span className="relative inline-grid">
                  <Badge tone="neutral" className="fx-swap-out col-start-1 row-start-1">Pending</Badge>
                  <Badge tone="success" className="fx-swap-in col-start-1 row-start-1 justify-self-end">Paid</Badge>
                </span>
              </span>
            }
          />
          <Row primary="INV-1047 · Acme Studio" secondary="Due Oct 12" end={<span className="flex items-center gap-3"><span className="tabular-nums max-sm:hidden">$350.00</span><Badge>Pending</Badge></span>} />
          <Row primary="INV-1046 · Northstar" secondary="Due Oct 04" end={<span className="flex items-center gap-3"><span className="tabular-nums max-sm:hidden">$89.00</span><Badge tone="warning">Overdue</Badge></span>} />
          <Row className="max-sm:hidden" primary="INV-1045 · Greenline Cafe" secondary="Due Oct 02" end={<span className="flex items-center gap-3"><span className="tabular-nums">$420.00</span><Badge tone="success">Paid</Badge></span>} />
        </Rows>
      </Panel>
    </div>
  );
}

function PeopleView() {
  const people = [
    ["Ayesha Karim", "Operations", "Present", "AK"],
    ["Daniel Brooks", "Finance", "Present", "DB"],
    ["Mei Tanaka", "Customer Care", "On leave", "MT"],
    ["Rafael Ortiz", "Operations", "Present", "RO"],
  ];
  return (
    <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[1fr_1.4fr]">
      <Panel title="Today">
        <div className="px-4 py-4">
          <p className="text-[32px] font-semibold leading-none tabular-nums">
            21<span className="text-[18px] font-normal text-zinc-400"> / 24 present</span>
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
            <span className="fx-fill-x block h-full w-[87.5%] rounded-full bg-[#f25b2a]" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[16px]">
            <div><dt className="text-zinc-500 dark:text-zinc-400">On leave</dt><dd className="font-semibold">2</dd></div>
            <div><dt className="text-zinc-500 dark:text-zinc-400">Absent</dt><dd className="font-semibold">1</dd></div>
          </dl>
        </div>
      </Panel>
      <Panel title="Team">
        <Rows>
          {people.map(([n, d, s, i], idx) => (
            <li key={n} className={`flex items-center gap-3 px-4 py-2.5 text-[16px] ${idx > 2 ? "max-sm:hidden" : ""}`}>
              <Initials tone={idx}>{i}</Initials>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate font-medium">{n}</span>
                <span className="text-zinc-500 dark:text-zinc-400">{d}</span>
              </span>
              <Badge tone={s === "Present" ? "success" : "warning"}>{s}</Badge>
            </li>
          ))}
        </Rows>
      </Panel>
    </div>
  );
}

function SupportView() {
  return (
    <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr_200px]">
      <div className="border-b border-zinc-100 dark:border-zinc-800 md:border-b-0 md:border-r">
        <div className="flex gap-3 px-4 py-2.5 text-[16px] text-zinc-500 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-white">Open 8</span>
          <span>Pending 3</span>
        </div>
        <Rows>
          <Row className="bg-zinc-50 dark:bg-zinc-800/40" primary="Where's my invoice?" secondary="Alex Morgan" />
          <Row primary="Change shipping address" secondary="Hana Ito" />
          <Row className="max-md:hidden" primary="Account access" secondary="Leo Martin" />
        </Rows>
      </div>
      <div className="space-y-3 p-4 text-[16px]">
        <p className="font-semibold">#1842 · Alex Morgan</p>
        <p className="max-w-[92%] rounded-[8px] bg-zinc-100 px-3 py-2 leading-snug dark:bg-zinc-800">
          Hi — where can I find the invoice for my last order?
        </p>
        <p className="fx-arrive ml-auto max-w-[92%] rounded-[8px] border border-zinc-200 px-3 py-2 leading-snug dark:border-zinc-700">
          INV-1048 is paid — I&apos;ve sent you a copy.
        </p>
      </div>
      <dl className="hidden space-y-3 border-l border-zinc-100 bg-zinc-50/70 p-4 text-[16px] dark:border-zinc-800 dark:bg-zinc-950/40 lg:block">
        {[
          ["Order", "#FX-1048"],
          ["Invoice", "INV-1048"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-zinc-500 dark:text-zinc-400">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Payment</dt>
          <dd><Badge tone="success">Paid</Badge></dd>
        </div>
      </dl>
    </div>
  );
}

const VIEWS: Record<RoleId, React.ComponentType> = {
  owners: OwnersView,
  operations: OperationsView,
  finance: FinanceView,
  people: PeopleView,
  support: SupportView,
};

/* ---------------- Section ---------------- */

export default function TeamsSection() {
  const ref = useRef<HTMLElement>(null);
  const { selected, shown, leaving, select } = useSwap(0, 160);
  const role = ROLES[shown];
  const View = VIEWS[role.id];

  useGsap(ref, (_mm, el) => revealOnScroll(el));

  const motion = leaving ? "opacity-0 translate-y-2 transition-all duration-150" : "fx-enter";

  return (
    <Section ref={ref} id="teams" tone="warm" labelledBy="teams-heading">
      <div className="max-w-[720px]">
        <Eyebrow>Built for every team</Eyebrow>
        <Heading id="teams-heading" lead="Different teams." accent="One connected workspace." />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-[minmax(0,32fr)_minmax(0,68fr)] lg:gap-0">
        {/* Role navigation */}
        <div
          role="tablist"
          aria-label="Teams"
          aria-orientation="vertical"
          onKeyDown={tabKeyHandler(ROLES.length, selected, select)}
          data-reveal
          className="-mx-4 flex gap-1 overflow-x-auto no-scrollbar px-4 lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-zinc-200 lg:px-0 lg:pr-10 dark:lg:border-zinc-800"
        >
          {ROLES.map((r, i) => {
            const active = i === selected;
            return (
              <button
                key={r.id}
                id={`team-tab-${r.id}`}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="team-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative flex shrink-0 items-center gap-4 whitespace-nowrap rounded-[6px] text-left text-[16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]
                  px-3.5 py-2 lg:w-full lg:rounded-none lg:border-b lg:border-zinc-200 lg:px-0 lg:py-5 dark:lg:border-zinc-800
                  ${active
                    ? "bg-white text-zinc-900 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-white dark:ring-zinc-800 lg:bg-transparent lg:ring-0 dark:lg:bg-transparent"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-px top-0 hidden h-full w-[2px] bg-[#f25b2a] transition-opacity lg:block ${active ? "opacity-100" : "opacity-0"}`}
                />
                <span className={`hidden tabular-nums lg:inline lg:pl-5 ${active ? "text-[#f25b2a]" : "text-zinc-400"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`lg:text-lg ${active ? "font-semibold" : ""}`}>
                  <span className="lg:hidden">{r.short}</span>
                  <span className="hidden lg:inline">{r.label}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className={`ml-auto hidden h-4 w-4 transition-all duration-300 lg:block ${
                    active ? "translate-x-0 text-[#f25b2a] opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Workspace */}
        <div
          id="team-panel"
          role="tabpanel"
          aria-labelledby={`team-tab-${ROLES[selected].id}`}
          data-reveal="soft"
          className="relative lg:border-l lg:border-zinc-200 lg:pl-12 xl:pl-16 dark:lg:border-zinc-800"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 right-0 select-none text-[160px] font-semibold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.04] max-lg:hidden"
          >
            {String(shown + 1).padStart(2, "0")}
          </span>

          <div key={role.id} className={`relative ${motion}`}>
            <h3 className="text-[28px] sm:text-4xl font-semibold tracking-tight leading-[1.12]">
              {role.headline.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </h3>
            <p className="mt-4 max-w-[520px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-400">{role.line}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {role.products.map((p) => (
                <ProductTag key={p} product={p} />
              ))}
            </div>

            <div role="img" aria-label={`${role.label}: example workspace with sample data`} className="mt-8">
              <div aria-hidden="true">
                <Frame label={role.frame}>
                  <View />
                </Frame>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
