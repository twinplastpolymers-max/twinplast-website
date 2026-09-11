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
  '/admin/industries': { title: 'Applications & Solutions', category: 'Markets' },
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
  { label: 'Applications',   href: '/admin/industries',   icon: Building2 },
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
      <header className="sticky top-0 z-20 h-20 bg-[#f0f6ff] text-slate-900 border-b border-blue-200/70 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors shadow-xs">
        
        {/* Left: Mobile Toggle & Page Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-100/70 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Page Heading */}
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {currentRoute.title}
          </h1>
        </div>

        {/* Right: Actions, Live Site, Status & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* View Live Site button */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-blue-200/80 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-xs"
            title="Open website in new tab"
          >
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Enquiries Quick Shortcut */}
          <Link
            href="/admin/enquiries"
            className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-100/70 transition-colors relative"
            title="View Inquiries"
          >
            <Mail className="w-4 h-4" />
          </Link>

          {/* Vertical divider */}
          <div className="h-5 w-[1px] bg-blue-200/70 mx-1" />

          {/* Admin User Profile Tag */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              TP
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Administrator</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="System Online" />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Twinplast Console</span>
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
          <div className="fixed inset-y-0 left-0 w-72 bg-[#f0f6ff] text-slate-800 border-r border-blue-200/70 shadow-2xl flex flex-col z-50">
            <div className="h-20 flex items-center justify-between px-6 border-b border-blue-200/70 bg-[#f0f6ff]">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="relative h-14 w-40 block">
                <Image
                  src="/logo.png"
                  alt="Twinplast Polymers Logo"
                  fill
                  priority
                  sizes="180px"
                  className="object-contain object-left"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-blue-100/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
              {mobileNavLinks.slice(0, 2).map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/70'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <HomepageSidebarGroup />

              {mobileNavLinks.slice(2).map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/70'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-blue-200/70 space-y-1.5 bg-blue-100/40">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-100/80 transition-colors"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
