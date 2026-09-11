import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/admin/cms/HeroSection';
import { HomepageSection, HomepageMedia } from '@/types';

export const metadata: Metadata = { title: 'Hero Section | Homepage CMS | Twinplast Admin' };

export default async function HeroPage() {
  let section: HomepageSection | undefined;
  let heroMedia: HomepageMedia | undefined;

  try {
    const supabase = await createClient();
    const [{ data: secData }, { data: mediaData }] = await Promise.all([
      supabase.from('homepage_sections').select('*').eq('section_key', 'hero').single(),
      supabase.from('homepage_media').select('*').eq('slot', 'hero').single(),
    ]);
    if (secData) section = secData as unknown as HomepageSection;
    if (mediaData) heroMedia = mediaData as unknown as HomepageMedia;
  } catch {}

  return (
    <HeroSection
      initialSection={section}
      initialHeroImage={{
        publicId: heroMedia?.image_cloudinary_public_id || null,
        url: heroMedia?.image_url || null,
      }}
    />
  );
}
