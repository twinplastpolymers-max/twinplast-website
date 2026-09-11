'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, QualityCommitmentSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';

const INPUT = 'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

export function QualitySection({ initialSection }: { initialSection?: HomepageSection }) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [heading, setHeading] = useState<string>((data.heading as string) || (data.title as string) || 'Quality Commitment');
  const [content, setContent] = useState<string>((data.content as string) || '');
  const [params, setParams] = useState<string[]>(
    (data.parameters as string[]) || (data.standards as string[]) || []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: QualityCommitmentSectionContent = { heading, content, parameters: params };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'quality_commitment', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;
      toast.success('Saved', 'Quality Commitment section updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Quality Commitment Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Edit the quality section heading, body text, and parameters list.</p>
      </div>

      <div>
        <label htmlFor="q-heading" className={LABEL}>Heading</label>
        <input id="q-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="q-content" className={LABEL}>Quality Statement Content</label>
        <textarea id="q-content" rows={4} value={content} onChange={(e) => setContent(e.target.value)}
          className={`${INPUT} resize-y`} />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quality Parameters ({params.length})
          </span>
          <button type="button" onClick={() => setParams([...params, 'New Parameter'])}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add Parameter
          </button>
        </div>
        <div className="space-y-2">
          {params.map((param, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono w-6">{idx + 1}.</span>
              <input type="text" value={param}
                onChange={(e) => { const u = [...params]; u[idx] = e.target.value; setParams(u); }}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              <button type="button" onClick={() => setParams(params.filter((_, i) => i !== idx))}
                className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Quality Section
        </button>
      </div>
    </div>
  );
}
