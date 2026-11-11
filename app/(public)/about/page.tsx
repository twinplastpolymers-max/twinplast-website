import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/public';
import { getSiteUrl } from '@/lib/site';
import { BRAND_NAME, LEGAL_COMPANY_NAME, buildPublicMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/shared/JsonLd';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { HomepageMedia, ManufacturingStep, HomepageSection, MarketRegionItem, Certification } from '@/types';
import { AboutSection } from '@/components/home/AboutSection';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { MarketsSection } from '@/components/home/MarketsSection';
import { VisionMissionSection } from '@/components/home/VisionMissionSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { ManufacturingProcessSection } from '@/components/home/ManufacturingProcessSection';
import { CertificationSection } from '@/components/home/CertificationSection';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const revalidate = 300;

export const metadata: Metadata = buildPublicMetadata({
  title: 'About Twinplast Polymers | PP Corrugated Sheet Manufacturer',
  description:
    'Learn about Twinplast Polymers (Twinplast Polymers Private Limited), an ISO 9001:2015 certified PP Corrugated Sheet and polypropylene products manufacturer in Thoothukudi, Tamil Nadu, India.',
  path: '/about',
  absoluteTitle: true,
});

export default async function AboutPage() {
  let aboutMainImage: string | null = null;
  let aboutSecondary1: string | null = null;
  let aboutSecondary2: string | null = null;
  let whyImageId: string | null = null;
  let vmImage: string | null = null;

  let publicPhone = '';
  let publicEmail = '';
  let publicAddress = '';

  let aboutEyebrow: string | undefined = undefined;
  let aboutHeading: string | undefined = undefined;
  let aboutDescription: string | undefined = undefined;

  let whyEyebrow: string | undefined = undefined;
  let whyHeading: string | undefined = undefined;
  let whyDescription: string | undefined = undefined;
  let pillars: Array<{ title: string; description: string }> = [];

  let mktEyebrow: string | undefined = undefined;
  let mktHeading: string | undefined = undefined;
  let mktBody: string | undefined = undefined;
  let mktBgImageUrl: string | null = null;
  let mktRegions: (string | MarketRegionItem)[] = [];

  let statsItems: Array<{ count: string; heading: string; description: string }> = [];

  let visionTitle = 'Our Vision';
  let visionText = 'To become a trusted and recognized manufacturer of innovative polypropylene sheet and packaging solutions, delivering quality products and sustainable value to customers in India and international markets.';
  let missionTitle = 'Our Mission';
  let missionText = 'Our mission is to manufacture high-quality PP products that combine durability, functionality and cost-effectiveness while continuously improving our technology, manufacturing processes and customer service.';

  let steps: ManufacturingStep[] = [];
  let certifications: Certification[] = [];

  try {
    const supabase = createPublicClient();
    if (!supabase) throw new Error('Public Supabase client unavailable');

    const [
      { data: mediaData },
      { data: secData },
      { data: stepRes },
      { data: certData },
      { data: settingRes }
    ] = await Promise.all([
      supabase.from('homepage_media').select('*'),
      supabase.from('homepage_sections').select('*').in('section_key', ['about', 'statistics', 'markets', 'why_choose', 'vision_mission']),
      supabase.from('manufacturing_steps').select('*').eq('active', true).order('step_number', { ascending: true }),
      supabase.from('certifications').select('*').eq('active', true).not('image_url', 'is', null).order('display_order', { ascending: true }),
      supabase.from('company_settings').select('*')
    ]);

    if (mediaData) {
      const mediaList = mediaData as unknown as HomepageMedia[];
      const mainMedia = mediaList.find((m) => m.slot === 'about_main');
      if (mainMedia?.image_cloudinary_public_id) {
        aboutMainImage = mainMedia.image_cloudinary_public_id;
      }
      const sec1Media = mediaList.find((m) => m.slot === 'about_secondary_1');
      if (sec1Media?.image_cloudinary_public_id) {
        aboutSecondary1 = sec1Media.image_cloudinary_public_id;
      }
      const sec2Media = mediaList.find((m) => m.slot === 'about_secondary_2');
      if (sec2Media?.image_cloudinary_public_id) {
        aboutSecondary2 = sec2Media.image_cloudinary_public_id;
        whyImageId = sec2Media.image_cloudinary_public_id;
      }
      const vmMedia = mediaList.find((m) => m.slot === 'vision_mission_image');
      if (vmMedia?.image_cloudinary_public_id) {
        vmImage = vmMedia.image_cloudinary_public_id;
      }
    }

    if (secData) {
      const sections = secData as unknown as HomepageSection[];

      const aboutSec = sections.find((s) => s.section_key === 'about');
      if (aboutSec) {
        const aboutContent = (aboutSec.content as Record<string, unknown>) || {};
        aboutEyebrow = (aboutContent.eyebrow as string) || undefined;
        aboutHeading = (aboutContent.heading as string) || (aboutContent.title as string) || undefined;
        aboutDescription = (aboutContent.description as string) || (aboutContent.content as string) || undefined;
      }

      const statsSec = sections.find((s) => s.section_key === 'statistics');
      if (statsSec) {
        const statsContent = (statsSec.content as Record<string, unknown>) || {};
        statsItems = (statsContent.stats as Array<{ count: string; heading: string; description: string }>) || [];
      }

      const mktSec = sections.find((s) => s.section_key === 'markets');
      if (mktSec) {
        const mktContent = (mktSec.content as Record<string, unknown>) || {};
        mktEyebrow = (mktContent.eyebrow as string) || undefined;
        mktHeading = (mktContent.heading as string) || (mktContent.title as string) || undefined;
        mktBody = (mktContent.content as string) || (mktContent.subtitle as string) || undefined;
        const mktBgRaw = (mktContent.background_image as string) || (mktContent.background_image_url as string) || null;
        mktBgImageUrl = mktBgRaw ? getOptimizedImageUrl(mktBgRaw, { width: 1600, quality: 'auto' }) : null;
        mktRegions = (mktContent.regions as (string | MarketRegionItem)[]) || [];
      }

      const whySec = sections.find((s) => s.section_key === 'why_choose');
      if (whySec) {
        const whyContent = (whySec.content as Record<string, unknown>) || {};
        whyEyebrow = (whyContent.eyebrow as string) || undefined;
        whyHeading = (whyContent.heading as string) || (whyContent.title as string) || undefined;
        whyDescription = (whyContent.description as string) || undefined;
        pillars = (whyContent.pillars as Array<{ title: string; description: string }>) ||
          (whyContent.reasons as Array<{ title: string; description: string }>) || [];
        const customWhyImg = (whyContent.image as string) || (whyContent.image_url as string);
        if (customWhyImg) whyImageId = customWhyImg;
      }

      const vmSec = sections.find((s) => s.section_key === 'vision_mission');
      if (vmSec) {
        const vmContent = (vmSec.content as Record<string, unknown>) || {};
        const vObj = (vmContent.vision as Record<string, string>) || {};
        const mObj = (vmContent.mission as Record<string, string>) || {};
        if (vObj.title?.trim()) visionTitle = vObj.title.trim();
        if (vObj.content?.trim()) visionText = vObj.content.trim();
        if (mObj.title?.trim()) missionTitle = mObj.title.trim();
        if (mObj.content?.trim()) missionText = mObj.content.trim();
      }
    }

    if (stepRes) {
      steps = stepRes;
    }

    if (certData) {
      certifications = (certData as unknown as Certification[]).filter((c) => Boolean(c.image_url));
    }

    if (settingRes) {
      const settings = settingRes as Array<{ key: string; value: unknown }>;
      const pPhone = settings.find((s) => s.key === 'public_phone')?.value;
      const pEmail = settings.find((s) => s.key === 'public_email')?.value;
      const pAddr = settings.find((s) => s.key === 'public_address')?.value;

      if (typeof pPhone === 'string' && pPhone.trim()) publicPhone = pPhone.trim();
      if (typeof pEmail === 'string' && pEmail.trim()) publicEmail = pEmail.trim();
      if (typeof pAddr === 'string' && pAddr.trim()) publicAddress = pAddr.trim();
    }
  } catch {
    // Graceful fallback
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl('/')}#localbusiness`,
    name: BRAND_NAME,
    legalName: LEGAL_COMPANY_NAME,
    url: getSiteUrl('/about'),
    logo: getSiteUrl('/logo.png'),
    description: 'ISO 9001:2015 certified polypropylene (PP) corrugated sheet manufacturing facility operating in South Silukkanpatti, Thoothukudi, Tamil Nadu, India.',
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
        name: 'About Us',
        item: getSiteUrl('/about'),
      },
    ],
  };

  return (
    <div className="flex flex-col w-full bg-white text-slate-900 font-sans">
      <JsonLd data={[localBusinessSchema, breadcrumbSchema]} />

      {/* Page Header Banner */}
      <section className="bg-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl space-y-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">About Us</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            About Twinplast Polymers — PP Corrugated Sheet Manufacturer
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Twinplast Polymers Private Limited manufactures polypropylene corrugated sheets, hollow sheets, Sunpack boards, layer pads, and floor protection rolls in Thoothukudi, Tamil Nadu.
          </p>
        </div>
      </section>

      {/* 1. Landing Page About Section */}
      <AboutSection
        eyebrow={aboutEyebrow}
        heading={aboutHeading}
        description={aboutDescription}
        mainImage={aboutMainImage}
        secondaryImage1={aboutSecondary1}
        secondaryImage2={aboutSecondary2}
        showButton={false}
      />

      {/* 2. Vision & Mission */}
      <VisionMissionSection
        visionTitle={visionTitle}
        visionText={visionText}
        missionTitle={missionTitle}
        missionText={missionText}
        vmImage={vmImage}
      />

      {/* 3. Markets We Serve */}
      <MarketsSection
        eyebrow={mktEyebrow}
        heading={mktHeading}
        body={mktBody}
        backgroundImage={mktBgImageUrl}
        regions={mktRegions}
      />

      {/* 4. 9-Stage Manufacturing Process */}
      <ManufacturingProcessSection steps={steps} />

      {/* 5. Statistics Section */}
      <StatisticsSection stats={statsItems} />

      {/* 6. Why Choose Us */}
      <WhyChooseSection
        eyebrow={whyEyebrow}
        heading={whyHeading}
        description={whyDescription}
        pillars={pillars}
        image={whyImageId}
      />

      {/* 7. Verified ISO 9001:2015 Quality Certification */}
      <CertificationSection certifications={certifications} />

      {/* 8. CTA Banner */}
      <CtaBanner />
    </div>
  );
}
