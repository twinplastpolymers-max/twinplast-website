'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, ChevronDown, ChevronRight } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Products', href: '/products', hasDropdown: true },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Enlarged substantially for prominence matching reference */}
        <Link 
          href="/" 
          className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md py-1"
        >
          <div className="relative h-16 w-60 sm:h-20 sm:w-72">
            <Image
              src="/logo.png"
              alt="Twinplast Polymers Logo"
              fill
              priority
              sizes="(max-width: 640px) 240px, 288px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1 text-sm font-bold tracking-wide text-slate-600 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md px-2 py-1"
            >
              <span>{item.label}</span>
              {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-slate-200" />
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Request a Quote
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
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
        <div className="fixed inset-0 top-20 z-40 bg-white md:hidden animate-fade-in">
          <nav
            id="mobile-navigation"
            className="flex flex-col h-[calc(100vh-5rem)] p-6 justify-between bg-white border-t border-slate-100"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-3">
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
