import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { JsonLd } from '@/components/shared/JsonLd';
import { getSiteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamically generate metadata by querying Supabase
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = getSiteUrl(`/products/${slug}`);

  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from('products')
      .select('title, description')
      .eq('slug', slug)
      .eq('active', true)
      .single() as unknown as { data: Product | null };

    if (!product) {
      return { title: 'Product Not Found | Twinplast Polymers' };
    }

    const title = `${product.title} | Twinplast Polymers`;
    const description = product.description;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Product Specifications | Twinplast Polymers',
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product: Product | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
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

  const productImageUrl = product.image_cloudinary_public_id
    ? getOptimizedImageUrl(product.image_cloudinary_public_id, { width: 800, quality: 'auto' })
    : product.image_url || getSiteUrl('/logo.png');

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${getSiteUrl(`/products/${product.slug}`)}#product`,
    name: product.title,
    description: product.description,
    image: productImageUrl,
    url: getSiteUrl(`/products/${product.slug}`),
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Twinplast Polymers',
    },
    manufacturer: {
      '@type': 'Organization',
      '@id': `${getSiteUrl('/')}#organization`,
      name: 'Twinplast Polymers Private Limited',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: getSiteUrl('/products'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: getSiteUrl(`/products/${product.slug}`),
      },
    ],
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <JsonLd data={[productSchema, breadcrumbSchema]} />
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <li>
              <Link href="/products" className="hover:text-accent transition-colors">
                Products
              </Link>
            </li>
            <li className="before:content-['/'] before:mr-2">
              <span className="text-foreground">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Spec Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Product Media - Left 5 cols */}
          <div className="md:col-span-5 w-full">
            <ImageContainer
              src={product.image_cloudinary_public_id}
              alt={product.title}
              aspectRatio="square"
            />
          </div>
          
          {/* Specifications Panel - Right 7 cols */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
                {product.title}
              </h1>
            </div>

            <div className="prose prose-slate dark:prose-invert">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Overview</h2>
              <p className="text-sm text-muted leading-relaxed mt-1.5">
                {product.description}
              </p>
            </div>

            {/* Extensible B2B Specification Container (Ready for dynamic columns later) */}
            <div className="border-t border-secondary/50 pt-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                Technical Specifications
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">GSM Weight Range</span>
                  <span className="font-semibold text-foreground mt-0.5 block">Customised to B2B Specs</span>
                  <span className="text-xs text-muted block mt-1">Extruded according to client target load capacity.</span>
                </div>

                <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Available Thickness</span>
                  <span className="font-semibold text-foreground mt-0.5 block">Custom thickness on request</span>
                  <span className="text-xs text-muted block mt-1">Calibrated dynamically during the extrusion process.</span>
                </div>

                <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Dimensions</span>
                  <span className="font-semibold text-foreground mt-0.5 block">Custom cut-to-size</span>
                  <span className="text-xs text-muted block mt-1">Standard layouts or specific length cuts available.</span>
                </div>

                <div className="bg-secondary/20 p-3 rounded-lg border border-secondary/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Color Choices</span>
                  <span className="font-semibold text-foreground mt-0.5 block">Multiple options available</span>
                  <span className="text-xs text-muted block mt-1">Color pigments matching your brand guidelines.</span>
                </div>
              </div>
            </div>

            {/* Inquire Action Button */}
            <div className="pt-6 border-t border-secondary/50">
              <Link
                href={`/contact?product=${product.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground px-5 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Mail className="w-4 h-4" />
                <span>Request B2B Quote</span>
              </Link>
              
              <div className="mt-4 flex items-center gap-2 justify-center text-xs text-muted">
                <HelpCircle className="w-4 h-4 text-muted/80" />
                <span>Need assistance? Phone sales plant at +91 95853 88444</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
