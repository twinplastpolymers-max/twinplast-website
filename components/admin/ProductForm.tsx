'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface ProductFormProps {
  product?: Product | null;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const isEditMode = !!product;

  // Form Fields State
  const [title, setTitle] = useState(product?.title || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [category, setCategory] = useState(product?.category || '');
  const [description, setDescription] = useState(product?.description || '');
  const [displayOrder, setDisplayOrder] = useState(product?.display_order !== undefined ? product.display_order : 0);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [active, setActive] = useState(product?.active !== undefined ? product.active : true);

  // Cloudinary image reference state
  const [imagePublicId, setImagePublicId] = useState<string | null>(product?.image_cloudinary_public_id || null);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url || null);

  // Image Upload UX State
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  
  // Submit state
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper: Slugify title input (only for new products)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditMode) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Secure Image Uploader Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File Type & Size Validations
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadState('error');
      const err = 'Invalid format. Please select a JPG, PNG, or WEBP image.';
      setUploadError(err);
      toast.error('Upload Error', err);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadState('error');
      const err = 'File is too large. Maximum size limit is 5MB.';
      setUploadError(err);
      toast.error('Upload Error', err);
      return;
    }

    setUploadState('uploading');
    setUploadProgress(10);
    setUploadError('');

    try {
      // 2. Fetch secure signed payload from server-only routing endpoint
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folderPath = `products/${slug || 'temp-product'}`;

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
        const errObj = await signRes.json();
        throw new Error(errObj.error || 'Failed to obtain upload signature.');
      }

      const { signature } = await signRes.json();
      setUploadProgress(40);

      // 3. Post payload directly to secure cloud endpoint
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folderPath);

      setUploadProgress(60);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Image upload failed. Please try again.');
      }

      const uploadResult = await cloudinaryRes.json();
      setUploadProgress(90);

      // 4. Update image parameters on success
      setImagePublicId(uploadResult.public_id);
      setImageUrl(uploadResult.secure_url);
      setUploadState('success');
      setUploadProgress(100);
      toast.success('Image uploaded successfully', 'Remember to save your product changes.');
    } catch (err) {
      setUploadState('error');
      const msg = err instanceof Error ? err.message : 'Upload failed. Verify connection.';
      setUploadError(msg);
      toast.error('Image Upload Failed', msg);
    }
  };

  // Submit Handler: Saves product row to Supabase
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError('');
    setSuccessMsg('');

    if (!title || !slug || !category || !description) {
      const err = 'Please complete all required fields.';
      setSubmitError(err);
      toast.error('Validation Error', err);
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        title,
        slug,
        category,
        description,
        display_order: displayOrder,
        featured,
        active,
        image_cloudinary_public_id: imagePublicId,
        image_url: imageUrl,
      };

      let queryError = null;

      if (isEditMode && product) {
        // Update existing row
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);
        queryError = error;
      } else {
        // Check for slug conflicts
        const { data: conflictProduct } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (conflictProduct) {
          const err = `A product with the slug "${slug}" already exists. Slugs must be unique.`;
          setSubmitError(err);
          toast.error('Slug Conflict', err);
          setIsSaving(false);
          return;
        }

        // Insert new row
        const { error } = await supabase
          .from('products')
          .insert([payload]);
        queryError = error;
      }

      if (queryError) {
        setSubmitError(queryError.message);
        toast.error('Failed to Save Product', queryError.message);
      } else {
        const msg = isEditMode ? 'Product updated successfully.' : 'Product created successfully.';
        setSuccessMsg(msg);
        toast.success('Saved Successfully!', msg);
        setTimeout(() => {
          router.push('/admin/products');
          router.refresh();
        }, 1200);
      }
    } catch {
      const connErr = 'Failed to save product due to connection problems.';
      setSubmitError(connErr);
      toast.error('Network Error', connErr);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Back to products list"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isEditMode ? 'Modify specific polymer sheet attributes and images.' : 'Insert a new fluted or layer pad product card.'}
          </p>
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 p-4 text-sm text-red-800 dark:text-red-400 flex items-start gap-2 animate-fade-in">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 p-4 text-sm text-green-800 dark:text-green-400 flex items-start gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Product Fields - 7 Columns */}
        <div className="md:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
          
          <div>
            <label htmlFor="title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Product Title *
            </label>
            <input
              id="title-input"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="slug-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Product URL Slug *
            </label>
            <input
              id="slug-input"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
            />
          </div>

          <div>
            <label htmlFor="category-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Category *
            </label>
            <input
              id="category-input"
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Sunpack, Corrugated, Hollow"
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Product Description *
            </label>
            <textarea
              id="description-input"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="display-order-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Display Order
              </label>
              <input
                id="display-order-input"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex flex-col justify-end space-y-3 pb-2 pl-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Featured Card</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Publish Active</span>
              </label>
            </div>
          </div>

          {/* Action Bar with Immediate Local Feedback near Save Button */}
          <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 mt-2">
            <div className="flex-1 text-xs">
              {isSaving && (
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving product...
                </span>
              )}
              {!isSaving && successMsg && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> {successMsg}
                </span>
              )}
              {!isSaving && submitError && (
                <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold animate-fade-in">
                  <ShieldAlert className="w-4 h-4" /> {submitError}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving || uploadState === 'uploading'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Product...' : 'Save Product'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Image Management - 5 Columns */}
        <div className="md:col-span-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Product Image</h3>
            <p className="text-xs text-muted mt-1 leading-normal">
              Manage the product image displayed on catalog screens.
            </p>
          </div>

          {/* Current / Uploaded Image Preview Frame */}
          <div className="border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Live Preview</span>
            <ImageContainer
              src={imagePublicId}
              alt={title || 'Product Preview'}
              aspectRatio="video"
            />
          </div>

          {/* Uploader Input Trigger */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Change Product Image
            </label>
            
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-6 text-center transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadState === 'uploading'}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Upload image"
              />
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Select a new image
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  JPG, PNG, or WEBP (Max 5MB)
                </span>
              </div>
            </div>

            {/* Upload Status Feedbacks */}
            {uploadState === 'uploading' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-blue-600">
                  <span>Uploading image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 dark:bg-slate-800">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 p-3 text-xs text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Upload complete! Remember to Save changes.</span>
              </div>
            )}

            {uploadState === 'error' && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-3 text-xs text-amber-800 dark:text-amber-400 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Clear Image Action */}
            {imagePublicId && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setImagePublicId(null);
                    setImageUrl(null);
                    setUploadState('idle');
                  }}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:underline cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
