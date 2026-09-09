'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { ImageContainer } from '@/components/shared/ImageContainer';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    const card = el.querySelector('[data-carousel-card]');
    const cardWidth = card?.clientWidth || 1;
    const gap = 24;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIdx(Math.min(idx, products.length - 1));
  }, [products.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-card]');
    if (!card) return;
    const scrollAmount = card.clientWidth + 24;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) {
    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="products-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
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

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100" aria-labelledby="products-heading">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              OUR PRODUCT LINE
            </span>
            <h2 id="products-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Product Range
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              High-performance polypropylene sheets and PP products designed to meet diverse industrial needs.
            </p>
          </div>
          
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider hidden sm:block">
              WIDE RANGE · CUSTOM SIZES · CONSISTENT QUALITY
            </span>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-600/20"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">

          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center transition-all cursor-pointer ${
              canScrollLeft
                ? 'opacity-90 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400 hover:scale-105'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center transition-all cursor-pointer ${
              canScrollRight
                ? 'opacity-90 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400 hover:scale-105'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 text-slate-800" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-2 px-2 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {products.map((prod) => (
              <div
                key={prod.id}
                data-carousel-card
                className="flex-none w-[82vw] sm:w-[46%] lg:w-[calc(25%-18px)] snap-start"
              >
                <div className="flex flex-col h-full rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400/80 transition-all duration-300 group">
                  {/* Product Image */}
                  <div className="relative bg-slate-50/70 p-4 border-b border-slate-100 min-h-[220px] flex items-center justify-center overflow-hidden rounded-t-xl">
                    <ImageContainer
                      src={prod.image_cloudinary_public_id}
                      alt={prod.title}
                      aspectRatio="tall"
                      fit="contain"
                      unstyled
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col p-5 space-y-2.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
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

        {/* Pagination Dots */}
        {products.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {products.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const el = scrollRef.current;
                  const card = el?.querySelector('[data-carousel-card]');
                  if (!el || !card) return;
                  el.scrollTo({ left: idx * (card.clientWidth + 24), behavior: 'smooth' });
                }}
                className={`rounded-full transition-all cursor-pointer ${
                  idx === activeIdx
                    ? 'w-7 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to product ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
