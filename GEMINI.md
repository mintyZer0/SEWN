# SEWN Project Context

This file serves as a foundational guide for Gemini CLI when working on the SEWN project.

## Architectural Overview
- **Framework:** Next.js 15 (App Router) with React 19.
- **Backend:** **Supabase** handles authentication (Email, OAuth), PostgreSQL database management, and image storage.
- **Styling:** **Tailwind CSS 4** with **DaisyUI** and Radix UI.
- **Theme:** Colors like `primary`, `secondary`, and `third` (orange) are defined as CSS variables in `globals.css`. Use Tailwind classes like `text-primary`, `bg-secondary`, `border-third`.
- **User Roles:** Triple-user ecosystem distinguishing between **Customers** (User Profile), **Sewists** (Sewist Center), and **Admins** (Internal Management).
- **Database Schema:** Follows a normalized structure where sewist-specific data is distributed across specialized tables (`sewist_verifications`, `sewist_onboarding_surveys`, `sewist_achievements`, `sewist_statistics`) rather than a single profile table.

## Routing & Subdomains
- **Middleware Rewrites:** The project uses Next.js middleware (`utils/supabase/middleware.ts`) to handle multi-tenant subdomains.
  - `sewist.*` requests are transparently rewritten to the `/sewist-app` folder.
  - `admin.*` requests are rewritten to the `/admin` folder.
- **Path Resolution:** When redirecting users within a subdomain (like sewists or admins), ALWAYS redirect to the root path (e.g., `/login`), NOT the physical folder path (e.g., `/sewist-app/login`). The middleware will automatically map `/login` on the `sewist` subdomain to the correct files in `/sewist-app/login`. Explicitly including `/sewist-app` or `/admin` in the redirect path will break the routing or cause 404 errors.
- **Cross-Domain Navigation:** When navigating between domains (e.g., from customer domain to sewist domain), use absolute URLs constructed with the current origin to ensure session cookies and routing work correctly.

## Key Features & Components
- **Marketplace:** Multi-step checkout stepper (`product-details` → `address` → `payment` → `confirmation`).
- **Sewist Center:** Profile management (Achievements, Services, Location pinning via Google Maps) and Product dashboard.
- **Admin Dashboard:** **Not yet implemented.** While the `Admin` user type exists in the database, the management UI is currently a future task.
- **Reusable Components:**
  - `ProfileButton`: Located in `@/components/user-profile/profile-buttons`. Use variants like `orange` (white text) and sizes like `xl` for primary actions.
  - `MapComponent`: Now using Google Maps API via `@vis.gl/react-google-maps`.
- **State Management:** **React Context** (e.g., `CartContext`) and **Supabase SSR**.

## Real-time Messaging & Supabase
- **Realtime Requirements:**
  - **Replication:** For `postgres_changes` to broadcast, tables (e.g., `chat_messages`, `chat_conversations`) MUST be added to the `supabase_realtime` publication via SQL (`alter publication supabase_realtime add table ...`).
  - **RLS Policies:** Supabase Realtime requires a valid `SELECT` policy for the authenticated user to receive broadcasts for a specific row.
- **Messaging Patterns:**
  - **Optimistic UI:** Always update local message state immediately in `sendMessage` before the database confirms the insert to ensure zero-latency feel.
  - **State Management:** Use Client-side "Container" components (e.g., `ChatContainer`) to manage active conversation IDs. Avoid using Server Component URL navigations for switching chats to prevent slow server round-trips.
  - **Caching:** Use a global in-memory `messageCache` in chat hooks to provide instant switching between previously opened rooms while fresh data loads in the background.
  - **Sidebar Sync:** The `useChatThreads` hook must listen for both new messages (`INSERT`) and conversation updates (`UPDATE` on `last_message_at`) to keep the inbox ordered and snippets fresh.

## Project Conventions
- **Forms:** Wrap profile/product fields in `<form>` elements with appropriate `name` and `type` attributes to prepare for future data integration.
- **Maps:** Use Google Maps API. Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`. Use `dynamic` imports for map components to avoid SSR issues.
- **Navigation:** The Sewist Center utilizes a `SewistSidebar` with themed navigation links.

## Coding Standards
- **Styling:** ALWAYS prioritize standard Tailwind CSS classes (e.g., `w-80`, `rounded-3xl`, `p-6`) over arbitrary values (e.g., `w-[320px]`, `rounded-[24px]`). Only use arbitrary values if a specific pixel-perfect requirement cannot be met by the standard scale.
- **Interactivity:** Use `active:scale-95` and `transition-all` for buttons and interactive elements to maintain a tactile feel.
- **UI Preservation:** When adding backend logic, database integration, or state management to existing components, NEVER modify established fonts, button styles, colors, or layouts unless explicitly directed. Focus strictly on functional implementation while keeping the visual design untouched.
