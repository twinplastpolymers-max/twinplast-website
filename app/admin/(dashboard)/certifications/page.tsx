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

    // Delete legacy mock records that have no uploaded image
    await supabase
      .from('certifications')
      .delete()
      .is('image_url', null);

    // Select only actual uploaded certificates
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .not('image_url', 'is', null)
      .order('display_order', { ascending: true });

    if (!error && data) {
      certList = data as unknown as Certification[];
    }
  } catch {
    certList = [];
  }

  return <CertificationsManager initialCertifications={certList} />;
}
