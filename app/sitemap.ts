import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

interface ProductSitemapItem {
  slug: string;
  updated_at: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: getSiteUrl('/products'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: getSiteUrl('/about'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: getSiteUrl('/contact'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('active', true);

      if (error) {
        console.error('[Sitemap] Failed to fetch active products from Supabase:', error.message);
      } else if (data) {
        const products = data as unknown as ProductSitemapItem[];
        productRoutes = products
          .filter((prod) => prod && typeof prod.slug === 'string' && prod.slug.trim().length > 0)
          .map((prod) => ({
            url: getSiteUrl(`/products/${prod.slug}`),
            lastModified: prod.updated_at ? new Date(prod.updated_at) : undefined,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          }));
      }
    }
  } catch (err) {
    console.error('[Sitemap] Unexpected error during sitemap generation:', err);
  }

  return [...staticRoutes, ...productRoutes];
}
