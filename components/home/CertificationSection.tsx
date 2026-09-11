import Image from 'next/image';
import { Certification } from '@/types';

interface CertificationSectionProps {
  certifications: Certification[];
}

export function CertificationSection({ certifications }: CertificationSectionProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-10" aria-labelledby="certification-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="certification-heading" className="text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900 text-center font-normal">
          Certification
        </h2>
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-8">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex flex-col items-center">
              {cert.image_url && (
                <div className="relative max-w-xl sm:max-w-2xl w-full flex justify-center border border-black">
                  <Image
                    src={cert.image_url}
                    alt={cert.title || 'Certification'}
                    width={800}
                    height={560}
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="w-full max-w-xl sm:max-w-2xl h-auto object-contain "
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
