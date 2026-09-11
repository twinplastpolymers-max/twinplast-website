import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SlideButton } from '@/components/shared/SlideButton';

export interface HeroSectionProps {
  subheading?: string;
  heading?: string;
  shortDescription?: string;
  bgImageUrl?: string | null;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
}

export function HeroSection({
  subheading,
  heading,
  shortDescription,
  bgImageUrl,
  primaryCtaLabel = 'Enquire Now',
  primaryCtaUrl = '/contact',
}: HeroSectionProps) {
  if (!heading) return null;

  return (
    <section className="relative overflow-hidden bg-slate-900 min-h-[calc(100vh-98px)] min-h-[calc(100dvh-98px)] flex items-end sm:items-center" aria-labelledby="hero-heading">
      {/* Uploaded Background Image */}
      {bgImageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-[65%] sm:bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
          aria-hidden="true"
        />
      )}

      {/* Gradient shade behind content on the left (Desktop) */}
      <div 
        className="absolute inset-y-0 left-0 hidden sm:block sm:w-4/5 md:w-3/4 lg:w-3/5 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Mobile-only: black gradient shadow at the bottom content side */}
      <div
        className="absolute bottom-0 left-0 w-full h-3/5 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none sm:hidden"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10 py-10 sm:py-16">
        <div className="max-w-xl text-left space-y-2.5 sm:space-y-3">
          {subheading && (
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400">
              {subheading}
            </span>
          )}

          <h1 id="hero-heading" className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-semibold tracking-tight leading-tight text-white">
            {heading}
          </h1>

          {shortDescription && (
            <p className="text-sm sm:text-base text-slate-200 leading-snug font-normal">
              {shortDescription}
            </p>
          )}

          <div className="pt-1 sm:pt-2">
            <SlideButton href={primaryCtaUrl} label={primaryCtaLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
