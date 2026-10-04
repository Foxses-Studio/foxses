import { LifeBuoy, Package, Receipt, ShoppingBag, UserRound, BadgeCheck, type LucideIcon } from "lucide-react";

// One illustrative order moving through Foxses. Wording is deliberately
// conservative: records are "created", "linked" or "marked" — no claims of
// automatic stock deduction, automatic invoicing or payment processing.
// See docs/foxses-content-guide.md.

export type StageId = "customer" | "order" | "inventory" | "invoice" | "payment" | "support";

export interface Stage {
  id: StageId;
  label: string;
  icon: LucideIcon;
  /** Small product identifier shown above the UI — null for plain business events */
  product: string | null;
  microcopy: string;
  /** Shared context revealed at this stage */
  context: { label: string; value: string };
  event: { time: string; text: string };
}

export const STORY = {
  customer: "Alex Morgan",
  email: "alex.morgan@example.com",
  order: "#FX-1048",
  item: "Business Starter Package",
  sku: "BSP-001",
  invoice: "INV-1048",
  amount: "$120.00",
};

export const STAGES: Stage[] = [
  {
    id: "customer",
    label: "Customer",
    icon: UserRound,
    product: null,
    microcopy: "Every workflow starts with context.",
    context: { label: "Customer", value: STORY.customer },
    event: { time: "09:41", text: "Customer activity created" },
  },
  {
    id: "order",
    label: "Order",
    icon: ShoppingBag,
    product: null,
    microcopy: "Keep the customer and order connected.",
    context: { label: "Order", value: STORY.order },
    event: { time: "09:42", text: `Order ${STORY.order} recorded` },
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    product: "Foxses Inventory",
    microcopy: "Operations stay informed.",
    context: { label: "Item", value: STORY.item },
    event: { time: "09:43", text: `Stock linked to ${STORY.order}` },
  },
  {
    id: "invoice",
    label: "Invoice",
    icon: Receipt,
    product: "Foxses Invoice",
    microcopy: "Billing keeps the same context.",
    context: { label: "Invoice", value: STORY.invoice },
    event: { time: "09:44", text: `Invoice ${STORY.invoice} created` },
  },
  {
    id: "payment",
    label: "Payment",
    icon: BadgeCheck,
    product: "Foxses Invoice",
    microcopy: "Know where every invoice stands.",
    context: { label: "Payment", value: "Paid" },
    event: { time: "09:48", text: "Payment marked as paid" },
  },
  {
    id: "support",
    label: "Support",
    icon: LifeBuoy,
    product: "Foxses Support",
    microcopy: "Help customers with the full picture.",
    context: { label: "Ticket", value: "Open" },
    event: { time: "10:15", text: `Support request linked to ${STORY.order}` },
  },
];
