import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { IndustriesManager } from '@/components/admin/IndustriesManager';
import { Industry } from '@/types';

export const metadata: Metadata = {
  title: 'Industries Manager | Twinplast Admin',
  description: 'Manage applications and target industries served.',
};

export default async function AdminIndustriesPage() {
  let indList: Industry[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      indList = data as unknown as Industry[];
    }
  } catch {
    indList = [];
  }

  return <IndustriesManager initialIndustries={indList} />;
}
