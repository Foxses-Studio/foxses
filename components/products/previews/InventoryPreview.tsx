import React from "react";
import {
  ArrowLeftRight,
  Boxes,
  ChartColumn,
  LayoutDashboard,
  Package,
  Plus,
  Settings,
  Truck,
  Warehouse,
} from "lucide-react";
import { AppShell, Badge, Card, PageHeader, PrimaryButton, Sparkline, Stat } from "./ui";

const NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Package, label: "Products" },
  { icon: Warehouse, label: "Warehouses" },
  { icon: ArrowLeftRight, label: "Stock movements" },
  { icon: Truck, label: "Suppliers" },
  { icon: ChartColumn, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const ITEMS = [
  { name: "Cotton T-shirt · Black", sku: "TS-1042", where: "Main warehouse", qty: 342, status: "In stock" },
  { name: "Canvas tote bag", sku: "BG-2210", where: "Main warehouse", qty: 18, status: "Low stock" },
  { name: "Ceramic mug 350ml", sku: "MG-0871", where: "Store room", qty: 126, status: "In stock" },
  { name: "Notebook A5 · Dotted", sku: "NB-3305", where: "Store room", qty: 0, status: "Out of stock" },
  { name: "Steel water bottle", sku: "WB-1190", where: "Main warehouse", qty: 9, status: "Low stock" },
];

const ACTIVITY = [
  { text: "+120 units received", meta: "Cotton T-shirt · Main warehouse" },
  { text: "−24 units shipped", meta: "Ceramic mug · Store room" },
  { text: "Low stock alert", meta: "Canvas tote bag · 18 left", alert: true },
  { text: "Transfer completed", meta: "Water bottle → Store room" },
];

const tone = (s: string) =>
  s === "In stock" ? "success" : s === "Low stock" ? "warning" : ("muted" as const);

export default function InventoryPreview({ compact }: { compact?: boolean }) {
  return (
    <AppShell product="Inventory" url="inventory.foxses.com" nav={NAV} compact={compact}>
      <PageHeader
        title="Overview"
        subtitle="All warehouses · This week"
        action={
          !compact && (
            <PrimaryButton>
              <Plus className="h-4 w-4" /> Add product
            </PrimaryButton>
          )
        }
      />

      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        <Stat label="Total products" value="1,248" />
        <Stat label="In stock" value="1,106" />
        <Stat label="Low stock" value="96" accent />
        <Stat label="Out of stock" value="46" />
      </div>

      {compact ? (
        <Card title="Needs attention" aside={`${ITEMS.filter((i) => i.status !== "In stock").length} items`} className="mt-3">
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {ITEMS.filter((i) => i.status !== "In stock").map((i) => (
              <li key={i.sku} className="flex items-center justify-between px-4 py-2.5">
                <span>
                  <span className="block font-medium">{i.name}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{i.sku}</span>
                </span>
                <Badge tone={tone(i.status)}>{i.qty === 0 ? "Out of stock" : `${i.qty} left`}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <div className="mt-3 grid grid-cols-[1.45fr_1fr] gap-3">
          <Card title="Stock movement" aside="Last 7 days">
            <div className="px-4 pb-2 pt-3">
              <div className="mb-1 flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-[#f25b2a]" /> Units out
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-t border-dashed border-zinc-400" /> Units in
                </span>
              </div>
              <Sparkline
                width={400}
                height={108}
                points={[42, 58, 51, 74, 66, 88, 81]}
                baseline={[60, 52, 64, 58, 70, 62, 72]}
              />
            </div>
          </Card>
          <Card title="Recent activity">
            <ul className="space-y-2.5 px-4 py-3">
              {ACTIVITY.map((a) => (
                <li key={a.text} className="flex gap-2.5">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                      a.alert ? "bg-[#f25b2a] fx-pulse-once" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                  <span className="leading-snug">
                    <span className="block font-medium">{a.text}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{a.meta}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {compact ? null : (
        <Card className="mt-3" title="Inventory" aside={<Boxes className="h-4 w-4" />}>
          <table className="w-full text-left">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-2 font-normal">Product</th>
                <th className="py-2 font-normal">SKU</th>
                <th className="py-2 font-normal">Location</th>
                <th className="py-2 text-right font-normal">Qty</th>
                <th className="px-4 py-2 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((i) => (
                <tr key={i.sku} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <td className="px-4 py-2 font-medium">{i.name}</td>
                  <td className="py-2 text-zinc-500 dark:text-zinc-400">{i.sku}</td>
                  <td className="py-2 text-zinc-500 dark:text-zinc-400">{i.where}</td>
                  <td className="py-2 text-right tabular-nums">{i.qty}</td>
                  <td className="px-4 py-2 text-right">
                    <Badge tone={tone(i.status)}>{i.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </AppShell>
  );
}
