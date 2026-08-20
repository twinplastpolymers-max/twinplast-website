-- Twinplast Polymers Migration: Pre-Phase 3 Security & Seeding Refinement
-- Safely migrates an existing Phase 1 database to the audited Phase 2.5 schema.

-- 1. Remove default 'admin' role value constraint on user_roles
alter table public.user_roles alter column role drop default;

-- 2. Drop existing RLS policies on company_settings to apply security whitelist
drop policy if exists "Public can read company settings" on public.company_settings;
drop policy if exists "Admins can manage company settings" on public.company_settings;

-- Recreate RLS policies on company_settings
create policy "Public can read company settings"
    on public.company_settings
    for select
    using (key in (
        'company_name',
        'public_phone',
        'public_email',
        'public_address',
        'website_metadata',
        'social_links',
        'business_info'
    ));

create policy "Admins can manage company settings"
    on public.company_settings
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));

-- 3. Drop existing product policies to ensure correct alignment
drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins can perform all operations on products" on public.products;

-- Recreate products policies
create policy "Public can view active products"
    on public.products
    for select
    using (active = true);

create policy "Admins can perform all operations on products"
    on public.products
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));

-- 4. Seed Products: Initial 6 Core Products with NULL Cloudinary media
-- Idempotent insert: if the product already exists (by slug), DO NOTHING.
-- This guarantees existing CMS-managed products and user uploads are never overwritten.
insert into public.products (slug, title, description, category, image_cloudinary_public_id, image_url, featured, display_order, active)
values
    ('pp-sunpack-sheets', 'PP Sunpack Sheets', 'Lightweight, durable fluted sheets optimal for high-quality printing, advertising boards, and industrial packaging applications.', 'Sunpack', null, null, true, 0, true),
    ('pp-corrugated-sheets', 'PP Corrugated Sheets', 'Premium fluted structural sheets providing impact resistance, water protection, and clean custom printability.', 'Corrugated', null, null, true, 1, true),
    ('pp-hollow-sheets', 'PP Hollow Sheets', 'Double-wall polypropylene sheets combining structural stiffness with minimal weight, suitable for separation layers.', 'Hollow', null, null, true, 2, true),
    ('pp-layer-pad-sheets', 'PP Layer Pad Sheets', 'High-quality divider sheets designed for securing stack-packaging of cans, bottles, and commercial containers.', 'Layer Pad', null, null, false, 3, true),
    ('pp-floor-protection-sheets', 'PP Floor Protection Sheets', 'Heavy-duty impact-resistant layers safeguarding marble, tile, and hardwood floors during construction.', 'Floor Protection', null, null, false, 4, true),
    ('pp-box-sheets', 'PP Box Sheets', 'Tough, moisture-resistant sheets designed specifically for fabrication of reusable boxes and storage crates.', 'Box', null, null, false, 5, true)
on conflict (slug) do nothing;
