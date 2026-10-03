// Content for the "Explore Foxses Products" showcase.
// Keep capabilities conservative — see docs/foxses-content-guide.md.

export type CategoryId =
  | "all"
  | "operations"
  | "finance"
  | "people"
  | "customer-experience"
  | "cloud";

export type ProductId = "inventory" | "forms" | "invoice" | "hr" | "support" | "cloud";

export interface ProductCategory {
  id: CategoryId;
  label: string;
}

export interface Product {
  id: ProductId;
  name: string;
  shortName: string;
  category: Exclude<CategoryId, "all">;
  categoryLabel: string;
  headline: string[];
  description: string;
  capabilities: string[];
  cta: string;
  href: string;
  /** Address shown in the preview's window bar */
  url: string;
  /** Shown when a product is not generally available yet */
  status?: string;
}

export const CATEGORIES: ProductCategory[] = [
  { id: "all", label: "All Products" },
  { id: "operations", label: "Operations" },
  { id: "finance", label: "Finance" },
  { id: "people", label: "People" },
  { id: "customer-experience", label: "Customer Experience" },
  { id: "cloud", label: "Cloud" },
];

export const PRODUCTS: Product[] = [
  {
    id: "inventory",
    name: "Foxses Inventory",
    shortName: "Inventory",
    category: "operations",
    categoryLabel: "Operations",
    headline: ["Know what's in stock.", "Know what's moving.", "Stay in control."],
    description:
      "Track inventory, stock movement and warehouse activity from one connected workspace.",
    capabilities: [
      "Real-time inventory tracking",
      "Stock & warehouse visibility",
      "Inventory activity management",
    ],
    cta: "Explore Inventory",
    href: "/products/inventory",
    url: "inventory.foxses.com",
  },
  {
    id: "forms",
    name: "Foxses Forms",
    shortName: "Forms",
    category: "operations",
    categoryLabel: "Operations",
    headline: ["Collect the information", "your business needs."],
    description:
      "Create structured forms and keep incoming business data organized inside your Foxses workspace.",
    capabilities: ["Custom forms", "Structured data collection", "Centralized submissions"],
    cta: "Explore Forms",
    href: "/products/forms",
    url: "forms.foxses.com",
  },
  {
    id: "invoice",
    name: "Foxses Invoice",
    shortName: "Invoice",
    category: "finance",
    categoryLabel: "Finance",
    headline: ["Simple invoicing.", "Clearer finances."],
    description:
      "Create and manage invoices while keeping billing information organized inside your Foxses workspace.",
    capabilities: ["Invoice creation", "Billing records", "Payment tracking"],
    cta: "Explore Invoice",
    href: "/products/invoice",
    url: "invoice.foxses.com",
  },
  {
    id: "hr",
    name: "Foxses HR",
    shortName: "HR",
    category: "people",
    categoryLabel: "People",
    headline: ["Your people.", "One organized workspace."],
    description:
      "Keep employee information, attendance and essential HR workflows organized in one place.",
    capabilities: ["Employee records", "Attendance management", "Team organization"],
    cta: "Explore HR",
    href: "/products/hr",
    url: "hr.foxses.com",
  },
  {
    id: "support",
    name: "Foxses Support",
    shortName: "Support",
    category: "customer-experience",
    categoryLabel: "Customer Experience",
    headline: ["Support customers", "without losing context."],
    description:
      "Keep customer conversations and support requests organized through one central helpdesk.",
    capabilities: ["Support tickets", "Customer conversations", "Ticket status management"],
    cta: "Explore Support",
    href: "/products/support",
    url: "support.foxses.com",
  },
  {
    id: "cloud",
    name: "Foxses Cloud",
    shortName: "Cloud",
    category: "cloud",
    categoryLabel: "Cloud",
    headline: ["Your online presence", "starts here."],
    description: "Find and manage domains for your business through Foxses Cloud.",
    capabilities: ["Domain search", "Domain purchasing", "Domain management"],
    cta: "Explore Foxses Cloud",
    href: "/products/cloud",
    url: "cloud.foxses.com",
    // The content guide lists Foxses Cloud as not launched yet
    status: "Coming soon",
  },
];

export function productsIn(category: CategoryId): Product[] {
  return category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
}
