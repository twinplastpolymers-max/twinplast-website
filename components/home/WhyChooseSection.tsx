'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface WhyChooseSectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  pillars?: Array<{ title: string; description: string }>;
  image?: string | null;
  imageUrl?: string | null;
}

export function WhyChooseSection({
  eyebrow,
  heading,
  description,
  pillars = [],
  image = null,
  imageUrl = null,
}: WhyChooseSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!pillars || pillars.length === 0) return null;

  const resolvedImage = imageUrl || (image ? (image.startsWith('http') ? image : getOptimizedImageUrl(image, { quality: 'best', sharpen: 90, upscale: true })) : null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl">

        {/* Common Section Header on Top */}
        <div className="mb-8 sm:mb-12">
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="why-heading" className="text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900 leading-tight">
            {heading || 'Why Choose Us'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {description || 'Discover why businesses trust Twinplast for durable, customized, and high-performance PP sheet solutions.'}
          </p>
        </div>

        {/* Grid: Left Column Image, Right Column Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-start">

          {/* Left Column: Image */}
          <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[480px] bg-slate-100 rounded-sm overflow-hidden">
            {resolvedImage ? (
              <Image
                src={resolvedImage}
                alt={heading || 'Why Choose Twinplast Polymers'}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
                <span className="text-xs text-slate-400">No image uploaded</span>
              </div>
            )}
          </div>

          {/* Right Column: Accordion Pillars List */}
          <div className="space-y-3">
            {pillars.map((pillar, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="bg-slate-200 rounded-sm overflow-hidden transition-colors">
                  {/* Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm  text-slate-800">
                      {pillar.title}
                    </span>

                    <div
                      className={`w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-blue-600' : 'rotate-0 text-slate-500'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content with smooth open/collapse animation */}
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {pillar.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
