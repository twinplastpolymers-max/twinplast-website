'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Trash2, Edit, Star, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal / Confirm state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  // Extract unique categories dynamically
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Client-side quick status toggle (Active / Featured)
  const handleToggleActive = async (id: string, currentVal: boolean) => {
    setMutatingId(id);
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: !currentVal })
        .eq('id', id);

      if (!error) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: !currentVal } : p))
        );
        toast.success(
          !currentVal ? 'Product Published' : 'Product Unpublished',
          'Product visibility status updated.'
        );
      } else {
        toast.error('Failed to update status', error.message);
      }
    } catch {
      toast.error('Network Error', 'Failed to update product status.');
    } finally {
      setMutatingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    setMutatingId(id);
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !currentVal })
        .eq('id', id);

      if (!error) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !currentVal } : p))
        );
        toast.success(
          !currentVal ? 'Added to Featured' : 'Removed from Featured',
          'Homepage product spotlight updated.'
        );
      } else {
        toast.error('Failed to update featured status', error.message);
      }
    } catch {
      toast.error('Network Error', 'Failed to update product spotlight status.');
    } finally {
      setMutatingId(null);
    }
  };

  // Safe Deletion Handler
  const handleDeleteProduct = async () => {
    if (!productToDelete || isDeleting) return;
    setIsDeleting(true);

    try {
      // Delete the Supabase product record
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (!error) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        toast.success('Product Deleted', `"${productToDelete.title}" was removed.`);
        setProductToDelete(null);
      } else {
        toast.error('Deletion Failed', error.message);
      }
    } catch {
      toast.error('Network Error', 'Failed to delete product record.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && p.active) || 
                          (statusFilter === 'Inactive' && !p.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
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
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Inactive">Inactive Only</option>
        </select>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        
        {/* Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Products list">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Display Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.title}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-semibold">{p.category}</td>
                  
                  {/* Featured toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p.id, p.featured)}
                      disabled={mutatingId === p.id}
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-amber-500 disabled:opacity-50 cursor-pointer"
                      title={p.featured ? 'Unmark as Featured' : 'Mark as Featured'}
                    >
                      <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  </td>

                  {/* Active toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(p.id, p.active)}
                      disabled={mutatingId === p.id}
                      type="button"
                      className="cursor-pointer"
                    >
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                        p.active 
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-500'
                      }`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 text-center font-semibold text-slate-500 dark:text-slate-400">{p.display_order}</td>
                  
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-500 dark:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded px-1 py-0.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setProductToDelete(p)}
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-500 dark:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 rounded px-1 py-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">
                    No products matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="block sm:hidden divide-y divide-slate-200 dark:divide-slate-800">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{p.title}</h3>
                  <span className="text-xs text-muted block mt-0.5">{p.category}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleFeatured(p.id, p.featured)}
                    type="button"
                    className="p-1 rounded text-amber-500"
                  >
                    <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : 'text-slate-300'}`} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(p.id, p.active)}
                    type="button"
                  >
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      p.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Order: {p.display_order}</span>
                
                <div className="flex gap-4">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-1 font-bold uppercase tracking-wider text-blue-600"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => setProductToDelete(p)}
                    type="button"
                    className="flex items-center gap-1 font-bold uppercase tracking-wider text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-sm text-muted">
              No products found.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 id="delete-title" className="text-lg font-bold text-slate-900 dark:text-white">Delete Product</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-700 dark:text-slate-300">{productToDelete.title}</strong>? This action cannot be undone. Cloudinary images will remain stored securely.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                type="button"
                className="inline-flex justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                type="button"
                className="inline-flex justify-center rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 transition-colors cursor-pointer disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
