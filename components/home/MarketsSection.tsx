import { Globe2 } from 'lucide-react';

export interface MarketsSectionProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  regions?: string[];
}

export function MarketsSection({
  eyebrow = 'SUPPLYING QUALITY WORLDWIDE',
  heading = 'Markets We Serve',
  body,
  regions = [],
}: MarketsSectionProps) {
  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100" aria-label="Markets">
      <div className="mx-auto max-w-7xl text-center space-y-8">
        
        <div className="max-w-xl mx-auto space-y-1.5">
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
              {eyebrow}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {heading}
          </h2>
          {body && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {body}
            </p>
          )}
        </div>

        {regions && regions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {regions.map((region) => (
              <div key={region} className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 flex flex-col items-center justify-center gap-2.5 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 shadow-2xs">
                <Globe2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-center">{region}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
