import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Industry } from '@/types';
import { getSiteUrl } from '@/lib/site';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Sheet Solutions & Industry Applications | Twinplast Polymers',
  description: 'Explore polypropylene (PP) sheet applications across packaging, advertising, construction, agriculture, and industrial material handling from Twinplast Polymers.',
  alternates: {
    canonical: getSiteUrl('/solutions'),
  },
  openGraph: {
    title: 'PP Sheet Solutions & Industry Applications | Twinplast Polymers',
    description: 'Explore polypropylene (PP) sheet applications across packaging, advertising, construction, agriculture, and industrial material handling from Twinplast Polymers.',
    url: getSiteUrl('/solutions'),
    type: 'website',
  },
};

export default async function SolutionsPage() {
  let industries: Industry[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('industries')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    industries = data || [];
  } catch {
    industries = [];
  }

  return (
    <div className="flex-1 bg-background">
      <div className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
              VERSATILE POLYMER APPLICATIONS
            </span>
            <h1 className="text-2xl sm:text-3xl  tracking-tight text-foreground">
              Industry Applications & Solutions
            </h1>
            <p className="text-sm max-w-2xl leading-relaxed">
              High-performance polypropylene sheets tailored for demanding operational conditions across packaging, logistics, commercial signage, and structural floor protection.
            </p>
          </div>

          {/* Grid of Solutions */}
          {industries.length === 0 ? (
            <div className="rounded-sm border border-surface-border bg-slate-50 p-8 text-center max-w-xl mx-auto my-12">
              <p className="text-sm text-muted">Loading industry solutions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
              {industries.map((ind) => (
                <div
                  key={ind.id}
                  className="flex flex-col bg-surface border border-surface-border rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="w-full bg-slate-50 border-b border-surface-border overflow-hidden h-36 sm:h-72 lg:h-80 relative">
                    <ImageContainer
                      src={ind.image_cloudinary_public_id}
                      alt={ind.title}
                      aspectRatio="tall"
                      fit="cover"
                      className="h-full w-full"
                      unstyled
                    />
                  </div>
                  <div className="p-3 sm:p-6 flex flex-col flex-1">
                    <h2 className="text-xs sm:text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors leading-snug mb-1 sm:mb-2 line-clamp-2">
                      {ind.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-muted leading-relaxed flex-1 line-clamp-2 sm:line-clamp-none">
                      {ind.description}
                    </p>

                    <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-surface-border">
                      <Link
                        href={`/contact?product=${encodeURIComponent(ind.title)}`}
                        className="inline-flex w-full items-center justify-between text-blue-500 hover:text-blue-600 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors group/btn"
                        aria-label={`Enquire about ${ind.title}`}
                      >
                        <span className="truncate">Enquire Now</span>
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted group-hover/btn:text-blue-600 transition-colors shrink-0" />
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
