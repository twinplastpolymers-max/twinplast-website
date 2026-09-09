'use client';

import { 
  Package, 
  Wine, 
  Building2, 
  Printer, 
  Factory, 
  Car, 
  Sprout, 
  Layers, 
  Zap, 
  FlaskConical, 
  UtensilsCrossed, 
  Cpu, 
  ArrowRight,
  LucideIcon 
} from 'lucide-react';
import Link from 'next/link';
import { Industry } from '@/types';

interface IndustriesSectionProps {
  industries: Industry[];
  title?: string;
  subtitle?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Package,
  Wine,
  Building2,
  Printer,
  Factory,
  Car,
  Sprout,
  Layers,
  Zap,
  FlaskConical,
  UtensilsCrossed,
  Cpu,
};

export function IndustriesSection({ 
  industries, 
  title = 'Industries & Applications', 
  subtitle = 'Our polypropylene sheets and PP products are widely used across industries, delivering reliable performance in challenging environments.' 
}: IndustriesSectionProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              FORMATIVE SOLUTIONS FOR EVERY INDUSTRY
            </span>
            <h2 id="industries-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-600/20 shrink-0"
          >
            <span>Explore Applications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Industries Grid — 4-Column Desktop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind) => {
            const IconComponent = (ind.icon_name && iconMap[ind.icon_name]) ? iconMap[ind.icon_name] : Layers;

            return (
              <div
                key={ind.id}
                className="flex flex-col p-5 sm:p-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400/80 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {ind.title}
                </h3>
                
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {ind.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
