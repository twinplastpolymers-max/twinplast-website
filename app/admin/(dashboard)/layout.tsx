import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Mail, Settings, LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold tracking-tight text-blue-600 dark:text-blue-400">Twinplast Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Admin Navigation">
          {[
            { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { label: 'Products', href: '/admin/products', icon: ShoppingBag },
            { label: 'Enquiries', href: '/admin/enquiries', icon: Mail },
            { label: 'Settings', href: '/admin/settings', icon: Settings },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <item.icon className="w-4 h-4 text-slate-400" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between px-4 md:hidden">
          <span className="font-bold text-blue-600 dark:text-blue-400">Twinplast Admin</span>
          <div className="flex gap-4">
            <Link href="/admin" className="text-slate-600 dark:text-slate-300">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <Link href="/admin/products" className="text-slate-600 dark:text-slate-300">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link href="/admin/enquiries" className="text-slate-600 dark:text-slate-300">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
