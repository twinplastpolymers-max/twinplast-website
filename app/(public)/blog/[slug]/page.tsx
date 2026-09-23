import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ChevronRight, ArrowLeft, Clock, Share2, Layers, MapPin, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { BlogPost } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = getSiteUrl(`/blog/${slug}`);

  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from('blog_posts')
      .select('title, excerpt, content, featured_image, featured_image_cloudinary_public_id, seo_title, seo_description')
      .eq('slug', slug)
      .eq('status', 'published')
      .single() as unknown as { data: BlogPost | null };

    if (!post) {
      return { title: 'Article Not Found | Twinplast Polymers' };
    }

    const title = post.seo_title || `${post.title} | Twinplast Polymers`;
    const description = post.seo_description || post.excerpt || post.content.slice(0, 155);

    const ogImageUrl = post.featured_image_cloudinary_public_id
      ? getOptimizedImageUrl(post.featured_image_cloudinary_public_id, { width: 1200, height: 630, quality: 'auto' })
      : post.featured_image || getSiteUrl('/logo.png');

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'article',
        images: [
          {
            url: ogImageUrl,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: 'Article | Twinplast Polymers',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: 'Article | Twinplast Polymers',
        url: canonicalUrl,
        type: 'article',
        images: [{ url: getSiteUrl('/logo.png') }],
      },
      twitter: {
        card: 'summary_large_image',
        images: [getSiteUrl('/logo.png')],
      },
    };
  }
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let post: BlogPost | null = null;
  let recentPosts: BlogPost[] = [];

  try {
    const supabase = await createClient();
    const [{ data: postData, error }, { data: recentData }] = await Promise.all([
      supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').single(),
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, published_at, featured_image, featured_image_cloudinary_public_id')
        .eq('status', 'published')
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3),
    ]);

    if (!error && postData) {
      post = postData as unknown as BlogPost;
    }
    if (recentData) {
      recentPosts = (recentData as unknown as BlogPost[]) || [];
    }
  } catch {
    post = null;
  }

  if (!post) {
    notFound();
  }

  // Calculate read time estimate (~200 words per minute)
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const postImageUrl = post.featured_image_cloudinary_public_id
    ? getOptimizedImageUrl(post.featured_image_cloudinary_public_id, { width: 1200, height: 630, quality: 'auto' })
    : post.featured_image || getSiteUrl('/logo.png');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${getSiteUrl(`/blog/${post.slug}`)}#article`,
    headline: post.title,
    description: post.seo_description || post.excerpt || post.content.slice(0, 155),
    image: postImageUrl,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Twinplast Technical Team',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${getSiteUrl('/')}#organization`,
      name: 'Twinplast Polymers Private Limited',
      logo: {
        '@type': 'ImageObject',
        url: getSiteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getSiteUrl(`/blog/${post.slug}`),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: getSiteUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: getSiteUrl(`/blog/${post.slug}`),
      },
    ],
  };

  // Helper to render content with support for markdown headings, bullet lists, and paragraphs
  const renderFormattedContent = (rawText: string) => {
    const blocks = rawText.split(/\n\s*\n/);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Heading 2 (## Heading)
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // Heading 3 (### Heading)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2 tracking-tight">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Unordered list (* item or - item)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((line) => line.replace(/^[\*\-]\s+/, '').trim()).filter(Boolean);
        return (
          <ul key={idx} className="my-4 space-y-2 list-disc list-inside text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed my-4 whitespace-pre-line">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 bg-white">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      <article className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {post.title}
            </h1>

            {/* Meta Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-1 pb-4 border-b border-slate-100">
              {post.author && (
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <User className="w-4 h-4 text-blue-600" />
                  {post.author}
                </span>
              )}

              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}

              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                {readTimeMinutes} min read
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {(post.featured_image_cloudinary_public_id || post.featured_image) && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
              <ImageContainer
                src={post.featured_image_cloudinary_public_id || post.featured_image}
                alt={post.title}
                aspectRatio="wide"
                fit="cover"
              />
            </div>
          )}

          {/* Article Lead Excerpt (if available) */}
          {post.excerpt && (
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/60 border-l-4 border-blue-600 mb-8">
              <p className="text-sm sm:text-base font-medium text-slate-800 italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Article Main Body Content */}
          <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 mb-12">
            {renderFormattedContent(post.content)}
          </div>

          {/* Internal Linking & Exploration Box */}
          <div className="my-10 p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Explore Twinplast Manufactured Solutions</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Looking for commercial or custom-manufactured polypropylene fluted sheets? Explore our product lines, application solutions, or local supply hubs across South India:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                href="/products"
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Catalog</span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Our Products</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>

              <Link
                href="/solutions"
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Industries</span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Applications</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>

              <Link
                href="/locations/tamil-nadu"
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Locations</span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Supply Hubs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Navigation Back & Inquiry Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all articles</span>
            </Link>

            <Link
              href={`/contact?product=${encodeURIComponent(post.title)}`}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              Request Custom Quote
            </Link>
          </div>

          {/* Recent Articles Section */}
          {recentPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                More Articles & Technical Resources
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recentPosts.map((rPost) => (
                  <Link
                    key={rPost.id}
                    href={`/blog/${rPost.slug}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-semibold text-slate-400 block">
                        {rPost.published_at
                          ? new Date(rPost.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {rPost.title}
                      </h3>
                      {rPost.excerpt && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {rPost.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                      <span>Read More</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Bottom CTA Banner */}
      <CtaBanner />
    </div>
  );
}
