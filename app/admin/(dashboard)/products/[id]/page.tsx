import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from('products')
      .select('title')
      .eq('id', id)
      .single() as unknown as { data: Product | null };

    if (!product) {
      return { title: 'Product Not Found | Twinplast Admin' };
    }

    return {
      title: `Edit ${product.title} | Twinplast Admin`,
    };
  } catch {
    return { title: 'Edit Product | Twinplast Admin' };
  }
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  let product: Product | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      product = data as unknown as Product;
    }
  } catch {
    product = null;
  }

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}
