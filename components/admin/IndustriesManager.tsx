'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Building2, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Industry } from '@/types';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { useToast } from '@/components/ui/Toast';

interface IndustriesManagerProps {
  initialIndustries: Industry[];
}

export function IndustriesManager({ initialIndustries }: IndustriesManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [industries, setIndustries] = useState<Industry[]>(initialIndustries);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Building2');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);

  // Cloudinary State
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // UX State
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingIndustry(null);
    setTitle('');
    setDescription('');
    setIconName('Building2');
    setDisplayOrder(industries.length + 1);
    setActive(true);
    setImagePublicId(null);
    setImageUrl(null);
    setUploadState('idle');
    setIsEditing(true);
  };

  const openEditForm = (ind: Industry) => {
    setEditingIndustry(ind);
    setTitle(ind.title);
    setDescription(ind.description);
    setIconName(ind.icon_name || 'Building2');
    setDisplayOrder(ind.display_order);
    setActive(ind.active);
    setImagePublicId(ind.image_cloudinary_public_id);
    setImageUrl(ind.image_url);
    setUploadState('idle');
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState('uploading');

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folderPath = 'industries';

      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign: { timestamp, folder: folderPath } }),
      });

      if (!signRes.ok) throw new Error('Failed to fetch signed upload signature.');

      const { signature } = await signRes.json();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folderPath);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) throw new Error('Image upload failed.');

      const result = await cloudinaryRes.json();
      setImagePublicId(result.public_id);
      setImageUrl(result.secure_url);
      setUploadState('success');
      toast.success('Image uploaded successfully');
    } catch (err) {
      setUploadState('error');
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      toast.error('Upload Error', msg);
    }
  };

  const handleSaveIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!title || !description) {
      toast.error('Validation Error', 'Title and Description are required.');
      setIsSaving(false);
      return;
    }

    const payload = {
      title,
      description,
      icon_name: iconName || null,
      display_order: displayOrder,
      active,
      image_cloudinary_public_id: imagePublicId,
      image_url: imageUrl,
    };

    try {
      if (editingIndustry) {
        const { data, error } = await supabase
          .from('industries')
          .update(payload)
          .eq('id', editingIndustry.id)
          .select()
          .single();

        if (error) throw error;

        setIndustries((prev) =>
          prev.map((i) => (i.id === editingIndustry.id ? (data as Industry) : i))
        );
        toast.success('Industry Updated', `"${title}" has been updated.`);
      } else {
        const { data, error } = await supabase
          .from('industries')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setIndustries((prev) => [...prev, data as Industry]);
        toast.success('Industry Added', `"${title}" has been added.`);
      }

      setIsEditing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save industry record.';
      toast.error('Database Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (ind: Industry) => {
    const newActive = !ind.active;
    try {
      const { error } = await supabase
        .from('industries')
        .update({ active: newActive })
        .eq('id', ind.id);

      if (error) throw error;

      setIndustries((prev) =>
        prev.map((i) => (i.id === ind.id ? { ...i, active: newActive } : i))
      );
      toast.success('Status Updated', `"${ind.title}" is now ${newActive ? 'active' : 'inactive'}.`);
    } catch {
      toast.error('Error', 'Failed to update active status.');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('industries').delete().eq('id', id);
      if (error) throw error;

      setIndustries((prev) => prev.filter((i) => i.id !== id));
      toast.success('Deleted', 'Industry sector record deleted.');
    } catch {
      toast.error('Error', 'Failed to delete industry.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Applications &amp; Industries Served</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage target industrial sectors rendered on the public website.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Industry Sector</span>
          </button>
        )}
      </div>

      {/* Form Area */}
      {isEditing && (
        <form onSubmit={handleSaveIndustry} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingIndustry ? 'Edit Industry Sector' : 'New Industry Sector'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ind-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Industry Name / Title *
              </label>
              <input
                id="ind-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Beverage Industry"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="ind-icon" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Icon Identifier Name
              </label>
              <select
                id="ind-icon"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="Package">Package (Packaging)</option>
                <option value="Wine">Wine / Beverage (Beverage)</option>
                <option value="Building2">Building2 (Construction)</option>
                <option value="Printer">Printer (Advertising &amp; Printing)</option>
                <option value="Factory">Factory (Industrial)</option>
                <option value="Car">Car (Automobile)</option>
                <option value="Sprout">Sprout (Agriculture)</option>
                <option value="Shield">Shield (General Protection)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ind-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description *
            </label>
            <textarea
              id="ind-desc"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Polypropylene layer pad sheets used as separators in product packaging."
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>

          {/* Optional Industry Image Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Optional Sector Image
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4 border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                <ImageContainer src={imagePublicId} alt={title || 'Industry Preview'} aspectRatio="video" />
              </div>
              <div className="sm:col-span-8 space-y-2">
                <div className="relative border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadState === 'uploading'}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {imagePublicId ? 'Change Image' : 'Upload Image'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 5MB)</span>
                  </div>
                </div>
                {imagePublicId && (
                  <button
                    type="button"
                    onClick={() => { setImagePublicId(null); setImageUrl(null); }}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="ind-display-order" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Display Order
              </label>
              <input
                id="ind-display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadState === 'uploading'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Saving...' : 'Save Industry Sector'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Industries List View */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {industries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No industry sectors found. Click &quot;Add Industry Sector&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {industries.map((ind) => (
              <div key={ind.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ind.title}
                      </h3>
                      {ind.active ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleActive(ind)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      ind.active
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {ind.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => openEditForm(ind)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {confirmDeleteId === ind.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(ind.id)}
                        disabled={deletingId === ind.id}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        {deletingId === ind.id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(ind.id)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
