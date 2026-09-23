import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { BlogPost } from '@/types';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Blog & Technical Articles | Twinplast Polymers',
  description:
    'Read articles, technical guides, and industry updates on PP Corrugated sheets, Sunpack boards, structural protection, and industrial packaging from Twinplast Polymers.',
  alternates: {
    canonical: getSiteUrl('/blog'),
  },
  openGraph: {
    title: 'Blog & Technical Articles | Twinplast Polymers',
    description:
      'Read articles, technical guides, and industry updates on PP Corrugated sheets, Sunpack boards, structural protection, and industrial packaging from Twinplast Polymers.',
    url: getSiteUrl('/blog'),
    type: 'website',
    images: [
      {
        url: getSiteUrl('/logo.png'),
        width: 512,
        height: 512,
        alt: 'Twinplast Polymers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Technical Articles | Twinplast Polymers',
    description:
      'Read articles, technical guides, and industry updates on PP Corrugated sheets, Sunpack boards, structural protection, and industrial packaging from Twinplast Polymers.',
    images: [getSiteUrl('/logo.png')],
  },
};

export default async function BlogListingPage() {
  let posts: BlogPost[] = [];
  let hasDbError = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      hasDbError = true;
    } else {
      posts = (data as unknown as BlogPost[]) || [];
    }
  } catch {
    hasDbError = true;
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${getSiteUrl('/blog')}#collection`,
    name: 'Twinplast Polymers Blog & Technical Guides',
    url: getSiteUrl('/blog'),
    description:
      'Industry insights, polymer extrusion guides, and packaging solutions published by Twinplast Polymers Private Limited.',
    publisher: {
      '@id': `${getSiteUrl('/')}#organization`,
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
    ],
  };

  return (
    <div className="flex-1 bg-white">
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Blog</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Insights & Technical Resources</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Polypropylene & Packaging Insights
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore technical guides, material comparisons, and engineering applications for PP Corrugated sheets, Sunpack boards, floor protection, and industrial packaging.
            </p>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 || hasDbError ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center max-w-xl mx-auto my-8 space-y-4 shadow-xs">
              <BookOpen className="w-12 h-12 text-blue-600/60 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Articles Coming Soon</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We are preparing in-depth technical guides and application studies. In the meantime, explore our manufactured polymer product catalog or request technical specifications directly.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  View Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Article Featured Image */}
                  <div className="w-full bg-slate-100 border-b border-slate-100 overflow-hidden relative">
                    <ImageContainer
                      src={post.featured_image_cloudinary_public_id || post.featured_image}
                      alt={post.title}
                      aspectRatio="video"
                      fit="cover"
                      unstyled
                    />
                  </div>

                  {/* Article Text Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Meta information */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {post.published_at && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {post.author && (
                          <span className="flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {post.author}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content.replace(/[#*`_]/g, '').slice(0, 150)}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 group-hover:text-blue-700 transition-colors"
                        aria-label={`Read article: ${post.title}`}
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaBanner />
    </div>
  );
}
