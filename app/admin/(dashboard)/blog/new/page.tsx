import type { Metadata } from 'next';
import { BlogForm } from '@/components/admin/BlogForm';

export const metadata: Metadata = {
  title: 'Create Blog Post | Twinplast Admin',
  description: 'Draft or publish a new article for Twinplast Polymers.',
};

export default function AdminNewBlogPage() {
  return <BlogForm />;
}
