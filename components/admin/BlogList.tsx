'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Trash2, Edit, ExternalLink, ShieldAlert, BookOpen, Calendar, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { ImageContainer } from '@/components/shared/ImageContainer';

interface BlogListProps {
  initialPosts: BlogPost[];
}

export function BlogList({ initialPosts }: BlogListProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'published' | 'draft'>('All');

  // Modal / Confirm state
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  // Client-side status toggle (Draft <-> Published)
  const handleToggleStatus = async (id: string, currentStatus: 'draft' | 'published') => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    setMutatingId(id);

    try {
      const updatePayload: { status: 'draft' | 'published'; published_at?: string } = {
        status: nextStatus,
      };

      // Auto-set published_at to now if transitioning to published without an existing date
      const post = posts.find((p) => p.id === id);
      if (nextStatus === 'published' && !post?.published_at) {
        updatePayload.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updatePayload)
        .eq('id', id);

      if (!error) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: nextStatus,
                  published_at: updatePayload.published_at || p.published_at,
                }
              : p
          )
        );
        toast.success(
          nextStatus === 'published' ? 'Post Published' : 'Moved to Drafts',
          `"${post?.title}" is now ${nextStatus}.`
        );
      } else {
        toast.error('Failed to update status', error.message);
      }
    } catch {
      toast.error('Network Error', 'Failed to update blog post status.');
    } finally {
      setMutatingId(null);
    }
  };

  // Safe Deletion Handler
  const handleDeletePost = async () => {
    if (!postToDelete || isDeleting) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete.id);

      if (!error) {
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        toast.success('Post Deleted', `"${postToDelete.title}" was permanently removed.`);
        setPostToDelete(null);
      } else {
        toast.error('Deletion Failed', error.message);
      }
    } catch {
      toast.error('Network Error', 'Could not delete post due to connection failure.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' ? true : post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Blog Articles</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Publish educational articles, technical insights, and company announcements.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title, slug, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
          {(['All', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List / Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No articles found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search query or status filter.'
                : 'Get started by creating your first blog article.'}
            </p>
          </div>
          {(!searchQuery && statusFilter === 'All') && (
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Post</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Image Container */}
                <div className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative">
                  <ImageContainer
                    src={post.featured_image_cloudinary_public_id || post.featured_image}
                    alt={post.title}
                    aspectRatio="video"
                    fit="cover"
                    unstyled
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs ${
                        post.status === 'published'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {post.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {post.author && (
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt || post.content.slice(0, 120)}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    /blog/{post.slug}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                    title="Edit article"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      title="View public article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setPostToDelete(post)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={mutatingId === post.id}
                  onClick={() => handleToggleStatus(post.id, post.status)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                    post.status === 'published'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400'
                  }`}
                >
                  {mutatingId === post.id
                    ? 'Updating...'
                    : post.status === 'published'
                    ? 'Unpublish'
                    : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Article?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">&ldquo;{postToDelete.title}&rdquo;</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setPostToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePost}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
