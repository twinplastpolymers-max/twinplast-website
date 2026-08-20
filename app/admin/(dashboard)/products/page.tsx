import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductList } from '@/components/admin/ProductList';
import { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Manage Products | Twinplast Admin',
  description: 'Manage Twinplast polypropylene products catalog.',
};

export default async function AdminProductsPage() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      products = data as unknown as Product[];
    }
  } catch {
    products = [];
  }

  return <ProductList initialProducts={products} />;
}
