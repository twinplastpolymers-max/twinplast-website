import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';
import { createPublicClient } from '@/lib/supabase/public';

// Revalidate sitemap every 1 hour (3600 seconds) via Next.js ISR for fast CDN delivery to Googlebot
export const revalidate = 3600;

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

interface TimestampRow {
  updated_at: string | null;
}

function toValidDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function latestDate(dates: Array<Date | undefined>): Date | undefined {
  let max: Date | undefined;
  for (const d of dates) {
    if (!d) continue;
    if (!max || d.getTime() > max.getTime()) {
      max = d;
    }
  }
  return max;
}

const LOCATION_SLUGS = [
  '/locations',
  '/locations/india',
  '/locations/tamil-nadu',
  '/locations/kerala',
  '/locations/karnataka',
  '/locations/chennai',
  '/locations/coimbatore',
  '/locations/bengaluru',
  '/locations/kochi',
  '/locations/thoothukudi',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = [];
  let solutionRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  let latestProductDate: Date | undefined;
  let latestSolutionDate: Date | undefined;
  let latestBlogDate: Date | undefined;
  let latestSectionDate: Date | undefined;
  let latestSettingsDate: Date | undefined;

  try {
    const supabase = createPublicClient();

    if (supabase) {
      // Fetch public records and timestamps with individual failure isolation
      const [prodResult, indResult, blogResult, secResult, settingsResult] = await Promise.allSettled([
        supabase.from('products').select('slug, updated_at').eq('active', true),
        supabase.from('industries').select('id, updated_at').eq('active', true),
        supabase.from('blog_posts').select('slug, updated_at, published_at').eq('status', 'published'),
        supabase.from('homepage_sections').select('updated_at'),
        supabase.from('company_settings').select('updated_at'),
      ]);

      if (secResult.status === 'fulfilled' && !secResult.value.error && Array.isArray(secResult.value.data)) {
        const rows = secResult.value.data as unknown as TimestampRow[];
        latestSectionDate = latestDate(rows.map((r) => toValidDate(r.updated_at)));
      }

      if (settingsResult.status === 'fulfilled' && !settingsResult.value.error && Array.isArray(settingsResult.value.data)) {
        const rows = settingsResult.value.data as unknown as TimestampRow[];
        latestSettingsDate = latestDate(rows.map((r) => toValidDate(r.updated_at)));
      }

      // Process products
      if (prodResult.status === 'fulfilled') {
        const { data: prodData, error: prodErr } = prodResult.value;
        if (prodErr) {
          console.error('[Sitemap] Failed to fetch active products:', prodErr.message);
        } else if (Array.isArray(prodData)) {
          const products = prodData as unknown as ProductSitemapItem[];
          const prodDates: Array<Date | undefined> = [];
          productRoutes = products
            .filter((prod) => prod && typeof prod.slug === 'string' && prod.slug.trim().length > 0)
            .map((prod) => {
              const lastModified = toValidDate(prod.updated_at);
              prodDates.push(lastModified);
              return {
                url: getSiteUrl(`/products/${prod.slug.trim()}`),
                ...(lastModified ? { lastModified } : {}),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
              };
            });
          latestProductDate = latestDate(prodDates);
        }
      } else {
        console.error('[Sitemap] Product query rejected:', prodResult.reason);
      }

      // Process industries / solutions
      if (indResult.status === 'fulfilled') {
        const { data: indData, error: indErr } = indResult.value;
        if (indErr) {
          console.error('[Sitemap] Failed to fetch active industries:', indErr.message);
        } else if (Array.isArray(indData)) {
          const industries = indData as unknown as IndustrySitemapItem[];
          const solDates: Array<Date | undefined> = [];
          solutionRoutes = industries
            .filter((ind) => ind && ind.id !== undefined && ind.id !== null && String(ind.id).trim().length > 0)
            .map((ind) => {
              const lastModified = toValidDate(ind.updated_at);
              solDates.push(lastModified);
              return {
                url: getSiteUrl(`/solutions/${String(ind.id).trim()}`),
                ...(lastModified ? { lastModified } : {}),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
              };
            });
          latestSolutionDate = latestDate(solDates);
        }
      } else {
        console.error('[Sitemap] Industries query rejected:', indResult.reason);
      }

      // Process blog posts
      if (blogResult.status === 'fulfilled') {
        const { data: blogData, error: blogErr } = blogResult.value;
        if (blogErr) {
          console.error('[Sitemap] Failed to fetch published blog posts:', blogErr.message);
        } else if (Array.isArray(blogData)) {
          const blogPosts = blogData as unknown as BlogSitemapItem[];
          const blogDates: Array<Date | undefined> = [];
          blogRoutes = blogPosts
            .filter((post) => post && typeof post.slug === 'string' && post.slug.trim().length > 0)
            .map((post) => {
              const lastModified = toValidDate(post.updated_at) || toValidDate(post.published_at);
              blogDates.push(lastModified);
              return {
                url: getSiteUrl(`/blog/${post.slug.trim()}`),
                ...(lastModified ? { lastModified } : {}),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
              };
            });
          latestBlogDate = latestDate(blogDates);
        }
      } else {
        console.error('[Sitemap] Blog posts query rejected:', blogResult.reason);
      }
    }
  } catch (err) {
    console.error('[Sitemap] Unexpected error during sitemap generation:', err);
  }

  const homeLastMod = latestDate([latestSectionDate, latestProductDate, latestSolutionDate, latestSettingsDate]);
  const aboutLastMod = latestDate([latestSectionDate, latestSettingsDate]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl('/'),
      ...(homeLastMod ? { lastModified: homeLastMod } : {}),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: getSiteUrl('/products'),
      ...(latestProductDate ? { lastModified: latestProductDate } : {}),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: getSiteUrl('/solutions'),
      ...(latestSolutionDate ? { lastModified: latestSolutionDate } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/blog'),
      ...(latestBlogDate ? { lastModified: latestBlogDate } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getSiteUrl('/about'),
      ...(aboutLastMod ? { lastModified: aboutLastMod } : {}),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: getSiteUrl('/contact'),
      ...(latestSettingsDate ? { lastModified: latestSettingsDate } : {}),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...LOCATION_SLUGS.map((slug) => ({
      url: getSiteUrl(slug),
      changeFrequency: 'monthly' as const,
      priority: slug === '/locations/india' ? 0.8 : 0.7,
    })),
  ];

  // Guarantee zero duplicate canonical URLs
  const seen = new Set<string>();
  const combined = [...staticRoutes, ...productRoutes, ...solutionRoutes, ...blogRoutes];
  return combined.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
