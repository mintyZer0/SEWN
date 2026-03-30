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

## Coding Standards
- **Styling:** ALWAYS prioritize standard Tailwind CSS classes (e.g., `w-80`, `rounded-3xl`, `p-6`) over arbitrary values (e.g., `w-[320px]`, `rounded-[24px]`). Only use arbitrary values if a specific pixel-perfect requirement cannot be met by the standard scale.
- **Interactivity:** Use `active:scale-95` and `transition-all` for buttons and interactive elements to maintain a tactile feel.
- **UI Preservation:** When adding backend logic, database integration, or state management to existing components, NEVER modify established fonts, button styles, colors, or layouts unless explicitly directed. Focus strictly on functional implementation while keeping the visual design untouched.
