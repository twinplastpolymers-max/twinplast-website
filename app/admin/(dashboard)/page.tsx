import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShoppingBag,
  Mail,
  ChevronRight,
  Award,
  Building2,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Enquiry } from '@/types';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Twinplast Polymers',
  description: 'Twinplast Polymers administrative content management panel.',
};

function formatDate(dateString?: string) {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default async function AdminDashboardPage() {
  let totalProductsCount = 0;
  let activeProductsCount = 0;
  let featuredProductsCount = 0;
  let totalEnquiriesCount = 0;
  let newEnquiriesCount = 0;
  let unresolvedEnquiriesCount = 0;
  let totalIndustriesCount = 0;
  let totalCertificationsCount = 0;
  let recentEnquiries: Enquiry[] = [];

  try {
    const supabase = await createClient();

    const [
      { count: totalProducts },
      { count: activeProducts },
      { count: featuredProducts },
      { count: totalEnquiries },
      { count: newEnquiries },
      { count: unresolvedEnquiries },
      { count: totalIndustries },
      { count: totalCertifications },
      { data: enquiriesData },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).in('status', ['new', 'in_progress']),
      supabase.from('industries').select('*', { count: 'exact', head: true }),
      supabase.from('certifications').select('*', { count: 'exact', head: true }).not('image_url', 'is', null),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    totalProductsCount = totalProducts || 0;
    activeProductsCount = activeProducts || 0;
    featuredProductsCount = featuredProducts || 0;
    totalEnquiriesCount = totalEnquiries || 0;
    newEnquiriesCount = newEnquiries || 0;
    unresolvedEnquiriesCount = unresolvedEnquiries || 0;
    totalIndustriesCount = totalIndustries || 0;
    totalCertificationsCount = totalCertifications || 0;

    if (enquiriesData) recentEnquiries = enquiriesData as Enquiry[];
  } catch {
    // Graceful fallback
  }

  const kpis = [
    {
      title: 'Products Catalog',
      value: `${activeProductsCount} / ${totalProductsCount}`,
      sub: `${featuredProductsCount} Featured on Live Site`,
      badge: 'Active',
      href: '/admin/products',
      icon: ShoppingBag,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      title: 'Client Enquiries',
      value: `${unresolvedEnquiriesCount}`,
      sub: `${newEnquiriesCount} New submissions`,
      badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} New` : 'All Caught Up',
      badgeColor: newEnquiriesCount > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-slate-100 text-slate-600',
      href: '/admin/enquiries',
      icon: Mail,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
    {
      title: 'Applications & Solutions',
      value: `${totalIndustriesCount}`,
      sub: 'Industrial Sectors Served',
      badge: 'Markets',
      href: '/admin/industries',
      icon: Building2,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      title: 'Quality Certifications',
      value: `${totalCertificationsCount}`,
      sub: totalCertificationsCount > 0 ? `${totalCertificationsCount} Uploaded Documents` : 'Upload certificate images',
      badge: totalCertificationsCount > 0 ? 'Verified' : 'Empty',
      href: '/admin/certifications',
      icon: Award,
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      
      {/* ── Dashboard Welcome Header (No Bold Font) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-normal mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Manufacturing Operations Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1.5 text-sm font-normal text-slate-500 dark:text-slate-400 max-w-2xl">
            Real-time management overview of your polypropylene fluted sheet catalog, incoming B2B client enquiries, and live website CMS modules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>View Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* ── 4 KPI Stats Cards (No Bold Font) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <Link
            key={kpi.title}
            href={kpi.href}
            className="group relative bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${kpi.iconBg} transition-transform group-hover:scale-105`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-normal px-2 py-0.5 rounded-md ${kpi.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'}`}>
                  {kpi.badge}
                </span>
              </div>
              <span className="text-xs font-normal text-slate-400 uppercase tracking-wider block">
                {kpi.title}
              </span>
              <span className="text-2xl font-normal text-slate-900 dark:text-white mt-1 block tracking-tight">
                {kpi.value}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs font-normal text-slate-500">
              <span className="truncate">{kpi.sub}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Recent Client Enquiries Feed (Full Width, No Bold Font) ── */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Recent Client Enquiries</span>
            </h2>
            <p className="text-xs font-normal text-slate-400 mt-0.5">
              Latest quotation and specification submissions from the public website
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All ({totalEnquiriesCount})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Inbox is all clear!
            </p>
            <p className="text-xs font-normal text-slate-400 mt-1 max-w-sm mx-auto">
              When clients request a quote on your products, their details and requirements will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-900">
            {recentEnquiries.map((enq) => {
              const isNew = enq.status === 'new';
              const isInProgress = enq.status === 'in_progress';
              return (
                <Link
                  key={enq.id}
                  href="/admin/enquiries"
                  className="group py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 -mx-3 px-3 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {enq.customer_name}
                      </span>
                      {enq.company && (
                        <span className="text-xs font-normal text-slate-500 truncate">
                          • {enq.company}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isNew
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {enq.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400 line-clamp-1">
                      {enq.message || 'No additional notes provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-normal text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(enq.created_at)}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
