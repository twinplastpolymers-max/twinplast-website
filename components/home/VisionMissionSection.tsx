import Image from 'next/image';
import { Eye, Target } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface VisionMissionSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  visionTitle?: string;
  visionText?: string;
  missionTitle?: string;
  missionText?: string;
  vmImage?: string | null;
}

export function VisionMissionSection({
  eyebrow = 'OUR DIRECTION',
  title = 'Vision & Mission',
  subtitle = 'Rooted in precision engineering and driven by purpose — shaping the future of high-performance polymer sheet manufacturing.',
  visionTitle = 'Our Vision',
  visionText = 'To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service.',
  missionTitle = 'Our Mission',
  missionText = 'To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to our customers while continuously improving our manufacturing capabilities.',
  vmImage = null,
}: VisionMissionSectionProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 " aria-label="Vision and Mission">
      <div className="mx-auto max-w-7xl">

        {/* Section header (Centered matching reference layout) */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14 space-y-2">
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main grid: 2-column split (Left: Stacked Cards, Right: Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">

          {/* Left: Two stacked cards */}
          <div className="flex flex-col gap-6 justify-between">

            {/* Vision Card */}
            <div className="flex-1 rounded-2xl bg-blue-50 p-7 sm:p-9 flex flex-col justify-center space-y-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 shadow-2xs flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{visionTitle}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {visionText}
              </p>
            </div>

            {/* Mission Card */}
            <div className="flex-1 rounded-2xl bg-blue-50 p-7 sm:p-9 flex flex-col justify-center space-y-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 shadow-2xs flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{missionTitle}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {missionText}
              </p>
            </div>

          </div>

          {/* Right: Image panel */}
          <div className="relative rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shadow-xs min-h-[340px] sm:min-h-[400px] lg:min-h-full">
            {vmImage ? (
              <Image
                src={getOptimizedImageUrl(vmImage, { width: 900, crop: 'fill', quality: 'best' })}
                alt="Twinplast Polymers Vision and Mission"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 bg-gradient-to-br from-slate-100 to-slate-200/60">
                <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-slate-400" />
                </div>
                <div className="text-center space-y-1 max-w-xs">
                  <p className="text-xs font-semibold text-slate-700">
                    Vision &amp; Mission Section Image
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Upload facility, manufacturing, or team photography from the Admin Panel
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
