import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface ImageContainerProps {
  src?: string | null;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'tall' | 'portrait';
  className?: string;
  priority?: boolean;
}

export function ImageContainer({
  src,
  alt,
  aspectRatio = 'video',
  className = '',
  priority = false,
}: ImageContainerProps) {
  // Map aspect ratio to Tailwind classes
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
    tall: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
  };

  const selectedAspect = aspectClasses[aspectRatio];

  // Resolve Cloudinary optimised delivery URL
  const isPlaceholder = !src || src.startsWith('products/') || src.startsWith('brand/');
  const resolvedUrl = (!isPlaceholder && src) ? getOptimizedImageUrl(src, {
    width: aspectRatio === 'square' ? 600 : 800,
    crop: 'fill',
    quality: 'auto',
  }) : null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-surface-border bg-slate-50 dark:bg-slate-900/20 transition-all duration-300 ${selectedAspect} ${className}`}
    >
      {resolvedUrl ? (
        <Image
          src={resolvedUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-102"
          priority={priority}
        />
      ) : (
        // Premium, Minimalistic Editorial Placeholder for Future Media
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none transition-all duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Subtle accent corner marks to suggest a layout frame */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-slate-300/40 dark:border-slate-700/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-slate-300/40 dark:border-slate-700/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-slate-300/40 dark:border-slate-700/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-slate-300/40 dark:border-slate-700/40 pointer-events-none" />
          
          {/* Minimalist layered sheet icon */}
          <svg
            className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>

          {/* Faint blue accent dot for brand consistency */}
          <div className="w-1.5 h-1.5 rounded-full bg-accent/30 animate-pulse mt-1" />
        </div>
      )}
    </div>
  );
}
