# Quixoria - Digital Book Shop

## Overview

Quixoria is a cozy digital bookshop web application where users can browse books, add them to their personal library, track reading progress, and leave reviews. It follows a full-stack TypeScript architecture with a React frontend and Express backend, backed by PostgreSQL. The app uses Replit Auth for authentication and has a warm, bookshop-themed UI with earthy tones (#7D3B25 primary, #FBEFD7 background).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight alternative to React Router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom warm color palette
- **Animations**: Framer Motion for page transitions and hover effects
- **Fonts**: Outfit (UI/display) and Libre Baskerville (body/book text)
- **Pages**: Home (book store), Library (user's books), Book Details, Profile, Checkout, Reader
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express.js running on Node with TypeScript (tsx)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas, keeping route definitions shared between client and server
- **Authentication**: Replit Auth via OpenID Connect (OIDC), with Passport.js strategy. Session stored in PostgreSQL via `connect-pg-simple`
- **Auth files are in**: `server/replit_integrations/auth/` — do not remove the sessions or users tables as they are mandatory for Replit Auth
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface using Drizzle ORM queries (DatabaseStorage class)

### Database
- **Database**: PostgreSQL (required, referenced via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` and `shared/models/auth.ts`
- **Tables**:
  - `users` — user profiles (managed by Replit Auth)
  - `sessions` — session storage (managed by Replit Auth)
  - `books` — book catalog (id, title, author, description, coverUrl, price in cents, genre, rating)
  - `library_items` — user-owned books with reading progress tracking
  - `reviews` — user reviews with ratings and comments
- **Relations**: Books have many library_items and reviews; library_items and reviews reference books and users
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database

### Shared Code (shared/)
- `shared/schema.ts` — Drizzle table definitions, Zod insert schemas, and relation definitions
- `shared/routes.ts` — API route definitions with paths, methods, Zod input/output schemas. Used by both client hooks and server route handlers
- `shared/models/auth.ts` — Auth-related table definitions (users, sessions)

### Build & Dev
- **Dev**: `npm run dev` runs the Express server with Vite middleware for HMR
- **Build**: `npm run build` runs a custom script (`script/build.ts`) that builds the Vite client and bundles the server with esbuild
- **Production**: `npm start` serves the built assets from `dist/`
- **Type checking**: `npm run check` runs TypeScript compiler

### Key Design Decisions
1. **Shared route definitions**: API routes are defined once in `shared/routes.ts` with Zod schemas, ensuring type safety across client and server
2. **Replit Auth integration**: Authentication uses Replit's OIDC provider rather than custom auth, simplifying user management
3. **Price in cents**: Book prices stored as integers (cents) to avoid floating point issues
4. **Currency**: Formatted in PHP (Philippine Peso) on the frontend
5. **No SSR**: The app is a client-side SPA with server-side API routes only

## External Dependencies

- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Replit Auth (OIDC)**: Authentication provider via `ISSUER_URL` (defaults to `https://replit.com/oidc`), requires `REPL_ID` and `SESSION_SECRET` environment variables
- **Google Fonts**: Outfit, Libre Baskerville, DM Sans, Fira Code, Architects Daughter, Geist Mono loaded via CDN
- **Key npm packages**: drizzle-orm, express, passport, openid-client, @tanstack/react-query, wouter, framer-motion, zod, shadcn/ui components (Radix UI)