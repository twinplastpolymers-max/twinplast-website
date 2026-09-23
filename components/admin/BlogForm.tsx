'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, ShieldAlert, CheckCircle2, Loader2, Sparkles, Globe, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { BlogPost } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface BlogFormProps {
  post?: BlogPost | null;
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const isEditMode = !!post;

  // Form Fields State
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || 'Twinplast Technical Team');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status || 'draft');
  const [publishedAt, setPublishedAt] = useState<string>(
    post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ''
  );

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(post?.seo_description || '');

  // Cloudinary image reference state
  const [imagePublicId, setImagePublicId] = useState<string | null>(post?.featured_image_cloudinary_public_id || null);
  const [imageUrl, setImageUrl] = useState<string | null>(post?.featured_image || null);

  // Image Upload UX State
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Submit state
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper: Slugify title input (only for new posts if not edited)
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

    // 1. Validations
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
      const folderPath = `blog/${slug || 'temp-post'}`;

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

      // 3. Post payload directly to Cloudinary
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

      // 4. Update image state
      setImagePublicId(uploadResult.public_id);
      setImageUrl(uploadResult.secure_url);
      setUploadState('success');
      setUploadProgress(100);
      toast.success('Featured image uploaded', 'Remember to save your article changes.');
    } catch (err) {
      setUploadState('error');
      const msg = err instanceof Error ? err.message : 'Upload failed. Verify connection.';
      setUploadError(msg);
      toast.error('Image Upload Failed', msg);
    }
  };

  // Submit Handler: Saves blog post to Supabase
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError('');
    setSuccessMsg('');

    if (!title.trim() || !slug.trim() || !content.trim()) {
      const err = 'Title, slug, and content are required fields.';
      setSubmitError(err);
      toast.error('Validation Error', err);
      setIsSaving(false);
      return;
    }

    try {
      // If status is published and published_at is not set, default to now
      let finalPublishedAt: string | null = null;
      if (status === 'published') {
        finalPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
      } else if (publishedAt) {
        finalPublishedAt = new Date(publishedAt).toISOString();
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        author: author.trim() || 'Twinplast Technical Team',
        status,
        published_at: finalPublishedAt,
        featured_image: imageUrl,
        featured_image_cloudinary_public_id: imagePublicId,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let queryError = null;

      if (isEditMode && post) {
        // Update existing row
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', post.id);
        queryError = error;
      } else {
        // Check for slug conflicts
        const { data: conflictPost } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', slug.trim())
          .maybeSingle();

        if (conflictPost) {
          const err = `An article with the slug "${slug}" already exists. Slugs must be unique.`;
          setSubmitError(err);
          toast.error('Slug Conflict', err);
          setIsSaving(false);
          return;
        }

        // Insert new row
        const { error } = await supabase
          .from('blog_posts')
          .insert([payload]);
        queryError = error;
      }

      if (queryError) {
        setSubmitError(queryError.message);
        toast.error('Failed to Save Article', queryError.message);
      } else {
        const msg = isEditMode ? 'Article updated successfully.' : 'Article created successfully.';
        setSuccessMsg(msg);
        toast.success('Saved Successfully!', msg);
        setTimeout(() => {
          router.push('/admin/blog');
          router.refresh();
        }, 1200);
      }
    } catch {
      const connErr = 'Failed to save article due to connection problems.';
      setSubmitError(connErr);
      toast.error('Network Error', connErr);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            aria-label="Back to articles list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEditMode ? 'Edit Blog Article' : 'Create New Article'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditMode
                ? 'Update article text, media, metadata, and publication status.'
                : 'Draft or publish an educational article for Twinplast customers.'}
            </p>
          </div>
        </div>

        {isEditMode && post?.status === 'published' && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public</span>
          </Link>
        )}
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

      <form onSubmit={handleSavePost} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Article Body & Content - 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Content Box */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-4">
            <div>
              <label htmlFor="title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Article Title *
              </label>
              <input
                id="title-input"
                type="text"
                required
                placeholder="e.g., Why PP Corrugated Sheets Outperform Traditional Cardboard"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="slug-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                URL Slug *
              </label>
              <input
                id="slug-input"
                type="text"
                required
                placeholder="why-pp-corrugated-sheets-outperform-cardboard"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Accessible at: <code className="text-blue-600">/blog/{slug || '[slug]'}</code>
              </p>
            </div>

            <div>
              <label htmlFor="excerpt-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Short Excerpt
              </label>
              <textarea
                id="excerpt-input"
                rows={2}
                placeholder="Brief 1-2 sentence overview shown in blog cards and search snippets..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-y"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="content-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Article Content *
                </label>
                <span className="text-[11px] text-slate-400">
                  Tip: Supports paragraphs, lists, and markdown
                </span>
              </div>
              <textarea
                id="content-input"
                required
                rows={16}
                placeholder="Write or paste your article content here. You can use markdown headings (## Heading 2), bullet lists (* item), and links ([Text](url))..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-sans resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="seo-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SEO Meta Title
                </label>
                <span className="text-[10px] text-slate-400">{seoTitle.length} / 60 chars</span>
              </div>
              <input
                id="seo-title-input"
                type="text"
                placeholder={title ? `${title} | Twinplast Polymers` : 'Defaults to article title'}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="seo-desc-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SEO Meta Description
                </label>
                <span className="text-[10px] text-slate-400">{seoDescription.length} / 160 chars</span>
              </div>
              <textarea
                id="seo-desc-input"
                rows={3}
                placeholder={excerpt || 'Defaults to article excerpt'}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-y"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Publishing Controls & Featured Image - 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Settings Box */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Publishing Settings
            </h3>

            <div>
              <label htmlFor="status-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Status *
              </label>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>

            <div>
              <label htmlFor="published-at-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Publish Date & Time
              </label>
              <input
                id="published-at-input"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Leave blank to automatically set current date when published.
              </p>
            </div>

            <div>
              <label htmlFor="author-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Author
              </label>
              <input
                id="author-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Save Action Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={isSaving || uploadState === 'uploading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Article...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditMode ? 'Save Changes' : 'Publish Article'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Featured Image
            </h3>

            {/* Preview */}
            <div className="border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Live Preview</span>
              <ImageContainer
                src={imagePublicId || imageUrl}
                alt={title || 'Article Preview'}
                aspectRatio="video"
              />
            </div>

            {/* Upload Trigger */}
            <div className="space-y-3">
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-5 text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadState === 'uploading'}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Upload article image"
                />
                <div className="flex flex-col items-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Select featured image
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG, or WEBP (Max 5MB)
                  </span>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadState === 'uploading' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>Uploading...</span>
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
                <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 p-2.5 text-xs text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Image uploaded! Save your article.</span>
                </div>
              )}

              {uploadState === 'error' && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-2.5 text-xs text-amber-800 dark:text-amber-400 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Clear Image Action */}
              {(imagePublicId || imageUrl) && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setImagePublicId(null);
                      setImageUrl(null);
                      setUploadState('idle');
                    }}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 hover:underline cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
