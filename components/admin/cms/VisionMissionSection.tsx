'use client';

import { useState } from 'react';
import { Save, Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSection, VisionMissionSectionContent } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { ImageContainer } from '@/components/shared/ImageContainer';

const INPUT = 'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white';
const LABEL = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

interface VisionMissionSectionProps {
  initialSection?: HomepageSection;
  initialImage?: { publicId: string | null; url: string | null };
}

export function VisionMissionSection({ 
  initialSection,
  initialImage,
}: VisionMissionSectionProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const data = (initialSection?.content as Record<string, unknown>) || {};
  const visionObj = (data.vision as Record<string, string>) || {};
  const missionObj = (data.mission as Record<string, string>) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [visionTitle, setVisionTitle] = useState<string>(visionObj.title || 'Our Vision');
  const [visionContent, setVisionContent] = useState<string>(visionObj.content || '');
  const [missionTitle, setMissionTitle] = useState<string>(missionObj.title || 'Our Mission');
  const [missionContent, setMissionContent] = useState<string>(missionObj.content || '');

  // Image Upload State
  const [imagePublicId, setImagePublicId] = useState<string>(initialImage?.publicId || '');
  const [imageUrl, setImageUrl] = useState<string>(initialImage?.url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign: { timestamp, folder: 'homepage/vision-mission' } }),
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
      formData.append('folder', 'homepage/vision-mission');

      setUploadProgress(70);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Image upload failed.');
      const result = await res.json();
      setUploadProgress(100);

      setImagePublicId(result.public_id);
      setImageUrl(result.secure_url);

      // Auto-save media to Supabase
      await supabase.from('homepage_media').upsert({
        slot: 'vision_mission_image',
        image_cloudinary_public_id: result.public_id,
        image_url: result.secure_url,
        alt_text: 'Vision and Mission',
      }, { onConflict: 'slot' });

      toast.success('Uploaded', 'Vision & Mission image uploaded and saved.');
    } catch (err) {
      toast.error('Upload Failed', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setImagePublicId('');
    setImageUrl('');
    try {
      await supabase.from('homepage_media').upsert({
        slot: 'vision_mission_image',
        image_cloudinary_public_id: null,
        image_url: null,
      }, { onConflict: 'slot' });
      toast.success('Removed', 'Image removed.');
    } catch {
      toast.error('Error', 'Failed to remove image from database.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: VisionMissionSectionContent = {
        vision: { title: visionTitle, content: visionContent },
        mission: { title: missionTitle, content: missionContent },
      };

      const { error } = await supabase
        .from('homepage_sections')
        .upsert({ section_key: 'vision_mission', content: payload }, { onConflict: 'section_key' });
      if (error) throw error;

      // Ensure media slot is in sync
      if (imagePublicId) {
        await supabase.from('homepage_media').upsert({
          slot: 'vision_mission_image',
          image_cloudinary_public_id: imagePublicId,
          image_url: imageUrl,
          alt_text: 'Vision and Mission',
        }, { onConflict: 'slot' });
      }

      toast.success('Saved', 'Vision & Mission updated.');
    } catch (err) {
      toast.error('Save Failed', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Vision & Mission Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Edit vision and mission statements and photography.</p>
      </div>

      {/* Text Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="v-title" className={LABEL}>Vision Title</label>
          <input id="v-title" type="text" value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} className={INPUT} />
          <label htmlFor="v-content" className={LABEL}>Vision Statement</label>
          <textarea id="v-content" rows={4} value={visionContent} onChange={(e) => setVisionContent(e.target.value)}
            className={`${INPUT} resize-y`} />
        </div>
        <div className="space-y-2">
          <label htmlFor="m-title" className={LABEL}>Mission Title</label>
          <input id="m-title" type="text" value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} className={INPUT} />
          <label htmlFor="m-content" className={LABEL}>Mission Statement</label>
          <textarea id="m-content" rows={4} value={missionContent} onChange={(e) => setMissionContent(e.target.value)}
            className={`${INPUT} resize-y`} />
        </div>
      </div>

      {/* Dedicated Vision & Mission Image Uploader */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Vision & Mission Photograph</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Photograph displayed on the right side of the Vision & Mission section.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50 max-w-xl">
          {imagePublicId ? (
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                <ImageContainer
                  src={imagePublicId}
                  alt="Vision and Mission Preview"
                  aspectRatio="video"
                  fit="cover"
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Change Image</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-lg cursor-pointer bg-white dark:bg-slate-950 transition-colors">
              <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to Upload Image</span>
              <span className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 8MB)</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
            </label>
          )}

          {isUploading && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-blue-600">
                <span>Uploading to Cloudinary...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="pt-6 flex justify-end border-t border-slate-100 dark:border-slate-800">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Vision & Mission
        </button>
      </div>
    </div>
  );
}

