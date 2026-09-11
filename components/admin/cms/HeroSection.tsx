'use client';

import { useState } from 'react';
import { Save, Loader2, Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, HeroSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const INPUT = 'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

interface Props {
  initialSection?: HomepageSection;
  initialHeroImage?: { publicId: string | null; url: string | null };
}

export function HeroSection({ initialSection, initialHeroImage }: Props) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bgError, setBgError] = useState('');

  const [bgImage, setBgImage] = useState<string>((data.background_image as string) || initialHeroImage?.publicId || '');
  const [bgImageUrl, setBgImageUrl] = useState<string>((data.background_image_url as string) || initialHeroImage?.url || '');
  const [subheading, setSubheading] = useState<string>((data.subheading as string) || (data.eyebrow as string) || 'DURABLE · VERSATILE · RELIABLE');
  const [heading, setHeading] = useState<string>((data.heading as string) || (data.headline as string) || 'Polypropylene Sheets & PP Product Manufacturer');
  const [shortDescription, setShortDescription] = useState<string>((data.short_description as string) || (data.subheadline as string) || 'High-quality polypropylene sheets and PP products engineered for diverse industrial applications.');

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      setBgError('Format error. Select JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setBgError('File size exceeds 8MB limit.');
      return;
    }

    setIsUploadingBg(true);
    setUploadProgress(10);
    setBgError('');

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign: { timestamp, folder: 'homepage/hero' } }),
      });
      if (!signRes.ok) throw new Error('Failed to get upload signature.');
      const { signature } = await signRes.json();
      setUploadProgress(40);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', 'homepage/hero');

      setUploadProgress(70);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Image upload failed.');
      const result = await res.json();
      setUploadProgress(100);
      setBgImage(result.public_id);
      setBgImageUrl(result.secure_url);
      toast.success('Uploaded', 'Click "Save Hero Section" to persist changes.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setBgError(msg);
      toast.error('Upload Failed', msg);
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: HeroSectionContent = {
        background_image: bgImage || null,
        background_image_url: bgImageUrl || null,
        subheading, heading, short_description: shortDescription,
        eyebrow: subheading, headline: heading, subheadline: shortDescription,
        primary_cta_label: 'Enquire Now', primary_cta_url: '/contact',
        secondary_cta_label: 'Explore Products', secondary_cta_url: '/products',
      };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'hero', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;

      // Sync hero media slot
      await supabase.from('homepage_media').upsert(
        { slot: 'hero', image_cloudinary_public_id: bgImage || null, image_url: bgImageUrl || null, alt_text: heading || 'Hero Background' },
        { onConflict: 'slot' }
      );

      toast.success('Saved', 'Hero section updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Hero Section Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload background image, set subheading, heading, and short description.
        </p>
      </div>

      {/* Background Image */}
      <div className="space-y-3">
        <label className={LABEL}>Background Image Upload</label>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
          {bgImage || bgImageUrl ? (
            <div className="space-y-3">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                <img
                  src={bgImageUrl || getOptimizedImageUrl(bgImage, { quality: 'good', width: 800 })}
                  alt="Hero Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-3 text-[11px] font-medium text-white/90 bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs">
                  Hero Background Preview
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isUploadingBg ? 'Uploading...' : 'Change Image'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBgUpload} disabled={isUploadingBg} className="hidden" />
                </label>
                <button type="button" onClick={() => { setBgImage(''); setBgImageUrl(''); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload background image for the hero section</p>
              <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, or WEBP up to 8MB</p>
              <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingBg ? 'Uploading...' : 'Select & Upload'}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBgUpload} disabled={isUploadingBg} className="hidden" />
              </label>
            </div>
          )}

          {isUploadingBg && (
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-blue-600 font-medium">
                <span>Uploading...</span><span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
          {bgError && (
            <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{bgError}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="hero-subheading" className={LABEL}>Subheading</label>
        <input id="hero-subheading" type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)}
          placeholder="e.g. DURABLE · VERSATILE · RELIABLE" className={INPUT} />
      </div>

      <div>
        <label htmlFor="hero-heading" className={LABEL}>Heading *</label>
        <input id="hero-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Polypropylene Sheets & PP Product Manufacturer" className={`${INPUT} font-semibold`} />
      </div>

      <div>
        <label htmlFor="hero-desc" className={LABEL}>Short Description</label>
        <textarea id="hero-desc" rows={4} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Brief description of your products..." className={`${INPUT} resize-y leading-relaxed`} />
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Hero Section
        </button>
      </div>
    </div>
  );
}
