-- Twinplast Polymers Migration: 005 Public RLS Policy Update for WhatsApp & Social Media Links
-- This allows unauthenticated / public visitors (e.g. Incognito mode) to read whatsapp_number, public_whatsapp, and social links.

DROP POLICY IF EXISTS "Public can read company settings" ON public.company_settings;

CREATE POLICY "Public can read company settings"
    ON public.company_settings
    FOR SELECT
    USING (key IN (
        'company_name',
        'public_phone',
        'primary_phone',
        'public_whatsapp',
        'whatsapp_number',
        'secondary_phone',
        'public_email',
        'official_email',
        'public_address',
        'website_metadata',
        'social_links',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'business_info'
    ));
