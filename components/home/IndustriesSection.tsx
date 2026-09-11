'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Industry } from '@/types';
import { ImageContainer } from '@/components/shared/ImageContainer';

interface IndustriesSectionProps {
  industries: Industry[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function IndustriesSection({ 
  industries, 
  eyebrow = 'VERSATILE POLYMER APPLICATIONS',
  title = 'Application and Solutions', 
  subtitle = 'High-performance polypropylene sheets and custom polymer solutions tailored to meet demanding applications across diverse industries.' 
}: IndustriesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, industries]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 320; // card width + gap (gap-5 = 20px)
    const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;

    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-10 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="applications-heading">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              {eyebrow}
            </span>
            <h2 id="applications-heading" className="text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls: Next and Previous Buttons */}
          {industries.length > 1 && (
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleScroll('prev')}
                disabled={!canScrollPrev}
                aria-label="Previous applications"
                className="p-2.5 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('next')}
                disabled={!canScrollNext}
                aria-label="Next applications"
                className="p-2.5 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Applications Cards Carousel (4 cards per view on desktop, 2 on tablet, 1 on mobile) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="flex-none w-[88%] xs:w-[320px] sm:w-[calc(50%-10px)] md:w-[calc((100%-40px)/3)] snap-start flex flex-col bg-white shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Card Image */}
              <div className="relative w-full overflow-hidden">
                <ImageContainer
                  src={ind.image_cloudinary_public_id || ind.image_url}
                  alt={ind.title}
                  aspectRatio="square"
                  fit="cover"
                  unstyled
                  className="w-full"
                />
              </div>

              {/* Card Content: Title, Description & Enquire Now Button */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-md text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                    {ind.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                    {ind.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href={`/contact?product=${encodeURIComponent(ind.title)}`}
                    className="inline-flex w-full items-center justify-between text-blue-500 hover:text-blue-600 px-1 py-1 text-xs font-bold uppercase tracking-wider transition-colors group/btn"
                    aria-label={`Enquire about ${ind.title}`}
                  >
                    <span>Enquire Now</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
