import React from 'react';
import { MarketRegionItem } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface MarketsSectionProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  backgroundImage?: string | null;
  regions?: (string | MarketRegionItem)[];
}

export function MarketsSection({
  eyebrow,
  heading,
  body,
  backgroundImage = null,
  regions = [],
}: MarketsSectionProps) {
  if (!regions || regions.length === 0) return null;

  const marketItems = regions.map((region, idx) => {
    if (typeof region === 'string') {
      return {
        id: `region-${idx}`,
        label: region,
        image: '',
        image_url: '',
      };
    }
    const name = region.name || region.label || '';
    return {
      id: region.id || `region-${idx}`,
      label: name,
      image: region.image || '',
      image_url: region.image_url || '',
    };
  });

  return (
    <section className="relative py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden" aria-labelledby="markets-heading">
      
      {/* Background: Custom Uploaded Image from Admin with fixed position and black shadow */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true" 
        >
          {/* Black shadow / overlay */}
          <div className="absolute inset-0 bg-black/65" />
        </div>
      )}

      <div className="mx-auto max-w-7xl relative z-10 text-center">
        
        {/* Header Content */}
        <div className="max-w-3xl mx-auto mb-5 sm:mb-7">
          {eyebrow ? (
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 block mb-2">
              {eyebrow}
            </span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 block mb-2">
              SUPPLYING WORLDWIDE
            </span>
          )}
        
          {heading && (
            <h2 id="markets-heading" className="text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {heading}
            </h2>
          )}
          {body && (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto mt-2.5">
              {body}
            </p>
          )}
        </div>

        {/* Markets Visual Journey Nodes */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Connecting Upward Arched Dotted Line (Starts at Node 1 bottom and ends at last Node bottom) */}
          <svg
            className="absolute top-0 left-0 w-full h-[112px] pointer-events-none hidden md:block z-0"
            viewBox="0 0 1000 112"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/*
              Grid has 4 equal columns (each exactly 25% = 250 units):
              Col 1 Center = 125
              Col 2 Center = 375
              Col 3 Center = 625
              Col 4 Center = 875
              Bottom Y = 112
              Each arch between nodes peaks at Y = 40
              Starts at first circle bottom (125, 112) and terminates at last circle bottom (875, 112)
            */}
            <path
              d="M 125 112 C 180 18, 320 18, 375 112 C 430 18, 570 18, 625 112 C 680 18, 820 18, 875 112"
              stroke="#93c5fd"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              fill="none"
            />
          </svg>

          {/* 4-Node Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-x-0 relative z-10">
            {marketItems.map((item) => {
              const resolvedImg = item.image_url || (item.image ? getOptimizedImageUrl(item.image, { quality: 'best', upscale: true }) : '');

              return (
                <div key={item.id} className="w-full flex flex-col items-center group px-2">
                  
                  {/* Circular Node with Uploaded Map Image and 360 Soft Blue Glow */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-[0_0_36px_rgba(59,130,246,0.18)] border border-blue-50 flex items-center justify-center p-2 sm:p-2.5 relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_42px_rgba(37,99,235,0.28)] overflow-hidden">
                    {resolvedImg ? (
                      <img
                        src={resolvedImg}
                        alt={item.label}
                        className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center" />
                    )}
                  </div>


                  {/* Text Label Only (No Box) */}
                  <div className="mt-2.5 text-center">
                    <span className="text-sm sm:text-base font-bold text-white block transition-colors group-hover:text-blue-400">
                      {item.label}
                    </span>
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


