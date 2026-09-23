import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogList } from '@/components/admin/BlogList';
import { BlogPost } from '@/types';

export const metadata: Metadata = {
  title: 'Manage Blog Posts | Twinplast Admin',
  description: 'Create, edit, and publish blog articles and technical guides for Twinplast Polymers.',
};

export default async function AdminBlogPage() {
  let posts: BlogPost[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      posts = data as unknown as BlogPost[];
    }
  } catch {
    posts = [];
  }

  return <BlogList initialPosts={posts} />;
}
