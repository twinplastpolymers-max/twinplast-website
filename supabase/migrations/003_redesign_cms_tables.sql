-- Twinplast Polymers Migration: Phase 1 Database & CMS Foundation
-- Creates CMS tables, configures Row Level Security (RLS) policies, and inserts verified seed data.

-- 1. Create certifications table
create table if not exists public.certifications (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    credential_type text not null constraint chk_credential_type check (credential_type in ('iso', 'plexconcil', 'other')),
    certificate_number text not null,
    issuing_organization text not null,
    scope text,
    issue_date date,
    expiry_date date,
    image_url text,
    image_cloudinary_public_id text,
    display_order integer not null default 0,
    active boolean not null default true,
    featured boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on certifications
alter table public.certifications enable row level security;

-- Indexes for certifications
create index if not exists idx_certifications_active_order on public.certifications(active, display_order);
create index if not exists idx_certifications_type on public.certifications(credential_type);

-- RLS policies for certifications
drop policy if exists "Public can view active certifications" on public.certifications;
create policy "Public can view active certifications"
    on public.certifications
    for select
    using (active = true);

drop policy if exists "Admins can manage all certifications" on public.certifications;
create policy "Admins can manage all certifications"
    on public.certifications
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));


-- 2. Create industries table
create table if not exists public.industries (
    id uuid primary key default gen_random_uuid(),
    title text not null unique,
    description text not null,
    icon_name text,
    image_url text,
    image_cloudinary_public_id text,
    display_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on industries
alter table public.industries enable row level security;

-- Indexes for industries
create index if not exists idx_industries_active_order on public.industries(active, display_order);

-- RLS policies for industries
drop policy if exists "Public can view active industries" on public.industries;
create policy "Public can view active industries"
    on public.industries
    for select
    using (active = true);

drop policy if exists "Admins can manage all industries" on public.industries;
create policy "Admins can manage all industries"
    on public.industries
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));


-- 3. Create manufacturing_steps table
create table if not exists public.manufacturing_steps (
    id uuid primary key default gen_random_uuid(),
    step_number integer not null unique,
    title text not null,
    description text not null,
    icon_name text,
    display_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on manufacturing_steps
alter table public.manufacturing_steps enable row level security;

-- Indexes for manufacturing_steps
create index if not exists idx_manufacturing_steps_active_step on public.manufacturing_steps(active, step_number);

-- RLS policies for manufacturing_steps
drop policy if exists "Public can view active manufacturing steps" on public.manufacturing_steps;
create policy "Public can view active manufacturing steps"
    on public.manufacturing_steps
    for select
    using (active = true);

drop policy if exists "Admins can manage all manufacturing steps" on public.manufacturing_steps;
create policy "Admins can manage all manufacturing steps"
    on public.manufacturing_steps
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));


-- 4. Create homepage_sections table
create table if not exists public.homepage_sections (
    id uuid primary key default gen_random_uuid(),
    section_key text not null unique,
    content jsonb not null,
    updated_at timestamptz not null default now()
);

-- Enable RLS on homepage_sections
alter table public.homepage_sections enable row level security;

-- Indexes for homepage_sections
create index if not exists idx_homepage_sections_key on public.homepage_sections(section_key);

-- RLS policies for homepage_sections
drop policy if exists "Public can read homepage sections" on public.homepage_sections;
create policy "Public can read homepage sections"
    on public.homepage_sections
    for select
    using (true);

drop policy if exists "Admins can manage homepage sections" on public.homepage_sections;
create policy "Admins can manage homepage sections"
    on public.homepage_sections
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));


-- 5. Apply automated updated_at triggers
drop trigger if exists trigger_certifications_updated_at on public.certifications;
create trigger trigger_certifications_updated_at
    before update on public.certifications
    for each row execute function public.update_updated_at_column();

drop trigger if exists trigger_industries_updated_at on public.industries;
create trigger trigger_industries_updated_at
    before update on public.industries
    for each row execute function public.update_updated_at_column();

drop trigger if exists trigger_manufacturing_steps_updated_at on public.manufacturing_steps;
create trigger trigger_manufacturing_steps_updated_at
    before update on public.manufacturing_steps
    for each row execute function public.update_updated_at_column();

drop trigger if exists trigger_homepage_sections_updated_at on public.homepage_sections;
create trigger trigger_homepage_sections_updated_at
    before update on public.homepage_sections
    for each row execute function public.update_updated_at_column();


-- 6. Expand company_settings RLS whitelist to include primary/official/alternate contact keys
drop policy if exists "Public can read company settings" on public.company_settings;
create policy "Public can read company settings"
    on public.company_settings
    for select
    using (key in (
        'company_name',
        'public_phone',
        'public_email',
        'public_address',
        'primary_phone',
        'alternate_phone',
        'primary_email',
        'official_email',
        'alternate_email',
        'website_metadata',
        'social_links',
        'business_info'
    ));


-- ====================================================
-- SEED DATA (VERIFIED & NON-DESTRUCTIVE ONLY)
-- ====================================================

-- Seed Verified Certifications (ISO 9001:2015 & PLEXCONCIL)
insert into public.certifications (
    title,
    credential_type,
    certificate_number,
    issuing_organization,
    scope,
    issue_date,
    expiry_date,
    display_order,
    active,
    featured
)
values
    (
        'ISO 9001:2015 Quality Management System',
        'iso',
        '26UQLO14',
        'Certification body shown on certificate: AQC',
        'Manufacturing of PP Corrugated Sheet and Box',
        '2026-04-17',
        '2029-04-16',
        1,
        true,
        true
    ),
    (
        'Plastics Export Promotion Council Registration',
        'plexconcil',
        'RCMC/PLEXCONCIL/00704/2023-2024',
        'Plastics Export Promotion Council (PLEXCONCIL)',
        'Merchant Cum Manufacturer Exporter - Registered category: Plastic Films and Sheets',
        '2026-03-11',
        '2027-03-31',
        2,
        true,
        true
    )
on conflict do nothing;


-- Seed Verified Industries (7 Core Sectors - Non-destructive)
insert into public.industries (title, description, icon_name, display_order, active)
values
    ('Packaging', 'Polypropylene corrugated sheets and boxes for packaging applications.', 'Package', 1, true),
    ('Beverage Industry', 'Polypropylene layer pad sheets used as separators in product packaging.', 'Wine', 2, true),
    ('Construction', 'Polypropylene floor protection sheets safeguarding tile, marble, and finished surfaces.', 'Building2', 3, true),
    ('Advertising & Printing', 'PP Sunpack sheets used for printing, advertising, signage, and display boards.', 'Printer', 4, true),
    ('Industrial', 'Polypropylene sheets and fabricated products for industrial applications.', 'Factory', 5, true),
    ('Automobile', 'PP corrugated products and protective layers for industrial packaging.', 'Car', 6, true),
    ('Agriculture', 'PP sheets for packaging and agricultural material handling.', 'Sprout', 7, true)
on conflict (title) do nothing;


-- Seed Verified 9 Manufacturing Process Stages (Non-destructive)
insert into public.manufacturing_steps (step_number, title, description, icon_name, display_order, active)
values
    (1, 'Raw Material', 'Polypropylene raw materials prepared for manufacturing.', 'Layers', 1, true),
    (2, 'Mixing', 'Mixing raw materials and color pigments according to specification.', 'RotateCw', 2, true),
    (3, 'Extrusion', 'Extruding molten polypropylene material through die.', 'Cpu', 3, true),
    (4, 'Sheet Formation', 'Forming fluted polypropylene sheet structure.', 'LayoutGrid', 4, true),
    (5, 'Cooling', 'Cooling formed polypropylene sheets.', 'ThermometerSnowflake', 5, true),
    (6, 'Cutting', 'Cutting sheets to required dimensions.', 'Scissors', 6, true),
    (7, 'Quality Inspection', 'Inspecting thickness, GSM, dimensions, colour, surface quality, and strength.', 'CheckCircle', 7, true),
    (8, 'Packing', 'Packing finished polypropylene products for protection.', 'PackageCheck', 8, true),
    (9, 'Dispatch', 'Staging and dispatching finished products for delivery.', 'Truck', 9, true)
on conflict (step_number) do nothing;


-- Seed Source-Controlled Homepage Sections (Non-destructive)
insert into public.homepage_sections (section_key, content)
values
    ('hero', '{
        "eyebrow": "PP SHEET MANUFACTURER",
        "headline": "Polypropylene Sheets & PP Product Manufacturer",
        "subheadline": "Manufacturer of high-quality PP Corrugated Sheets, PP Layer Pad Sheets, PP Sunpack Sheets, PP Floor Protection Sheets, PP Corrugated Boxes & Customized PP Products in Thoothukudi, Tamil Nadu.",
        "primary_cta_label": "Request a Quote",
        "primary_cta_url": "/contact",
        "secondary_cta_label": "Explore Products",
        "secondary_cta_url": "/products",
        "location": "Thoothukudi, Tamil Nadu, India"
    }'::jsonb),
    ('about', '{
        "eyebrow": "ABOUT TWINPLAST POLYMERS",
        "heading": "Twinplast Polymers Private Limited",
        "subheadline": "Established in 2021 in Thoothukudi, Tamil Nadu, India.",
        "content": "Twinplast Polymers Pvt. Ltd. is a manufacturer of high-quality polypropylene sheets and PP-based products serving packaging, construction, industrial, advertising and commercial applications.",
        "cta_label": "Know More About Us",
        "cta_url": "/about"
    }'::jsonb),
    ('vision_mission', '{
        "vision": {
            "title": "Our Vision",
            "content": "To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service."
        },
        "mission": {
            "title": "Our Mission",
            "content": "To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to our customers while continuously improving our manufacturing capabilities and product range."
        },
        "objectives": [
            "Consistent product quality",
            "Innovative PP solutions",
            "Customization",
            "Competitive pricing",
            "Long-term relationships",
            "Reliable supply",
            "Domestic and international market reach",
            "Reusable and recyclable PP solutions"
        ]
    }'::jsonb),
    ('why_choose', '{
        "eyebrow": "WHY CHOOSE TWINPLAST POLYMERS",
        "heading": "Why Choose Twinplast",
        "pillars": [
            {
                "title": "Quality",
                "description": "High-quality polypropylene raw materials processed under strict quality checks."
            },
            {
                "title": "Customization",
                "description": "Tailored GSM, thickness, dimensions, and color options to suit customer requirements."
            },
            {
                "title": "Durability",
                "description": "Durable and resilient polypropylene product structure for industrial applications."
            },
            {
                "title": "Cost Effective",
                "description": "Competitive pricing delivering practical B2B value."
            },
            {
                "title": "Reliable Supply",
                "description": "Dependable production and supply schedules for timely order fulfillment."
            },
            {
                "title": "Customer Focus",
                "description": "Dedicated B2B customer support focused on practical client needs."
            }
        ]
    }'::jsonb),
    ('quality_commitment', '{
        "heading": "Quality Commitment",
        "content": "Quality is integrated into our manufacturing process. We monitor key parameters to ensure consistent product performance.",
        "parameters": [
            "Thickness",
            "GSM",
            "Dimensions",
            "Colour Consistency",
            "Surface Quality",
            "Product Performance & Strength"
        ]
    }'::jsonb),
    ('markets', '{
        "heading": "Markets We Serve",
        "content": "Twinplast Polymers serves customers across domestic and targeted international markets.",
        "regions": [
            "India",
            "Middle East",
            "Asia",
            "International Markets"
        ]
    }'::jsonb),
    ('final_cta', '{
        "heading": "Looking for a Reliable PP Sheet Solution?",
        "subheadline": "Contact our team to discuss your polypropylene sheet and product requirements.",
        "primary_cta_label": "Request a Quote",
        "primary_cta_url": "/contact",
        "secondary_cta_label": "Contact Us",
        "secondary_cta_url": "/contact"
    }'::jsonb)
on conflict (section_key) do nothing;


-- Seed Official vs Alternate contact settings safely without overwriting existing production public keys (Non-destructive)
insert into public.company_settings (key, value)
values
    ('official_email', '"info@twinplastpolymers.com"'::jsonb),
    ('primary_phone', '"+91 95853 88444"'::jsonb),
    ('alternate_phone', '"+91 96458 32154"'::jsonb),
    ('primary_email', '"twinplastpolymers@gmail.com"'::jsonb),
    ('alternate_email', '"info@twinplastpolymers.com"'::jsonb)
on conflict (key) do nothing;
