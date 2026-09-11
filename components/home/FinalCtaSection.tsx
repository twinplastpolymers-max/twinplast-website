import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { SlideButton } from '@/components/shared/SlideButton';

export interface FinalCtaSectionProps {
  eyebrow?: string;
  heading?: string;
  subheadline?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  bgImage?: string | null;
}

export function FinalCtaSection({
  eyebrow = 'B2B ENQUIRY PATHWAY',
  heading = "Let's Build A Stronger Tomorrow",
  subheadline = 'Get in touch with our team for product inquiries, custom solutions, or bulk orders. We are here to assist.',
  primaryLabel = 'Contact Us',
  primaryUrl = '/contact',
  secondaryLabel = 'Request a Quote',
  secondaryUrl = '/contact',
  bgImage = null,
}: FinalCtaSectionProps) {
  return (
    <section className="relative overflow-hidden py-18 sm:py-22 px-4 sm:px-6 lg:px-8 border-t border-slate-900" aria-labelledby="cta-heading">
      <div className="absolute inset-0 z-0">
        {bgImage ? (
          <Image
            src={getOptimizedImageUrl(bgImage, { quality: 'best', sharpen: 90, upscale: true })}
            alt="Industrial texture background"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-[#06152b] pointer-events-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06152b] via-[#06152b]/90 to-[#0b294d]/80 z-10" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
        <div className="text-center lg:text-left space-y-2.5 max-w-2xl">
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
              {eyebrow}
            </span>
          )}
          <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {heading}
          </h2>
          {subheadline && (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {subheadline}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-center">
          <SlideButton
            href={primaryUrl}
            label={primaryLabel}
            baseClass="bg-white"
            overlayClass="bg-slate-100"
            textClass="text-blue-900"
            className="justify-center uppercase tracking-wider text-xs sm:text-sm font-bold shadow-md"
          />
          <SlideButton
            href={secondaryUrl}
            label={secondaryLabel}
            baseClass="bg-transparent border border-white/60"
            overlayClass="bg-white/10"
            textClass="text-white"
            className="justify-center uppercase tracking-wider text-xs sm:text-sm font-bold"
          />
        </div>
      </div>
    </section>
  );
}
