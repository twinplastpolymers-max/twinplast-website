import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MarketsSection } from '@/components/admin/cms/MarketsSection';
import { HomepageSection } from '@/types';

export const metadata: Metadata = { title: 'Markets | Homepage CMS | Twinplast Admin' };

export default async function MarketsPage() {
  let section: HomepageSection | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('homepage_sections').select('*').eq('section_key', 'markets').single();
    if (data) section = data as unknown as HomepageSection;
  } catch {}

  return <MarketsSection initialSection={section} />;
}
