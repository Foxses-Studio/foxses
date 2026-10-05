import {
  Award,
  Bot,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  Cloud,
  Code,
  Compass,
  Crown,
  Globe,
  Handshake,
  Headphones,
  LayoutTemplate,
  Mail,
  MapPin,
  Megaphone,
  Newspaper,
  Package,
  Receipt,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Star,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

// Navigation data. Routes that have no page yet are kept as real routes on
// purpose — they land on the custom "not ready yet" 404 page.

export interface DropdownItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export interface DropdownColumn {
  title: string;
  items: DropdownItem[];
}

export interface MenuItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  megaMenu?: DropdownColumn[];
}

export const productsMenu: DropdownColumn[] = [
  {
    title: "Core products",
    items: [
      { icon: Package, title: "Foxses Inventory", description: "Stock and warehouse management", href: "/products/inventory" },
      { icon: Receipt, title: "Foxses Invoice", description: "Invoicing and payment tracking", href: "/products/invoice" },
      { icon: Cloud, title: "Foxses Cloud", description: "Domains for your business", href: "/products/cloud" },
    ],
  },
  {
    title: "Operations & people",
    items: [
      { icon: ClipboardList, title: "Foxses Forms", description: "Forms and data collection", href: "/products/forms" },
      { icon: Users, title: "Foxses HR", description: "Employee records and attendance", href: "/products/hr" },
    ],
  },
  {
    title: "More",
    items: [
      { icon: Headphones, title: "Foxses Support", description: "Helpdesk and support tickets", href: "/products/support" },
      { icon: LayoutTemplate, title: "Foxses Templates", description: "Ready-to-use business templates", href: "/products/templates" },
      { icon: ShoppingBag, title: "F-Commerce", description: "Social commerce store tools", href: "/products/f-commerce" },
    ],
  },
];

export const solutionsMenu: DropdownColumn[] = [
  {
    title: "Business types",
    items: [
      { icon: Building2, title: "Small Businesses", description: "Run the essentials in one place", href: "/solutions/small-businesses" },
      { icon: ShoppingBag, title: "Retail & E-commerce", description: "Online and in-store retail", href: "/solutions/retail-ecommerce" },
    ],
  },
  {
    title: "Operations & services",
    items: [
      { icon: Briefcase, title: "Service Businesses", description: "For agencies and service teams", href: "/solutions/service-businesses" },
      { icon: Settings2, title: "Business Operations", description: "Everyday operational work", href: "/solutions/business-operations" },
    ],
  },
];

export const resourcesMenu: DropdownColumn[] = [
  {
    title: "Learn",
    items: [
      { icon: Megaphone, title: "Announcements", description: "Product updates and news", href: "/resources/announcements" },
      { icon: ShieldCheck, title: "Security", description: "How we approach security", href: "/resources/security" },
      { icon: Code, title: "Developer Center", description: "SDKs and developer docs", href: "/resources/developer-center" },
      { icon: Newspaper, title: "Blog", description: "Articles and insights", href: "/resources/blog" },
    ],
  },
  {
    title: "Explore",
    items: [
      { icon: Bot, title: "Sara AI", description: "In development", href: "/resources/sara-ai" },
      { icon: Mail, title: "Newsletter", description: "Product and strategy digest", href: "/resources/newsletter" },
      { icon: Compass, title: "The Long Game", description: "Long-term growth thinking", href: "/resources/long-game" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: BookOpen, title: "Knowledge Base", description: "Guides and FAQs", href: "/resources/knowledge-base" },
      { icon: Crown, title: "Concierge", description: "Premium assistance", href: "/resources/concierge" },
      { icon: Mail, title: "Contact Us", description: "Talk to the Foxses team", href: "/resources/contact" },
    ],
  },
];

export const companyMenu: DropdownColumn[] = [
  {
    title: "About",
    items: [
      { icon: Building2, title: "About Foxses Studio", description: "Who we are", href: "/company/about" },
      { icon: Globe, title: "Our Story", description: "How Foxses started", href: "/company/story" },
      { icon: UserRound, title: "Careers", description: "Work with us", href: "/company/careers" },
    ],
  },
  {
    title: "Stories",
    items: [
      { icon: Award, title: "Case Studies", description: "How businesses use Foxses", href: "/company/case-studies" },
      { icon: Star, title: "Customer Reviews", description: "What customers say", href: "/company/reviews" },
      { icon: Megaphone, title: "Press & Media", description: "News and brand assets", href: "/company/press" },
    ],
  },
  {
    title: "Connect",
    items: [
      { icon: Mail, title: "Contact Us", description: "Get in touch", href: "/company/contact" },
      { icon: Handshake, title: "Partners", description: "Partner with Foxses", href: "/company/partners" },
      { icon: MapPin, title: "Locations", description: "Where to find us", href: "/company/locations" },
    ],
  },
];

export const defaultMenuItems: MenuItem[] = [
  { label: "Products", href: "/products", hasDropdown: true, megaMenu: productsMenu },
  { label: "Solutions", href: "/solutions", hasDropdown: true, megaMenu: solutionsMenu },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources", hasDropdown: true, megaMenu: resourcesMenu },
  { label: "Company", href: "/company", hasDropdown: true, megaMenu: companyMenu },
];

export const MENU_BY_LABEL: Record<string, DropdownColumn[]> = {
  Products: productsMenu,
  Solutions: solutionsMenu,
  Resources: resourcesMenu,
  Company: companyMenu,
};

/** Account routes — not built yet, so they land on the custom 404 */
export const LOGIN_HREF = "/login";
export const SIGNUP_HREF = "/signup";
