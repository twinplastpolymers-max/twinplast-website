'use client';

import { ManufacturingStep } from '@/types';

interface ManufacturingProcessSectionProps {
  steps: ManufacturingStep[];
}

// 9 Rich, tailored colors faithfully extracted from the reference infographic
const STEP_COLORS = [
  { border: '#00838f', bg: '#00838f' }, // 01 - Teal
  { border: '#7e1742', bg: '#7e1742' }, // 02 - Deep Wine / Maroon
  { border: '#e59819', bg: '#e59819' }, // 03 - Warm Amber / Gold
  { border: '#3b3131', bg: '#3b3131' }, // 04 - Charcoal / Dark Espresso
  { border: '#d81b60', bg: '#d81b60' }, // 05 - Vivid Magenta / Berry Red
  { border: '#4d3d75', bg: '#4d3d75' }, // 06 - Deep Purple / Indigo
  { border: '#1d4ed8', bg: '#1d4ed8' }, // 07 - Royal Cobalt Blue
  { border: '#059669', bg: '#059669' }, // 08 - Emerald Forest Green
  { border: '#1a1464', bg: '#1a1464' }, // 09 - Signature Deep Navy
];

// Fallback descriptions matching Twinplast manufacturing process
const STEP_DEFAULT_DESCRIPTIONS: Record<number, string> = {
  1: 'Virgin polymer granules & additives selected for optimal sheet performance.',
  2: 'Precise batch blending with UV stabilizers, antioxidants and color masterbatches.',
  3: 'High-temperature melt extrusion through precision-calibrated die heads.',
  4: 'Continuous hollow fluted structure forming with uniform wall calibration.',
  5: 'Multi-zone controlled cooling to eliminate thermal stress and surface warpage.',
  6: 'High-speed automated inline trimming to exact customer dimensions.',
  7: 'Rigorous QA inspection for GSM, thickness, flute integrity and flatness.',
  8: 'Corner-guarded protective strapping and palletizing for safe transport.',
  9: 'Coordinated logistics ensuring prompt delivery across all destinations.',
};

export function ManufacturingProcessSection({ steps }: ManufacturingProcessSectionProps) {
  if (!steps || steps.length === 0) return null;

  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

  return (
    <section className="py-16 sm:py-10 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 lg:mb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
            FROM RAW MATERIAL TO RELIABLE PRODUCTS
          </span>
          <h2 id="process-heading" className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
            Nine Stage Manufacturing Process
          </h2>
     
        </div>

        {/* Horizontal Scroll Area for all screen sizes, perfectly centered on large displays */}
        <div className="overflow-x-auto pb-8 pt-2 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="min-w-[1080px] flex items-center sm:justify-center justify-start py-4">
            <div className="flex items-center">
              {sortedSteps.map((step, idx) => {
                // Alternating layout matching the reference infographic:
                // Odd indices (0, 2, 4, 6, 8 -> Steps 01, 03, 05, 07, 09) = Bottom Tier (Z-10)
                // Even indices (1, 3, 5, 7 -> Steps 02, 04, 06, 08) = Top Tier (Z-20, overlapping adjacent bottom circles)
                const isTop = idx % 2 === 1;
                const color = STEP_COLORS[idx % STEP_COLORS.length];
                const numStr = step.step_number < 10 ? `0${step.step_number}` : `${step.step_number}`;
                const desc = step.description?.trim() || STEP_DEFAULT_DESCRIPTIONS[step.step_number] || '';

                return (
                  <div
                    key={step.id || idx}
                    className={`relative flex flex-col items-center shrink-0 w-[140px] sm:w-[152px] ${
                      isTop ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      marginLeft: idx === 0 ? '0px' : '-36px',
                    }}
                  >
                    {/* TOP SLOT */}
                    {isTop ? (
                      <div className="flex flex-col items-center w-full">
                        {/* Top Description */}
                        <div className="h-[76px] flex items-end justify-center px-1 pb-1">
                          <p className="text-[11px] sm:text-xs text-slate-600 text-center leading-snug line-clamp-3 font-normal max-w-[130px]">
                            {desc}
                          </p>
                        </div>
                        {/* Top Pin Dot */}
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: color.bg }}
                        />
                        {/* Top Pin Stem directly connecting into top apex of circle */}
                        <div
                          className="w-[2px] h-10 sm:h-12 shrink-0"
                          style={{ backgroundColor: color.bg }}
                        />
                      </div>
                    ) : (
                      /* Spacer aligning bottom-tier circles */
                      <div className="h-[136px] sm:h-[144px] w-full" aria-hidden="true" />
                    )}

                    {/* CIRCLE WIDGET (Concentric Double Ring with Pure White Gap) */}
                    <div
                      className="w-[140px] h-[140px] sm:w-[152px] sm:h-[152px] rounded-full p-2 sm:p-2.5 bg-white shrink-0 shadow-md transition-transform duration-300 hover:scale-105 select-none"
                      style={{
                        border: `3.5px solid ${color.border}`,
                      }}
                    >
                      {/* Inner Solid Circle */}
                      <div
                        className="w-full h-full rounded-full flex flex-col items-center justify-center text-center px-2 shadow-inner"
                        style={{ backgroundColor: color.bg }}
                      >
                        {/* Bold Step Number */}
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                          {numStr}
                        </span>
                        {/* Uppercase Step Title */}
                        <span className="text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider leading-tight mt-1.5 line-clamp-2">
                          {step.title}
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM SLOT */}
                    {!isTop ? (
                      <div className="flex flex-col items-center w-full">
                        {/* Bottom Pin Stem directly connecting from bottom apex of circle */}
                        <div
                          className="w-[2px] h-10 sm:h-12 shrink-0"
                          style={{ backgroundColor: color.bg }}
                        />
                        {/* Bottom Pin Dot */}
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: color.bg }}
                        />
                        {/* Bottom Description */}
                        <div className="h-[76px] flex items-start justify-center px-1 pt-1">
                          <p className="text-[11px] sm:text-xs text-slate-600 text-center leading-snug line-clamp-3 font-normal max-w-[130px]">
                            {desc}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Spacer aligning top-tier columns */
                      <div className="h-[136px] sm:h-[144px] w-full" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
