-- Twinplast Polymers Migration: 004 Company Settings Private Contact RLS Correction
-- Restricts public SELECT on company_settings so only genuinely public keys are readable by unauthenticated clients.

-- 1. Drop existing public SELECT policy on company_settings
drop policy if exists "Public can read company settings" on public.company_settings;

-- 2. Recreate strict public SELECT policy exposing only public keys
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

-- 3. Ensure admin policy remains active for full CRUD on all settings
drop policy if exists "Admins can manage company settings" on public.company_settings;
create policy "Admins can manage company settings"
    on public.company_settings
    for all
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));
