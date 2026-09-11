import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AboutSection } from '@/components/admin/cms/AboutSection';
import { HomepageSection } from '@/types';

export const metadata: Metadata = { title: 'About Company | Homepage CMS | Twinplast Admin' };

export default async function AboutPage() {
  let section: HomepageSection | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('homepage_sections').select('*').eq('section_key', 'about').single();
    if (data) section = data as unknown as HomepageSection;
  } catch {}

  return <AboutSection initialSection={section} />;
}
