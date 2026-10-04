import React from "react";
import {
  Building2,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { AppShell, Avatar, Badge, Bars, Card, PageHeader, PrimaryButton, Stat, type Tone } from "./ui";

const NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Users, label: "Employees", active: true },
  { icon: CalendarCheck, label: "Attendance" },
  { icon: Building2, label: "Departments" },
  { icon: FileText, label: "Documents" },
  { icon: Settings, label: "Settings" },
];

const PEOPLE = [
  { name: "Ayesha Karim", initials: "AK", role: "Operations Lead", dept: "Operations", status: "Present" },
  { name: "Daniel Brooks", initials: "DB", role: "Accountant", dept: "Finance", status: "Present" },
  { name: "Mei Tanaka", initials: "MT", role: "Support Specialist", dept: "Customer Care", status: "On leave" },
  { name: "Rafael Ortiz", initials: "RO", role: "Warehouse Associate", dept: "Operations", status: "Present" },
  { name: "Sofia Lind", initials: "SL", role: "Designer", dept: "Marketing", status: "Remote" },
];

const ACTIVITY = [
  "Mei Tanaka · leave approved",
  "New employee added to Finance",
  "Attendance closed for Monday",
];

const tone = (s: string): Tone => (s === "Present" ? "success" : s === "On leave" ? "warning" : "neutral");

export default function HRPreview({ compact }: { compact?: boolean }) {
  return (
    <AppShell product="HR" url="hr.foxses.com" nav={NAV} compact={compact}>
      <PageHeader
        title="Employees"
        subtitle="48 people · 6 departments"
        action={
          !compact && (
            <PrimaryButton>
              <Plus className="h-4 w-4" /> Add employee
            </PrimaryButton>
          )
        }
      />

      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-[1fr_1fr_1fr_1.5fr]"}`}>
        <Stat label="Employees" value="48" />
        <Stat label="Present today" value="42" />
        {!compact && <Stat label="On leave" value="3" accent />}
        {!compact && (
          <div className="rounded-[8px] border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-zinc-500 dark:text-zinc-400">Attendance this week</span>
            <div className="mt-2">
              <Bars values={[44, 46, 39, 45, 42]} height={62} highlight={4} labels={["M", "T", "W", "T", "F"]} />
            </div>
          </div>
        )}
      </div>

      <div className={`mt-3 grid gap-3 ${compact ? "" : "grid-cols-[1fr_230px]"}`}>
        <Card title="Directory" aside={compact ? undefined : "All departments"}>
          {compact ? (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {PEOPLE.slice(0, 5).map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 px-4 py-2.5">
                  <Avatar initials={p.initials} tone={i} />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block font-medium">{p.name}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{p.dept}</span>
                  </span>
                  <Badge tone={tone(p.status)}>{p.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <table className="w-full text-left">
              <thead className="text-zinc-500 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-2 font-normal">Name</th>
                  <th className="py-2 font-normal">Department</th>
                  <th className="px-4 py-2 text-right font-normal">Today</th>
                </tr>
              </thead>
              <tbody>
                {PEOPLE.map((p, i) => (
                  <tr key={p.name} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                    <td className="px-4 py-2">
                      <span className="flex items-center gap-2.5">
                        <Avatar initials={p.initials} tone={i} />
                        <span className="leading-tight">
                          <span className="block font-medium">{p.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400">{p.role}</span>
                        </span>
                      </span>
                    </td>
                    <td className="py-2 text-zinc-500 dark:text-zinc-400">{p.dept}</td>
                    <td className="px-4 py-2 text-right">
                      <Badge tone={tone(p.status)}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {!compact && (
          <Card title="Recent activity">
            <ul className="space-y-3 px-4 py-3">
              {ACTIVITY.map((a, i) => (
                <li key={a} className="flex gap-2.5 leading-snug">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                      i === 0 ? "bg-[#f25b2a] fx-pulse-once" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                  {a}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
