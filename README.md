# FrontendBattel3.0
# AetherFlux — Autonomous Data Automation Platform

> Streamline microservices, normalize relational databases, and self-heal API workflows
> with an AI-driven data orchestration engine built for modern infrastructure teams.

Link: https://aetheflux-frontendbattle3.netlify.app/

---

## Overview

AetherFlux is a production-grade SaaS landing page for an AI-driven data automation platform.
Built with an oceanic dark theme and warm golden accents, it features a matrix-driven pricing
engine, an interactive bento/accordion feature grid, and a responsive design system engineered
for zero-reflow state updates.

---

## Features

- **Matrix Pricing Engine** — `computePrice()` drives all displayed prices; zero hardcoded strings
- **Multi-currency & Billing Toggle** — Instant USD / INR / EUR switching with monthly/annual discount
- **State-Isolated Rerenders** — Billing/currency changes mutate only price `<span>` text nodes; no parent reflow
- **Bento → Accordion Context Lock** — Active bento card index transfers seamlessly on viewport resize
- **Oceanic Noir Theme** — Deep structural negative space with Forsythia gold accent highlights throughout
- **Inline SVG Icons** — Zero external icon library dependencies

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Icons | Inline SVG only (no icon libraries) |
| Animation | Native CSS transitions + Web Animations API |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm, yarn, or pnpm

### Install & Run

```bash
git clone https://github.com/your-username/aetherflux
cd aetherflux
npm install
npm run dev        # http://localhost:3000
```

### Build for Production

```bash
npm run build      # outputs to /dist
npm run lint       # TypeScript type check
```

---

## Pricing Tiers

Prices are computed at runtime from `PRICING_MATRIX` — never hardcoded.

| Tier | Monthly (USD) | Annual (USD) |
|---|---|---|
| Starter | $29 | $23/mo |
| Pro | $79 | $63/mo |
| Scale | $199 | $159/mo |

Annual billing applies a 20% multiplier. Currency conversion (INR, EUR) uses tariff values from the matrix.

---

## Project Structure
src/

├── components/

│   ├── Navbar.tsx

│   ├── Hero.tsx

│   ├── Features.tsx       # Bento grid + accordion

│   ├── Pricing.tsx        # Matrix pricing engine

│   ├── SocialProof.tsx

│   └── Footer.tsx

├── lib/

│   └── pricing.ts         # computePrice() + PRICING_MATRIX

├── styles/

│   └── globals.css        # CSS variables, keyframes

└── App.tsx
