'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, StatisticsSectionContent, StatisticItem } from '@/types';
import { useToast } from '@/components/ui/Toast';

const INPUT = 'block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';

export function StatisticsSection({ initialSection }: { initialSection?: HomepageSection }) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<StatisticItem[]>((data.stats as StatisticItem[]) || []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: StatisticsSectionContent = { stats };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'statistics', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;
      toast.success('Saved', 'Statistics section updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Statistics Section Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Add stat cards shown in the blue statistics strip on the homepage. Each card has a count value, heading, and small description.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Stat Cards ({stats.length})
          </span>
          <button type="button"
            onClick={() => setStats([...stats, { count: '', heading: '', description: '' }])}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        </div>

        {stats.length === 0 && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No stat cards yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">Click "Add Stat" to create the first one.</p>
          </div>
        )}

        <div className="space-y-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Stat #{idx + 1}</span>
                <button type="button"
                  onClick={() => setStats(stats.filter((_, i) => i !== idx))}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Count / Value</label>
                  <input type="text" value={stat.count}
                    onChange={(e) => { const u = [...stats]; u[idx] = { ...u[idx], count: e.target.value }; setStats(u); }}
                    placeholder="e.g. 500+, 10 MT, 99%"
                    className={`${INPUT} font-bold`} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Heading</label>
                  <input type="text" value={stat.heading}
                    onChange={(e) => { const u = [...stats]; u[idx] = { ...u[idx], heading: e.target.value }; setStats(u); }}
                    placeholder="e.g. Products Manufactured"
                    className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Small Description</label>
                <input type="text" value={stat.description}
                  onChange={(e) => { const u = [...stats]; u[idx] = { ...u[idx], description: e.target.value }; setStats(u); }}
                  placeholder="e.g. Across diverse industrial sectors"
                  className={INPUT} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Statistics Section
        </button>
      </div>
    </div>
  );
}
