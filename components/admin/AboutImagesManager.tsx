'use client';

import { useState } from 'react';
import { Save, Upload, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { HomepageMedia } from '@/types';
import { useToast } from '@/components/ui/Toast';

export const ABOUT_IMAGE_SLOTS = [
  {
    slot: 'about_main',
    label: 'Facility Main Image',
    aspect: 'video' as const,
    guide: 'Landscape manufacturing plant / facility photograph displayed on the public About page and homepage About section.',
  },
  {
    slot: 'about_secondary_1',
    label: 'Machinery Image',
    aspect: 'square' as const,
    guide: 'Square close-up photograph of high-load sheet extrusion machinery in operation.',
  },
  {
    slot: 'about_secondary_2',
    label: 'Finished Product Image',
    aspect: 'square' as const,
    guide: 'Square close-up photo showing stored, finished layers or B2B corrugated sheet cuts.',
  },
];

interface AboutImagesManagerProps {
  initialMedia: HomepageMedia[];
}

export function AboutImagesManager({ initialMedia }: AboutImagesManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  // Initialize media list with slots
  const [mediaList, setMediaList] = useState<HomepageMedia[]>(() => {
    const list = [...initialMedia];
    ABOUT_IMAGE_SLOTS.forEach((cfg) => {
      if (!list.some((m) => m.slot === cfg.slot)) {
        list.push({
          id: cfg.slot,
          slot: cfg.slot,
          alt_text: cfg.label,
          image_cloudinary_public_id: null,
          image_url: null,
          updated_at: new Date().toISOString(),
        });
      }
    });
    return list;
  });

  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [successSlot, setSuccessSlot] = useState<string | null>(null);

  const getSlotMedia = (slot: string) => mediaList.find((m) => m.slot === slot);

  const handleImageUpload = async (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingSlot(slot);
    setUploadProgress((prev) => ({ ...prev, [slot]: 10 }));

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const folderPath = `homepage/${slot}`;

      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign: { timestamp, folder: folderPath } }),
      });
      if (!signRes.ok) throw new Error('Failed to fetch upload signature.');
      const { signature } = await signRes.json();
      setUploadProgress((prev) => ({ ...prev, [slot]: 40 }));

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folderPath);

      setUploadProgress((prev) => ({ ...prev, [slot]: 70 }));
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Image upload failed.');
      const result = await res.json();
      setUploadProgress((prev) => ({ ...prev, [slot]: 100 }));

      setMediaList((prev) =>
        prev.map((m) =>
          m.slot === slot
            ? { ...m, image_cloudinary_public_id: result.public_id, image_url: result.secure_url }
            : m
        )
      );

      // Auto-save media to Supabase
      await supabase.from('homepage_media').upsert({
        slot,
        image_cloudinary_public_id: result.public_id,
        image_url: result.secure_url,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slot' });

      toast.success('Uploaded', 'Image uploaded and saved successfully.');
    } catch (err) {
      toast.error('Upload Failed', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleAltTextChange = (slot: string, value: string) => {
    setMediaList((prev) =>
      prev.map((m) => (m.slot === slot ? { ...m, alt_text: value } : m))
    );
  };

  const handleSaveSlot = async (slot: string) => {
    const item = getSlotMedia(slot);
    if (!item) return;

    setSavingSlot(slot);
    try {
      const { error } = await supabase.from('homepage_media').upsert({
        slot: item.slot,
        alt_text: item.alt_text,
        image_cloudinary_public_id: item.image_cloudinary_public_id,
        image_url: item.image_url,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slot' });

      if (error) throw error;

      setSuccessSlot(slot);
      setTimeout(() => setSuccessSlot(null), 3000);
      const cfg = ABOUT_IMAGE_SLOTS.find((c) => c.slot === slot);
      toast.success('Saved', `${cfg?.label || slot} updated.`);
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">About Company Images</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Upload and manage the 3 photography assets (facility, machinery, finished product) displayed in the About section.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 w-full">
        {ABOUT_IMAGE_SLOTS.map((cfg) => {
          const media = getSlotMedia(cfg.slot);
          const isUploading = uploadingSlot === cfg.slot;
          const isSaving = savingSlot === cfg.slot;
          const isSuccess = successSlot === cfg.slot;

          return (
            <div
              key={cfg.slot}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-6 shadow-xs w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cfg.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cfg.guide}</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded w-fit">
                  Slot: {cfg.slot}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Image Preview & Upload (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    {media?.image_cloudinary_public_id ? (
                      <ImageContainer
                        src={media.image_cloudinary_public_id}
                        alt={media.alt_text || cfg.label}
                        aspectRatio={cfg.aspect}
                        fit="cover"
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-slate-400 text-center">
                        <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                        <span className="text-xs font-semibold">No Image Uploaded</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Click below to select an asset</span>
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{media?.image_cloudinary_public_id ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleImageUpload(cfg.slot, e)}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-blue-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress[cfg.slot] || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress[cfg.slot] || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Fields (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Accessibility Alt Text / Image Description
                    </label>
                    <input
                      type="text"
                      value={media?.alt_text || ''}
                      onChange={(e) => handleAltTextChange(cfg.slot, e.target.value)}
                      placeholder="Descriptive label for screen readers and SEO"
                      className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      Descriptive text used by screen readers and search engines for accessibility and SEO.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSlot(cfg.slot)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{isSuccess ? 'Saved!' : 'Save Details'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
