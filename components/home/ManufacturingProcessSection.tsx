'use client';

import { 
  Layers, 
  RotateCw, 
  Cpu, 
  LayoutGrid, 
  ThermometerSnowflake, 
  Scissors, 
  CheckCircle, 
  PackageCheck, 
  Truck,
  ArrowRight,
  LucideIcon 
} from 'lucide-react';
import Link from 'next/link';
import { ManufacturingStep } from '@/types';

interface ManufacturingProcessSectionProps {
  steps: ManufacturingStep[];
}

const stepIconMap: Record<string, LucideIcon> = {
  Layers,
  RotateCw,
  Cpu,
  LayoutGrid,
  ThermometerSnowflake,
  Scissors,
  CheckCircle,
  PackageCheck,
  Truck,
};

export function ManufacturingProcessSection({ steps }: ManufacturingProcessSectionProps) {
  if (!steps || steps.length === 0) return null;

  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 lg:mb-16 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              FROM RAW MATERIAL TO RELIABLE PRODUCTS
            </span>
            <h2 id="process-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              9-Stage Manufacturing Process
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              A standardized process ensuring superior quality, consistency and performance in every sheet and product we manufacture.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-600/20 shrink-0"
          >
            <span>Our Manufacturing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: Clean Vertical Progression Timeline */}
        <div className="block lg:hidden space-y-0 max-w-md mx-auto">
          {sortedSteps.map((step, idx) => {
            const IconComponent = (step.icon_name && stepIconMap[step.icon_name]) ? stepIconMap[step.icon_name] : Layers;
            const numStr = step.step_number < 10 ? `0${step.step_number}` : `${step.step_number}`;
            const isLast = idx === sortedSteps.length - 1;

            return (
              <div key={step.id} className="flex gap-4">
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 shadow-sm z-10">
                    {numStr}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-blue-200 min-h-[2.5rem]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: High-Fidelity Horizontal Connected Pipeline */}
        <div className="hidden lg:block">
          <div className="relative pt-2 pb-4">
            {/* Horizontal connecting line across circles */}
            <div className="absolute top-8 left-[4%] right-[4%] h-[3px] bg-blue-200 -z-0" />

            {/* 9-Column Steps Grid */}
            <div className="grid grid-cols-9 gap-3 relative z-10">
              {sortedSteps.map((step) => {
                const IconComponent = (step.icon_name && stepIconMap[step.icon_name]) ? stepIconMap[step.icon_name] : Layers;
                const numStr = step.step_number < 10 ? `0${step.step_number}` : `${step.step_number}`;

                return (
                  <div key={step.id} className="flex flex-col items-center text-center group">
                    {/* Numbered circle with white ring */}
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-sm font-extrabold font-mono flex items-center justify-center shadow-md ring-4 ring-slate-50 group-hover:bg-blue-700 group-hover:scale-105 transition-all duration-300 mb-3">
                      {numStr}
                    </div>
                    
                    {/* Icon container */}
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/90 text-blue-600 flex items-center justify-center mb-2.5 shadow-2xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Stage Title */}
                    <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
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
