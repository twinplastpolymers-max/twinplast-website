import Image from 'next/image';
import { CheckCircle2, Layers } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface WhyChooseSectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  pillars?: Array<{ title: string; description: string }>;
  image?: string | null;
}

export function WhyChooseSection({
  eyebrow = 'OUR ADVANTAGES',
  heading = 'Why Choose Us',
  description,
  pillars = [],
  image = null,
}: WhyChooseSectionProps) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#06142c] text-white relative overflow-hidden border-t border-slate-800" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Content: Eyebrow + Heading + Feature Grid */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              {eyebrow && (
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
                  {eyebrow}
                </span>
              )}
              <h2 id="why-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {heading}
              </h2>
              {description && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Feature Grid */}
            {pillars && pillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-xl bg-[#0a1835]/90 border border-blue-900/40 hover:border-blue-500/50 transition-all duration-200 space-y-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{pillar.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden border border-blue-900/50 shadow-2xl bg-[#0a1835]">
            {image ? (
              <Image
                src={getOptimizedImageUrl(image, { quality: 'best', sharpen: 90, upscale: true })}
                alt="Finished polypropylene sheet products ready for industrial dispatch"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a1835] to-[#06142c]">
                <Layers className="w-16 h-16 text-blue-500/40" />
              </div>
            )}
            
            {/* Overlay Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06142c] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
                BUILT FOR
              </span>
              <p className="text-lg font-extrabold text-white tracking-tight">
                A STRONGER TOMORROW
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
