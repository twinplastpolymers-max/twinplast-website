-- Twinplast Polymers Migration: 007_create_blog_posts.sql
-- Creates the blog_posts table with RLS policies and indexing for the blog system.

create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    excerpt text,
    content text not null,
    featured_image text,
    featured_image_cloudinary_public_id text,
    author text default 'Twinplast Technical Team',
    published_at timestamptz,
    status text not null default 'draft' check (status in ('draft', 'published')),
    seo_title text,
    seo_description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at desc);

-- Enable Row Level Security
alter table public.blog_posts enable row level security;

-- Drop existing policies if any
drop policy if exists "Public can view published blog posts" on public.blog_posts;
drop policy if exists "Admins can manage blog posts" on public.blog_posts;

-- Policy 1: Public can view published blog posts
create policy "Public can view published blog posts"
    on public.blog_posts
    for select
    using (status = 'published');

-- Policy 2: Admins can perform all operations (select, insert, update, delete)
create policy "Admins can manage blog posts"
    on public.blog_posts
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));
