import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { EnquiryManager } from '@/components/admin/EnquiryManager';
import { Enquiry } from '@/types';

export const metadata: Metadata = {
  title: 'Client Enquiries | Twinplast Admin',
  description: 'View and process incoming B2B business inquiries.',
};

export default async function AdminEnquiriesPage() {
  let enquiries: Enquiry[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      enquiries = data as unknown as Enquiry[];
    }
  } catch {
    enquiries = [];
  }

  return <EnquiryManager initialEnquiries={enquiries} />;
}
