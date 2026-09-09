'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface FooterProps {
  publicPhone?: string;
  publicEmail?: string;
  publicAddress?: string;
}

export function Footer({ publicPhone, publicEmail, publicAddress }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const phone = publicPhone || '+91 95853 88444';
  const email = publicEmail || 'twinplastpolymers@gmail.com';
  const address = publicAddress || 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan, Thoothukudi, Tamil Nadu • 628101';
  const cleanPhone = phone.replace(/[^+\d]/g, '');

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
    { label: 'Contact Us', href: '/contact' },
  ];

  const productLinks = [
    { label: 'PP Corrugated Sheets', href: '/products' },
    { label: 'Layer Pad Sheets', href: '/products' },
    { label: 'Floor Protection Sheets', href: '/products' },
    { label: 'Sunpack / PP Sheets', href: '/products' },
  ];

  return (
    <footer className="mt-auto transition-all duration-300">
      
      {/* ========================================================================= */}
      {/* MOBILE FOOTER (< md) - Clean, Compact Collapsible Accordions (Ref Design) */}
      {/* ========================================================================= */}
      <div className="md:hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-t border-slate-200/80 dark:border-slate-800 px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Mobile Brand Area */}
          <div className="space-y-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
              aria-label="Twinplast Polymers Home"
            >
              <div className="relative h-9 w-9 shrink-0 flex items-center justify-center">
                <Image
                  src="/twinplast logo icon.png"
                  alt="Twinplast Polymers Logo Icon"
                  fill
                  priority
                  sizes="36px"
                  className="object-contain"
                />
              </div>
              <div className="relative h-7 w-36 shrink-0 flex items-center">
                <Image
                  src="/twinplast logo text-black.png"
                  alt="Twinplast Polymers"
                  fill
                  priority
                  sizes="144px"
                  className="object-contain object-left dark:hidden"
                />
                <Image
                  src="/twinplast logo text-white.png"
                  alt="Twinplast Polymers"
                  fill
                  priority
                  sizes="144px"
                  className="object-contain object-left hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Specialized B2B manufacturer of polypropylene fluted sheets. Established in 2021 in Thoothukudi, Tamil Nadu.
            </p>
          </div>

          {/* Mobile Collapsible Navigation Rows */}
          <div className="border-y border-slate-200 dark:border-slate-800/80 divide-y divide-slate-200/80 dark:divide-slate-800/80">
            
            {/* 1. Quick Links Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('quickLinks')}
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none"
                aria-expanded={!!openSections.quickLinks}
              >
                <span>Quick Links</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSections.quickLinks ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              
              {openSections.quickLinks && (
                <ul className="pb-3.5 space-y-2.5 pl-1 animate-fade-in">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors block py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. Our Products Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('products')}
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none"
                aria-expanded={!!openSections.products}
              >
                <span>Our Products</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSections.products ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              
              {openSections.products && (
                <ul className="pb-3.5 space-y-2.5 pl-1 animate-fade-in">
                  {productLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors block py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 3. Contact Us Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('contact')}
                className="w-full py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none"
                aria-expanded={!!openSections.contact}
              >
                <span>Contact Us</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSections.contact ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              
              {openSections.contact && (
                <div className="pb-3.5 space-y-2.5 pl-1 text-xs text-slate-600 dark:text-slate-400 animate-fade-in">
                  <p className="leading-relaxed">
                    {address}
                  </p>
                  <div className="space-y-1 pt-1">
                    <p>
                      Phone: <a href={`tel:${cleanPhone}`} className="font-bold text-slate-800 dark:text-white hover:text-blue-600 transition-colors">{phone}</a>
                    </p>
                    <p>
                      Email: <a href={`mailto:${email}`} className="font-bold text-slate-800 dark:text-white hover:text-blue-600 transition-colors">{email}</a>
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Bottom Bar */}
          <div className="pt-2 text-center space-y-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              &copy; {currentYear} Twinplast Polymers Pvt. Ltd. All Rights Reserved.
            </p>
            <div>
              <Link
                href="https://www.ekodrix.com/"
                className="text-[11px] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors inline-flex items-center gap-1 justify-center"
              >
                Crafted with love by <span className="inline-flex items-center font-semibold">Ek<Image src="/ekodrix-logo.png" alt="o" width={12} height={12} className="mx-0.5 inline-block rounded-full align-middle" />drix</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP FOOTER (>= md) - Original Dark Navy Footer Intact */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[#06152b] text-slate-200 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Brand/About column - Left 5 cols */}
            <div className="md:col-span-5 flex flex-col gap-5">
              <Link 
                href="/" 
                className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded py-1 shrink-0"
                aria-label="Twinplast Polymers Home"
              >
                <div className="relative h-10 w-10 shrink-0 flex items-center justify-center">
                  <Image
                    src="/twinplast logo icon.png"
                    alt="Twinplast Polymers Logo Icon"
                    fill
                    priority
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
                <div className="relative h-8 w-44 shrink-0 flex items-center">
                  <Image
                    src="/twinplast logo text-white.png"
                    alt="Twinplast Polymers"
                    fill
                    priority
                    sizes="176px"
                    className="object-contain object-left"
                  />
                </div>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Twinplast Polymers Private Limited is a specialized B2B manufacturer of polypropylene fluted sheets. Established in 2021 in Thoothukudi, Tamil Nadu, we engineer durable packaging, separations, and flooring protection products.
              </p>
            </div>

            {/* Quick Links column - Mid 3 cols */}
            <div className="md:col-span-3 md:pl-8 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Quick Links
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

            {/* Our Products column - Right-mid 2 cols */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Our Products
              </span>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
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

            {/* Contact Information column - Right 2 cols */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Contact Us
              </span>
              <address className="not-italic space-y-3 text-sm text-slate-400">
                <p className="leading-relaxed text-xs">
                  {address}
                </p>
                
                <div className="pt-2 space-y-1 text-xs">
                  <p>
                    P: <a href={`tel:${cleanPhone}`} className="text-white hover:text-blue-400 transition-colors font-bold">{phone}</a>
                  </p>
                  <p>
                    E: <a href={`mailto:${email}`} className="text-white hover:text-blue-400 transition-colors font-bold">{email}</a>
                  </p>
                </div>
              </address>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {currentYear} Twinplast Polymers Pvt. Ltd. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.ekodrix.com/"
                className="text-sm text-slate-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5 inline-flex items-center gap-1"
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
