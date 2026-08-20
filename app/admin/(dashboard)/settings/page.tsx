import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SettingsManager } from '@/components/admin/SettingsManager';

export const metadata: Metadata = {
  title: 'Company Settings | Twinplast Admin',
  description: 'Manage Twinplast global business settings.',
};

export default async function AdminSettingsPage() {
  let settings: { key: string; value: unknown }[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('company_settings')
      .select('*');

    if (!error && data) {
      settings = data;
    }
  } catch {
    settings = [];
  }

  return <SettingsManager initialSettings={settings} />;
}
