# SEWN Project Context

This file serves as a foundational guide for Gemini CLI when working on the SEWN project.

## Architectural Overview
- **Framework:** Next.js 15 (App Router) with React 19.
- **Backend:** **Supabase** handles authentication (Email, OAuth), PostgreSQL database management, and image storage.
- **Styling:** **Tailwind CSS 4** with **DaisyUI** and Radix UI.
- **Theme:** Colors like `primary`, `secondary`, and `third` (orange) are defined as CSS variables in `globals.css`. Use Tailwind classes like `text-primary`, `bg-secondary`, `border-third`.
- **User Roles:** Dual-user ecosystem distinguishing between **Customers** (User Profile) and **Sellers** (Sewer Center).

## Key Features & Components
- **Marketplace:** Multi-step checkout stepper (`product-details` → `address` → `payment` → `confirmation`).
- **Sewer Center:** Profile management (Achievements, Services, Location pinning via Leaflet) and Product dashboard.
- **Reusable Components:**
  - `ProfileButton`: Located in `@/components/user-profile/profile-buttons`. Use variants like `orange` (white text) and sizes like `xl` for primary actions.
- **State Management:** **React Context** (e.g., `CartContext`) and **Supabase SSR**.

## Project Conventions
- **Forms:** Wrap profile/product fields in `<form>` elements with appropriate `name` and `type` attributes to prepare for future data integration.
- **Maps:** Use `dynamic` imports for Leaflet components to avoid SSR issues.
- **Navigation:** The Seller Center utilizes a `SewerSidebar` with themed navigation links.
