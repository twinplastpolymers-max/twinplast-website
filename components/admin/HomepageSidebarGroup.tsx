'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronDown } from 'lucide-react';

const subLinks = [
  { label: 'Hero Section',     href: '/admin/homepage/hero' },
  { label: 'About Company',    href: '/admin/homepage/about' },
  { label: 'About Images',     href: '/admin/homepage/about-images' },
  { label: 'Vision & Mission', href: '/admin/homepage/vision-mission' },
  { label: 'Why Choose',       href: '/admin/homepage/why-choose' },
  { label: 'Quality',          href: '/admin/homepage/quality' },
  { label: 'Markets',          href: '/admin/homepage/markets' },
  { label: 'Final CTA',        href: '/admin/homepage/final-cta' },
  { label: 'Statistics',       href: '/admin/homepage/statistics' },
];

export function HomepageSidebarGroup() {
  const pathname = usePathname();
  const isHomepageActive = pathname.startsWith('/admin/homepage');
  const [isOpen, setIsOpen] = useState(isHomepageActive);

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleParentClick = (e: React.MouseEvent) => {
    if (pathname === '/admin/homepage/hero') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div>
      {/* Parent link row with open/close toggle */}
      <div
        className={`group flex items-center justify-between rounded-lg transition-colors ${
          isHomepageActive
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 font-semibold'
        }`}
      >
        <Link
          href="/admin/homepage/hero"
          onClick={handleParentClick}
          className="flex-1 flex items-center gap-3 px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Home className={`w-4 h-4 ${isHomepageActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          <span>Homepage</span>
        </Link>

        <button
          type="button"
          onClick={toggleOpen}
          aria-label={isOpen ? 'Close Homepage sub-menu' : 'Open Homepage sub-menu'}
          title={isOpen ? 'Click to close' : 'Click to open'}
          className="p-2 mr-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>
      </div>

      {/* Sub-links — open/close based on isOpen */}
      {isOpen && (
        <div className="ml-4 mt-1 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
          {subLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60'
                }`}
              >
                {isActive && <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
