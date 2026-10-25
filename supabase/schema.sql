-- ====================================================================
-- OWLERA E-COMMERCE DATABASE SCHEMA & SEED DATA
-- Fully compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- ====================================================================

create extension if not exists pgcrypto;

-- 1. PROFILES & ADMINS
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- 2. CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  image_url text default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. COLLECTIONS
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  banner_image text default '',
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category_id uuid references public.categories(id) on delete set null,
  category_name text not null default 'Jewellery',
  description text not null default '',
  specifications jsonb default '{}'::jsonb,
  price integer not null check (price >= 0),
  compare_at integer check (compare_at is null or compare_at >= price),
  image_url text not null default '',
  gallery_urls text[] default array[]::text[],
  stock integer not null default 0 check (stock >= 0),
  sku text default '',
  badge text default '',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  seo_title text default '',
  seo_description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. COLLECTION PRODUCTS JUNCTION
create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  display_order integer not null default 0,
  primary key (collection_id, product_id)
);

-- 6. ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('OWL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  subtotal integer not null check (subtotal >= 0),
  shipping_fee integer not null default 0 check (shipping_fee >= 0),
  discount integer not null default 0 check (discount >= 0),
  total integer not null check (total >= 0),
  currency text not null default 'INR',
  payment_provider text default 'razorpay',
  payment_reference text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'initiated', 'paid', 'failed', 'refunded')),
  order_status text not null default 'confirmed' check (order_status in ('pending', 'confirmed', 'processing', 'packed', 'dispatched', 'shipped', 'delivered', 'cancelled', 'returned')),
  internal_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  sku text default '',
  variant_info text default '',
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0),
  image_url text default ''
);

-- 8. PAYMENTS LOG
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  amount integer not null check (amount >= 0),
  currency text not null default 'INR',
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'failed')),
  refund_status text default 'none' check (refund_status in ('none', 'initiated', 'refunded')),
  raw_response jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 9. SHIPPING & FULFILMENT (MANUAL SHIPPING)
create table if not exists public.shipping_fulfilment (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references public.orders(id) on delete cascade,
  shipping_method text not null default 'Standard Insured Delivery',
  shipping_cost integer not null default 0,
  courier_name text default '',
  tracking_number text default '',
  tracking_url text default '',
  dispatched_at timestamptz,
  delivered_at timestamptz,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. SITE SETTINGS & CONFIG
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 11. NEWSLETTER SUBSCRIBERS
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 12. COUPONS
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null default 'percentage' check (discount_type in ('percentage', 'fixed')),
  discount_value integer not null check (discount_value > 0),
  min_order_value integer not null default 0,
  max_discount integer,
  usage_limit integer,
  times_used integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- 13. WEBHOOK EVENTS (IDEMPOTENCY & RECONCILIATION AUDIT)
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique not null,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'processed',
  processed_at timestamptz not null default now()
);

-- 14. PRODUCT VARIANTS
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null, -- e.g. "Gold / Size 6", "Silver / Standard"
  sku text default '',
  price_override integer,
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 15. AUDIT LOGS (SECURITY & PRIVILEGE TRACKING)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  resource_type text not null,
  resource_id text,
  changes jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.collection_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shipping_fulfilment enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.coupons enable row level security;
alter table public.webhook_events enable row level security;
alter table public.product_variants enable row level security;
alter table public.audit_logs enable row level security;

-- Performance Indexes
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_webhook_events_id on public.webhook_events(event_id);
create index if not exists idx_product_variants_prod on public.product_variants(product_id);

-- Product Variants read policy
drop policy if exists "Public can read active variants" on public.product_variants;
create policy "Public can read active variants" on public.product_variants for select using (is_active = true);

-- Admin security: users present in admin_users or profiles with role='admin' have full management
drop policy if exists "Admins manage webhook events" on public.webhook_events;
create policy "Admins manage webhook events" on public.webhook_events for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins manage audit logs" on public.audit_logs;
create policy "Admins manage audit logs" on public.audit_logs for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- Public can read active categories, published collections, active products
drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories for select using (is_active = true);

drop policy if exists "Public can read published collections" on public.collections;
create policy "Public can read published collections" on public.collections for select using (is_published = true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (is_active = true);

drop policy if exists "Public can read collection products" on public.collection_products;
create policy "Public can read collection products" on public.collection_products for select using (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);

drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter" on public.newsletter_subscribers for insert with check (true);

-- Admin security: users present in admin_users or profiles with role='admin' have full management
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins manage collections" on public.collections;
create policy "Admins manage collections" on public.collections for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders" on public.orders for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins read order items" on public.order_items;
create policy "Admins read order items" on public.order_items for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "Admins manage shipping" on public.shipping_fulfilment;
create policy "Admins manage shipping" on public.shipping_fulfilment for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- ====================================================================
-- SEED DATA: LUXURY JEWELLERY, FASHION & LIFESTYLE FOR OWLERA
-- ====================================================================

-- Insert Categories
insert into public.categories (id, name, slug, description, image_url, display_order)
values
  ('11111111-1111-1111-1111-111111111111', 'Jewellery', 'jewellery', 'Fine everyday gold-tone necklaces, earrings, and handcrafted accents.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85', 1),
  ('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion', 'Sophisticated clutches, silk scarves and timeless styling accessories.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', 2),
  ('33333333-3333-3333-3333-333333333333', 'Lifestyle', 'lifestyle', 'Scented artisanal candles, leather keepsakes and mindful living luxuries.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85', 3),
  ('44444444-4444-4444-4444-444444444444', 'Gifting', 'gifting', 'Curated gift boxes wrapped in signature cream and forest green ribbon.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85', 4)
on conflict (slug) do nothing;

-- Insert Collections
insert into public.collections (id, name, slug, description, banner_image, display_order)
values
  ('55555555-5555-5555-5555-555555555555', 'Celestial Gold', 'celestial-gold', 'Lustrous warm 18k gold-toned pieces crafted for daytime subtlety and evening allure.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85', 1),
  ('66666666-6666-6666-6666-666666666666', 'Heirloom Pearls', 'heirloom-pearls', 'Baroque and freshwater pearl accents reimagined with modern geometric lines.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85', 2),
  ('77777777-7777-7777-7777-777777777777', 'Minimalist Everyday', 'minimalist-everyday', 'Featherweight silhouettes designed to layer seamlessly from morning coffee to dinner.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85', 3),
  ('88888888-8888-8888-8888-888888888888', 'Artisan Keepsakes', 'artisan-keepsakes', 'Limited-batch lifestyle treasures and bespoke gift sets for life’s rare milestones.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=85', 4)
on conflict (slug) do nothing;

-- Insert Products
insert into public.products (id, name, slug, category_name, description, specifications, price, compare_at, image_url, gallery_urls, stock, sku, badge, is_active, is_featured, is_new)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Celeste Gold Hoops',
  'celeste-gold-hoops',
  'Jewellery',
  'Masterfully sculpted with an arched curvature that catches warm ambient light from every angle. Featuring a premium 18k gold-tone vacuum plating over hypoallergenic brass, the Celeste Hoops offer featherlight comfort for day-long wear. Designed to elevate casual knitwear and formal gowns alike.',
  '{"Material": "18k Gold-Tone PVD Plating on Brass", "Diameter": "24mm", "Weight": "4.2g per hoop", "Closure": "Hinged Huggie Post", "Care": "Avoid perfumes, water, and abrasive cloths. Store in your OWLERA pouch."}'::jsonb,
  1499,
  1999,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  array['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85'],
  14,
  'OWL-JW-001',
  'Bestseller',
  true,
  true,
  false
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Luna Pendant Necklace',
  'luna-pendant-necklace',
  'Jewellery',
  'An ethereal crescent motif suspended along an intricately diamond-cut curb chain. The pendant reflects the soft luminescence of the nocturnal sky, finished with OWLERA’s hallmark satin-polished gold tone. An exquisite solo piece or a base for layering.',
  '{"Material": "18k Gold Plated Brass & Micro Zircon", "Chain Length": "42cm + 5cm extender", "Pendant": "16mm x 14mm", "Clasp": "Lobster Claw", "Care": "Gently wipe with a soft microfiber cloth after wear."}'::jsonb,
  1899,
  2499,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85'],
  9,
  'OWL-JW-002',
  'New Arrival',
  true,
  true,
  true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Golden Hour Paperclip Bracelet',
  'golden-hour-bracelet',
  'Jewellery',
  'Modern geometric links interlocked in balanced proportions. The Golden Hour Bracelet delivers contemporary refinement with high-reflectance faceted sides. Finished with an engraved OWLERA wing insignia tag.',
  '{"Material": "18k Gold-Tone High-Polished Brass", "Length": "18cm adjustable", "Link Width": "5mm", "Finish": "Mirror Polish", "Care": "Store dry in original luxury presentation case."}'::jsonb,
  1299,
  1699,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85',
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85'],
  18,
  'OWL-JW-003',
  'Classic',
  true,
  true,
  false
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Aura Baroque Pearl Earrings',
  'aura-baroque-pearl-earrings',
  'Jewellery',
  'Naturally formed organic baroque pearls held by sculpted gold molten studs. Because each cultured pearl possesses organic individuality, no two pairs are identical—giving you an authentic, one-of-a-kind jewel.',
  '{"Material": "Cultured Baroque Pearls & 18k Gold Plate", "Length": "32mm approximate", "Pearl Type": "Organic Cultured Pearl", "Hypoallergenic": "Yes, surgical grade posts"}'::jsonb,
  2199,
  2899,
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85',
  array['https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85'],
  6,
  'OWL-JW-004',
  'Limited Batch',
  true,
  true,
  true
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Verdant Leather Evening Bag',
  'verdant-leather-evening-bag',
  'Fashion',
  'Crafted in deep forest green pebbled vegan leather with polished gold hardware accents. Includes a detachable fine-link curb chain strap, magnetic envelope closure, and structured accordion interior slots for cards and essentials.',
  '{"Material": "Premium Structured Vegan Leather", "Dimensions": "21cm x 13cm x 5cm", "Hardware": "Brushed Gold Alloy", "Strap Drop": "54cm crossbody chain"}'::jsonb,
  3499,
  4500,
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
  array['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'],
  8,
  'OWL-FS-001',
  'Signature',
  true,
  true,
  false
),
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Nocturne Amber & Fig Soy Candle',
  'nocturne-amber-fig-candle',
  'Lifestyle',
  'Hand-poured into a forest green matte glass vessel with a golden brass snuffer lid. Notes of sun-warmed wild fig, golden amber, smoky vetiver, and cedarwood create an intimate, calming sanctuary in any room.',
  '{"Wax": "100% Organic Soy & Coconut Wax", "Burn Time": "55+ Hours", "Weight": "280g / 9.8 oz", "Wick": "Natural Unbleached Cotton"}'::jsonb,
  1199,
  1499,
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
  array['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85'],
  25,
  'OWL-LS-001',
  'Aromatics',
  true,
  false,
  true
)
on conflict (slug) do nothing;

-- Link Collection Products
insert into public.collection_products (collection_id, product_id, display_order)
values
  ('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
  ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2),
  ('55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3),
  ('66666666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1),
  ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
  ('77777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2),
  ('88888888-8888-8888-8888-888888888888', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 1),
  ('88888888-8888-8888-8888-888888888888', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 2)
on conflict do nothing;

-- Default Site Settings
insert into public.site_settings (key, value)
values
  ('announcement', '{"text": "COMPLIMENTARY INSURED PAN-INDIA DELIVERY ON ORDERS ABOVE ₹999 ✦ USE CODE: OWLFIRST10", "enabled": true}'::jsonb),
  ('hero', '{"headline": "Your everyday shine, suspended in elegance.", "subhead": "Thoughtfully crafted jewellery, fashion finds and quiet luxuries made to elevate your moments.", "primary_cta": "Shop Collection", "secondary_cta": "Discover Our Heritage"}'::jsonb),
  ('contact', '{"whatsapp": "+91 6305630468", "email": "concierge@owlera.in", "hours": "Monday to Saturday, 10:00 AM – 7:00 PM IST"}'::jsonb),
  ('shipping', '{"standard_fee": 99, "free_threshold": 999, "courier_partners": ["Delhivery", "BlueDart", "DTDC"]}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- Coupons
insert into public.coupons (code, discount_type, discount_value, min_order_value, max_discount, is_active)
values
  ('OWLFIRST10', 'percentage', 10, 999, 500, true),
  ('SHINE200', 'fixed', 200, 1999, 200, true)
on conflict (code) do nothing;
