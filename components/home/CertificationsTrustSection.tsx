'use client';

import { useState } from 'react';
import { Award, Calendar, FileText, CheckCircle2, Eye, X } from 'lucide-react';
import { Certification } from '@/types';
import { ImageContainer } from '@/components/shared/ImageContainer';

interface CertificationsTrustSectionProps {
  certifications: Certification[];
}

export function CertificationsTrustSection({ certifications }: CertificationsTrustSectionProps) {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#06142c] text-white relative overflow-hidden border-t border-slate-800" aria-labelledby="cert-heading">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
            VERIFIED CORPORATE CREDENTIALS
          </span>
          <h2 id="cert-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Quality &amp; Export Certifications
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Our products meet international quality standards and are trusted globally for B2B industrial applications.
          </p>
          <div className="w-12 h-0.5 bg-blue-500 rounded-full mx-auto pt-0.5 mt-3" />
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="relative flex flex-col p-6 sm:p-7 rounded-xl bg-[#0a1835] border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950 text-blue-400 border border-blue-800/60 text-[10px] font-bold uppercase tracking-wider">
                    <Award className="w-3 h-3" />
                    {cert.credential_type.toUpperCase()} CERTIFIED
                  </span>
                  <h3 className="text-lg font-bold text-white pt-1">{cert.title}</h3>
                </div>

                {cert.image_cloudinary_public_id && (
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Number: <strong className="text-white font-mono">{cert.certificate_number}</strong></span>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Scope: <strong className="text-slate-200">{cert.scope || cert.issuing_organization}</strong></span>
                </div>

                {cert.issuing_organization && (
                  <div className="text-[11px] text-slate-400 pl-5.5">
                    {cert.issuing_organization}
                  </div>
                )}

                {(cert.issue_date || cert.expiry_date) && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {cert.issue_date && `Issued: ${cert.issue_date}`}
                      {cert.issue_date && cert.expiry_date && ' • '}
                      {cert.expiry_date && `Valid Until: ${cert.expiry_date}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white">{selectedCert.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-slate-950">
              <ImageContainer
                src={selectedCert.image_cloudinary_public_id}
                alt={selectedCert.title}
                aspectRatio="tall"
                fit="contain"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
