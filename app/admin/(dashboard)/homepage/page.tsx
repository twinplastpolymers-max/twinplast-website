import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { HomepageCMSManager } from '@/components/admin/HomepageCMSManager';
import { HomepageMediaManager } from '@/components/admin/HomepageMediaManager';
import { HomepageSection, HomepageMedia } from '@/types';

export const metadata: Metadata = {
  title: 'Homepage Content & Media CMS | Twinplast Admin',
  description: 'Manage homepage structured content sections and visual photography.',
};

export default async function AdminHomepageCMSPage() {
  let sectionList: HomepageSection[] = [];
  let mediaList: HomepageMedia[] = [];

  try {
    const supabase = await createClient();
    
    // Fetch homepage sections
    const { data: secData } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('section_key', { ascending: true });

    if (secData) {
      sectionList = secData as unknown as HomepageSection[];
    }

    // Fetch homepage media slots
    const { data: medData } = await supabase
      .from('homepage_media')
      .select('*')
      .order('slot', { ascending: true });

    if (medData) {
      mediaList = medData as unknown as HomepageMedia[];
    }
  } catch {
    sectionList = [];
    mediaList = [];
  }

  return (
    <div className="space-y-12">
      <HomepageCMSManager initialSections={sectionList} />
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
        <HomepageMediaManager initialMedia={mediaList} />
      </div>
    </div>
  );
}
