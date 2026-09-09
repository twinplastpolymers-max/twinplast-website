import type { Metadata } from 'next';
import { Award, Layers, Target, Compass } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { HomepageMedia } from '@/types';

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

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('homepage_media')
      .select('image_cloudinary_public_id, alt_text')
      .eq('slot', 'about_main')
      .maybeSingle();

    if (data) {
      const media = data as unknown as HomepageMedia;
      if (media.image_cloudinary_public_id) {
        aboutImageId = media.image_cloudinary_public_id;
      }
      if (media.alt_text?.trim()) {
        aboutAltText = media.alt_text.trim();
      }
    }
  } catch {
    // Graceful fallback to null image which renders editorial placeholder without broken icon
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
    <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <JsonLd data={localBusinessSchema} />
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

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-secondary/50 pt-12">
          <div className="bg-surface border border-surface-border p-8 rounded-xl shadow-sm space-y-4 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
              <Compass className="w-5 h-5 text-accent-green" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Our Vision</h3>
            <p className="text-sm text-muted leading-relaxed flex-1">
              To become a trusted and recognized manufacturer of innovative polypropylene sheet and packaging solutions, delivering quality products and sustainable value to customers in India and international markets.
            </p>
          </div>
          <div className="bg-surface border border-surface-border p-8 rounded-xl shadow-sm space-y-4 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
            <p className="text-sm text-muted leading-relaxed flex-1">
              Our mission is to manufacture high-quality PP products that combine durability, functionality and cost-effectiveness while continuously improving our technology, manufacturing processes and customer service.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
