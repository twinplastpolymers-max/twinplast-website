'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Phone, Mail } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface FooterProps {
  publicPhone?: string;
  whatsappNumber?: string;
  publicEmail?: string;
  publicAddress?: string;
  products?: Array<{ title: string; slug: string }>;
}

export function Footer({ publicPhone, whatsappNumber, publicEmail, publicAddress, products }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const phone = publicPhone?.trim() || '';
  const waNumber = whatsappNumber?.trim() || '';
  const email = publicEmail?.trim() || '';
  const address = publicAddress?.trim() || '';
  const cleanPhone = phone ? phone.replace(/[^+\d]/g, '') : '';
  const cleanWaNumber = waNumber ? waNumber.replace(/[^+\d]/g, '').replace('+', '') : '';

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const productLinks = products && products.length > 0
    ? products.map((p) => ({ label: p.title, href: `/products/${p.slug}` }))
    : [];

  return (
    <footer className="mt-auto transition-all duration-300">

      {/* ========================================================================= */}
      {/* MOBILE FOOTER (< md) - Clean, Compact Collapsible Accordions (Dark Navy same as Desktop) */}
      {/* ========================================================================= */}
      <div className="md:hidden bg-[#06152b] text-slate-200 border-t-0 px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto space-y-6">

          {/* Mobile Brand Area */}
          <div className="space-y-2">
            <Link href="/" className="relative h-20 w-60 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 rounded">
              <Image
                src="/logo-white.png"
                alt="Twinplast Polymers Logo"
                fill
                priority
                sizes="240px"
                className="object-contain object-left"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specialized manufacturer of polypropylene fluted sheets. Established in 2021 in Thoothukudi, Tamil Nadu.
            </p>
          </div>

          {/* Mobile Collapsible Navigation Rows */}
          <div className="border-y border-slate-800 divide-y divide-slate-800/80">

            {/* 1. Quick Links Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('quickLinks')}
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors focus-visible:outline-none"
                aria-expanded={!!openSections.quickLinks}
              >
                <span>Quick Links</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSections.quickLinks ? 'rotate-180 text-blue-400' : ''}`} />
              </button>

              {openSections.quickLinks && (
                <ul className="pb-3.5 space-y-2.5 pl-1 animate-fade-in">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. Products Accordion */}
            {productLinks.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('products')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors focus-visible:outline-none"
                  aria-expanded={!!openSections.products}
                >
                  <span>Our Products</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSections.products ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                {openSections.products && (
                  <ul className="pb-3.5 space-y-2.5 pl-1 animate-fade-in">
                    {productLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 3. Contact Us Accordion */}
            {(address || phone || waNumber || email) && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('contact')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors focus-visible:outline-none"
                  aria-expanded={!!openSections.contact}
                >
                  <span>Contact Us</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSections.contact ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                {openSections.contact && (
                  <div className="pb-3.5 space-y-2.5 pl-1 text-xs text-slate-400 animate-fade-in">
                    {address && <p className="leading-relaxed">{address}</p>}
                    <div className="space-y-2 pt-1">
                      {phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <a href={`tel:${cleanPhone}`} className="font-bold text-white hover:text-blue-400 transition-colors">{phone}</a>
                        </p>
                      )}
                      {waNumber && (
                        <p className="flex items-center gap-2">
                          <WhatsAppIcon />
                          <a href={`https://wa.me/${cleanWaNumber}`} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">{waNumber}</a>
                        </p>
                      )}
                      {email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`mailto:${email}`} className="font-bold text-white hover:text-blue-400 transition-colors">{email}</a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile Bottom Bar */}
          <div className="pt-2 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              &copy; {currentYear} Twinplast Polymers Pvt. Ltd. All Rights Reserved.
            </p>
            <div>
              <Link
                href="https://www.ekodrix.com/"
                className="text-[11px] text-slate-500 hover:text-white transition-colors inline-flex items-center gap-1 justify-center"
              >
                Crafted with love by <span className="inline-flex items-center font-semibold text-slate-400">Ek<Image src="/ekodrix-logo.png" alt="o" width={12} height={12} className="mx-0.5 inline-block rounded-full align-middle" />drix</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP FOOTER (>= md) - Original Dark Navy Footer Intact */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[#06152b] text-slate-200 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Brand/About column - Left 4 cols */}
            <div className="md:col-span-4 flex flex-col gap-2">
              <Link href="/" className="relative h-28 w-72 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded">
                <Image
                  src="/logo-white.png"
                  alt="Twinplast Polymers Logo"
                  fill
                  priority
                  sizes="300px"
                  className="object-contain object-left"
                />
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Twinplast Polymers Private Limited is a specialized manufacturer of polypropylene fluted sheets. Established in 2021 in Thoothukudi, Tamil Nadu, we engineer durable packaging, separations, and flooring protection products.
              </p>
            </div>

            {/* Pages / Quick Links column - Mid 2 cols */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Pages
              </span>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Products column - Right-mid 3 cols */}
            {productLinks.length > 0 && (
              <div className="md:col-span-3 flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Our Products
                </span>
                <ul className="space-y-3">
                  {productLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5 block truncate"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Information column - Right 3 cols */}
            {(address || phone || waNumber || email) && (
              <div className="md:col-span-3 flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Contact Us
                </span>
                <address className="not-italic space-y-3 text-sm text-slate-400">
                  {address && <p className="leading-relaxed text-xs">{address}</p>}

                  <div className="pt-1 space-y-2 text-xs">
                    {phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <a href={`tel:${cleanPhone}`} className="text-white hover:text-blue-400 transition-colors font-medium">{phone}</a>
                      </p>
                    )}
                    {waNumber && (
                      <p className="flex items-center gap-2">
                        <WhatsAppIcon />
                        <a href={`https://wa.me/${cleanWaNumber}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">{waNumber}</a>
                      </p>
                    )}
                    {email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${email}`} className="text-white hover:text-blue-400 transition-colors font-medium break-all">{email}</a>
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>Send an Enquiry</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </address>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Vertically centered with equal top and bottom padding */}
        <div className="border-t border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {currentYear} Twinplast Polymers Pvt. Ltd. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.ekodrix.com/"
                className="text-xs text-slate-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5 inline-flex items-center gap-1"
              >
                Crafted with love by <span className="inline-flex items-center font-semibold">Ek<Image src="/ekodrix-logo.png" alt="o" width={14} height={14} className="mx-0.5 inline-block rounded-full align-middle" />drix</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
