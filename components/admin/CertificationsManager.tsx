'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Award, CheckCircle2, Loader2, Upload, X, Eye, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Certification } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface CertificationsManagerProps {
  initialCertifications: Certification[];
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [certifications, setCertifications] = useState<Certification[]>(
    initialCertifications.filter((c) => Boolean(c.image_url))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // Simplified Form State: Image + Optional Title Only
  const [title, setTitle] = useState('');
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // UX Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingCert(null);
    setTitle('');
    setImagePublicId(null);
    setImageUrl(null);
    setUploadState('idle');
    setUploadError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingCert(cert);
    setTitle(cert.title || '');
    setImagePublicId(cert.image_cloudinary_public_id);
    setImageUrl(cert.image_url);
    setUploadState('idle');
    setUploadError('');
    setIsModalOpen(true);
  };

  // Secure Signed Cloudinary Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadState('error');
      const err = 'Please select a valid image file (JPG, PNG, or WEBP).';
      setUploadError(err);
      toast.error('Upload Error', err);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadState('error');
      const err = 'File size exceeds 10MB limit.';
      setUploadError(err);
      toast.error('Upload Error', err);
      return;
    }

    // Auto-fill title if empty
    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(fileName);
    }

    setUploadState('uploading');
    setUploadProgress(20);
    setUploadError('');

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folderPath = 'certifications';

      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paramsToSign: { timestamp, folder: folderPath },
        }),
      });

      if (!signRes.ok) {
        throw new Error('Failed to obtain secure upload signature.');
      }

      const { signature } = await signRes.json();
      setUploadProgress(50);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folderPath);

      setUploadProgress(75);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Cloudinary image upload failed.');
      }

      const uploadResult = await cloudinaryRes.json();
      setUploadProgress(100);

      setImagePublicId(uploadResult.public_id);
      setImageUrl(uploadResult.secure_url);
      setUploadState('success');
      toast.success('Certificate image uploaded');
    } catch (err) {
      setUploadState('error');
      const msg = err instanceof Error ? err.message : 'Image upload failed.';
      setUploadError(msg);
      toast.error('Upload Failed', msg);
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!imageUrl) {
      toast.error('Validation Error', 'Please select and upload a certificate image.');
      setIsSaving(false);
      return;
    }

    const certTitle = title.trim() || 'Certificate';

    const payload = {
      title: certTitle,
      image_url: imageUrl,
      image_cloudinary_public_id: imagePublicId,
      active: editingCert ? editingCert.active : true,
      display_order: editingCert ? editingCert.display_order : certifications.length + 1,
      // Backward-compatible defaults for legacy DB constraints
      credential_type: 'other',
      certificate_number: '',
      issuing_organization: '',
    };

    try {
      if (editingCert) {
        const { data, error } = await supabase
          .from('certifications')
          .update(payload)
          .eq('id', editingCert.id)
          .select()
          .single();

        if (error) throw error;

        setCertifications((prev) =>
          prev.map((c) => (c.id === editingCert.id ? (data as Certification) : c))
        );
        toast.success('Certificate Updated', `"${certTitle}" has been saved.`);
      } else {
        const { data, error } = await supabase
          .from('certifications')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setCertifications((prev) => [...prev, data as Certification]);
        toast.success('Certificate Added', `"${certTitle}" has been added.`);
      }

      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save certificate.';
      toast.error('Database Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cert: Certification) => {
    const newActive = !cert.active;
    try {
      const { error } = await supabase
        .from('certifications')
        .update({ active: newActive })
        .eq('id', cert.id);

      if (error) throw error;

      setCertifications((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, active: newActive } : c))
      );
      toast.success('Status Updated', `"${cert.title || 'Certificate'}" is now ${newActive ? 'active' : 'inactive'}.`);
    } catch {
      toast.error('Error', 'Failed to update active status.');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCertifications((prev) => prev.filter((c) => c.id !== id));
      toast.success('Certificate Removed', 'The certificate has been deleted.');
    } catch {
      toast.error('Delete Failed', 'Could not delete certificate.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-normal mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Quality Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 dark:text-white">
            Certifications & Trust Credentials
          </h1>
          <p className="mt-1.5 text-sm font-normal text-slate-500 dark:text-slate-400 max-w-2xl">
            Upload and manage verified company certificate images displayed on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* ── Certificates Gallery Grid ── */}
      {certifications.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-base font-medium text-slate-800 dark:text-slate-200">
            No certificates uploaded yet
          </p>
          <p className="text-xs font-normal text-slate-400 mt-1 max-w-md mx-auto">
            Click the button below to upload an image of your ISO, PLEXCONCIL, or quality certificates.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Certificate</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-900">
                {cert.image_url ? (
                  <div className="relative w-full h-full cursor-pointer" onClick={() => setPreviewImageUrl(cert.image_url)}>
                    <Image
                      src={cert.image_url}
                      alt={cert.title || 'Certificate'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/90 text-slate-800 shadow-sm">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 p-4">
                    <Award className="w-8 h-8 text-slate-300" />
                    <span className="text-[11px] font-normal">No image attached</span>
                  </div>
                )}

                {/* Status Pill on thumbnail */}
                <div className="absolute top-2.5 right-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(cert)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-normal tracking-wide transition-colors ${
                      cert.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {cert.active ? 'Active' : 'Hidden'}
                  </button>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4">
                <h3 className="text-sm font-normal text-slate-900 dark:text-white truncate" title={cert.title || 'Certificate'}>
                  {cert.title || 'Certificate Image'}
                </h3>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => openEditModal(cert)}
                    className="inline-flex items-center gap-1 text-xs font-normal text-slate-600 hover:text-blue-600 transition-colors p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {confirmDeleteId === cert.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDelete(cert.id)}
                        disabled={deletingId === cert.id}
                        className="px-2 py-0.5 rounded text-[11px] font-normal bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === cert.id ? '...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(cert.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Simplified Image Upload Modal (Image + Title Only) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-normal text-slate-900 dark:text-white">
                    {editingCert ? 'Edit Certificate' : 'Upload Certificate Image'}
                  </h2>
                  <p className="text-xs font-normal text-slate-400">
                    Upload image document
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCert} className="space-y-5">
              
              {/* Image Upload Box */}
              <div>
                <label className="block text-xs font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Certificate Document Image <span className="text-red-500">*</span>
                </label>

                {imageUrl ? (
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2">
                    <Image
                      src={imageUrl}
                      alt="Certificate Preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl(null);
                        setImagePublicId(null);
                        setUploadState('idle');
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                      title="Remove and replace image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleImageUpload}
                      disabled={uploadState === 'uploading'}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />

                    {uploadState === 'uploading' ? (
                      <div className="flex flex-col items-center gap-2 text-blue-600">
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span className="text-xs font-normal">Uploading image... {uploadProgress}%</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-normal text-slate-700 dark:text-slate-300">
                          Click to select or drag & drop certificate image
                        </p>
                        <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                          Supports JPG, PNG, WEBP (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs font-normal text-red-500 mt-1.5">{uploadError}</p>
                )}
              </div>

              {/* Title / Label Input */}
              <div>
                <label className="block text-xs font-normal text-slate-700 dark:text-slate-300 mb-1.5">
                  Certificate Name / Label <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ISO 9001:2015 Quality Certificate"
                  className="w-full px-3.5 py-2.5 text-xs font-normal rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-normal rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadState === 'uploading' || !imageUrl}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-normal text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCert ? 'Save Changes' : 'Add Certificate'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Full Image Preview Modal ── */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-[80vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-4">
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={previewImageUrl}
                alt="Full Certificate Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
