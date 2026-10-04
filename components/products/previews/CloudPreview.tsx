import React from "react";
import { Check, Globe, LayoutDashboard, Search, Settings } from "lucide-react";
import { AppShell, Badge, Card, PageHeader } from "./ui";

// Domain search and management only — no hosting or other infrastructure,
// which Foxses Cloud does not offer.
const NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Search, label: "Find a domain", active: true },
  { icon: Globe, label: "My domains" },
  { icon: Settings, label: "Settings" },
];

const RESULTS = [
  { name: "brightbakery.com", price: "$12.99/yr", available: true, best: true },
  { name: "brightbakery.co", price: "$24.99/yr", available: true },
  { name: "brightbakery.store", price: "$4.99/yr", available: true },
  { name: "brightbakery.net", price: "—", available: false },
];

const OWNED = [
  { name: "northwindstudio.com", status: "Active", expires: "Mar 14, 2027" },
  { name: "northwind.shop", status: "Active", expires: "Nov 02, 2026" },
  { name: "nw-studio.co", status: "Expiring soon", expires: "Oct 21, 2026" },
];

export default function CloudPreview({ compact }: { compact?: boolean }) {
  return (
    <AppShell product="Cloud" url="cloud.foxses.com" nav={NAV} compact={compact}>
      <PageHeader title="Find a domain" subtitle="Search for the right name for your business" />

      <div className="flex h-11 items-center gap-2.5 rounded-[8px] border border-zinc-300 bg-white px-3.5 dark:border-zinc-700 dark:bg-zinc-900">
        <Search className="h-4 w-4 text-zinc-400" />
        <span className="flex-1 font-medium">
          brightbakery<span className="fx-caret ml-px inline-block h-5 w-px translate-y-1 bg-zinc-900 dark:bg-white" />
        </span>
        <span className="inline-flex h-8 items-center rounded-[6px] bg-[#f25b2a] px-3 font-medium text-white">
          Search
        </span>
      </div>

      <Card className="mt-3" title="Results" aside={compact ? undefined : "4 extensions checked"}>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {RESULTS.slice(0, compact ? 3 : 4).map((r) => (
            <li key={r.name} className="flex items-center gap-3 px-4 py-2.5">
              <span className="flex-1">
                <span className={`font-medium ${r.available ? "" : "text-zinc-400 line-through"}`}>
                  {r.name}
                </span>
                {r.best && !compact && (
                  <span className="ml-2">
                    <Badge tone="warning">Best match</Badge>
                  </span>
                )}
              </span>
              <span className="tabular-nums text-zinc-500 dark:text-zinc-400">{r.price}</span>
              {r.available ? (
                <span
                  className={`inline-flex h-8 items-center gap-1 rounded-[6px] px-3 ${
                    r.best
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {r.best && <Check className="h-4 w-4" />}
                  {r.best ? "Added" : "Add"}
                </span>
              ) : (
                <Badge tone="muted">Taken</Badge>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-3" title="My domains" aside={compact ? undefined : "3 domains"}>
        {compact ? (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {OWNED.slice(0, 2).map((d) => (
              <li key={d.name} className="flex items-center justify-between px-4 py-2.5 leading-tight">
                <span>
                  <span className="block font-medium">{d.name}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">Expires {d.expires}</span>
                </span>
                <Badge tone={d.status === "Active" ? "success" : "warning"}>{d.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <table className="w-full text-left">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-2 font-normal">Domain</th>
                <th className="py-2 font-normal">Status</th>
                <th className="px-4 py-2 text-right font-normal">Expires</th>
              </tr>
            </thead>
            <tbody>
              {OWNED.map((d) => (
                <tr key={d.name} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <td className="px-4 py-2.5 font-medium">{d.name}</td>
                  <td className="py-2.5">
                    <Badge tone={d.status === "Active" ? "success" : "warning"}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                    {d.expires}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </AppShell>
  );
}
