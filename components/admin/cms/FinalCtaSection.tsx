'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, FinalCtaSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';

const INPUT = 'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

export function FinalCtaSection({ initialSection }: { initialSection?: HomepageSection }) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [heading, setHeading] = useState<string>((data.heading as string) || (data.headline as string) || "Looking for a Reliable PP Sheet Solution?");
  const [subheadline, setSubheadline] = useState<string>((data.subheadline as string) || '');
  const [primaryLabel, setPrimaryLabel] = useState<string>((data.primary_cta_label as string) || (data.button_text as string) || 'Request a Quote');
  const [primaryUrl, setPrimaryUrl] = useState<string>((data.primary_cta_url as string) || (data.button_url as string) || '/contact');
  const [secondaryLabel, setSecondaryLabel] = useState<string>((data.secondary_cta_label as string) || 'Contact Us');
  const [secondaryUrl, setSecondaryUrl] = useState<string>((data.secondary_cta_url as string) || '/contact');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: FinalCtaSectionContent = {
        heading, subheadline,
        primary_cta_label: primaryLabel, primary_cta_url: primaryUrl,
        secondary_cta_label: secondaryLabel, secondary_cta_url: secondaryUrl,
      };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'final_cta', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;
      toast.success('Saved', 'Final CTA section updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Final CTA Banner Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Edit the bottom CTA banner heading, subheadline, and button labels & URLs.</p>
      </div>

      <div>
        <label htmlFor="cta-heading" className={LABEL}>Heading</label>
        <input id="cta-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="cta-sub" className={LABEL}>Supporting Subheadline</label>
        <textarea id="cta-sub" rows={3} value={subheadline} onChange={(e) => setSubheadline(e.target.value)}
          className={`${INPUT} resize-y`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cta-p-label" className={LABEL}>Primary CTA Label</label>
          <input id="cta-p-label" type="text" value={primaryLabel} onChange={(e) => setPrimaryLabel(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="cta-p-url" className={LABEL}>Primary CTA URL</label>
          <input id="cta-p-url" type="text" value={primaryUrl} onChange={(e) => setPrimaryUrl(e.target.value)} className={`${INPUT} font-mono`} />
        </div>
        <div>
          <label htmlFor="cta-s-label" className={LABEL}>Secondary CTA Label</label>
          <input id="cta-s-label" type="text" value={secondaryLabel} onChange={(e) => setSecondaryLabel(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="cta-s-url" className={LABEL}>Secondary CTA URL</label>
          <input id="cta-s-url" type="text" value={secondaryUrl} onChange={(e) => setSecondaryUrl(e.target.value)} className={`${INPUT} font-mono`} />
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Final CTA Section
        </button>
      </div>
    </div>
  );
}
