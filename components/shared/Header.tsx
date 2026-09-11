'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, ChevronRight, Phone, Mail } from 'lucide-react';

interface HeaderProps {
  publicPhone?: string;
  publicEmail?: string;
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

export function Header({ publicPhone, publicEmail }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const phone = publicPhone || '+91 95853 88444';
  const email = publicEmail || 'twinplastpolymers@gmail.com';
  const cleanPhone = phone.replace(/[^+\d]/g, '');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      icon: <FacebookIcon />,
      hoverColor: 'hover:bg-[#1877F2]',
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: <InstagramIcon />,
      hoverColor: 'hover:bg-[#E1306C]',
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/${cleanPhone}`,
      icon: <WhatsAppIcon />,
      hoverColor: 'hover:bg-[#25D366]',
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com',
      icon: <YouTubeIcon />,
      hoverColor: 'hover:bg-[#FF0000]',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">

      {/* ── Top Info Bar ── */}
      <div className="w-full bg-[#1a1464] text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left: contact info */}
          <div className="flex items-center gap-5 text-[11px] font-medium text-white/90">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 shrink-0 opacity-80" />
              <span className="hidden sm:inline">{email}</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 shrink-0 opacity-80" />
              <span>{phone}</span>
            </a>
          </div>

          {/* Right: social icons */}
          <div className="flex items-center gap-1">
            {socialLinks.map((s) => (
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
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md py-1 shrink-0"
            aria-label="Twinplast Polymers Home"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center">
              <Image
                src="/twinplast logo icon.png"
                alt="Twinplast Polymers Logo Icon"
                fill
                priority
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div className="relative h-7 w-36 sm:h-8 sm:w-44 shrink-0 flex items-center">
              <Image
                src="/twinplast logo text-black.png"
                alt="Twinplast Polymers"
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Right Side: Nav Links & CTA Button */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5">
            <nav className="flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-semibold text-slate-600 hover:text-[#1a1464] transition-colors px-3 py-2 rounded-md group"
                >
                  {item.label}
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#1a1464] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                </Link>
              ))}
            </nav>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#1a1464] hover:bg-[#13104f] text-white px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1464]"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#1a1464] hover:bg-[#13104f] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1464]"
            >
              Contact Us
            </Link>
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
        <div className="fixed inset-0 top-[calc(36px+62px)] z-40 bg-white lg:hidden animate-fade-in">
          <nav
            id="mobile-navigation"
            className="flex flex-col h-[calc(100vh-98px)] p-6 justify-between bg-white border-t border-slate-100"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-base font-bold text-slate-700 hover:text-[#1a1464] p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-[#1a1464] hover:bg-[#13104f] text-white py-4 text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Contact Us
              </Link>

              <a
                href={`mailto:${email}`}
                className="block text-center text-xs font-semibold text-slate-500 hover:text-[#1a1464]"
              >
                {email}
              </a>

              {/* Social links in mobile menu */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {socialLinks.map((s) => (
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

              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-600 py-2 hover:underline transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrative Access</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
