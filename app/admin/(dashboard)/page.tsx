import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, Mail, Settings, ChevronRight, Award, Inbox } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Twinplast Polymers',
  description: 'Twinplast Polymers administrative content management panel.',
};

export default async function AdminDashboardPage() {
  let totalProductsCount = 0;
  let activeProductsCount = 0;
  let featuredProductsCount = 0;
  let newEnquiriesCount = 0;
  let unresolvedEnquiriesCount = 0;

  try {
    const supabase = await createClient();

    // Fetch live statistics
    const [
      { count: totalProducts },
      { count: activeProducts },
      { count: featuredProducts },
      { count: newEnquiries },
      { count: unresolvedEnquiries },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).in('status', ['new', 'in_progress']),
    ]);

    totalProductsCount = totalProducts || 0;
    activeProductsCount = activeProducts || 0;
    featuredProductsCount = featuredProducts || 0;
    newEnquiriesCount = newEnquiries || 0;
    unresolvedEnquiriesCount = unresolvedEnquiries || 0;
  } catch {
    // Database connection parameters unconfigured yet during compile/fallback
  }

  const stats = [
    {
      label: 'Products Catalog',
      value: `${activeProductsCount} / ${totalProductsCount} Active`,
      sub: `${featuredProductsCount} Featured Sheets`,
      href: '/admin/products',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30',
    },
    {
      label: 'Unresolved Enquiries',
      value: unresolvedEnquiriesCount.toString(),
      sub: `${newEnquiriesCount} New submissions`,
      href: '/admin/enquiries',
      icon: Mail,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
    },
    {
      label: 'Global Settings',
      value: 'Configured',
      sub: 'Corporate Whitelist',
      href: '/admin/settings',
      icon: Settings,
      color: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-950/30',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of your polymer product catalog and incoming B2B business inquiries.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 block leading-none">
                  {stat.value}
                </span>
                <span className="text-xs text-muted mt-1 block">
                  {stat.sub}
                </span>
              </div>
            </div>
            <Link
              href={stat.href}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-lg"
              aria-label={`Go to ${stat.label} management`}
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Production Quick Actions Section */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Console Management Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center justify-between p-4 border border-slate-100 hover:border-slate-200 dark:border-slate-900 dark:hover:border-slate-800 rounded-lg text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Manage Polypropylene Product Catalog</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center justify-between p-4 border border-slate-100 hover:border-slate-200 dark:border-slate-900 dark:hover:border-slate-800 rounded-lg text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4 text-amber-500" />
              <span>View Client Specifications Inbox</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
