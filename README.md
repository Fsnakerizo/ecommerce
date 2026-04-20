# AquaFlow

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

**AquaFlow** is an advanced e-commerce platform for drip irrigation systems, parts, water pumps, and related products. The storefront and admin experience are built for clarity, performance, and accessibility.

**Brand mark:** The AquaFlow logo pairs a water-drop silhouette with a gradient from deep water blue (`#1B6B93`) to teal (`#0E8C91`), with optional “AquaFlow” wordmark — see `src/components/logo.tsx`.

---

## Features

- **Storefront:** Modern catalog, filtering and search, persistent cart, Stripe checkout, customer accounts, reviews and ratings, SEO-friendly pages.
- **Admin:** Revenue analytics, product and inventory management, orders and customers, shipping and payments, coupons, and store settings.
- **Design:** Custom AquaFlow palette (WCAG-oriented), dark mode, tokens via CSS custom properties, shadcn/ui + Tailwind CSS v4.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) 5.7 |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (Auth.js) |
| **Payments** | [Stripe](https://stripe.com/) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) (cart), [TanStack Query](https://tanstack.com/query) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Project structure

```
aquaflow-store/
├── prisma/                    # Database schema & migrations
├── public/                    # Static assets, favicon
├── src/
│   ├── app/
│   │   ├── (admin)/           # Admin dashboard routes
│   │   │   └── admin/
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── products/          # Product management
│   │   │       ├── inventory/         # Inventory management
│   │   │       ├── orders/            # Order management
│   │   │       ├── customers/         # Customer management
│   │   │       ├── shipping/          # Shipping management
│   │   │       ├── payments/          # Payment tracking
│   │   │       ├── coupons/           # Coupon management
│   │   │       └── settings/          # Store settings
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (storefront)/      # Public-facing store
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── products/             # Product catalog & detail
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout & success
│   │   │   └── account/              # Customer account
│   │   └── api/               # API routes (auth, checkout, webhooks)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── storefront/        # Store components
│   │   └── admin/             # Admin components
│   ├── hooks/                 # Custom hooks (cart, etc.)
│   ├── lib/                   # Utilities, constants, Prisma, Stripe
│   └── types/                 # TypeScript type definitions
```

---

## Getting started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** 14+ (local or hosted)
- **npm** (or pnpm / yarn, if you prefer)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/aquaflow-store.git
   cd aquaflow-store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy `.env.example` to `.env` when available, or create `.env` in the project root. Fill in the values from the table below.

4. **Database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

   To load demo or baseline data, run the seed command **after** adding a `prisma.seed` entry in `package.json` (if not already present):

   ```bash
   npx prisma db seed
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (used by Prisma; see `prisma.config.ts`). |
| `NEXTAUTH_URL` | Yes | Canonical site URL (e.g. `http://localhost:3000` in development). |
| `NEXTAUTH_SECRET` | Yes | Secret for signing session tokens (generate a strong random string). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For checkout | Stripe publishable key (safe for the browser). |
| `STRIPE_SECRET_KEY` | For checkout | Stripe secret key (server-only). |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Signing secret from the Stripe webhook endpoint. |
| `NEXT_PUBLIC_APP_URL` | Optional | Public app URL for emails or absolute links (often mirrors `NEXTAUTH_URL`). |

---

## Design system

AquaFlow uses **water-inspired blues**, **growth greens**, and **neutral earth tones**, with semantic tokens in `src/app/globals.css` (including **dark mode** via `.dark`). Values are stored in **oklch** for perceptual uniformity; the table below lists **reference hex** values for designers and documentation (the logo gradient uses exact hex stops in the SVG).

| Role | Reference hex | Purpose |
| --- | --- | --- |
| Deep water blue | `#1B6B93` | Primary brand, logo gradient start, key actions and focus rings. |
| Teal flow | `#0E8C91` | Logo gradient end, secondary highlights, “fresh water” accents. |
| Growth green | `#2F9D6E` (approx.) | Secondary / success-adjacent UI (maps to `--secondary` in theme). |
| Sky accent | `#3AA8B8` (approx.) | Tertiary accents and charts (maps to `--accent`). |
| Mist / surface | `#F8FAFC` (approx.) | Page background in light mode (`--background`). |
| Slate text | `#475569` (approx.) | Secondary text (`--muted-foreground`). |

All components should use **design tokens** (e.g. `bg-primary`, `text-muted-foreground`) rather than hard-coded hex in application code, so contrast and dark mode stay consistent and **WCAG AA** targets are easier to meet.

---

## Admin dashboard routes

These routes live under the `(admin)` segment; URLs are prefixed with `/admin`.

| Path | Description |
| --- | --- |
| `/admin` | Dashboard (overview, KPIs). |
| `/admin/products` | Product list and management. |
| `/admin/products/new` | Create product. |
| `/admin/inventory` | Stock levels, low-stock awareness. |
| `/admin/orders` | Order list. |
| `/admin/orders/[id]` | Order detail and status. |
| `/admin/customers` | Customer records. |
| `/admin/shipping` | Shipments and tracking. |
| `/admin/payments` | Payments and refunds. |
| `/admin/coupons` | Discount codes. |
| `/admin/settings` | Store configuration. |

---

## API routes

The App Router convention places handlers under `src/app/api/`. Typical endpoints for this stack include:

| Route | Purpose |
| --- | --- |
| `/api/auth/[...nextauth]` | NextAuth.js session and OAuth/credentials flows. |
| `/api/checkout/*` | Create Stripe Checkout sessions or Payment Intents (server-side). |
| `/api/webhooks/stripe` | Stripe webhooks (payment confirmation, refunds, disputes). |

Add or adjust routes as features are implemented; keep secrets on the server and validate webhook signatures.

---

## Contributing

1. Fork the repository and create a feature branch (`feat/…` or `fix/…`).
2. Follow existing TypeScript, ESLint, and component patterns in the repo.
3. Test changes locally (`npm run dev`, `npm run lint`, and database migrations as needed).
4. Open a pull request with a clear description of behavior and any schema or env changes.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
