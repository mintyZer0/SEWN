# SEWN Database Documentation

This document serves as a guide for developers working with the SEWN database schema on **Supabase (PostgreSQL)**.

---

## 1. Core Identity & User Management

### `users`
The central identity table.
- **Fields:** `id` (UUID), `first_name`, `last_name`, `email` (Unique), `user_type` (USER-DEFINED), `birthday` (Date), `gender` (USER-DEFINED), `created_at`.

### User Metadata
- **`user_avatars`**: `id`, `user_id` (Unique), `avatar_url` (Default: 'avatars/Default.jpg'), `uploaded_at`.
- **`user_phones`**: `id`, `user_id`, `phone`, `landline`, `is_primary` (Boolean).
- **`user_addresses`**: `id`, `user_id`, `full_address`, `barangay`, `city`, `zip_code` (Integer), `is_primary`.
- **`user_socials`**: `id`, `user_id`, `platform`, `handle`.
- **`user_measurements`**: Detailed tailoring profiles.
  - **Fields:** `id`, `user_id`, `profile_name`, `unit` (e.g., 'in'), and 20+ numeric measurement fields (e.g., `chest`, `waist_pants`, `hips`, `inseam`).

---

## 2. Marketplace & Products (Sewer-Owned)

### `seller_products`
The main product catalog.
- **Constraints:**
  - `location`: NCR, Luzon, Visayas, Mindanao.
  - `type`: Kids, Men, Women.
- **Fields:** `id`, `user_id`, `name`, `price`, `img_src`, `is_active`, `rating`, `sold`, `description`, `seller_name`, `deleted_at` (Timestamp).

### Product Attributes & Variants
- **`product_categories`**, **`product_colors`**, **`product_materials`**, **`product_sizes`**: Global tags for a product (One-to-Many).
- **`product_variants`**: The specific physical item in stock.
  - **Fields:** `id`, `product_id`, `sku`, `stock_quantity`, `price_override`.
- **`variant_attribute_values`**: Maps specific variant attributes.

#### Working with Multi-Attribute Variants
To create a variant with multiple attributes (e.g., a "Red, Large" shirt), you insert one row into `product_variants` and **multiple rows** into `variant_attribute_values` using the same `variant_id`.

**Example Logic:**
1. Create Variant: `Insert into product_variants (sku: 'SHIRT-RED-L', stock: 10)` -> returns `variant_id: 'uuid-123'`.
2. Assign Attributes:
   - `Insert into variant_attribute_values (variant_id: 'uuid-123', type: 'Color', value: 'Red')`
   - `Insert into variant_attribute_values (variant_id: 'uuid-123', type: 'Size', value: 'Large')`

**Fetching a Variant's Details:**
```sql
SELECT attribute_type, attribute_value 
FROM variant_attribute_values 
WHERE variant_id = 'uuid-123';
-- Returns: [{type: 'Color', value: 'Red'}, {type: 'Size', value: 'Large'}]
```

---

## 3. Orders & Transactions

### `orders`
- **Fields:** `id`, `user_id`, `total`, `status` (Default: 'pending'), `created_at`.

### `order_items`
- **Fields:** `id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`, `variant_id` (Optional).

---

## 4. Tailoring Services (Sewing & Repairs)

### `service_requests`
The workflow for custom work.
- **Service Types:** `commission`, `repair`, `alteration`.
- **Status:** `pending`, `accepted`, `in_progress`, `completed`, `cancelled`.
- **Fields:** Includes contact info, `subject` (Required), `request_details`, `appointment_date`, `fabric_id`, `measurement_profile_id`, and `deleted_at` (Timestamp).

### Sewer-Specific Config
- **`sewer_settings`**: Toggles for `accepting_commissions`, `accepting_alterations`, `accepting_repairs`, and `accepting_appointments`.
- **`sewer_statistics`**: Performance and engagement metrics (`user_id`, `rating_avg`, `rating_count`, `total_orders_completed`, `profile_views_total`, `response_time_minutes`, `last_active_at`).
- **`sewer_verifications`**: Stores `tax_id`, `dti_sec_number`, and `verification_status` ('pending', 'verified', 'rejected').
- **`sewer_onboarding_surveys`**: Qualitative data like `educational_attainment`, `monthly_income`, and personal sewing background.
- **`sewer_achievements`**: A list of professional milestones for a sewer (`user_id`, `title`).
- **`sewer_fabrics`**: A catalog of fabrics a sewer offers for commissions. Includes `name`, `description`, `image_url`, and `is_available`.

### RPC Functions (Stored Procedures)
Custom PostgreSQL functions called via `supabase.rpc()`.
- **`increment_profile_views(target_user_id)`**: Atomically increments the `profile_views_total` in `sewer_statistics`. Configured as `SECURITY DEFINER` to allow public tracking without exposing write access to the table.

---

## 5. Messaging & Communication

### `chat_conversations`
- **Fields:** `id` (text), `buyer_id`, `seller_id`, `last_message_at`.

### `chat_messages`
- **Fields:** `id`, `conversation_id` (text), `from_user_id`, `to_user_id`, `content`, `created_at`.

---

## 6. Implementation Notes

### Security & Row Level Security (RLS)
The database enforces strict privacy using Supabase RLS policies.
- **Public Tables (SELECT for all):** `sewer_statistics`, `sewer_achievements`. These are visible to marketplace visitors.
- **Private Tables (Owner only):** `sewer_onboarding_surveys`, `sewer_verifications`. These contain sensitive data (Income, Tax IDs) visible only to the account owner and admins.
- **Write Access:** Restricted to the account owner (`auth.uid() = user_id`) across all specialized seller tables.

### User Roles & Permissions
- **Triple-User System:** `users` can have types `buyer`, `seller`, or `admin`.
- **Admin Verification:** Admins have bypass policies to review documents in `sewer_verifications` and `sewer_onboarding_surveys` for verification purposes.

### For Frontend Developers
- **Tracking Views:** Use `await supabase.rpc('increment_profile_views', { target_user_id: id })` on profile load.
- **Measurements:** Use the `user_measurements` table to populate the "Measurements" section of the user profile.
- **Marketplace:** Filter `seller_products` using `location` and `type` fields.
- **Sewer Profile:** Data from `sewer_onboarding_surveys` (Public fields only) and `sewer_achievements` should be used to build the "About" section.
