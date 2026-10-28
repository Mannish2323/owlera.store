---
name: owlera-ecommerce-engineering
description: >-
  Protects and manages OWLERA's e-commerce backend architecture, product data, cart logic,
  Supabase PostgreSQL tables, Razorpay HMAC-SHA256 payments, webhooks, inventory, and order fulfillment.
  Activate when working on checkout, cart state, Supabase queries, Razorpay integration, admin APIs, or data models.
---

# OWLERA E-Commerce Engineering & Backend Systems

This skill establishes engineering guidelines, data models, payment security, and API patterns for the **OWLERA** storefront backend and state management infrastructure.

---

## 1. Core Architecture & Data Layer

### Supabase Integration
- **Server Client:** `lib/supabase-server.ts` uses `@supabase/ssr` with Next.js cookie handling. Use this for server components, API route handlers, and admin tasks.
- **Browser Client:** `lib/supabase-browser.ts` uses `@supabase/ssr` for client-side queries.
- **Database Schema (`supabase/schema.sql`):**
  - `products`: id, slug, title, description, price, compare_at_price, images, category, inventory_count, is_featured, tags.
  - `orders`: id, order_number, customer_id, total_amount, shipping_fee, discount_amount, coupon_code, status, payment_id, razorpay_order_id, shipping_address.
  - `order_items`: order_id, product_id, quantity, unit_price, total_price.
  - `customers`: id, email, full_name, phone, addresses.
  - `newsletter_subscribers`: email, subscribed_at.
- **Local Fallback Data:** `lib/products.ts` provides fallback catalogue data when Supabase is disconnected or during offline testing. Always ensure data consistency between local mocks and database schemas.

### Cart & Wishlist State Management
- **Cart Provider (`components/cart-provider.tsx`):**
  - In-memory state synchronized with `localStorage` (`owlera_cart_v1`).
  - Actions: `addItem(product, quantity)`, `removeItem(productId)`, `updateQuantity(productId, quantity)`, `clearCart()`.
  - Computed values: `subtotal`, `itemCount`, `shippingFee` (₹0 if subtotal ≥ ₹999, else ₹99), `total`.
- **Wishlist Provider (`components/wishlist-provider.tsx`):**
  - Synchronized with `localStorage` (`owlera_wishlist_v1`).
  - Actions: `toggleWishlist(productId)`, `isInWishlist(productId)`.

---

## 2. Payment Security & Razorpay Integration

### Payment Lifecycle
1. **Order Creation (`app/api/checkout/route.ts`):**
   - Calculates server-side subtotal, discount, and shipping fee. **Never trust client-submitted prices.**
   - Creates a Razorpay order via Razorpay API (`lib/razorpay.ts`).
   - Inserts pending order record into Supabase `orders` table.
   - Returns `orderId`, `amount`, and `currency` (INR) to client.
2. **Client Checkout Modal:**
   - Launches Razorpay checkout checkout.js script with `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
3. **Payment Verification (`app/api/checkout/verify/route.ts`):**
   - Validates cryptographic signature using HMAC-SHA256:
     ```typescript
     const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
     const expectedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
       .update(payload)
       .digest("hex");
     const isValid = expectedSignature === razorpay_signature;
     ```
   - On valid signature, updates order status to `paid` and decrements inventory.
4. **Webhook Handling (`app/api/checkout/webhook/route.ts`):**
   - Verifies raw request body with `RAZORPAY_WEBHOOK_SECRET` using `crypto.timingSafeEqual`.
   - Implements idempotent event handling: ignores duplicate `payment.captured` events if order is already marked paid.

---

## 3. Order Tracking & Customer Privacy

- **Order Tracking (`app/api/orders/track/route.ts`):**
  - Supports tracking by `order_number` and `phone` or `email`.
  - **Privacy Rule:** Mask sensitive customer details on public lookups (e.g. `R***** K****`, `+91 98****1234`).
- **Pincode Verification (`lib/pincode-validator.ts`):**
  - Strict validation of Indian 6-digit postal PINs (`/^[1-9][0-9]{5}$/`).
  - Validates delivery zones across all 8 Indian postal regions.

---

## 4. Admin Security & Operations (`app/admin/page.tsx`)

- Admin routes (`app/admin/*`, `app/api/admin/*`) require server-side session guards.
- Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`) must ONLY be accessed in secure server-side routes (`route.ts`), never in browser client components or `NEXT_PUBLIC_` variables.

---

## 5. Security & Safety Checklist

- [ ] **No Secret Exposure:** Never log `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] **Server-Side Price Authority:** Always look up unit prices from database or `lib/products.ts`; never calculate checkout total based purely on client payloads.
- [ ] **RLS Policies Enabled:** Ensure Row Level Security is active on all Supabase tables.
- [ ] **Timing-Safe Equality:** Always use `crypto.timingSafeEqual` for webhook signature comparisons.
- [ ] **Idempotent Webhooks:** Never increment/decrement inventory twice on retransmitted webhook events.
