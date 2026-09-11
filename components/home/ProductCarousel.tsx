'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ImageContainer } from '@/components/shared/ImageContainer';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="products-heading" className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
            Our Product Range
          </h2>
          <div className="mt-8 p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-600">
              Products updating. Please contact our team directly for custom PP sheet specifications.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Ensure enough items in one set so it always fills wide screens seamlessly
  const repeatHalf = Math.max(1, Math.ceil(6 / Math.max(products.length, 1)));
  const singleSet = Array.from({ length: repeatHalf }, () => products).flat();
  // Duplicate for a continuous seamless infinite loop
  const marqueeProducts = [...singleSet, ...singleSet];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-100 overflow-hidden" aria-labelledby="products-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              OUR PRODUCT LINE
            </span>
            <div className="flex items-center justify-between gap-3">
              <h2 id="products-heading" className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                Our Product Range
              </h2>
              <Link
                href="/products"
                className="inline-flex sm:hidden items-center gap-1.5 text-blue-700 text-xs font-bold shrink-0 whitespace-nowrap"
              >
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              High-performance polypropylene sheets and PP products designed to meet diverse industrial needs.
            </p>
          </div>
          
          <div className="hidden sm:flex flex-col sm:items-end gap-1.5 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-blue-700 px-5 text-xs sm:text-sm font-bold transition-all hover:text-blue-800"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Continuous Infinite Marquee Track (Right to Left) */}
      <div 
        className="relative w-full overflow-hidden"
        role="region"
        aria-label="Product Showcase Carousel"
      >
        <div className="animate-marquee-infinite flex gap-6 px-4">
          {marqueeProducts.map((prod, idx) => (
            <div
              key={`${prod.id}-${idx}`}
              className="w-[280px] sm:w-[320px] shrink-0"
            >
              <div className="flex flex-col h-full rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400/80 transition-all duration-300 group/card">
                {/* Product Image */}
                <div className="relative w-full bg-slate-50/70 border-b border-slate-100 overflow-hidden rounded-t-xl">
                  <ImageContainer
                    src={prod.image_cloudinary_public_id}
                    alt={prod.title}
                    aspectRatio="tall"
                    fit="cover"
                    unstyled
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors leading-snug">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
                    {prod.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors"
                      aria-label={`View details for ${prod.title}`}
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

