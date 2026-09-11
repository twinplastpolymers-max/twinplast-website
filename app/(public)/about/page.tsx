import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site';
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

export const metadata: Metadata = {
  title: 'About Twinplast Polymers | PP Sheet Manufacturer',
  description: 'Learn about Twinplast Polymers Pvt. Ltd., a specialized Polypropylene (PP) Corrugated Sheets and PP-based products manufacturer in Tuticorin, Tamil Nadu, India.',
  alternates: {
    canonical: getSiteUrl('/about'),
  },
  openGraph: {
    title: 'About Twinplast Polymers | PP Sheet Manufacturer',
    description: 'Learn about Twinplast Polymers Pvt. Ltd., a specialized Polypropylene (PP) Corrugated Sheets and PP-based products manufacturer in Tuticorin, Tamil Nadu, India.',
    url: getSiteUrl('/about'),
    type: 'website',
  },
};

export default async function AboutPage() {
  let aboutMainImage: string | null = null;
  let aboutSecondary1: string | null = null;
  let aboutSecondary2: string | null = null;
  let whyImageId: string | null = null;
  let vmImage: string | null = null;

  let aboutEyebrow: string | undefined = undefined;
  let aboutHeading: string | undefined = undefined;
  let aboutDescription: string | undefined = undefined;

  let whyEyebrow: string | undefined = undefined;
  let whyHeading = 'Why Choose Us';
  let whyDescription: string | undefined = undefined;
  let pillars: Array<{ title: string; description: string }> = [];

  let mktEyebrow: string | undefined = undefined;
  let mktHeading = 'Markets We Serve';
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
    const supabase = await createClient();

    const [
      { data: mediaData },
      { data: secData },
      { data: stepRes },
      { data: certData }
    ] = await Promise.all([
      supabase.from('homepage_media').select('*'),
      supabase.from('homepage_sections').select('*').in('section_key', ['about', 'statistics', 'markets', 'why_choose', 'vision_mission']),
      supabase.from('manufacturing_steps').select('*').eq('active', true).order('step_number', { ascending: true }),
      supabase.from('certifications').select('*').eq('active', true).not('image_url', 'is', null).order('display_order', { ascending: true })
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
        mktHeading = (mktContent.heading as string) || (mktContent.title as string) || 'Markets We Serve';
        mktBody = (mktContent.content as string) || (mktContent.subtitle as string) || undefined;
        const mktBgRaw = (mktContent.background_image as string) || (mktContent.background_image_url as string) || null;
        mktBgImageUrl = mktBgRaw ? getOptimizedImageUrl(mktBgRaw, { quality: 'best', upscale: true }) : null;
        mktRegions = (mktContent.regions as (string | MarketRegionItem)[]) || [];
      }

      const whySec = sections.find((s) => s.section_key === 'why_choose');
      if (whySec) {
        const whyContent = (whySec.content as Record<string, unknown>) || {};
        whyEyebrow = (whyContent.eyebrow as string) || undefined;
        whyHeading = (whyContent.heading as string) || (whyContent.title as string) || 'Why Choose Us';
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
  } catch {
    // Graceful fallback
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl('/')}#localbusiness`,
    name: 'Twinplast Polymers Pvt. Ltd.',
    url: getSiteUrl('/about'),
    logo: getSiteUrl('/logo.png'),
    description: 'Polypropylene (PP) sheet manufacturing facility operating in Tuticorin, Tamil Nadu, India.',
    telephone: '+91 96458 32154',
    email: 'info@twinplastpolymers.com',
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
    <div className="flex flex-col w-full bg-white text-slate-900 font-sans">
      <JsonLd data={localBusinessSchema} />

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

            {/* 7. Certification */}
      <CertificationSection certifications={certifications} />

      {/* 2. Statistics Section */}
      <StatisticsSection stats={statsItems} />

      {/* 3. Vision & Mission */}
      <VisionMissionSection
        visionTitle={visionTitle}
        visionText={visionText}
        missionTitle={missionTitle}
        missionText={missionText}
        vmImage={vmImage}
      />

      {/* 4. Markets We Serve */}
      <MarketsSection
        eyebrow={mktEyebrow}
        heading={mktHeading}
        body={mktBody}
        backgroundImage={mktBgImageUrl}
        regions={mktRegions}
      />

      {/* 5. Why Choose Us */}
      <WhyChooseSection
        eyebrow={whyEyebrow}
        heading={whyHeading}
        description={whyDescription}
        pillars={pillars}
        image={whyImageId}
      />

      {/* 6. 9-Stage Manufacturing Process */}
      <ManufacturingProcessSection steps={steps} />



      {/* 8. CTA Banner */}
      <CtaBanner />
    </div>
  );
}
