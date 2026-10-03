# Foxses Content Guide

The source of truth for what Foxses is, how it is positioned, and what the website
may (and may not) say. Read this before writing or changing any website copy.

---

## 1. What is Foxses Studio?

Foxses Studio is a **software product company**. Its goal is to build practical
SaaS products, developer tools and business infrastructure for businesses.

> Foxses Studio builds software products that help businesses operate, automate, and scale.

### Foxses Studio ≠ TeachFosys

Keep this distinction clear on the website.

| | Foxses Studio | TeachFosys |
|---|---|---|
| Type | Product company | Service company |
| Builds / does | Its own SaaS products, developer tools, business software, APIs, infrastructure — marketed as products | Client work: web development, Shopify, WordPress, GHL, automation, UI/UX, SEO, marketing |

Internal brand architecture (not a comparison to show on the site):

```text
FOXSES — Technology / Product Company
  ├── SaaS Products
  ├── Cloud
  ├── APIs
  └── Developer Tools

TEACHFOSYS — Technology Services Company
  ├── Development
  ├── Shopify
  ├── WordPress
  ├── Automation
  ├── UI/UX
  └── Marketing
```

This keeps the two brands from eating into each other's identity.

---

## 2. Positioning

Options:

- *Technology built for modern businesses.*
- *Software that helps businesses work smarter.* (more product-focused)
- **Building the software infrastructure behind modern businesses.** ← preferred long-term

The third is strongest because Foxses is not only building SaaS dashboards — it is
already building developer infrastructure (payments).

**The one thing every visitor should understand:**

> Foxses Studio builds a growing ecosystem of SaaS products, cloud services, and
> developer infrastructure for modern businesses.

---

## 3. What kind of company is Foxses?

- **SaaS products** — software for daily business operations: Inventory, Invoice, HR,
  Forms, Templates, Support, Cloud services.
- **Developer infrastructure** — APIs and SDKs that make developers' work easier.
  The most concrete example today is `@foxses/pay`.

The developer side lets Foxses be seen as a developer-infrastructure company, not
"just another SaaS company".

---

## 4. Products

| Product | Purpose |
|---|---|
| Foxses Cloud | Hosting, domains, business infrastructure |
| Foxses Invoice | Invoicing and billing |
| Foxses Inventory | Inventory and stock management |
| Foxses Forms | Business forms and data collection |
| Foxses HR | Employee and HR management |
| Foxses Template | Business-ready templates |
| Foxses Support | Customer / support management |
| Foxses Pay | Unified payment integration / API |

### Product status labels (always use them)

Foxses is early-stage. Say "building a suite of products", not "a company with 8 products".

- **Available** — live
- **In Development** — being built
- **Coming Soon** — roadmap

Never present an unlaunched product as live.

### Foxses Pay

*One API. Multiple payment providers.*

A consistent API so developers don't integrate each payment gateway separately.
Per the public npm listing, `@foxses/pay` supports **Stripe, bKash, Nagad and
SSLCommerz**. Separate provider packages are also public (e.g. `@foxses/pay-bkash`),
built for the TypeScript / Node.js ecosystem. MIT licensed, published by Foxses Studio.

Copy:

> **Payments without the integration headache.**
> Foxses Pay gives developers a unified API for integrating multiple payment
> providers into their applications.
>
> Explore Foxses Pay → (plus a link to developer documentation)

Highlight it separately on the website — it no longer needs to be shown as a future idea.

### Foxses Cloud

Planned scope: domain registration, hosting, cloud infrastructure, domain management,
bulk messaging, API-based provisioning, business infrastructure (domain automation
planned via the Spaceship API).

- Positioning: *Cloud infrastructure, without the complexity.*
- Description: *Manage your domains, hosting, and essential business infrastructure from one place.*
- ⚠️ Not launched yet → label **Coming Soon**.

### Foxses Invoice

- Target: small businesses, freelancers, agencies, growing teams.
- Features: create invoices, customer management, invoice history, payment tracking,
  PDF invoices, recurring invoices, tax/discount, payment status, business reports.
- Positioning: *Simple invoicing for growing businesses.*

### Foxses Inventory

- Target: retail businesses, e-commerce stores, wholesalers, small businesses, warehouses.
- Features: products, stock tracking, low-stock alerts, purchase records, sales records,
  suppliers, inventory adjustments, reports.
- Positioning: *Know what you have. Know what you need.*

### Foxses HR

- Features: employee profiles, attendance, leave, departments, roles, payroll-related
  records, documents, employee reports.
- Positioning: *Simplify the way you manage your team.*

### Foxses Forms

Do not position it as a Google Forms clone — make it business-oriented.

- Positioning: *Build forms that turn responses into useful business data.*
- Uses: lead forms, customer intake, internal forms, applications, surveys, feedback,
  data collection.

### Foxses Support

- Target: SaaS companies, e-commerce, agencies, online businesses.
- Features: tickets, customer conversations, internal notes, status, assignments,
  priorities, team members, knowledge base.
- Positioning: *Keep customer support organized.*

### Foxses Template

A supporting product in the ecosystem: invoice templates, business documents, forms,
HR documents, marketing templates, email templates, proposal templates.

---

## 5. Target customers

Never write "We build software for everyone" — it weakens the identity.

- **Small & medium businesses** — want software to run their business.
- **Startups** — don't need expensive enterprise software, but need scalable tools.
- **Agencies** — manage client / business operations.
- **Developers** — especially for infrastructure products like Foxses Pay.
- **Online businesses** — e-commerce, SaaS, digital businesses.

---

## 6. Philosophy, vision, mission

**Philosophy:** *Useful software over unnecessary complexity.* The goal is not more
features — it is software that is simple, reliable, scalable, practical and affordable.

> We believe business software should make work simpler, not add another layer of complexity.
>
> Foxses builds practical software products and developer tools designed to solve real
> operational problems.

**Vision:** *To build a connected ecosystem of software products that makes modern
business operations simpler.* — instead of 10 disconnected tools, one connected
Foxses ecosystem.

**Mission:** *Our mission is to build reliable, accessible software that helps
businesses operate better and developers build faster.*
(Businesses → Foxses SaaS · Developers → Foxses APIs / infrastructure)

---

## 7. Ecosystem architecture

```text
                 FOXSES STUDIO
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     BUSINESS        CLOUD        DEVELOPERS
     SOFTWARE    INFRASTRUCTURE       │
        │              │          Foxses Pay
   Invoice         Foxses Cloud
   Inventory
   HR
   Forms
   Support
   Templates
```

### "What we build" — three categories

| Category | Description | Includes |
|---|---|---|
| Business Software | Tools that help businesses manage everyday operations. | Invoice · Inventory · HR · Forms · Support |
| Cloud & Infrastructure | Infrastructure that helps businesses establish and operate online. | Domains · Hosting · Cloud Services |
| Developer Tools | Tools and APIs that make software development easier. | Payments · APIs · SDKs · Integrations |

---

## 8. Website structure

**Navbar:** Logo · Products · Solutions · Developers · About · Resources — right side:
Sign in · Get Started.

**Homepage sections:**

1. **Hero** — *Build better. Operate simpler.* / *Foxses builds software products and
   developer tools that help modern businesses operate, grow, and scale.*
   Buttons: Explore Products · Explore Developers.
2. **Software built around real business problems.** — short paragraph + product
   cards (Cloud, Invoice, Inventory, HR, Forms, Support).
3. **One ecosystem. Multiple tools.** — how Foxses products connect with each other.
4. **Built for developers, too.** — Foxses Pay: *Integrate multiple payment providers
   through a unified API.* (Stripe / bKash / Nagad / SSLCommerz)
5. **Made for businesses of all sizes.** — cards: Startups, Small Businesses,
   Growing Teams, Developers.
6. **Why Foxses?**
   - **Simple** — Software without unnecessary complexity.
   - **Practical** — Built around real operational problems.
   - **Connected** — Products designed to work together.
   - **Developer-friendly** — APIs and tools built with developers in mind.

**Developer section idea:** *Built in public. Built for developers.* — links: NPM,
Documentation, GitHub, API Reference. ⚠️ Verify what is actually public on GitHub
before linking it.

---

## 9. About copy

> Foxses Studio is a technology company focused on building practical software
> products, SaaS platforms, and developer tools for modern businesses.
>
> We started with a simple idea: business software shouldn't be complicated just
> because the business is growing.
>
> Our products are designed to simplify everyday operations, reduce repetitive work,
> and give businesses the tools they need to grow.
>
> Alongside our SaaS products, we build developer-focused infrastructure that makes
> complex integrations easier to implement.

---

## 10. Brand voice

**Modern + Technical + Minimal + Confident**

Good:

- *Software that works.*
- *Built for real businesses.*
- *Simple tools. Serious work.*
- *Build less infrastructure. Ship more products.*

Avoid generic filler like *"Revolutionizing the future of business through
cutting-edge AI-powered synergistic solutions…"*

---

## 11. Claims we must NOT make (without real data)

- ❌ "Trusted by 10,000+ businesses"
- ❌ "Serving customers worldwide"
- ❌ "Millions of users"
- ❌ "Industry-leading"
- ❌ "The fastest-growing SaaS company"
- ❌ "Used by Fortune 500 companies"
- ⚠️ "Global company" — only with a real international context; don't call Foxses a
  "global technology company" without legal incorporation / location to back it.
- ❌ No fake statistics, fake office locations or fake infrastructure claims.
