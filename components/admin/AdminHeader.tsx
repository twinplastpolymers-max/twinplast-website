'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ExternalLink,
  Mail,
  LayoutDashboard,
  ShoppingBag,
  Award,
  Building2,
  Layers,
  Settings,
} from 'lucide-react';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { HomepageSidebarGroup } from '@/components/admin/HomepageSidebarGroup';

const routeLabels: Record<string, { title: string; category?: string }> = {
  '/admin': { title: 'Dashboard' },
  '/admin/products': { title: 'Products Catalog', category: 'Catalog' },
  '/admin/certifications': { title: 'Quality Certifications', category: 'Compliance' },
  '/admin/industries': { title: 'Industries Served', category: 'Markets' },
  '/admin/manufacturing': { title: 'Manufacturing Process', category: 'Operations' },
  '/admin/enquiries': { title: 'Client Enquiries', category: 'Messages' },
  '/admin/settings': { title: 'Site Settings', category: 'Configuration' },
  '/admin/homepage/hero': { title: 'Hero Section', category: 'Homepage' },
  '/admin/homepage/about': { title: 'About Company', category: 'Homepage' },
  '/admin/homepage/about-images': { title: 'About Images', category: 'Homepage' },
  '/admin/homepage/vision-mission': { title: 'Vision & Mission', category: 'Homepage' },
  '/admin/homepage/why-choose': { title: 'Why Choose Twinplast', category: 'Homepage' },
  '/admin/homepage/quality': { title: 'Quality Commitment', category: 'Homepage' },
  '/admin/homepage/markets': { title: 'Markets Served', category: 'Homepage' },
  '/admin/homepage/final-cta': { title: 'Final CTA Banner', category: 'Homepage' },
  '/admin/homepage/statistics': { title: 'Key Statistics', category: 'Homepage' },
};

const mobileNavLinks = [
  { label: 'Dashboard',      href: '/admin',              icon: LayoutDashboard },
  { label: 'Products',       href: '/admin/products',     icon: ShoppingBag },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Industries',     href: '/admin/industries',   icon: Building2 },
  { label: 'Process',        href: '/admin/manufacturing', icon: Layers },
  { label: 'Enquiries',      href: '/admin/enquiries',    icon: Mail },
  { label: 'Settings',       href: '/admin/settings',     icon: Settings },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRoute = routeLabels[pathname] || {
    title: pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Admin',
    category: 'Admin',
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
        
        {/* Left: Mobile Toggle & Page Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Page Heading */}
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {currentRoute.title}
          </h1>
        </div>

        {/* Right: Actions, Live Site, Status & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* View Live Site button */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title="Open website in new tab"
          >
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {/* Enquiries Quick Shortcut */}
          <Link
            href="/admin/enquiries"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors relative"
            title="View Inquiries"
          >
            <Mail className="w-4 h-4" />
          </Link>

          {/* Vertical divider */}
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Admin User Profile Tag */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              TP
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Administrator</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="System Online" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Twinplast Console</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (when opened on small screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-xl flex flex-col z-50">
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="relative h-14 w-40 block">
                <Image
                  src="/logo.png"
                  alt="Twinplast Polymers Logo"
                  fill
                  priority
                  sizes="180px"
                  className="object-contain object-left dark:hidden"
                />
                <Image
                  src="/logo-white.png"
                  alt="Twinplast Polymers Logo"
                  fill
                  priority
                  sizes="180px"
                  className="object-contain object-left hidden dark:block"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
              {mobileNavLinks.slice(0, 2).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <HomepageSidebarGroup />

              {mobileNavLinks.slice(2).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
