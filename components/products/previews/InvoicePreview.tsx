import React from "react";
import {
  ChartColumn,
  CreditCard,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import { AppShell, Badge, Bars, Card, PageHeader, PrimaryButton, Stat, type Tone } from "./ui";

const NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Receipt, label: "Invoices", active: true },
  { icon: Users, label: "Customers" },
  { icon: CreditCard, label: "Payments" },
  { icon: ChartColumn, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const INVOICES: { id: string; customer: string; amount: string; due: string; status: string }[] = [
  { id: "INV-1048", customer: "Northwind Studio", amount: "$2,400.00", due: "Oct 18", status: "Pending" },
  { id: "INV-1047", customer: "Bluefield Retail", amount: "$860.00", due: "Oct 12", status: "Paid" },
  { id: "INV-1046", customer: "Harbor & Co.", amount: "$1,275.50", due: "Oct 04", status: "Overdue" },
  { id: "INV-1045", customer: "Greenline Cafe", amount: "$420.00", due: "Oct 02", status: "Paid" },
  { id: "INV-1044", customer: "Atlas Logistics", amount: "$3,150.00", due: "Sep 28", status: "Paid" },
];

const tone = (s: string): Tone => (s === "Paid" ? "success" : s === "Overdue" ? "warning" : "neutral");

export default function InvoicePreview({ compact }: { compact?: boolean }) {
  return (
    <AppShell product="Invoice" url="invoice.foxses.com" nav={NAV} compact={compact}>
      <PageHeader
        title="Invoices"
        subtitle="October"
        action={
          !compact && (
            <PrimaryButton>
              <Plus className="h-4 w-4" /> New invoice
            </PrimaryButton>
          )
        }
      />

      <div className={`grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-[1fr_1fr_1fr_1.4fr]"}`}>
        <Stat label="Paid" value="18" hint={compact ? undefined : "$12,480.00"} />
        <Stat label="Pending" value="7" hint={compact ? undefined : "$5,215.00"} />
        <Stat label="Overdue" value="2" hint={compact ? undefined : "$1,275.50"} accent />
        {!compact && (
          <div className="rounded-[8px] border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-zinc-500 dark:text-zinc-400">Billed per week</span>
            <div className="mt-2">
              <Bars values={[5, 8, 6, 9, 7, 11]} height={52} highlight={5} />
            </div>
          </div>
        )}
      </div>

      <Card className="mt-3" title="All invoices" aside={compact ? undefined : "27 this month"}>
        {compact ? (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {INVOICES.slice(0, 5).map((inv) => (
              <li key={inv.id} className="flex items-center justify-between px-4 py-2.5">
                <span className="leading-tight">
                  <span className="block font-medium">{inv.customer}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {inv.id} · Due {inv.due}
                  </span>
                </span>
                <span className="text-right leading-tight">
                  <span className="block font-medium tabular-nums">{inv.amount}</span>
                  <Badge tone={tone(inv.status)}>{inv.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <table className="w-full text-left">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-2 font-normal">Invoice</th>
                <th className="py-2 font-normal">Customer</th>
                <th className="py-2 font-normal">Due date</th>
                <th className="py-2 text-right font-normal">Amount</th>
                <th className="px-4 py-2 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{inv.id}</td>
                  <td className="py-2.5 font-medium">{inv.customer}</td>
                  <td className="py-2.5 text-zinc-500 dark:text-zinc-400">{inv.due}</td>
                  <td className="py-2.5 text-right tabular-nums">{inv.amount}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Badge tone={tone(inv.status)}>{inv.status}</Badge>
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
