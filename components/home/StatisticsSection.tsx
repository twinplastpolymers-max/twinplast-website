import React from 'react';

export interface StatItem {
  count: string;
  heading: string;
  description?: string;
}

export interface StatisticsSectionProps {
  stats?: StatItem[];
}

export function StatisticsSection({ stats }: StatisticsSectionProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-black border-t border-zinc-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.slice(0, 4).map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl sm:text-3xl text-white tracking-tight">{stat.count}</p>
              <h3 className="text-sm font-semibold text-slate-200 mt-1.5">{stat.heading}</h3>
              {stat.description && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[140px] mx-auto">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
