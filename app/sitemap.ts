import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

interface ProductSitemapItem {
  slug: string;
  updated_at: string | null;
}

interface IndustrySitemapItem {
  id: string | number;
  updated_at: string | null;
}

interface BlogSitemapItem {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: getSiteUrl('/products'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: getSiteUrl('/solutions'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/blog'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: getSiteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: getSiteUrl('/locations/tamil-nadu'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: getSiteUrl('/locations/kerala'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: getSiteUrl('/locations/karnataka'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let solutionRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const [
        { data: prodData, error: prodErr },
        { data: indData, error: indErr },
        { data: blogData, error: blogErr }
      ] = await Promise.all([
        supabase.from('products').select('slug, updated_at').eq('active', true),
        supabase.from('industries').select('id, updated_at').eq('active', true),
        supabase.from('blog_posts').select('slug, updated_at, published_at').eq('status', 'published'),
      ]);

      if (prodErr) {
        console.error('[Sitemap] Failed to fetch active products from Supabase:', prodErr.message);
      } else if (prodData) {
        const products = prodData as unknown as ProductSitemapItem[];
        productRoutes = products
          .filter((prod) => prod && typeof prod.slug === 'string' && prod.slug.trim().length > 0)
          .map((prod) => ({
            url: getSiteUrl(`/products/${prod.slug}`),
            lastModified: prod.updated_at ? new Date(prod.updated_at) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          }));
      }

      if (indErr) {
        console.error('[Sitemap] Failed to fetch active industries from Supabase:', indErr.message);
      } else if (indData) {
        const industries = indData as unknown as IndustrySitemapItem[];
        solutionRoutes = industries
          .filter((ind) => ind && ind.id !== undefined && ind.id !== null)
          .map((ind) => ({
            url: getSiteUrl(`/solutions/${ind.id}`),
            lastModified: ind.updated_at ? new Date(ind.updated_at) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          }));
      }

      if (blogErr) {
        console.error('[Sitemap] Failed to fetch published blog posts from Supabase:', blogErr.message);
      } else if (blogData) {
        const blogPosts = blogData as unknown as BlogSitemapItem[];
        blogRoutes = blogPosts
          .filter((post) => post && typeof post.slug === 'string' && post.slug.trim().length > 0)
          .map((post) => ({
            url: getSiteUrl(`/blog/${post.slug}`),
            lastModified: post.updated_at ? new Date(post.updated_at) : post.published_at ? new Date(post.published_at) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          }));
      }
    }
  } catch (err) {
    console.error('[Sitemap] Unexpected error during sitemap generation:', err);
  }

  return [...staticRoutes, ...productRoutes, ...solutionRoutes, ...blogRoutes];
}
