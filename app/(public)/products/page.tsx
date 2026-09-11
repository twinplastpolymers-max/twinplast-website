import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product } from '@/types';

import { getSiteUrl } from '@/lib/site';
import { CtaBanner } from '@/components/shared/CtaBanner';

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
    <div className="flex-1 bg-background">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Industrial Sheets Manufacturer
            </span>
            <h1 className="text-2xl sm:text-3xl tracking-tight text-foreground ">
              Polypropylene (PP) Sheet Catalog
            </h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
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
            /* Mobile-first grid layout: 2 col mobile, 3 col lg, 4 col xl */
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 animate-fade-in">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="w-full bg-slate-50/80 dark:bg-slate-900/60 border-b border-surface-border overflow-hidden">
                    <ImageContainer
                      src={prod.image_cloudinary_public_id}
                      alt={prod.title}
                      aspectRatio="tall"
                      fit="cover"
                      unstyled
                    />
                  </div>
                  <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent mb-0.5 sm:mb-1 block truncate">
                      {prod.category}
                    </span>
                    <h2 className="text-xs sm:text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {prod.title}
                    </h2>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-muted line-clamp-2 sm:line-clamp-3 flex-1 leading-relaxed">
                      {prod.description}
                    </p>
                    
                    <div className="mt-2 sm:mt-4 pt-2 sm:pt-3">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex w-full items-center justify-between text-blue-500 py-1 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent group/btn"
                        aria-label={`View details for ${prod.title}`}
                      >
                        <span className="truncate">View Product</span>
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted group-hover/btn:text-accent transition-colors shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Banner (Same content reused across all pages) */}
      <CtaBanner />
    </div>
  );
}
