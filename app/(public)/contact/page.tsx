import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from './contact-form';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Twinplast Polymers | Request a PP Sheet Quote',
  description: 'Contact Twinplast Polymers in Thoothukudi, Tamil Nadu for PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheet enquiries and B2B quotations.',
  alternates: {
    canonical: getSiteUrl('/contact'),
  },
  openGraph: {
    title: 'Contact Twinplast Polymers | Request a PP Sheet Quote',
    description: 'Contact Twinplast Polymers in Thoothukudi, Tamil Nadu for PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheet enquiries and B2B quotations.',
    url: getSiteUrl('/contact'),
    type: 'website',
  },
};

export default function ContactPage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl('/')}#localbusiness`,
    name: 'Twinplast Polymers Private Limited',
    url: getSiteUrl('/contact'),
    logo: getSiteUrl('/logo.png'),
    description: 'Sales and customer support for PP sheet orders in Thoothukudi, Tamil Nadu.',
    telephone: '+91 95853 88444',
    email: 'twinplastpolymers@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan',
      addressLocality: 'Thoothukudi',
      addressRegion: 'Tamil Nadu',
      postalCode: '628101',
      addressCountry: 'IN',
    },
    parentOrganization: {
      '@id': `${getSiteUrl('/')}#organization`,
    },
  };

  return (
    <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <JsonLd data={localBusinessSchema} />
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Partner With Twinplast
          </h1>
          <p className="mt-2 text-base text-muted max-w-2xl">
            Contact our factory sales team directly for custom order quotes, bulk requirements, or application advice.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted">Loading B2B Form...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
