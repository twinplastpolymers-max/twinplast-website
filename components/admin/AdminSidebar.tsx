'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Award,
  Building2,
  Layers,
  Mail,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { HomepageSidebarGroup } from '@/components/admin/HomepageSidebarGroup';

export function AdminSidebar() {
  const pathname = usePathname();

  const topLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag, exact: false },
  ];

  const bottomLinks = [
    { label: 'Certifications', href: '/admin/certifications', icon: Award, exact: false },
    { label: 'Applications', href: '/admin/industries', icon: Building2, exact: false },
    { label: 'Process', href: '/admin/manufacturing', icon: Layers, exact: false },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Mail, exact: false },
    { label: 'Settings', href: '/admin/settings', icon: Settings, exact: false },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-30 flex-col bg-[#f0f6ff] text-slate-800 border-r border-blue-200/70 shadow-sm">
      {/* Brand Logo Header */}
      <div className="h-20 shrink-0 flex items-center justify-center px-5 border-b border-blue-200/70 bg-[#f0f6ff]">
        <Link
          href="/admin"
          className="relative h-14 w-44 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
          title="Twinplast Admin Dashboard"
        >
          <Image
            src="/logo.png"
            alt="Twinplast Polymers Logo"
            fill
            priority
            sizes="200px"
            className="object-contain object-center"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar" aria-label="Admin Navigation">
        {topLinks.map((item) => {
          const active = isLinkActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/70'
              }`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Homepage Collapsible Group */}
        <HomepageSidebarGroup />

        {bottomLinks.map((item) => {
          const active = isLinkActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/70'
              }`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: View Live Site & Sign Out */}
      <div className="shrink-0 p-4 border-t border-blue-200/70 space-y-1.5 bg-blue-100/40">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-100/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
