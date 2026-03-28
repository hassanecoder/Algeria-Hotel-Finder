# Workspace

## Overview

Algeria Hotels — a full-featured hotel booking, directory, and listings web app for Algeria.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui

## Features

- Hotel listings with search, filtering (city, stars, price, amenities), and sorting
- Hotel detail pages with image gallery, rooms, reviews
- Booking flow with guest details, confirmation page
- City directory with 8 Algerian cities
- 12 real Algerian hotels with rich descriptions
- Review system
- Featured hotels
- Algerian Dinar (DZD) pricing

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── algeria-hotels/     # React + Vite frontend (previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/hotels.ts  # cities, hotels, rooms, reviews, bookings, amenities
├── scripts/
│   └── src/seed.ts         # Database seed script
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Routes

All routes prefixed with `/api`:

- `GET /healthz` — Health check
- `GET /hotels` — List hotels (city, minPrice, maxPrice, stars, search, page, limit, sortBy)
- `GET /hotels/featured` — Featured hotels
- `GET /hotels/:id` — Hotel detail with rooms and reviews
- `GET /hotels/:hotelId/reviews` — Hotel reviews
- `POST /hotels/:hotelId/reviews` — Submit a review
- `GET /cities` — All cities
- `GET /cities/:slug` — City detail with hotels
- `POST /bookings` — Create booking
- `GET /bookings/:reference` — Get booking by reference
- `GET /amenities` — All amenities

## Database

### Seed Data

Run: `pnpm --filter @workspace/scripts run seed`

8 Algerian cities: Algiers, Oran, Constantine, Annaba, Tlemcen, Tamanrasset, Ghardaïa, Béjaïa
12 Hotels with rooms and reviews

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`.

- **Always typecheck from the root** — run `pnpm run typecheck`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
