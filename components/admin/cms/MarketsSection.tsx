'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, Upload, ImageIcon, X, ArrowUp, ArrowDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, MarketRegionItem, MarketsSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const INPUT = 'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

const DEFAULT_REGIONS: MarketRegionItem[] = [
  { name: 'India', image: '', image_url: '' },
  { name: 'Middle East', image: '', image_url: '' },
  { name: 'Asia', image: '', image_url: '' },
  { name: 'International Markets', image: '', image_url: '' },
];

export function MarketsSection({ initialSection }: { initialSection?: HomepageSection }) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [heading, setHeading] = useState<string>((data.heading as string) || (data.title as string) || 'Markets We Serve');
  const [content, setContent] = useState<string>((data.content as string) || (data.subtitle as string) || '');
  const [bgImage, setBgImage] = useState<string>((data.background_image as string) || '');
  const [bgImageUrl, setBgImageUrl] = useState<string>((data.background_image_url as string) || '');
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  
  // Normalize existing regions data (supports both string[] and MarketRegionItem[])
  const [regions, setRegions] = useState<MarketRegionItem[]>(() => {
    const raw = data.regions;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item) => {
        if (typeof item === 'string') {
          return { name: item, image: '', image_url: '' };
        }
        return {
          name: item.name || '',
          image: item.image || item.image_url || '',
          image_url: item.image_url || '',
        };
      });
    }
    return DEFAULT_REGIONS;
  });

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Format Error', 'Please select a JPG, PNG, WEBP, or SVG image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Size Error', 'File size exceeds 8MB limit.');
      return;
    }

    setIsUploadingBg(true);

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'homepage/markets';

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

      if (!res.ok) throw new Error('Background image upload failed.');
      const result = await res.json();

      setBgImage(result.public_id);
      setBgImageUrl(result.secure_url);
      toast.success('Uploaded', 'Section background image uploaded successfully.');
    } catch (err) {
      toast.error('Upload Failed', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploadingBg(false);
      e.target.value = '';
    }
  };

  const removeBgImage = () => {
    setBgImage('');
    setBgImageUrl('');
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Format Error', 'Please select a JPG, PNG, WEBP, or SVG image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Size Error', 'File size exceeds 8MB limit.');
      return;
    }

    setUploadingIndex(index);

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'homepage/markets';

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

      const updated = [...regions];
      updated[index] = {
        ...updated[index],
        image: result.public_id,
        image_url: result.secure_url,
      };
      setRegions(updated);
      toast.success('Uploaded', `Map image for "${updated[index].name || 'Region'}" uploaded.`);
    } catch (err) {
      toast.error('Upload Failed', err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploadingIndex(null);
      // Reset input value
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updated = [...regions];
    updated[index] = {
      ...updated[index],
      image: '',
      image_url: '',
    };
    setRegions(updated);
  };

  const moveRegion = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= regions.length) return;
    const updated = [...regions];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setRegions(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: MarketsSectionContent = {
        heading,
        content,
        background_image: bgImage || null,
        background_image_url: bgImageUrl || null,
        regions,
      };
      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'markets', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;
      toast.success('Saved', 'Markets section updated successfully.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Markets We Serve Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Edit the section heading, description, and market regions along with their round map images.
        </p>
      </div>

      <div>
        <label htmlFor="mkt-heading" className={LABEL}>Heading</label>
        <input id="mkt-heading" type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={INPUT} />
      </div>

      <div>
        <label htmlFor="mkt-content" className={LABEL}>Market Description</label>
        <textarea id="mkt-content" rows={3} value={content} onChange={(e) => setContent(e.target.value)}
          className={`${INPUT} resize-y`} />
      </div>

      {/* Section Background Image Upload */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Section Background Image
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Upload a background image (e.g. world map graphic, satellite map, or texture) to display across the background of this section.
          </p>
        </div>

        {(() => {
          const resolvedBgUrl = bgImageUrl || (bgImage ? getOptimizedImageUrl(bgImage, { quality: 'good', width: 800 }) : '');

          return (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
              {/* Background Image Preview */}
              <div className="relative w-44 h-24 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center group shrink-0">
                {resolvedBgUrl ? (
                  <>
                    <img
                      src={resolvedBgUrl}
                      alt="Markets Background"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeBgImage}
                      title="Remove background image"
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold gap-1"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </>
                ) : isUploadingBg ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400 text-center px-2">
                    <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    <span className="text-[10px]">No image uploaded</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/50 border border-blue-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shadow-2xs">
                  {isUploadingBg ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {bgImage ? 'Change Background Image' : 'Upload Background Image'}
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={isUploadingBg}
                    onChange={handleBgUpload}
                  />
                </label>
                <p className="text-[11px] text-slate-400">PNG, JPG, SVG or WEBP (Max 8MB)</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Market Regions with Map Image Upload */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Market Regions & Map Images ({regions.length})
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Upload a map image for each region. It will be displayed inside the round badge.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRegions([...regions, { name: 'New Region', image: '', image_url: '' }])}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Region
          </button>
        </div>

        <div className="space-y-3">
          {regions.map((reg, idx) => {
            const previewUrl = reg.image_url || (reg.image ? getOptimizedImageUrl(reg.image, { quality: 'good', width: 200 }) : '');
            const isCurrentlyUploading = uploadingIndex === idx;

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 transition-colors"
              >
                {/* Round Map Image Preview / Upload Area */}
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900/50 shadow-xs flex items-center justify-center overflow-hidden shrink-0 group">
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt={reg.name || 'Map'}
                          className="w-12 h-12 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          title="Remove image"
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : isCurrentlyUploading ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/50 border border-blue-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shadow-2xs">
                      {isCurrentlyUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          {reg.image ? 'Change Map' : 'Upload Map'}
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        className="hidden"
                        disabled={isCurrentlyUploading}
                        onChange={(e) => handleImageUpload(idx, e)}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG or WEBP</p>
                  </div>
                </div>

                {/* Region Name Input */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Region Name
                  </label>
                  <input
                    type="text"
                    value={reg.name}
                    placeholder="e.g. India, Middle East, Asia"
                    onChange={(e) => {
                      const updated = [...regions];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setRegions(updated);
                    }}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                {/* Reorder and Delete Actions */}
                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveRegion(idx, 'up')}
                    title="Move up"
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === regions.length - 1}
                    onClick={() => moveRegion(idx, 'down')}
                    title="Move down"
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegions(regions.filter((_, i) => i !== idx))}
                    title="Delete region"
                    className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleSave}
          disabled={isSaving || uploadingIndex !== null}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Markets Section
        </button>
      </div>
    </div>
  );
}
