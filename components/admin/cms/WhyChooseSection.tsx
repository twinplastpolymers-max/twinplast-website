'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, WhyChooseSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';

const INPUT = 'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

export function WhyChooseSection({ initialSection }: { initialSection?: HomepageSection }) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [eyebrow, setEyebrow] = useState<string>((data.eyebrow as string) || 'WHY CHOOSE TWINPLAST POLYMERS');
  const [heading, setHeading] = useState<string>((data.heading as string) || (data.title as string) || 'Why Choose Twinplast');
  const [pillars, setPillars] = useState<Array<{ title: string; description: string }>>(
    (data.pillars as Array<{ title: string; description: string }>) ||
    (data.reasons as Array<{ title: string; description: string }>) || []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: WhyChooseSectionContent = { eyebrow, heading, pillars };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'why_choose', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;
      toast.success('Saved', 'Why Choose section updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Why Choose Section Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Edit the eyebrow, heading, and value pillars for the Why Choose section.</p>
      </div>

      <div>
        <label htmlFor="why-eyebrow" className={LABEL}>Eyebrow Tag</label>
        <input id="why-eyebrow" type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="why-heading" className={LABEL}>Heading</label>
        <input id="why-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={INPUT} />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Value Pillars ({pillars.length})
          </span>
          <button type="button"
            onClick={() => setPillars([...pillars, { title: 'New Pillar', description: 'Pillar description' }])}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add Pillar
          </button>
        </div>

        <div className="space-y-3">
          {pillars.map((pil, idx) => (
            <div key={idx} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pillar {idx + 1}</span>
                <button type="button" onClick={() => setPillars(pillars.filter((_, i) => i !== idx))}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
              <input type="text" value={pil.title}
                onChange={(e) => { const u = [...pillars]; u[idx] = { ...u[idx], title: e.target.value }; setPillars(u); }}
                placeholder="Title"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              <textarea rows={2} value={pil.description}
                onChange={(e) => { const u = [...pillars]; u[idx] = { ...u[idx], description: e.target.value }; setPillars(u); }}
                placeholder="Description"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Why Choose Section
        </button>
      </div>
    </div>
  );
}
