import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogForm } from '@/components/admin/BlogForm';
import { BlogPost } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Blog Post | Twinplast Admin',
  description: 'Modify blog article content, images, and publishing status.',
};

export default async function AdminEditBlogPage({ params }: PageProps) {
  const { id } = await params;
  let post: BlogPost | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      post = data as unknown as BlogPost;
    }
  } catch {
    post = null;
  }

  if (!post) {
    notFound();
  }

  return <BlogForm post={post} />;
}
