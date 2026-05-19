# Riderz

Premium jetski e-commerce — multibrand (Sea-Doo, Yamaha, Kawasaki), multilingual (FR, EN, DE, IT).

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4**
- **Prisma 6** + SQLite (zero-setup local DB)
- **next-intl 4** for i18n
- **NextAuth v5** (credentials, bcrypt)
- **Stripe Checkout** for payments

## Quick start

```bash
npm install
cp .env.example .env
# Fill in AUTH_SECRET (any string is fine for dev) and Stripe keys (optional)
npm run db:push
npm run db:seed
npm run dev
```

Open <http://localhost:3001/fr>.

Without Stripe keys, the checkout auto-completes the order in dev mode.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Production build |
| `npm run db:push` | Apply schema to SQLite |
| `npm run db:seed` | Load 9 demo jetskis |
| `npm run db:studio` | Open Prisma Studio |

## Project layout

```
src/
├── app/[locale]/           # i18n pages (shop, cart, checkout, account…)
├── components/             # Header, Footer, ProductCard, etc.
├── i18n/                   # next-intl routing + request config
├── lib/
│   ├── actions/            # Server actions (cart, auth, checkout)
│   ├── auth.ts             # NextAuth setup
│   ├── cart.ts             # Cookie-based cart helpers
│   └── prisma.ts           # Prisma singleton
├── messages/               # fr.json / en.json / de.json / it.json
└── middleware.ts           # next-intl locale routing
prisma/
├── schema.prisma           # Product, User, Order, OrderItem…
└── seed.ts                 # 9 jetskis (Sea-Doo, Yamaha, Kawasaki)
```

## Features

- 9 products seeded with real photos (Sea-Doo, Yamaha, Kawasaki)
- Product catalog with brand/condition/sort filters
- Product detail page with gallery, specs, localized description
- Cookie-based cart (works without login)
- Credentials auth (sign-up / sign-in) with bcrypt
- Stripe Checkout integration with order tracking
- Account page with order history
- Locale switcher preserving the current path

## Notes

- Uses npm rather than pnpm to avoid Windows build-script approval issues.
- Dev port is 3001 to coexist with other local projects on 3000.
