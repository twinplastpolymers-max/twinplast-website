import type { Metadata } from 'next';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Products | Twinplast Admin',
  description: 'Manage Twinplast polypropylene products catalog.',
};

export default function AdminProductsPage() {
  const dummyProducts = [
    { id: '1', title: 'PP Sunpack Sheets', category: 'Sunpack', active: true, order: 0 },
    { id: '2', title: 'PP Corrugated Sheets', category: 'Corrugated', active: true, order: 1 },
    { id: '3', title: 'PP Hollow Sheets', category: 'Hollow', active: true, order: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Products
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create, update, and sort products displayed on the public site catalog.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Products list">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Display Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {dummyProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.title}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{p.category}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{p.order}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded px-1 cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
