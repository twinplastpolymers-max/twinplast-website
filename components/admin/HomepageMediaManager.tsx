'use client';

import { useState } from 'react';
import { Save, Upload, X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { HomepageMedia } from '@/types';

interface HomepageMediaManagerProps {
  initialMedia: HomepageMedia[];
}

export function HomepageMediaManager({ initialMedia }: HomepageMediaManagerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  // Track media lists
  const [mediaList, setMediaList] = useState<HomepageMedia[]>(initialMedia);

  // Loaders and feedbacks
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  // Find media row by slot name helper
  const getSlotMedia = (slot: string) => {
    return mediaList.find((m) => m.slot === slot);
  };

  // Upload handler for a specific slot
  const handleImageUpload = async (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File Type & Size Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [slot]: 'Format error. Select JPG, PNG, or WEBP.' }));
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, [slot]: 'File size exceeds 5MB limit.' }));
      return;
    }

    setUploadingSlot(slot);
    setUploadProgress((prev) => ({ ...prev, [slot]: 10 }));
    setErrors((prev) => ({ ...prev, [slot]: '' }));
    setSuccessMsg('');

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folderPath = `homepage/${slot}`;

      // 2. Obtain signature
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paramsToSign: {
            timestamp,
            folder: folderPath,
          },
        }),
      });

      if (!signRes.ok) {
        throw new Error('Failed to fetch signed secure upload signature.');
      }

      const { signature } = await signRes.json();
      setUploadProgress((prev) => ({ ...prev, [slot]: 40 }));

      // 3. Post to Cloudinary
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folderPath);

      setUploadProgress((prev) => ({ ...prev, [slot]: 70 }));

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Upload to Cloudinary failed.');
      }

      const uploadResult = await cloudinaryRes.json();
      setUploadProgress((prev) => ({ ...prev, [slot]: 100 }));

      // 4. Update local state list
      setMediaList((prev) =>
        prev.map((m) =>
          m.slot === slot
            ? {
                ...m,
                image_cloudinary_public_id: uploadResult.public_id,
                image_url: uploadResult.secure_url,
              }
            : m
        )
      );
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [slot]: err instanceof Error ? err.message : 'Asset upload failed.',
      }));
    } finally {
      setUploadingSlot(null);
    }
  };

  // Clear slot image helper
  const handleClearImage = (slot: string) => {
    setMediaList((prev) =>
      prev.map((m) =>
        m.slot === slot
          ? { ...m, image_cloudinary_public_id: null, image_url: null }
          : m
      )
    );
    setSuccessMsg('');
  };

  // Alt Text changer helper
  const handleAltTextChange = (slot: string, text: string) => {
    setMediaList((prev) =>
      prev.map((m) => (m.slot === slot ? { ...m, alt_text: text } : m))
    );
    setSuccessMsg('');
  };

  // Database Save slot handler
  const handleSaveSlot = async (slot: string) => {
    const slotMedia = getSlotMedia(slot);
    if (!slotMedia) return;

    setSavingSlot(slot);
    setSuccessMsg('');
    setErrors((prev) => ({ ...prev, [slot]: '' }));

    try {
      const payload = {
        image_cloudinary_public_id: slotMedia.image_cloudinary_public_id,
        image_url: slotMedia.image_url,
        alt_text: slotMedia.alt_text,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('homepage_media')
        .update(payload)
        .eq('slot', slot);

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMsg(`Homepage slot "${slot.replace('_', ' ')}" updated successfully.`);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [slot]: err instanceof Error ? err.message : 'Save query failed.',
      }));
    } finally {
      setSavingSlot(null);
    }
  };

  // Layout slots details
  const slotConfigs = [
    {
      slot: 'hero',
      label: 'Homepage Hero Image',
      aspect: 'video' as const,
      guide: 'Wide landscape photograph representing high-grade polymer product stacks or plant floor settings.',
    },
    {
      slot: 'about_main',
      label: 'About Main Facility Image',
      aspect: 'video' as const,
      guide: 'Large landscape building facade or structural factory layout photo.',
    },
    {
      slot: 'about_secondary_1',
      label: 'About Machinery Image',
      aspect: 'square' as const,
      guide: 'Square close-up photograph of high-load sheet extrusion machinery in operation.',
    },
    {
      slot: 'about_secondary_2',
      label: 'About Finished Product Image',
      aspect: 'square' as const,
      guide: 'Square close-up photo showing stored, finished layers or B2B corrugated sheet cuts.',
    },
    {
      slot: 'cta_background',
      label: 'CTA Industrial Sheet Image',
      aspect: 'video' as const,
      guide: 'Wide background photograph with smooth patterns and space to overlay navy gradients and white texts.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Homepage Media Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload and configure rich-media assets displayed on the public site landing homepage.
        </p>
      </div>

      {successMsg && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 p-4 text-sm text-green-800 dark:text-green-400 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Slots List Layout */}
      <div className="space-y-6">
        {slotConfigs.map((cfg) => {
          const media = getSlotMedia(cfg.slot);
          const hasError = errors[cfg.slot];
          const isUploading = uploadingSlot === cfg.slot;
          const isSaving = savingSlot === cfg.slot;

          return (
            <div
              key={cfg.slot}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Form Settings - 7 Cols */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {cfg.label}
                  </h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {cfg.guide}
                  </p>
                </div>

                {/* Alt text field */}
                <div>
                  <label htmlFor={`alt-${cfg.slot}`} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Accessibility Alt Text
                  </label>
                  <input
                    id={`alt-${cfg.slot}`}
                    type="text"
                    value={media?.alt_text || ''}
                    onChange={(e) => handleAltTextChange(cfg.slot, e.target.value)}
                    disabled={isSaving || isUploading}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    placeholder="e.g. Polypropylene hollow layer pads stacked in Thoothukudi factory floor"
                  />
                </div>

                {/* Error messages */}
                {hasError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 p-3 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{hasError}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 flex justify-start gap-4">
                  <button
                    onClick={() => handleSaveSlot(cfg.slot)}
                    disabled={isSaving || isUploading}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Previews and uploads - 5 Cols */}
              <div className="md:col-span-5 space-y-4">
                
                {/* Live Preview Container */}
                <div className="border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Live Preview ({cfg.aspect})
                  </span>
                  <ImageContainer
                    src={media?.image_cloudinary_public_id}
                    alt={media?.alt_text || cfg.label}
                    aspectRatio={cfg.aspect}
                  />
                </div>

                {/* Uploader Input trigger */}
                <div className="space-y-3">
                  <div className="relative border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-4 text-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(cfg.slot, e)}
                      disabled={isSaving || isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      aria-label={`Upload image for ${cfg.label}`}
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {media?.image_cloudinary_public_id ? 'Change Image' : 'Select Image'}
                      </span>
                    </div>
                  </div>

                  {/* Upload Progress Loader */}
                  {isUploading && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-blue-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress[cfg.slot] || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 dark:bg-slate-800">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress[cfg.slot] || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Clear Image Trigger */}
                  {media?.image_cloudinary_public_id && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleClearImage(cfg.slot)}
                        disabled={isSaving || isUploading}
                        type="button"
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove Reference</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
