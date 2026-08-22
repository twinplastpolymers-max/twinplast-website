import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product } from '@/types';

import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'PP Sheets | Corrugated, Sunpack & More | Twinplast Polymers',
  description: 'Explore PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheets from Twinplast Polymers for B2B industrial and packaging applications.',
  alternates: {
    canonical: getSiteUrl('/products'),
  },
  openGraph: {
    title: 'PP Sheets | Corrugated, Sunpack & More | Twinplast Polymers',
    description: 'Explore PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheets from Twinplast Polymers for B2B industrial and packaging applications.',
    url: getSiteUrl('/products'),
    type: 'website',
  },
};

export default async function ProductsCatalogPage() {
  let products: Product[] = [];
  let hasDbError = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) {
      hasDbError = true;
    } else {
      products = data || [];
    }
  } catch {
    hasDbError = true;
  }

  return (
    <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center sm:text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Industrial Sheets Manufacturer
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Polypropylene (PP) Sheet Catalog
          </h1>
          <p className="text-base text-muted max-w-2xl leading-relaxed">
            Our sheets are engineered for packaging durability, material handling safety, custom advertising, and structural floor protection. We custom-manufacture to client thickness and GSM parameters.
          </p>
        </div>

        {/* Database Content Check - Graceful B2B Empty State */}
        {products.length === 0 || hasDbError ? (
          <div className="rounded-2xl border border-surface-border bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Catalog Updating</h3>
            <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">
              We are currently indexing our manufacturing inventory records. To inquire about PP Corrugated, Sunpack, Hollow, Layer Pad, or Floor Protection sheets, contact our Thoothukudi sales department directly.
            </p>
            <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-muted">
              <div>Phone: <span className="font-bold text-foreground">+91 95853 88444</span></div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div>Email: <span className="font-bold text-foreground">twinplastpolymers@gmail.com</span></div>
            </div>
          </div>
        ) : (
          /* Mobile-first grid layout: 1 col mobile, 2 col tablet, 3-4 col desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-slate-50/80 dark:bg-slate-900/60 border-b border-surface-border">
                  <ImageContainer
                    src={prod.image_cloudinary_public_id}
                    alt={prod.title}
                    aspectRatio="tall"
                    fit="contain"
                    unstyled
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1 block">
                    {prod.category}
                  </span>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                    {prod.title}
                  </h2>
                  <p className="mt-2 text-xs text-muted line-clamp-3 flex-1 leading-relaxed">
                    {prod.description}
                  </p>
                  
                  <div className="mt-4 border-t border-secondary/50 pt-3">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="inline-flex w-full items-center justify-between rounded-lg bg-secondary/30 hover:bg-secondary/60 text-secondary-foreground px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent group/btn"
                      aria-label={`View details for ${prod.title}`}
                    >
                      <span>View Product</span>
                      <ChevronRight className="w-4 h-4 text-muted group-hover/btn:text-accent transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
