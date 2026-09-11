import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { HomeContactSection } from '@/components/home/HomeContactSection';

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

interface ContactPageProps {
  searchParams?: Promise<{ product?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialProduct = resolvedParams?.product || '';

  let publicPhone = '+91 95853 88444';
  let publicEmail = 'twinplastpolymers@gmail.com';
  let publicAddress = 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan, Thoothukudi, Tamil Nadu - 628101';

  try {
    const supabase = await createClient();
    const { data: settingRes } = await supabase.from('company_settings').select('*');
    if (settingRes) {
      const settings = settingRes as Array<{ key: string; value: unknown }>;
      const pPhone = settings.find((s) => s.key === 'public_phone')?.value;
      const pEmail = settings.find((s) => s.key === 'public_email')?.value;
      const pAddr = settings.find((s) => s.key === 'public_address')?.value;

      if (typeof pPhone === 'string' && pPhone.trim()) publicPhone = pPhone;
      if (typeof pEmail === 'string' && pEmail.trim()) publicEmail = pEmail;
      if (typeof pAddr === 'string' && pAddr.trim()) publicAddress = pAddr;
    }
  } catch {
    // Graceful fallback
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl('/')}#localbusiness`,
    name: 'Twinplast Polymers Private Limited',
    url: getSiteUrl('/contact'),
    logo: getSiteUrl('/logo.png'),
    description: 'Sales and customer support for PP sheet orders in Thoothukudi, Tamil Nadu.',
    telephone: publicPhone,
    email: publicEmail,
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
    <div className="flex-1 bg-white">
      <JsonLd data={localBusinessSchema} />
      <Suspense fallback={null}>
        <HomeContactSection
          phone={publicPhone}
          email={publicEmail}
          address={publicAddress}
          initialProduct={initialProduct}
        />
      </Suspense>
    </div>
  );
}
