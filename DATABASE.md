# SEWN Database Documentation

This document serves as a guide for developers working with the SEWN database schema. The system is built on **Supabase (PostgreSQL)** and follows a relational structure optimized for a multi-role marketplace (Customers and Sewers).

---

## 1. Core Identity & User Management

These tables handle user authentication profiles, contact information, and specific user attributes.

### `users`
The central identity table. All other tables link back here via `user_id`.
- **Role System:** `user_type` determines if a user is a Customer or a Sewer.
- **Fields:** `id`, `first_name`, `last_name`, `email`, `birthday`, `gender`, `created_at`.

### User Metadata Tables
- **`user_avatars`**: Stores URLs for profile pictures.
- **`user_phones`**: Handles multiple phone numbers; use `is_primary` for default contact.
- **`user_addresses`**: Stores shipping/service locations. Linked to orders and service requests.
- **`user_socials`**: Links to external profiles (Instagram, Facebook, etc.).
- **`user_measurements`**: A specialized table for tailoring. Allows users to save multiple "Measurement Profiles" (e.g., "My Suit", "Prom Dress").

---

## 2. Marketplace & Products

Managed primarily by **Sellers (Sewers)**.

### `seller_products`
The main catalog table.
- **Filtering:** Includes `location` (NCR, Luzon, etc.) and `type` (Men, Women, Kids).
- **Stats:** Tracks `rating` and `sold` count for discovery algorithms.

### Product Attributes (Normalization)
To support complex filtering and variations, product details are split:
- **`product_categories`**, **`product_colors`**, **`product_materials`**, **`product_sizes`**: Multi-select attributes for each product.
- **`product_variants`**: Specific stock-keeping units (SKUs). This is where `stock_quantity` lives.
- **`variant_attribute_values`**: Maps specific variants to their attributes (e.g., "Size: M, Color: Blue").

---

## 3. Orders & Transactions

Handles the lifecycle of a purchase from the marketplace.

### `orders`
The header for a transaction.
- **Status:** `pending`, `completed`, `cancelled`, etc.
- **Total:** Denormalized sum of all items for quick reporting.

### `order_items`
Line items for each order.
- **Snapshotting:** Stores `price_at_purchase` to ensure historical accuracy even if the product price changes later.
- **Linking:** Connects to both the base `product_id` and the specific `variant_id`.

---

## 4. Tailoring Services (Sewing & Repairs)

Specialized workflow for custom commissions, repairs, and alterations.

### `service_requests`
The "Order" equivalent for services.
- **Types:** `commission`, `repair`, or `alteration`.
- **Integration:** Links to `user_measurements` (the specs) and `sewer_fabrics` (the material).
- **Lifecycle:** `pending` → `accepted` → `in_progress` → `completed`.

### Sewer-Specific Config
- **`sewer_settings`**: A toggle-heavy table where sewers define what they offer (e.g., `accepting_commissions: true`).
- **`sewer_fabrics`**: A catalog of materials a sewer has in stock for custom commissions.

---

## 5. Developer Implementation Guide

### Backend (Supabase/Postgres)
1. **RLS (Row Level Security):** 
   - Users should only be able to `UPDATE` their own records.
   - Products are `READ` for everyone but `WRITE` only for the owner (`user_id`).
2. **Foreign Keys:** Ensure `ON DELETE CASCADE` is set where appropriate (e.g., deleting a user should cleanup their phone numbers/socials).
3. **Timestamps:** Most tables use `DEFAULT CURRENT_TIMESTAMP`. Ensure `updated_at` triggers are set up in Supabase.

### Frontend (Next.js/TypeScript)
1. **UUIDs:** All IDs are `uuid`. Use a library like `crypto.randomUUID()` for optimistic UI updates, but let Postgres handle generation on insert.
2. **Types:** Generate TypeScript definitions from the Supabase CLI to ensure type safety across the app:
   ```bash
   supabase gen types typescript --project-id your-project-id > lib/database.types.ts
   ```
3. **Relational Queries:** Leverage Supabase's `.select('*, product_variants(*)')` syntax to fetch nested data in a single request.

---

## Entity Relationship Summary (High Level)
- `users` 1:N `seller_products`
- `seller_products` 1:N `product_variants`
- `users` 1:N `orders` 1:N `order_items`
- `users` (Client) 1:N `service_requests` N:1 `users` (Sewer)
