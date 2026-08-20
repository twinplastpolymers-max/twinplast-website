import type { Metadata } from 'next';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Add New Product | Twinplast Admin',
  description: 'Create a new polymer sheet card in the catalog.',
};

export default function NewProductPage() {
  return <ProductForm />;
}
