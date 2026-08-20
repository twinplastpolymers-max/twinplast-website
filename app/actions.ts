'use server';

import { createClient } from '@/lib/supabase/server';
import { EnquiryInsert } from '@/types';

export async function submitEnquiry(data: EnquiryInsert) {
  try {
    const supabase = (await createClient()) as unknown as {
      from: (table: string) => {
        insert: (data: unknown[]) => Promise<{ error: { message: string } | null }>
      }
    };
    const { error } = await supabase
      .from('enquiries')
      .insert([
        {
          customer_name: data.customer_name,
          phone: data.phone || null,
          email: data.email,
          company: data.company || null,
          message: data.message,
          status: 'new',
        },
      ]);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown Server Error';
    return { success: false, error: errorMessage };
  }
}
