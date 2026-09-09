'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, ChevronRight, Phone } from 'lucide-react';

interface HeaderProps {
  publicPhone?: string;
  publicEmail?: string;
}

export function Header({ publicPhone, publicEmail }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const phone = publicPhone || '+91 95853 88444';
  const email = publicEmail || 'twinplastpolymers@gmail.com';
  const cleanPhone = phone.replace(/[^+\d]/g, '');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Industries', href: '/#industries-heading' },
    { label: 'Quality', href: '/#quality-heading' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
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

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-semibold text-slate-600 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md px-2.5 py-1.5"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-slate-200 mx-1" />
          
          <a
            href={`tel:${cleanPhone}`}
            className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors px-2"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>{phone}</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ml-1"
          >
            Request a Quote
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Quote
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

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white lg:hidden animate-fade-in">
          <nav
            id="mobile-navigation"
            className="flex flex-col h-[calc(100vh-4rem)] p-6 justify-between bg-white border-t border-slate-100"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-base font-bold text-slate-700 hover:text-blue-600 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all"
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
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-4 text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Request a Quote
              </Link>

              <a
                href={`mailto:${email}`}
                className="block text-center text-xs font-semibold text-slate-500 hover:text-blue-600"
              >
                {email}
              </a>
              
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
