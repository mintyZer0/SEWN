# SEWN - Tailoring Marketplace Context

## Project Overview
SEWN is a specialized marketplace platform connecting users with local tailors and dressmakers ("sewists"). It facilitates browsing sewist profiles, purchasing custom-made garments, and commissioning tailoring services (alterations, repairs, custom commissions).

## Tech Stack
- **Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS v4, DaisyUI, Radix UI
- **Backend/Auth:** Supabase (@supabase/ssr, @supabase/supabase-js), NextAuth
- **Maps:** Google Maps API (via @vis.gl/react-google-maps)
- **Icons:** Lucide-React, React-Feather
- **State Management:** React Context (CartContext)

## Core Domain Entities
- **Sewists:** Profile pages (`/sewists/[sewistId]`), contact info, map location, services, achievements, and stats. Managed via the **Sewist Center** dashboard. Metrics are tracked in the `sewist_statistics` table (ratings, clicks, views).
- **Customers:** Profile management (`/user-profile`), address management, and measurements.
- **Admins:** System-wide management for verifying sewist documents. **Admin Dashboard is currently not yet implemented.**
- **Products:** Custom-made garments listed by sewists (`/browse/shop`).
- **Services:** Tailoring services like alterations, repairs, and commissions.
- **Checkout:** A multi-step stepper process for garment purchases and service commissions.

## Key Directories
- `app/`: Routing and layouts (App Router).
- `components/`:
  - `ui/`: Reusable primitive components (many seem to be Radix-based or custom Tailwind).
  - `sections/`: Feature-specific sections used in pages (e.g., `home/`, `shop/`).
  - `sewist-profile/`: Components specifically for the sewist profile view.
  - `checkout/`: Stepper components for the checkout flow.
- `lib/`: Shared logic for Supabase and utility functions.
- `data/`: Mock data for development (`products.ts`, `sewists.ts`).
- `utils/`: Supabase middleware and client/server helpers.

## Established Conventions
- **Naming:** Kebab-case for file names and directories.
- **Typography:** Uses Jost font as the primary font.
- **Theming:** Background image fixed globally in `RootLayout`.
- **Modals:** Managed via a `modals` folder in components.
- **Data Fetching:** Hybrid approach with Supabase SSR and client-side helpers.
- **Soft Deletes:** Use `deleted_at` (Timestamp) for `sewist_products` and `service_requests` to preserve historical data while hiding from UI.
- **Messaging:** Conversation IDs use `text` type to support flexible identifiers.
