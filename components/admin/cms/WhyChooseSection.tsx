'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, Upload, ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, WhyChooseSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

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
  const [image, setImage] = useState<string>((data.image as string) || '');
  const [imageUrl, setImageUrl] = useState<string>((data.image_url as string) || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [pillars, setPillars] = useState<Array<{ title: string; description: string }>>(
    (data.pillars as Array<{ title: string; description: string }>) ||
    (data.reasons as Array<{ title: string; description: string }>) || []
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      toast.error('Format Error', 'Please select a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Size Error', 'File size exceeds 8MB limit.');
      return;
    }

    setIsUploadingImage(true);

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'homepage/why_choose';

      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign: { timestamp, folder } }),
      });

      if (!signRes.ok) throw new Error('Failed to get upload signature.');
      const { signature } = await signRes.json();

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Image upload failed.');
      const result = await res.json();

      setImage(result.public_id);
      setImageUrl(result.secure_url);
      toast.success('Uploaded', 'Section image uploaded successfully.');
    } catch (err) {
      toast.error('Upload Failed', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = () => {
    setImage('');
    setImageUrl('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: WhyChooseSectionContent = { eyebrow, heading, image, image_url: imageUrl, pillars };
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
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Edit the eyebrow, heading, image, and value pillars for the Why Choose section.</p>
      </div>

      <div>
        <label htmlFor="why-eyebrow" className={LABEL}>Eyebrow Tag</label>
        <input id="why-eyebrow" type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="why-heading" className={LABEL}>Heading</label>
        <input id="why-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={INPUT} />
      </div>

      {/* Section Image Upload */}
      <div className="space-y-2">
        <label className={LABEL}>Left Column Image</label>
        <div className="flex items-start gap-4">
          <div className="w-40 h-28 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 relative group">
            {imageUrl || image ? (
              <>
                <img
                  src={imageUrl || getOptimizedImageUrl(image, { quality: 'good', width: 320, height: 220 })}
                  alt="Why choose preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="text-center p-2">
                <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">No image uploaded</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors shadow-xs">
              {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Upload className="w-3.5 h-3.5 text-blue-600" />}
              {isUploadingImage ? 'Uploading Image...' : 'Upload Image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Recommended ratio: 4:3 or 1:1. High-resolution JPG, PNG, or WEBP up to 8MB.
            </p>
          </div>
        </div>
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
