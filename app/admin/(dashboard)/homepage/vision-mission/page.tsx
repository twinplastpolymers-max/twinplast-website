import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { VisionMissionSection } from '@/components/admin/cms/VisionMissionSection';
import { HomepageSection, HomepageMedia } from '@/types';

export const metadata: Metadata = { title: 'Vision & Mission | Homepage CMS | Twinplast Admin' };

export default async function VisionMissionPage() {
  let section: HomepageSection | undefined;
  let vmMedia: HomepageMedia | undefined;

  try {
    const supabase = await createClient();
    const [{ data: sectionData }, { data: mediaData }] = await Promise.all([
      supabase.from('homepage_sections').select('*').eq('section_key', 'vision_mission').single(),
      supabase.from('homepage_media').select('*').eq('slot', 'vision_mission_image').single(),
    ]);
    if (sectionData) section = sectionData as unknown as HomepageSection;
    if (mediaData) vmMedia = mediaData as unknown as HomepageMedia;
  } catch {}

  return (
    <VisionMissionSection 
      initialSection={section}
      initialImage={{
        publicId: vmMedia?.image_cloudinary_public_id || null,
        url: vmMedia?.image_url || null,
      }}
    />
  );
}

