import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  Product,
  HomepageMedia,
  HomepageSection,
  Industry,
  MarketRegionItem
} from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';

import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { IndustriesSection } from '@/components/home/IndustriesSection';
import { MarketsSection } from '@/components/home/MarketsSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu',
  description: 'Twinplast Polymers Private Limited is a specialized PP sheet manufacturer in Thoothukudi, Tamil Nadu, supplying PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheets for B2B industrial applications.',
  alternates: {
    canonical: getSiteUrl('/'),
  },
  openGraph: {
    title: 'Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu',
    description: 'Twinplast Polymers Private Limited is a specialized PP sheet manufacturer in Thoothukudi, Tamil Nadu, supplying PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheets for B2B industrial applications.',
    url: getSiteUrl('/'),
    type: 'website',
  },
};

export default async function HomePage() {
  let products: Product[] = [];
  let industries: Industry[] = [];

  let heroImage: string | null = null;
  let aboutMainImage: string | null = null;
  let aboutSecondary1: string | null = null;
  let aboutSecondary2: string | null = null;
  let ctaBgImage: string | null = null;

  let publicPhone = '+91 95853 88444';
  let publicEmail = 'twinplastpolymers@gmail.com';
  let publicAddress = 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan, Thoothukudi, Tamil Nadu, 628101';

  let secData: HomepageSection[] = [];

  try {
    const supabase = await createClient();

    const [
      { data: prodRes },
      { data: mediaRes },
      { data: secRes },
      { data: indRes },
      { data: settingRes }
    ] = await Promise.all([
      supabase.from('products').select('*').eq('active', true).order('display_order', { ascending: true }),
      supabase.from('homepage_media').select('*'),
      supabase.from('homepage_sections').select('*'),
      supabase.from('industries').select('*').eq('active', true).order('display_order', { ascending: true }),
      supabase.from('company_settings').select('*')
    ]);

    products = prodRes || [];
    industries = indRes || [];
    secData = (secRes || []) as HomepageSection[];

    if (mediaRes) {
      const mediaData = mediaRes as unknown as HomepageMedia[];
      heroImage = mediaData.find((m) => m.slot === 'hero')?.image_cloudinary_public_id || null;
      aboutMainImage = mediaData.find((m) => m.slot === 'about_main')?.image_cloudinary_public_id || null;
      aboutSecondary1 = mediaData.find((m) => m.slot === 'about_secondary_1')?.image_cloudinary_public_id || null;
      aboutSecondary2 = mediaData.find((m) => m.slot === 'about_secondary_2')?.image_cloudinary_public_id || null;
      ctaBgImage = mediaData.find((m) => m.slot === 'cta_background')?.image_cloudinary_public_id || null;
    }

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
    // Graceful fallback to empty state
  }

  // Section Content Extraction from Supabase
  const getSec = (key: string) => {
    const sec = secData.find((s) => s.section_key === key);
    return (sec?.content as Record<string, unknown>) || {};
  };

  // 1. Hero Content
  const heroContent = getSec('hero');
  const heroSubheading = (heroContent.subheading as string) || (heroContent.eyebrow as string) || (heroContent.badge_text as string) || undefined;
  const heroHeading = (heroContent.heading as string) || (heroContent.headline as string) || 'Polypropylene Sheets & PP Product Manufacturer';
  const heroShortDescription = (heroContent.short_description as string) || (heroContent.subheadline as string) || undefined;
  const heroBgRaw = (heroContent.background_image as string) || (heroContent.background_image_url as string) || heroImage || null;
  const heroBgImageUrl = heroBgRaw ? getOptimizedImageUrl(heroBgRaw, { quality: 'best', upscale: true }) : null;

  // 2. About Content
  const aboutContentData = getSec('about');
  const aboutEyebrow = (aboutContentData.eyebrow as string) || undefined;
  const aboutHeading = (aboutContentData.heading as string) || (aboutContentData.title as string) || undefined;
  const aboutDescription = (aboutContentData.content as string) || undefined;




  // 6. Markets Content
  const mktContentData = getSec('markets');
  const mktEyebrow = (mktContentData.eyebrow as string) || undefined;
  const mktHeading = (mktContentData.heading as string) || (mktContentData.title as string) || 'Markets We Serve';
  const mktBody = (mktContentData.content as string) || (mktContentData.subtitle as string) || undefined;
  const mktBgRaw = (mktContentData.background_image as string) || (mktContentData.background_image_url as string) || null;
  const mktBgImageUrl = mktBgRaw ? getOptimizedImageUrl(mktBgRaw, { quality: 'best', upscale: true }) : null;
  const mktRegions = (mktContentData.regions as (string | MarketRegionItem)[]) || [];

  // 7. Why Choose Content
  const whyContentData = getSec('why_choose');
  const whyEyebrow = (whyContentData.eyebrow as string) || undefined;
  const whyHeading = (whyContentData.heading as string) || (whyContentData.title as string) || undefined;
  const whyDescription = (whyContentData.description as string) || (whyContentData.content as string) || undefined;
  const whyImage = (whyContentData.image as string) || (whyContentData.image_url as string) || aboutSecondary2 || null;
  const whyPillars = (whyContentData.pillars as Array<{ title: string; description: string }>) || 
                     (whyContentData.reasons as Array<{ title: string; description: string }>) || [];

  // 7. Final CTA Content
  const ctaContentData = getSec('final_cta');
  const ctaHeading = (ctaContentData.heading as string) || (ctaContentData.headline as string) || undefined;
  const ctaSubheadline = (ctaContentData.subheadline as string) || undefined;
  const ctaPrimaryLabel = (ctaContentData.primary_cta_label as string) || (ctaContentData.button_text as string) || 'Contact Us';
  const ctaPrimaryUrl = (ctaContentData.primary_cta_url as string) || '/contact';
  const ctaSecondaryLabel = (ctaContentData.secondary_cta_label as string) || 'Request a Quote';
  const ctaSecondaryUrl = (ctaContentData.secondary_cta_url as string) || '/contact';

  // 8. Statistics Content (No mock data fallback)
  const statsContentData = getSec('statistics');
  const statsItems = (statsContentData.stats as Array<{ count: string; heading: string; description: string }>) || [];

  // JSON-LD Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${getSiteUrl('/')}#organization`,
    name: 'Twinplast Polymers Private Limited',
    url: getSiteUrl('/'),
    logo: getSiteUrl('/logo.png'),
    description: 'Twinplast Polymers Private Limited is a specialized B2B manufacturer of PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection, and Box sheets located in Thoothukudi, Tamil Nadu, India.',
    foundingDate: '2021',
    telephone: publicPhone,
    email: publicEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: publicAddress,
      addressLocality: 'Thoothukudi',
      addressRegion: 'Tamil Nadu',
      postalCode: '628101',
      addressCountry: 'IN',
    },
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-slate-900 font-sans">
      <JsonLd data={organizationSchema} />

      {/* 1. HERO SECTION */}
      <HeroSection
        subheading={heroSubheading}
        heading={heroHeading}
        shortDescription={heroShortDescription}
        bgImageUrl={heroBgImageUrl}
      />

      {/* 2. ABOUT SECTION */}
      <AboutSection
        eyebrow={aboutEyebrow}
        heading={aboutHeading}
        description={aboutDescription}
        mainImage={aboutMainImage}
        secondaryImage1={aboutSecondary1}
        secondaryImage2={aboutSecondary2}
      />

      {/* 3. STATISTICS SECTION (separate, full-width) */}
      <StatisticsSection stats={statsItems} />

    {/* 5. APPLICATIONS & SOLUTIONS */}
      <IndustriesSection industries={industries} />

      {/* 4. PRODUCT SHOWCASE (Horizontal Carousel) */}
      <ProductCarousel products={products} />

  





      {/* 10. MARKETS WE SERVE */}
      <MarketsSection
        eyebrow={mktEyebrow}
        heading={mktHeading}
        body={mktBody}
        backgroundImage={mktBgImageUrl}
        regions={mktRegions}
      />

      {/* 11. WHY CHOOSE US */}
      <WhyChooseSection
        eyebrow={whyEyebrow}
        heading={whyHeading}
        description={whyDescription}
        pillars={whyPillars}
        image={whyImage}
      />

      {/* 12. CTA BANNER */}
      <CtaBanner />
    </div>
  );
}
