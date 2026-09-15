import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { Certification } from '@/types';

interface CertificationSectionProps {
  certifications?: Certification[];
}

export function CertificationSection({ certifications }: CertificationSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/80 border-y border-slate-100" aria-labelledby="certification-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          
          {/* Left Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl bg-[#1a1464] text-white flex flex-col items-center justify-center shadow-md text-center p-3">
            <Award className="w-8 h-8 text-blue-300 mb-1" />
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">ISO</span>
            <span className="text-xs sm:text-sm font-bold leading-tight text-white">9001:2015</span>
          </div>

          {/* Right Content */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>ISO 9001:2015 Certified Company</span>
            </div>

            <h2 id="certification-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              ISO 9001:2015 Quality Certification
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Twinplast Polymers Private Limited is an ISO 9001:2015 certified company operating under a standardized Quality Management System (QMS). We ensure rigorous manufacturing controls, precise sheet dimensions, GSM accuracy, and reliable performance across all product lines.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certified Quality Management</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standardized Inspection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Process Control & Reliability</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
