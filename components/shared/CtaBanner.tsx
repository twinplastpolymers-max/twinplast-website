import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export interface CtaBannerProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  contactLabel?: string;
  contactHref?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function CtaBanner({
  eyebrow = 'INITIATE CONSULTATION',
  heading = 'Have a PP Requirement? Let’s Talk.',
  description = 'Discuss your requirements with our team and find the right PP product for your application.',
  contactLabel = 'Contact Us',
  contactHref = '/contact',
  whatsappNumber = '919585388444',
  whatsappMessage = 'Hi Twinplast, I would like to enquire about your PP sheet products.',
}: CtaBannerProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="pt-8 pb-0 sm:py-16 px-0 sm:px-6 lg:px-8 bg-white w-full">
      <div className="mx-auto max-w-7xl w-full">
        <div className="bg-[#1a1464] text-white px-6 py-10 sm:p-12 lg:p-14 shadow-none sm:shadow-lg rounded-none sm:rounded-sm w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Suitable Project Content */}
            <div className="lg:col-span-8 space-y-3">
              {eyebrow && (
                <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{eyebrow}</span>
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
                {heading}
              </h2>
              {description && (
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Right Side: Contact Us & WhatsApp Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              {/* Contact Us Button */}
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#1a1464] font-bold px-6 py-3.5 text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all shadow-sm hover:shadow-md cursor-pointer text-center"
              >
                <span>{contactLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/60 font-bold px-6 py-3.5 text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all cursor-pointer text-center"
              >
                {/* WhatsApp SVG Icon */}
                <svg
                  className="w-4 h-4 fill-current text-green-400"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
