'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Increased size for strong legibility */}
        <Link 
          href="/" 
          className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-md py-1"
        >
          <div className="relative h-12 w-52 sm:h-14 sm:w-60">
            <Image
              src="/logo.png"
              alt="Twinplast Polymers Logo"
              fill
              priority
              sizes="(max-width: 640px) 208px, 240px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold tracking-wide text-foreground/80 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-md px-2.5 py-1"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-surface-border" />
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-sm"
          >
            Request a Quote
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Quote
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/80 hover:bg-secondary/60 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-background md:hidden animate-fade-in">
          <nav
            id="mobile-navigation"
            className="flex flex-col h-[calc(100vh-5rem)] p-6 justify-between bg-background border-t border-surface-border"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-lg font-bold text-foreground hover:text-accent p-4 rounded-xl border border-secondary bg-surface/50 hover:bg-surface transition-all"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-muted" />
                </Link>
              ))}
            </div>
            
            <div className="space-y-4 border-t border-surface-border pt-6">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-accent text-accent-foreground py-4 text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-all"
              >
                Request a Quote
              </Link>
              
              {/* Visual isolation of admin access */}
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-muted/65 py-2 hover:text-muted transition-colors border border-dashed border-surface-border rounded-lg"
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
