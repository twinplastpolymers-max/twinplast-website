import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ManufacturingManager } from '@/components/admin/ManufacturingManager';
import { ManufacturingStep } from '@/types';

export const metadata: Metadata = {
  title: 'Manufacturing Process Manager | Twinplast Admin',
  description: 'Manage the 9 verified stages of sheet extrusion and fabrication.',
};

export default async function AdminManufacturingPage() {
  let stepList: ManufacturingStep[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('manufacturing_steps')
      .select('*')
      .order('step_number', { ascending: true });

    if (!error && data) {
      stepList = data as unknown as ManufacturingStep[];
    }
  } catch {
    stepList = [];
  }

  return <ManufacturingManager initialSteps={stepList} />;
}
