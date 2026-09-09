import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CertificationsManager } from '@/components/admin/CertificationsManager';
import { Certification } from '@/types';

export const metadata: Metadata = {
  title: 'Certifications Manager | Twinplast Admin',
  description: 'Manage verified ISO 9001:2015 and PLEXCONCIL credentials.',
};

export default async function AdminCertificationsPage() {
  let certList: Certification[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      certList = data as unknown as Certification[];
    }
  } catch {
    certList = [];
  }

  return <CertificationsManager initialCertifications={certList} />;
}
