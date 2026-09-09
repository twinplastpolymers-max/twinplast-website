'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Award, CheckCircle2, Loader2, Upload, X, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Certification } from '@/types';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { useToast } from '@/components/ui/Toast';

interface CertificationsManagerProps {
  initialCertifications: Certification[];
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [credentialType, setCredentialType] = useState<'iso' | 'plexconcil' | 'other'>('iso');
  const [certNumber, setCertNumber] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [scope, setScope] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(true);

  // Image Upload State
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // UX Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingCert(null);
    setTitle('');
    setCredentialType('iso');
    setCertNumber('');
    setIssuingOrg('');
    setScope('');
    setIssueDate('');
    setExpiryDate('');
    setDisplayOrder(certifications.length + 1);
    setActive(true);
    setFeatured(true);
    setImagePublicId(null);
    setImageUrl(null);
    setUploadState('idle');
    setIsEditing(true);
  };

  const openEditForm = (cert: Certification) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setCredentialType(cert.credential_type);
    setCertNumber(cert.certificate_number);
    setIssuingOrg(cert.issuing_organization);
    setScope(cert.scope || '');
    setIssueDate(cert.issue_date || '');
    setExpiryDate(cert.expiry_date || '');
    setDisplayOrder(cert.display_order);
    setActive(cert.active);
    setFeatured(cert.featured);
    setImagePublicId(cert.image_cloudinary_public_id);
    setImageUrl(cert.image_url);
    setUploadState('idle');
    setIsEditing(true);
  };

  // Secure Signed Cloudinary Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadState('error');
      const err = 'Invalid file format. Select JPG, PNG, WEBP, or PDF.';
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

    setUploadState('uploading');
    setUploadProgress(10);
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
      setUploadProgress(40);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folderPath);

      setUploadProgress(70);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Cloudinary upload failed.');
      }

      const uploadResult = await cloudinaryRes.json();
      setUploadProgress(100);

      setImagePublicId(uploadResult.public_id);
      setImageUrl(uploadResult.secure_url);
      setUploadState('success');
      toast.success('Document uploaded successfully');
    } catch (err) {
      setUploadState('error');
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setUploadError(msg);
      toast.error('Upload Failed', msg);
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!title || !certNumber || !issuingOrg) {
      toast.error('Validation Error', 'Title, Certificate Number, and Issuing Organization are required.');
      setIsSaving(false);
      return;
    }

    const payload = {
      title,
      credential_type: credentialType,
      certificate_number: certNumber,
      issuing_organization: issuingOrg,
      scope: scope || null,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null,
      display_order: displayOrder,
      active,
      featured,
      image_cloudinary_public_id: imagePublicId,
      image_url: imageUrl,
    };

    try {
      if (editingCert) {
        // Update existing record
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
        toast.success('Certification Updated', `"${title}" has been updated.`);
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('certifications')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setCertifications((prev) => [...prev, data as Certification]);
        toast.success('Certification Added', `"${title}" has been added.`);
      }

      setIsEditing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save certification.';
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
      toast.success('Status Updated', `"${cert.title}" is now ${newActive ? 'active' : 'inactive'}.`);
    } catch {
      toast.error('Error', 'Failed to update active status.');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', id);
      if (error) throw error;

      setCertifications((prev) => prev.filter((c) => c.id !== id));
      toast.success('Deleted', 'Certification record deleted successfully.');
    } catch {
      toast.error('Error', 'Failed to delete certification.');
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
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Certifications &amp; Trust Credentials</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage verified company certifications (ISO 9001:2015, PLEXCONCIL, etc.) displayed across the website.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        )}
      </div>

      {/* Form Area */}
      {isEditing && (
        <form onSubmit={handleSaveCert} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingCert ? 'Edit Certification' : 'New Certification'}
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
              <label htmlFor="cert-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Title *
              </label>
              <input
                id="cert-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ISO 9001:2015 Quality Management System"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="cred-type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Credential Type *
              </label>
              <select
                id="cred-type"
                value={credentialType}
                onChange={(e) => setCredentialType(e.target.value as 'iso' | 'plexconcil' | 'other')}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="iso">ISO Certification</option>
                <option value="plexconcil">PLEXCONCIL Registration</option>
                <option value="other">Industry / Government Credential</option>
              </select>
            </div>

            <div>
              <label htmlFor="cert-num" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Certificate / Registration Number *
              </label>
              <input
                id="cert-num"
                type="text"
                required
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g. 26UQLO14"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
              />
            </div>

            <div>
              <label htmlFor="issuing-org" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Issuing Organization *
              </label>
              <input
                id="issuing-org"
                type="text"
                required
                value={issuingOrg}
                onChange={(e) => setIssuingOrg(e.target.value)}
                placeholder="e.g. Certification body shown on certificate: AQC"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="issue-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Issue Date
              </label>
              <input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="expiry-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Expiry / Renewal Date
              </label>
              <input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cert-scope" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Scope / Description
            </label>
            <textarea
              id="cert-scope"
              rows={2}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. Manufacturing of PP Corrugated Sheet and Box"
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>

          {/* Certificate Image Document Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Certificate Document / Image
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4 border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                <ImageContainer src={imagePublicId} alt={title || 'Certificate Preview'} aspectRatio="video" />
              </div>
              <div className="sm:col-span-8 space-y-2">
                <div className="relative border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleImageUpload}
                    disabled={uploadState === 'uploading'}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {imagePublicId ? 'Change Certificate Image' : 'Upload Certificate Image'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 10MB)</span>
                  </div>
                </div>
                {uploadState === 'uploading' && (
                  <div className="text-xs text-blue-600 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading document ({uploadProgress}%)...
                  </div>
                )}
                {uploadState === 'error' && uploadError && (
                  <div className="text-xs text-red-600 font-medium">
                    {uploadError}
                  </div>
                )}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label htmlFor="display-order" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Display Order
              </label>
              <input
                id="display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Active</span>
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Featured</span>
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
              <span>{isSaving ? 'Saving...' : 'Save Certification'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Certifications Table / Card View */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {certifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No certifications found. Click &quot;Add Certification&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cert.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {cert.credential_type}
                      </span>
                      {cert.active ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                      No: {cert.certificate_number} &bull; {cert.issuing_organization}
                    </p>

                    {cert.scope && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        Scope: {cert.scope}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400 flex gap-4 pt-0.5">
                      <span>Issued: {cert.issue_date || 'N/A'}</span>
                      <span>Expires: {cert.expiry_date || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {cert.image_url && (
                    <button
                      onClick={() => setPreviewImage(cert.image_url)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                      title="Preview Certificate"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleActive(cert)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      cert.active
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {cert.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => openEditForm(cert)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {confirmDeleteId === cert.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cert.id)}
                        disabled={deletingId === cert.id}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        {deletingId === cert.id ? 'Deleting...' : 'Confirm'}
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
                      onClick={() => setConfirmDeleteId(cert.id)}
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

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-black">
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[70vh]">
              <ImageContainer src={previewImage} alt="Certificate Document Preview" aspectRatio="video" unstyled />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
