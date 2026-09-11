import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { WhyChooseSection } from '@/components/admin/cms/WhyChooseSection';
import { HomepageSection } from '@/types';

export const metadata: Metadata = { title: 'Why Choose | Homepage CMS | Twinplast Admin' };

export default async function WhyChoosePage() {
  let section: HomepageSection | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('homepage_sections').select('*').eq('section_key', 'why_choose').single();
    if (data) section = data as unknown as HomepageSection;
  } catch {}

  return <WhyChooseSection initialSection={section} />;
}
