import type { Metadata } from 'next';
import { Award, Layers } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { HomepageMedia, ManufacturingStep, HomepageSection } from '@/types';
import { VisionMissionSection } from '@/components/home/VisionMissionSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { ManufacturingProcessSection } from '@/components/home/ManufacturingProcessSection';

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
  let aboutImageId: string | null = null;
  let aboutAltText = 'Twinplast Polymers manufacturing plant in Tuticorin';
  let whyImageId: string | null = null;
  let vmImage: string | null = null;

  let whyEyebrow: string | undefined = undefined;
  let whyHeading = 'Why Choose Us';
  let whyDescription: string | undefined = undefined;
  let pillars: Array<{ title: string; description: string }> = [];

  let visionTitle = 'Our Vision';
  let visionText = 'To become a trusted and recognized manufacturer of innovative polypropylene sheet and packaging solutions, delivering quality products and sustainable value to customers in India and international markets.';
  let missionTitle = 'Our Mission';
  let missionText = 'Our mission is to manufacture high-quality PP products that combine durability, functionality and cost-effectiveness while continuously improving our technology, manufacturing processes and customer service.';

  let steps: ManufacturingStep[] = [];

  try {
    const supabase = await createClient();

    const [
      { data: mediaData },
      { data: secData },
      { data: stepRes }
    ] = await Promise.all([
      supabase.from('homepage_media').select('*'),
      supabase.from('homepage_sections').select('*').in('section_key', ['why_choose', 'vision_mission']),
      supabase.from('manufacturing_steps').select('*').eq('active', true).order('step_number', { ascending: true })
    ]);

    if (mediaData) {
      const mediaList = mediaData as unknown as HomepageMedia[];
      const mainMedia = mediaList.find((m) => m.slot === 'about_main');
      if (mainMedia?.image_cloudinary_public_id) {
        aboutImageId = mainMedia.image_cloudinary_public_id;
      }
      if (mainMedia?.alt_text?.trim()) {
        aboutAltText = mainMedia.alt_text.trim();
      }
      const secMedia = mediaList.find((m) => m.slot === 'about_secondary_2');
      if (secMedia?.image_cloudinary_public_id) {
        whyImageId = secMedia.image_cloudinary_public_id;
      }
      const vmMedia = mediaList.find((m) => m.slot === 'vision_mission_image');
      if (vmMedia?.image_cloudinary_public_id) {
        vmImage = vmMedia.image_cloudinary_public_id;
      }
    }

    if (secData) {
      const sections = secData as unknown as HomepageSection[];
      const whySec = sections.find((s) => s.section_key === 'why_choose');
      if (whySec) {
        const whyContent = (whySec.content as Record<string, unknown>) || {};
        whyEyebrow = (whyContent.eyebrow as string) || undefined;
        whyHeading = (whyContent.heading as string) || (whyContent.title as string) || 'Why Choose Us';
        whyDescription = (whyContent.description as string) || undefined;
        pillars = (whyContent.pillars as Array<{ title: string; description: string }>) || 
                  (whyContent.reasons as Array<{ title: string; description: string }>) || [];
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
  } catch {
    // Graceful fallback
  }

  const companyStrengths = [
    { title: 'Modern Extrusion', desc: 'Operating advanced polymer extrusion machines to achieve accurate sheet finishes.', icon: Layers },
    { title: 'Quality Controls', desc: 'Consistent testing procedures safeguarding structural and visual parameters.', icon: Award },
  ];

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

      {/* Main Story & Values */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-4xl space-y-12">
          
          {/* Section Header */}
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Twinplast Story
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              About Us
            </h1>
            <p className="text-base text-muted max-w-2xl">
              Twinplast Polymers Pvt. Ltd. &bull; Tuticorin, Tamil Nadu, India
            </p>
          </div>

          {/* Plant Facade image */}
          <ImageContainer
            src={aboutImageId}
            alt={aboutAltText}
            aspectRatio="video"
            priority
          />

          {/* Authoritative About Us Text with Exact Source Bold Emphasis */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Twinplast Polymers Pvt. Ltd.</h2>
              
              {/* Paragraph 1 */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                <strong className="font-bold text-slate-900 dark:text-white">Twinplast Polymers Pvt. Ltd.</strong> is a manufacturer of high-quality <strong className="font-bold text-slate-900 dark:text-white">Polypropylene (PP) Corrugated Sheets and PP-based products</strong>, serving customers across <strong className="font-bold text-slate-900 dark:text-white">packaging, construction, industrial, advertising</strong> and other <strong className="font-bold text-slate-900 dark:text-white">commercial applications</strong>.
              </p>

              {/* Paragraph 2 */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Based in <strong className="font-bold text-slate-900 dark:text-white">Tuticorin, Tamil Nadu, India</strong>, Twinplast specializes in manufacturing versatile PP sheet solutions designed to provide <strong className="font-bold text-slate-900 dark:text-white">lightweight, durable, reusable and moisture-resistant alternatives</strong> for a wide range of applications.
              </p>

              {/* Paragraph 3 */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Our product range includes <strong className="font-bold text-slate-900 dark:text-white">PP Corrugated Sheets, PP Layer Pad Sheets, PP Sunpack Sheets, PP Floor Protection Sheets, PP Corrugated Boxes and customized PP products</strong>.
              </p>

              {/* Paragraph 4 */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                With a focus on product quality, customization and reliable supply, we work closely with customers to understand their requirements and provide practical PP solutions for their specific applications.
              </p>
            </div>

            <div className="md:col-span-5 bg-surface border border-surface-border p-6 rounded-xl shadow-sm space-y-6">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Plant Values</h3>
              <div className="space-y-4">
                {companyStrengths.map((str) => (
                  <div key={str.title} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <str.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{str.title}</h4>
                      <p className="text-xs text-muted mt-1 leading-normal">{str.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Vision & Mission */}
      <VisionMissionSection
        visionTitle={visionTitle}
        visionText={visionText}
        missionTitle={missionTitle}
        missionText={missionText}
        vmImage={vmImage}
      />

      {/* Why Choose Us */}
      <WhyChooseSection
        eyebrow={whyEyebrow}
        heading={whyHeading}
        description={whyDescription}
        pillars={pillars}
        image={whyImageId}
      />

      {/* 9-Stage Manufacturing Process */}
      <ManufacturingProcessSection steps={steps} />
    </div>
  );
}
