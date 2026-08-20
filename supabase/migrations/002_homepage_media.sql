-- Twinplast Polymers Migration: Homepage Media Management Table
-- Safely creates the public.homepage_media table and configures RLS security policies.

-- Create homepage_media table
create table if not exists public.homepage_media (
    id uuid primary key default gen_random_uuid(),
    slot text not null unique,
    image_cloudinary_public_id text,
    image_url text,
    alt_text text,
    updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.homepage_media enable row level security;

-- Indexing for quick slot lookups
create index if not exists idx_homepage_media_slot on public.homepage_media(slot);

-- RLS Policy: Public read-only access
create policy "Public can read homepage media"
    on public.homepage_media
    for select
    using (true);

-- RLS Policy: Admin full management access
create policy "Admins can manage homepage media"
    on public.homepage_media
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));

-- Seed default slots
insert into public.homepage_media (slot, image_cloudinary_public_id, image_url, alt_text)
values 
    ('hero', null, null, 'Durable fluted packaging sheets stacked together'),
    ('about_main', null, null, 'Twinplast Polymers factory facade facade'),
    ('about_secondary_1', null, null, 'Production line extrusion machinery'),
    ('about_secondary_2', null, null, 'Finished stacked polypropylene partition layers'),
    ('cta_background', null, null, 'Industrial PP corrugated sheet background texture')
on conflict (slot) do nothing;
