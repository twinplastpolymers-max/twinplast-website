-- Twinplast Polymers Database Schema - Phase 1 Foundation
-- This file can be run directly in the Supabase SQL Editor.

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Create user role enum
create type public.user_role as enum ('admin');

-- ----------------------------------------------------
-- Table: user_roles
-- ----------------------------------------------------
create table public.user_roles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    role public.user_role not null,
    created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) on user_roles
alter table public.user_roles enable row level security;

-- ----------------------------------------------------
-- Helper Function: is_admin
-- ----------------------------------------------------
create or replace function public.is_admin(user_id uuid)
returns boolean
security definer
set search_path = public
language plpgsql
as $$
begin
    return exists (
        select 1 from public.user_roles
        where user_roles.user_id = $1 and user_roles.role = 'admin'
    );
end;
$$;

-- RLS policies for user_roles
create policy "Users can view their own roles"
    on public.user_roles
    for select
    using (auth.uid() = user_id);

create policy "Admins can manage all user roles"
    on public.user_roles
    for all
    using (public.is_admin(auth.uid()));


-- ----------------------------------------------------
-- Table: products
-- ----------------------------------------------------
create table public.products (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    description text not null,
    category text not null,
    image_cloudinary_public_id text, -- Cloudinary unique asset identifier
    image_url text, -- Fallback / backup delivery URL
    featured boolean not null default false,
    display_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on products
alter table public.products enable row level security;

-- Indexing for lookup speed and slug uniqueness
create index idx_products_slug on public.products(slug);
create index idx_products_active_order on public.products(active, display_order);

-- RLS policies for products
create policy "Public can view active products"
    on public.products
    for select
    using (active = true);

create policy "Admins can perform all operations on products"
    on public.products
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));


-- ----------------------------------------------------
-- Table: enquiries
-- ----------------------------------------------------
create table public.enquiries (
    id uuid primary key default gen_random_uuid(),
    customer_name text not null,
    phone text,
    email text not null,
    company text,
    message text not null,
    status text not null default 'new' constraint chk_enquiry_status check (status in ('new', 'in_progress', 'resolved', 'archived')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on enquiries
alter table public.enquiries enable row level security;

-- Indexing for enquiry management
create index idx_enquiries_status_created on public.enquiries(status, created_at desc);

-- RLS policies for enquiries
create policy "Public can submit enquiries"
    on public.enquiries
    for insert
    with check (true); -- Anyone can submit a contact form

create policy "Admins can view and manage enquiries"
    on public.enquiries
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));


-- ----------------------------------------------------
-- Table: company_settings
-- ----------------------------------------------------
create table public.company_settings (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    value jsonb not null,
    updated_at timestamptz not null default now()
);

-- Enable RLS on company_settings
alter table public.company_settings enable row level security;

-- Indexing for settings lookup
create index idx_company_settings_key on public.company_settings(key);

-- RLS policies for company_settings
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


-- ----------------------------------------------------
-- Automated Updated At Trigger Function
-- ----------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Apply triggers
create trigger trigger_products_updated_at
    before update on public.products
    for each row execute function public.update_updated_at_column();

create trigger trigger_enquiries_updated_at
    before update on public.enquiries
    for each row execute function public.update_updated_at_column();

create trigger trigger_company_settings_updated_at
    before update on public.company_settings
    for each row execute function public.update_updated_at_column();


-- ----------------------------------------------------
-- Seed Data: Initial 6 Core Products
-- ----------------------------------------------------
insert into public.products (slug, title, description, category, image_cloudinary_public_id, image_url, featured, display_order, active)
values
    ('pp-sunpack-sheets', 'PP Sunpack Sheets', 'Lightweight, durable fluted sheets optimal for high-quality printing, advertising boards, and industrial packaging applications.', 'Sunpack', null, null, true, 0, true),
    ('pp-corrugated-sheets', 'PP Corrugated Sheets', 'Premium fluted structural sheets providing impact resistance, water protection, and clean custom printability.', 'Corrugated', null, null, true, 1, true),
    ('pp-hollow-sheets', 'PP Hollow Sheets', 'Double-wall polypropylene sheets combining structural stiffness with minimal weight, suitable for separation layers.', 'Hollow', null, null, true, 2, true),
    ('pp-layer-pad-sheets', 'PP Layer Pad Sheets', 'High-quality divider sheets designed for securing stack-packaging of cans, bottles, and commercial containers.', 'Layer Pad', null, null, false, 3, true),
    ('pp-floor-protection-sheets', 'PP Floor Protection Sheets', 'Heavy-duty impact-resistant layers safeguarding marble, tile, and hardwood floors during construction.', 'Floor Protection', null, null, false, 4, true),
    ('pp-box-sheets', 'PP Box Sheets', 'Tough, moisture-resistant sheets designed specifically for fabrication of reusable boxes and storage crates.', 'Box', null, null, false, 5, true)
on conflict (slug) do nothing;


