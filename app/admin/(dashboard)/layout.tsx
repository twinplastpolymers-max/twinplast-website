import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      
      {/* Sidebar Navigation - Fixed on desktop (md+) */}
      <AdminSidebar />

      {/* Main Content Workspace - Offset by fixed sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
