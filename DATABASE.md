# SEWN Database Documentation

This document serves as a guide for developers working with the SEWN database schema on **Supabase (PostgreSQL)**.

---

## 1. Core Identity & User Management

### `users`
The central identity table.
- **Fields:** `id` (UUID), `first_name`, `last_name`, `email` (Unique), `user_type` (USER-DEFINED), `birthday` (Date), `gender` (USER-DEFINED), `created_at`.

### User Metadata
- **`user_avatars`**: `id`, `user_id`, `avatar_url`, `uploaded_at`.
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
- **Fields:** `id`, `user_id`, `name`, `price`, `img_src`, `is_active`, `rating`, `sold`, `description`, `seller_name`.

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
- **Fields:** Includes contact info, `request_details`, `appointment_date`, `fabric_id`, and `measurement_profile_id`.

### Sewer-Specific Config
- **`sewer_settings`**: Toggles for `accepting_commissions`, `accepting_alterations`, `accepting_repairs`, and `accepting_appointments`.
- **`sewer_fabrics`**: A catalog of fabrics a sewer offers for commissions. Includes `name`, `description`, `image_url`, and `is_available`.

---

## 5. Implementation Notes

### Relational Mapping
- All tables use `uuid` for primary keys with `gen_random_uuid()` defaults.
- Most tables include `user_id` or `product_id` foreign keys with standard relational constraints.

### For Frontend Developers
- Use the `user_measurements` table to populate the "Measurements" section of the user profile.
- When creating a `service_request`, ensure a `measurement_profile_id` is linked if the service type is `commission`.
- Filter `seller_products` using the `location` and `type` fields for the marketplace browse pages.
