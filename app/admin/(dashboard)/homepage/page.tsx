import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { HomepageMediaManager } from '@/components/admin/HomepageMediaManager';
import { HomepageMedia } from '@/types';

export const metadata: Metadata = {
  title: 'Homepage Media CMS | Twinplast Admin',
  description: 'Manage homepage visual banners and editorial photography.',
};

export default async function AdminHomepageMediaPage() {
  let mediaList: HomepageMedia[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('homepage_media')
      .select('*')
      .order('slot', { ascending: true });

    if (!error && data) {
      mediaList = data as unknown as HomepageMedia[];
    }
  } catch {
    mediaList = [];
  }

  return <HomepageMediaManager initialMedia={mediaList} />;
}
