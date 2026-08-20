import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Mail, Settings, ExternalLink } from 'lucide-react';
import { SignOutButton } from '@/components/admin/SignOutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Mail },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      
      {/* Sidebar Navigation - Hidden on mobile, shown on md+ */}
      <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold tracking-tight text-blue-600 dark:text-blue-400 text-lg">Twinplast Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5" aria-label="Admin Navigation">
          {sidebarLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <item.icon className="w-4 h-4 text-slate-400" />
              <span>{item.label}</span>
            </Link>
          ))}
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
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Nav Header */}
        <header className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between px-4 md:hidden">
          <span className="font-bold text-blue-600 dark:text-blue-400 text-md">Twinplast Admin</span>
          
          <nav className="flex items-center gap-3" aria-label="Mobile Navigation">
            {sidebarLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded"
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            ))}
            
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            
            {/* Direct, clean log out support for mobile admins */}
            <div className="w-10">
              <SignOutButton />
            </div>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
