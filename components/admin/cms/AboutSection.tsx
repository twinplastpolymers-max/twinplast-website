'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, AboutSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';

const INPUT = 'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

export function AboutSection({ initialSection }: { initialSection?: HomepageSection }) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [eyebrow, setEyebrow] = useState<string>((data.eyebrow as string) || 'ABOUT TWINPLAST POLYMERS');
  const [heading, setHeading] = useState<string>((data.heading as string) || (data.title as string) || 'Twinplast Polymers Private Limited');
  const [subheadline, setSubheadline] = useState<string>((data.subheadline as string) || (data.subtitle as string) || 'Established in 2021 in Thoothukudi, Tamil Nadu, India.');
  const [content, setContent] = useState<string>((data.content as string) || '');
  const [ctaLabel, setCtaLabel] = useState<string>((data.cta_label as string) || 'Know More About Us');
  const [ctaUrl, setCtaUrl] = useState<string>((data.cta_url as string) || '/about');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: AboutSectionContent = { eyebrow, heading, subheadline, content, cta_label: ctaLabel, cta_url: ctaUrl };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'about', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;
      toast.success('Saved', 'About section updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">About Company Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Edit the About Company section text content displayed on the homepage.</p>
      </div>

      <div>
        <label htmlFor="about-eyebrow" className={LABEL}>Eyebrow Tag</label>
        <input id="about-eyebrow" type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="about-heading" className={LABEL}>Heading</label>
        <input id="about-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="about-sub" className={LABEL}>Subheadline / Plant Location Note</label>
        <input id="about-sub" type="text" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="about-content" className={LABEL}>Company Introduction Content</label>
        <textarea id="about-content" rows={5} value={content} onChange={(e) => setContent(e.target.value)}
          className={`${INPUT} resize-y`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="about-cta-label" className={LABEL}>CTA Button Label</label>
          <input id="about-cta-label" type="text" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="about-cta-url" className={LABEL}>CTA Destination URL</label>
          <input id="about-cta-url" type="text" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className={`${INPUT} font-mono`} />
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save About Section
        </button>
      </div>
    </div>
  );
}
