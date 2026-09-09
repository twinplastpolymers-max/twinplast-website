-- =====================================================================================
-- SEED FILE: 001_authoritative_twinplast_website_content.sql
-- Project: Twinplast Polymers Pvt. Ltd.
-- Description: Authoritative website content seed based strictly on twinplastWebsite(1).docx.
--
-- IMPORTANT SAFETY & NON-DESTRUCTIVE GUARANTEES:
-- 1. NON-DESTRUCTIVE: Contains ONLY INSERT / ON CONFLICT UPDATE statements.
-- 2. ZERO INVENTED CONTENT: No marketing claims, embellishments, or unmentioned values.
-- 3. PRESERVES PRESENTATION METADATA: Does not overwrite existing UI icons, categories,
--    or media fields on conflict.
-- 4. PRESERVES DESCRIPTIONS: Manufacturing step descriptions are NOT overwritten on conflict.
-- 5. DOES NOT OVERWRITE HERO: Hero is not defined in source document, so hero is untouched.
-- 6. NO SCHEMA / RLS / MEDIA CHANGES: Operates strictly within existing columns.
-- 7. DO NOT EXECUTE AUTOMATICALLY: Created for inspection and manual review.
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 1. COMPANY SETTINGS (Strictly Public Authoritative Contact & Location)
-- -------------------------------------------------------------------------------------
insert into public.company_settings (key, value)
values
    ('company_name', '"Twinplast Polymers Pvt. Ltd."'::jsonb),
    ('public_phone', '"+91 96458 32154"'::jsonb),
    ('public_email', '"info@twinplastpolymers.com"'::jsonb),
    ('public_address', '"Tuticorin, Tamil Nadu, India"'::jsonb),
    ('business_info', '{
        "company_name": "Twinplast Polymers Pvt. Ltd.",
        "location": "Tuticorin, Tamil Nadu, India",
        "primary_contact": "+91 96458 32154",
        "official_email": "info@twinplastpolymers.com"
    }'::jsonb)
on conflict (key) do update
set value = excluded.value;


-- -------------------------------------------------------------------------------------
-- 2. PRODUCTS (6 Authoritative Products & Exact Verbatim Descriptions)
-- Note on Schema Architecture:
-- The authoritative source provides structured lists (Available Options, Applications,
-- Suitable Surfaces, Features, Customization Capabilities). The current products table
-- schema does not have dedicated columns for these structured arrays. They are preserved
-- in the application/presentation layer and require a future dedicated schema/CMS phase.
-- On conflict, existing media (Cloudinary IDs / URLs) and UI flags are strictly preserved.
-- -------------------------------------------------------------------------------------

-- Product 1: PP Corrugated Sheet
insert into public.products (slug, title, description, category, featured, display_order, active)
values (
    'pp-corrugated-sheets',
    'PP Corrugated Sheet',
    'Lightweight, durable and moisture-resistant polypropylene sheets suitable for a wide variety of industrial, construction, packaging and protection applications.',
    'Corrugated',
    true,
    1,
    true
)
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;

-- Product 2: PP Layer Pad Sheet
insert into public.products (slug, title, description, category, featured, display_order, active)
values (
    'pp-layer-pad-sheets',
    'PP Layer Pad Sheet',
    'Reusable polypropylene layer pads designed primarily for separating and protecting bottles and other packaged products during transportation and storage.',
    'Layer Pad',
    true,
    2,
    true
)
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;

-- Product 3: PP Sunpack Sheet
insert into public.products (slug, title, description, category, featured, display_order, active)
values (
    'pp-sunpack-sheets',
    'PP Sunpack Sheet',
    'Lightweight corrugated PP sheets suitable for printing, advertising, signage and promotional applications.',
    'Sunpack',
    true,
    3,
    true
)
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;

-- Product 4: PP Floor Protection Sheet
insert into public.products (slug, title, description, category, featured, display_order, active)
values (
    'pp-floor-protection-sheets',
    'PP Floor Protection Sheet',
    'Durable PP sheets designed to protect finished surfaces during construction, renovation and interior works.',
    'Floor Protection',
    true,
    4,
    true
)
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;

-- Product 5: PP Corrugated Box
insert into public.products (slug, title, description, category, featured, display_order, active)
values (
    'pp-box-sheets',
    'PP Corrugated Box',
    'Reusable and lightweight PP corrugated boxes manufactured for industrial and commercial packaging requirements.',
    'Box',
    true,
    5,
    true
)
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;

-- Product 6: Customized PP Products
insert into public.products (slug, title, description, category, featured, display_order, active)
values (
    'customized-pp-products',
    'Customized PP Products',
    'We can develop and manufacture customized PP sheet products according to customer requirements.',
    'Customized',
    true,
    6,
    true
)
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;


-- -------------------------------------------------------------------------------------
-- 3. INDUSTRIES (7 Authoritative Application Sectors & Exact Item Lists)
-- On conflict, existing icon_name is preserved.
-- -------------------------------------------------------------------------------------
insert into public.industries (title, description, icon_name, display_order, active)
values
    (
        'Construction',
        'Floor protection, tile protection, surface protection, temporary protection, partitioning.',
        'Building2',
        1,
        true
    ),
    (
        'Packaging',
        'Packaging boxes, layer pads, separators, industrial packaging, returnable packaging.',
        'Package',
        2,
        true
    ),
    (
        'Beverage Industry',
        'Bottle layer pads, bottle separators, transportation protection.',
        'Wine',
        3,
        true
    ),
    (
        'Advertising & Printing',
        'Advertising boards, promotional displays, signage, real estate boards, retail displays.',
        'Printer',
        4,
        true
    ),
    (
        'Industrial',
        'Component separators, protective sheets, industrial packaging, material handling.',
        'Factory',
        5,
        true
    ),
    (
        'Automobile',
        'Component protection, part separators, returnable packaging, transit protection.',
        'Car',
        6,
        true
    ),
    (
        'Agriculture',
        'Packaging, protective applications, material separation.',
        'Sprout',
        7,
        true
    )
on conflict (title) do update set
    description = excluded.description,
    display_order = excluded.display_order,
    active = true;


-- -------------------------------------------------------------------------------------
-- 4. MANUFACTURING PROCESS (9 Exact Authoritative Stage Titles)
-- Important Preservation Rule:
-- The authoritative source provides the 9 stage titles. For new rows, an empty string ''
-- satisfies the NOT NULL constraint on manufacturing_steps.description.
-- On conflict, existing descriptions and icons are explicitly PRESERVED and NOT overwritten.
-- -------------------------------------------------------------------------------------
insert into public.manufacturing_steps (step_number, title, description, icon_name, display_order, active)
values
    (1, 'Raw Material', '', 'Layers', 1, true),
    (2, 'Mixing', '', 'RotateCw', 2, true),
    (3, 'Extrusion', '', 'Cpu', 3, true),
    (4, 'Sheet Formation', '', 'LayoutGrid', 4, true),
    (5, 'Cooling', '', 'ThermometerSnowflake', 5, true),
    (6, 'Cutting', '', 'Scissors', 6, true),
    (7, 'Quality Inspection', '', 'CheckCircle', 7, true),
    (8, 'Packing', '', 'PackageCheck', 8, true),
    (9, 'Dispatch', '', 'Truck', 9, true)
on conflict (step_number) do update set
    title = excluded.title,
    display_order = excluded.display_order,
    active = true;


-- -------------------------------------------------------------------------------------
-- 5. HOMEPAGE SECTIONS CMS (Verbatim Authoritative Content Only)
-- Hero section is intentionally NOT overwritten because it is not defined in source doc.
-- -------------------------------------------------------------------------------------

-- About Section (Complete 4-paragraph source text)
insert into public.homepage_sections (section_key, content)
values (
    'about',
    '{
        "eyebrow": "ABOUT US",
        "heading": "Twinplast Polymers Pvt. Ltd.",
        "subheadline": "Tuticorin, Tamil Nadu, India",
        "content": "Twinplast Polymers Pvt. Ltd. is a manufacturer of high-quality Polypropylene (PP) Corrugated Sheets and PP-based products, serving customers across packaging, construction, industrial, advertising and other commercial applications.\n\nBased in Tuticorin, Tamil Nadu, India, Twinplast specializes in manufacturing versatile PP sheet solutions designed to provide lightweight, durable, reusable and moisture-resistant alternatives for a wide range of applications.\n\nOur product range includes PP Corrugated Sheets, PP Layer Pad Sheets, PP Sunpack Sheets, PP Floor Protection Sheets, PP Corrugated Boxes and customized PP products.\n\nWith a focus on product quality, customization and reliable supply, we work closely with customers to understand their requirements and provide practical PP solutions for their specific applications.",
        "cta_label": "More About Us",
        "cta_url": "/about"
    }'::jsonb
)
on conflict (section_key) do update set
    content = excluded.content,
    updated_at = now();

-- Vision & Mission (Exact Vision, Mission, and 8-item Objectives)
insert into public.homepage_sections (section_key, content)
values (
    'vision_mission',
    '{
        "vision": {
            "title": "Our Vision",
            "content": "To become a trusted and recognized manufacturer of innovative polypropylene sheet and packaging solutions, delivering quality products and sustainable value to customers in India and international markets."
        },
        "mission": {
            "title": "Our Mission",
            "content": "Our mission is to manufacture high-quality PP products that combine durability, functionality and cost-effectiveness while continuously improving our technology, manufacturing processes and customer service."
        },
        "objectives": [
            "Deliver consistent product quality",
            "Develop innovative PP solutions",
            "Provide customized products according to customer requirements",
            "Maintain competitive pricing",
            "Build long-term customer relationships",
            "Ensure reliable and timely supply",
            "Expand our presence in domestic and international markets",
            "Promote reusable and recyclable PP solutions"
        ]
    }'::jsonb
)
on conflict (section_key) do update set
    content = excluded.content,
    updated_at = now();

-- Why Choose Us (Exact 6 Pillars & Verbatim Descriptions, No Invented Overview)
insert into public.homepage_sections (section_key, content)
values (
    'why_choose',
    '{
        "eyebrow": "OUR ADVANTAGES",
        "heading": "Why Choose Us",
        "pillars": [
            {
                "title": "Quality",
                "description": "We focus on maintaining consistent product quality and performance."
            },
            {
                "title": "Customization",
                "description": "Products can be manufactured according to specific customer requirements."
            },
            {
                "title": "Durability",
                "description": "Our PP products are designed for demanding industrial and commercial applications."
            },
            {
                "title": "Cost Effective",
                "description": "We provide practical and economical alternatives for various applications."
            },
            {
                "title": "Reliable Supply",
                "description": "We aim to provide dependable supply for both regular and bulk requirements."
            },
            {
                "title": "Customer Focus",
                "description": "We work closely with customers to understand their application and recommend suitable solutions."
            }
        ]
    }'::jsonb
)
on conflict (section_key) do update set
    content = excluded.content,
    updated_at = now();

-- Quality Commitment (Exact Statement & 7 Monitored Parameters)
insert into public.homepage_sections (section_key, content)
values (
    'quality_commitment',
    '{
        "heading": "Quality Commitment",
        "content": "At Twinplast, quality is an integral part of our manufacturing process.\n\nWe monitor key product parameters such as:\n- Thickness\n- GSM\n- Dimensions\n- Colour consistency\n- Surface finish\n- Strength\n- Overall product quality\n\nOur objective is to provide customers with products that deliver consistent performance and value.",
        "parameters": [
            "Thickness",
            "GSM",
            "Dimensions",
            "Colour consistency",
            "Surface finish",
            "Strength",
            "Overall product quality"
        ]
    }'::jsonb
)
on conflict (section_key) do update set
    content = excluded.content,
    updated_at = now();

-- Markets We Serve (Exact Verbatim Copy & 4 Authoritative Regions)
insert into public.homepage_sections (section_key, content)
values (
    'markets',
    '{
        "heading": "Markets We Serve",
        "content": "We aim to serve customers across:\n\nIndia | Middle East | Asia | International Markets\n\nOur products are suitable for manufacturers, distributors, contractors, packaging companies, construction companies, advertising companies and industrial users.",
        "regions": [
            "India",
            "Middle East",
            "Asia",
            "International Markets"
        ]
    }'::jsonb
)
on conflict (section_key) do update set
    content = excluded.content,
    updated_at = now();

-- Final CTA / Enquiry Section (Exact Copy with Separate Action Prompt)
insert into public.homepage_sections (section_key, content)
values (
    'final_cta',
    '{
        "heading": "Looking for a reliable PP Sheet Solution?",
        "subheadline": "Whether you require PP Corrugated Sheets, Layer Pads, Sunpack Sheets, Floor Protection Sheets, PP Boxes or customized PP products, our team is ready to discuss your requirements.\n\nSend us your requirement today.",
        "primary_cta_label": "Contact Us",
        "primary_cta_url": "/contact",
        "secondary_cta_label": "Request a Quote",
        "secondary_cta_url": "/contact"
    }'::jsonb
)
on conflict (section_key) do update set
    content = excluded.content,
    updated_at = now();
