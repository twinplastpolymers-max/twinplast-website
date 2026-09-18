'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, ChevronRight, ChevronDown, Phone, Mail, MessageCircle } from 'lucide-react';

interface HeaderProps {
  publicPhone?: string;
  secondaryPhone?: string;
  whatsappNumber?: string;
  publicEmail?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  products?: Array<{ title: string; slug: string }>;
  solutions?: Array<{ id: string; title: string }>;
}

// Social media SVG icons (inline, no extra library needed)
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export function Header({ publicPhone, secondaryPhone, whatsappNumber, publicEmail, socialLinks, products, solutions }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<'products' | 'solutions' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<{ products: boolean; solutions: boolean }>({
    products: false,
    solutions: false,
  });
  const pathname = usePathname();

  const phone = publicPhone?.trim() || '';
  const waNumber = (whatsappNumber && whatsappNumber.trim()) ? whatsappNumber.trim() : (secondaryPhone?.trim() || '');
  const email = publicEmail?.trim() || '';
  const cleanPhone = phone ? phone.replace(/[^+\d]/g, '') : '';
  const cleanWaNumber = waNumber ? waNumber.replace(/[^+\d]/g, '').replace('+', '') : '';

  const productList = products || [];
  const solutionList = solutions || [];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const fbUrl = socialLinks?.facebook?.trim() || 'https://facebook.com';
  const igUrl = socialLinks?.instagram?.trim() || 'https://instagram.com';
  const twUrl = socialLinks?.twitter?.trim() || 'https://twitter.com';
  const ytUrl = socialLinks?.youtube?.trim() || 'https://youtube.com';

  const socialLinksList = [
    {
      label: 'Facebook',
      href: fbUrl,
      icon: <FacebookIcon />,
      hoverColor: 'hover:bg-[#1877F2]',
    },
    {
      label: 'Instagram',
      href: igUrl,
      icon: <InstagramIcon />,
      hoverColor: 'hover:bg-[#E1306C]',
    },
    {
      label: 'Twitter',
      href: twUrl,
      icon: <TwitterIcon />,
      hoverColor: 'hover:bg-slate-800',
    },
    {
      label: 'YouTube',
      href: ytUrl,
      icon: <YouTubeIcon />,
      hoverColor: 'hover:bg-[#FF0000]',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">

      {/* ── Top Info Bar ── */}
      <div className="w-full bg-[#1a1464] text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left: contact info (Phone 1st, WhatsApp 2nd, Email 3rd) */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 text-[10px] sm:text-[11px] font-medium text-white/90 overflow-x-auto no-scrollbar">
            {email && (
              <a
                href={`mailto:${email}`}
                className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors shrink-0"
              >
                <Mail className="w-3 h-3 shrink-0 opacity-80" />
                <span>{email}</span>
              </a>
            )}

            {phone && (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors shrink-0"
                title="Phone Number (1st Place)"
              >
                <Phone className="w-3 h-3 shrink-0 opacity-80 text-blue-300" />
                <span>{phone}</span>
              </a>
            )}

            {waNumber && (
              <a
                href={`https://wa.me/${cleanWaNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors shrink-0 opacity-90 hover:opacity-100"
                title="WhatsApp (2nd Place)"
              >
                <WhatsAppIcon />
                <span>{waNumber}</span>
              </a>
            )}
          </div>

          {/* Right: social icons */}
          <div className="flex items-center gap-1">
            {socialLinksList.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white transition-all duration-200 ${s.hoverColor} hover:scale-110`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="mx-auto flex py-3 sm:py-3.5 min-h-[80px] sm:min-h-[88px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand Logo */}
          <Link
            href="/"
            className="flex flex-col items-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md py-1 shrink-0 group"
            aria-label="Twinplast Polymers Home"
          >
            <div className="flex items-center gap-1 sm:gap-0">
              <div className="relative h-11 w-11 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center">
                <Image
                  src="/twinplast logo icon.png"
                  alt="Twinplast Polymers Logo Icon"
                  fill
                  priority
                  sizes="(max-width: 640px) 44px, 56px"
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 w-40 sm:h-11 sm:w-56 shrink-0 flex items-center">
                <Image
                  src="/twinplast logo text-black.png"
                  alt="Twinplast Polymers"
                  fill
                  priority
                  sizes="(max-width: 640px) 160px, 224px"
                  className="object-contain object-left"
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-1 -mt-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-[#1a1464]">
              <Shield className="w-3 h-3 text-[#1a1464] shrink-0" />
              <span>ISO 9001:2015 Certified Company</span>
            </div>
          </Link>

          {/* Desktop Right Side: Nav Links & CTA Button */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5">
            <nav className="flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
              {/* Home */}
              <Link
                href="/"
                className={`relative text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive('/') ? 'text-[#1a1464] font-bold' : 'text-slate-600 hover:text-[#1a1464]'
                  }`}
              >
                Home
                {isActive('/') && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2.5px] bg-[#1a1464] rounded-full" />
                )}
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className={`relative text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive('/about') ? 'text-[#1a1464] font-bold' : 'text-slate-600 hover:text-[#1a1464]'
                  }`}
              >
                About Us
                {isActive('/about') && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2.5px] bg-[#1a1464] rounded-full" />
                )}
              </Link>

              {/* Products Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setHoveredNav('products')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href="/products"
                  className={`relative inline-flex items-center gap-1 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive('/products') ? 'text-[#1a1464] font-bold' : 'text-slate-600 hover:text-[#1a1464]'
                    }`}
                >
                  <span>Products</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#1a1464] transition-transform duration-200 group-hover:rotate-180" />
                  {isActive('/products') && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2.5px] bg-[#1a1464] rounded-full" />
                  )}
                </Link>

                <div
                  className={`absolute left-0 top-full pt-2 w-72 transition-all duration-200 ${hoveredNav === 'products'
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-0.5 ring-1 ring-black/5">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      PP Sheet Catalog
                    </div>
                    {productList.map((prod) => (
                      <Link
                        key={prod.slug}
                        href={`/products/${prod.slug}`}
                        onClick={() => setHoveredNav(null)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-[#1a1464] hover:bg-blue-50/70 transition-all group/item"
                      >
                        <span>{prod.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-[#1a1464] group-hover/item:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <Link
                        href="/products"
                        onClick={() => setHoveredNav(null)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#1a1464] hover:bg-blue-50/90 transition-colors"
                      >
                        <span>View All Products</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setHoveredNav('solutions')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href="/solutions"
                  className={`relative inline-flex items-center gap-1 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive('/solutions') ? 'text-[#1a1464] font-bold' : 'text-slate-600 hover:text-[#1a1464]'
                    }`}
                >
                  <span>Solutions</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#1a1464] transition-transform duration-200 group-hover:rotate-180" />
                  {isActive('/solutions') && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2.5px] bg-[#1a1464] rounded-full" />
                  )}
                </Link>

                <div
                  className={`absolute left-0 top-full pt-2 w-72 transition-all duration-200 ${hoveredNav === 'solutions'
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-0.5 ring-1 ring-black/5">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Industry Applications
                    </div>
                    {solutionList.map((sol) => (
                      <Link
                        key={sol.id || sol.title}
                        href={`/solutions/${sol.id}`}
                        onClick={() => setHoveredNav(null)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-[#1a1464] hover:bg-blue-50/70 transition-all group/item"
                      >
                        <span>{sol.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-[#1a1464] group-hover/item:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <Link
                        href="/solutions"
                        onClick={() => setHoveredNav(null)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#1a1464] hover:bg-blue-50/90 transition-colors"
                      >
                        <span>View All Solutions</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Us */}
              <Link
                href="/contact"
                className={`relative text-sm font-semibold transition-colors px-3 py-2 rounded-md ${isActive('/contact') ? 'text-[#1a1464] font-bold' : 'text-slate-600 hover:text-[#1a1464]'
                  }`}
              >
                Contact Us
                {isActive('/contact') && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2.5px] bg-[#1a1464] rounded-full" />
                )}
              </Link>

            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#1a1464] hover:bg-[#13104f] text-white px-4 py-2.5 text-[12px] xl:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1464]"
              >
                Request for Sample
              </Link>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-[calc(36px+62px)] z-40 bg-white lg:hidden animate-fade-in overflow-y-auto">
          <nav
            id="mobile-navigation"
            className="flex flex-col min-h-[calc(100vh-98px)] p-6 justify-between bg-white border-t border-slate-100"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`text-base py-2 transition-colors ${isActive('/') ? 'font-bold text-[#1a1464]' : 'font-medium text-slate-700 hover:text-[#1a1464]'
                  }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`text-base py-2 transition-colors ${isActive('/about') ? 'font-bold text-[#1a1464]' : 'font-medium text-slate-700 hover:text-[#1a1464]'
                  }`}
              >
                About Us
              </Link>

              {/* Products Accordion */}
              <div className="py-1 border-y border-slate-50">
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/products"
                    onClick={() => setIsOpen(false)}
                    className={`text-base transition-colors ${isActive('/products') ? 'font-bold text-[#1a1464]' : 'font-medium text-slate-700 hover:text-[#1a1464]'
                      }`}
                  >
                    Products
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(prev => ({ ...prev, products: !prev.products }))}
                    className="p-1 text-slate-500 hover:text-[#1a1464]"
                    aria-label="Toggle Products Submenu"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileExpanded.products ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {mobileExpanded.products && (
                  <div className="pl-4 pb-2 space-y-2 border-l-2 border-blue-100 ml-1 mt-1">
                    {productList.map((prod) => (
                      <Link
                        key={prod.slug}
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block text-xs font-medium text-slate-600 hover:text-[#1a1464] py-1"
                      >
                        {prod.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions Accordion */}
              <div className="py-1 border-b border-slate-50">
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/solutions"
                    onClick={() => setIsOpen(false)}
                    className={`text-base transition-colors ${isActive('/solutions') ? 'font-bold text-[#1a1464]' : 'font-medium text-slate-700 hover:text-[#1a1464]'
                      }`}
                  >
                    Solutions
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(prev => ({ ...prev, solutions: !prev.solutions }))}
                    className="p-1 text-slate-500 hover:text-[#1a1464]"
                    aria-label="Toggle Solutions Submenu"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileExpanded.solutions ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {mobileExpanded.solutions && (
                  <div className="pl-4 pb-2 space-y-2 border-l-2 border-blue-100 ml-1 mt-1">
                    {solutionList.map((sol) => (
                      <Link
                        key={sol.id || sol.title}
                        href={`/solutions/${sol.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block text-xs font-medium text-slate-600 hover:text-[#1a1464] py-1"
                      >
                        {sol.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={`text-base py-2 transition-colors ${isActive('/contact') ? 'font-bold text-[#1a1464]' : 'font-medium text-slate-700 hover:text-[#1a1464]'
                  }`}
              >
                Contact Us
              </Link>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6 mt-6">
              <div className="flex flex-col gap-2">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-sm bg-[#1a1464] hover:bg-[#13104f] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Request for Sample
                </Link>
              </div>

              <div className="flex flex-col items-center gap-1.5 pt-1">
                {phone && (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1a1464]"
                  >
                    <Phone className="w-3 h-3 text-[#1a1464]" />
                    <span>{phone}</span>
                  </a>
                )}
                {waNumber && (
                  <a
                    href={`https://wa.me/${cleanWaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp: {waNumber}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1a1464] pt-0.5"
                  >
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{email}</span>
                  </a>
                )}
              </div>

              {/* Social links in mobile menu */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {socialLinksList.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 transition-all duration-200 ${s.hoverColor} hover:text-white hover:scale-110`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
