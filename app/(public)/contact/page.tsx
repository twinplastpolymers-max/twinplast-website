import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPublicShellData } from '@/lib/public-data';
import { getSiteUrl } from '@/lib/site';
import { BRAND_NAME, LEGAL_COMPANY_NAME, buildPublicMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/shared/JsonLd';
import { HomeContactSection } from '@/components/home/HomeContactSection';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Contact Twinplast Polymers | Request a PP Corrugated Sheet Quote',
  description:
    'Contact Twinplast Polymers in Thoothukudi, Tamil Nadu for bulk PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheet enquiries and quotations.',
  path: '/contact',
  absoluteTitle: true,
});

interface ContactPageProps {
  searchParams?: Promise<{ product?: string; solution?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialProduct = resolvedParams?.product || '';
  const initialSolution = resolvedParams?.solution || '';

  const {
    publicPhone,
    publicEmail,
    publicAddress,
    internationalPhone,
    products: productRows,
    solutions: solutionRows,
  } = await getPublicShellData();

  const products = productRows.map((p) => p.title);
  const solutions = solutionRows.map((s) => s.title);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl('/')}#localbusiness`,
    name: BRAND_NAME,
    legalName: LEGAL_COMPANY_NAME,
    url: getSiteUrl('/contact'),
    logo: getSiteUrl('/logo.png'),
    description: 'Direct sales, technical specification support, and wholesale enquiries for PP corrugated sheets in Thoothukudi, Tamil Nadu.',
    telephone: publicPhone || undefined,
    email: publicEmail || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: publicAddress || 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan',
      addressLocality: 'Thoothukudi',
      addressRegion: 'Tamil Nadu',
      postalCode: '628101',
      addressCountry: 'IN',
    },
    parentOrganization: {
      '@id': `${getSiteUrl('/')}#organization`,
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
        name: 'Contact Us',
        item: getSiteUrl('/contact'),
      },
    ],
  };

  return (
    <div className="flex-1 bg-white">
      <JsonLd data={[localBusinessSchema, breadcrumbSchema]} />

      {/* Server-rendered Header Banner */}
      <section className="bg-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl space-y-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Contact Us</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Contact Twinplast Polymers
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Reach our manufacturing plant in Thoothukudi, Tamil Nadu for factory-direct quotations, custom thickness and GSM runs, bulk supply schedules across South India, and export enquiries.
          </p>
        </div>
      </section>

      <HomeContactSection
        key={`${initialProduct}|${initialSolution}`}
        phone={publicPhone}
        email={publicEmail}
        address={publicAddress}
        initialProduct={initialProduct}
        initialSolution={initialSolution}
        products={products}
        solutions={solutions}
        internationalPhone={internationalPhone}
      />
    </div>
  );
}
