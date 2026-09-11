import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { QualitySection } from '@/components/admin/cms/QualitySection';
import { HomepageSection } from '@/types';

export const metadata: Metadata = { title: 'Quality Commitment | Homepage CMS | Twinplast Admin' };

export default async function QualityPage() {
  let section: HomepageSection | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('homepage_sections').select('*').eq('section_key', 'quality_commitment').single();
    if (data) section = data as unknown as HomepageSection;
  } catch {}

  return <QualitySection initialSection={section} />;
}
