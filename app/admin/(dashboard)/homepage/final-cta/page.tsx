import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { FinalCtaSection } from '@/components/admin/cms/FinalCtaSection';
import { HomepageSection } from '@/types';

export const metadata: Metadata = { title: 'Final CTA | Homepage CMS | Twinplast Admin' };

export default async function FinalCtaPage() {
  let section: HomepageSection | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('homepage_sections').select('*').eq('section_key', 'final_cta').single();
    if (data) section = data as unknown as HomepageSection;
  } catch {}

  return <FinalCtaSection initialSection={section} />;
}
