import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AboutImagesManager } from '@/components/admin/AboutImagesManager';
import { HomepageMedia } from '@/types';

export const metadata: Metadata = { title: 'About Company Images | Homepage CMS | Twinplast Admin' };

export default async function AboutImagesPage() {
  let mediaList: HomepageMedia[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('homepage_media').select('*').order('slot', { ascending: true });
    if (data) mediaList = data as unknown as HomepageMedia[];
  } catch {}

  return <AboutImagesManager initialMedia={mediaList} />;
}

