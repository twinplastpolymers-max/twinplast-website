import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { SlideButton } from '@/components/shared/SlideButton';

export interface AboutSectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  mainImage?: string | null;
  secondaryImage1?: string | null;
  secondaryImage2?: string | null;
}

export function AboutSection({
  eyebrow = 'ABOUT US',
  heading = 'Welcome to Twinplast Polymers',
  description,
  mainImage = null,
  secondaryImage1 = null,
  secondaryImage2 = null,
}: AboutSectionProps) {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left side: Eyebrow + Heading + Description */}
          <div className="lg:col-span-6 space-y-5">
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                {eyebrow}
              </span>
            )}
            <h2 id="about-heading" className="text-2xl sm:text-3xl tracking-tight text-slate-900 leading-tight">
              Welcome to <span className="text-blue-600">Twinplast Polymers</span>
            </h2>
            {description && (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            )}
            <div>
              <SlideButton href="/about" label="Know More About Us" />
            </div>
          </div>

          {/* Right side: 3 Images */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* Main image */}
            <div className="h-52 relative border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-2xs group">
              {mainImage ? (
                <Image
                  src={getOptimizedImageUrl(mainImage, { width: 1600, crop: 'fill', quality: 'best' })}
                  alt="Twinplast Polymers manufacturing facility in Thoothukudi"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-300 text-xs">No image</span>
                </div>
              )}
              <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
                Engineering Polymer Solutions
              </div>
            </div>

            {/* Bottom row: two images */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-52 relative border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-2xs group">
                {secondaryImage1 ? (
                  <Image
                    src={getOptimizedImageUrl(secondaryImage1, { width: 800, crop: 'fill', quality: 'best' })}
                    alt="Automated polypropylene extrusion line machinery"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-300 text-xs">No image</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider">
                  Advanced Manufacturing
                </div>
              </div>

              <div className="h-52 relative border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-2xs group">
                {secondaryImage2 ? (
                  <Image
                    src={getOptimizedImageUrl(secondaryImage2, { width: 800, crop: 'fill', quality: 'best' })}
                    alt="Stacked finished polymer partition layer pads"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-300 text-xs">No image</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider">
                  Consistent Quality
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

