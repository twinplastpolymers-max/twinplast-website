import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Layers, 
  Shield, 
  Leaf, 
  Droplet, 
  Gem, 
  CheckCircle, 
  Eye, 
  Target, 
  ArrowRight, 
  Globe2,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { 
  Product, 
  HomepageMedia, 
  HomepageSection, 
  Industry, 
  ManufacturingStep, 
  Certification 
} from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';

import { ProductCarousel } from '@/components/home/ProductCarousel';
import { IndustriesSection } from '@/components/home/IndustriesSection';
import { ManufacturingProcessSection } from '@/components/home/ManufacturingProcessSection';
import { CertificationsTrustSection } from '@/components/home/CertificationsTrustSection';

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
  let steps: ManufacturingStep[] = [];
  let certifications: Certification[] = [];
  
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
      { data: stepRes },
      { data: certRes },
      { data: settingRes }
    ] = await Promise.all([
      supabase.from('products').select('*').eq('active', true).order('display_order', { ascending: true }),
      supabase.from('homepage_media').select('*'),
      supabase.from('homepage_sections').select('*'),
      supabase.from('industries').select('*').eq('active', true).order('display_order', { ascending: true }),
      supabase.from('manufacturing_steps').select('*').eq('active', true).order('step_number', { ascending: true }),
      supabase.from('certifications').select('*').eq('active', true).order('display_order', { ascending: true }),
      supabase.from('company_settings').select('*')
    ]);

    products = prodRes || [];
    industries = indRes || [];
    steps = stepRes || [];
    certifications = certRes || [];
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
    // Graceful fallback to default verified values
  }

  // Section Content Extraction with Fallback Resiliency
  const getSec = (key: string) => {
    const sec = secData.find((s) => s.section_key === key);
    return (sec?.content as Record<string, unknown>) || {};
  };

  // 1. Hero Content
  const heroContent = getSec('hero');
  const heroEyebrow = (heroContent.eyebrow as string) || (heroContent.badge_text as string) || 'DURABLE · VERSATILE · RELIABLE';
  const heroHeadline = (heroContent.headline as string) || 'Polypropylene Sheets & PP Product Manufacturer';
  const heroSubheadline = (heroContent.subheadline as string) || 'High-quality polypropylene sheets and PP products engineered for diverse industrial applications. Stronger. Safer. A more sustainable tomorrow.';
  const heroPrimaryLabel = (heroContent.primary_cta_label as string) || (heroContent.primary_cta_text as string) || 'Explore Products';
  const heroPrimaryUrl = (heroContent.primary_cta_url as string) || '/products';
  const heroSecondaryLabel = (heroContent.secondary_cta_label as string) || (heroContent.secondary_cta_text as string) || 'Contact Us';
  const heroSecondaryUrl = (heroContent.secondary_cta_url as string) || '/contact';

  // 2. About Content
  const aboutContentData = getSec('about');
  const aboutEyebrow = (aboutContentData.eyebrow as string) || 'ABOUT OUR COMPANY';
  const aboutHeading = (aboutContentData.heading as string) || (aboutContentData.title as string) || 'Twinplast Polymers Private Limited';
  const aboutSubheadline = (aboutContentData.subheadline as string) || (aboutContentData.subtitle as string) || 'Established in 2021 in Thoothukudi, Tamil Nadu, India.';
  const aboutBody = (aboutContentData.content as string) || 'We are a trusted manufacturer of polypropylene sheets and PP products, delivering innovative and high-quality solutions for industrial and commercial applications. With advanced manufacturing facilities and a commitment to excellence, we serve customers across diverse industries.';
  const aboutCtaLabel = (aboutContentData.cta_label as string) || 'More About Us';
  const aboutCtaUrl = (aboutContentData.cta_url as string) || '/about';

  // 3. Vision & Mission Content
  const vmData = getSec('vision_mission');
  const visionObj = (vmData.vision as Record<string, string>) || {};
  const missionObj = (vmData.mission as Record<string, string>) || {};
  const visionTitle = visionObj.title || 'Our Vision';
  const visionText = visionObj.content || 'To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service.';
  const missionTitle = missionObj.title || 'Our Mission';
  const missionText = missionObj.content || 'To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to our customers while continuously improving our manufacturing capabilities.';
  const objectives = (vmData.objectives as string[]) || [
    'Consistent product quality',
    'Innovative PP solutions',
    'Tailored B2B customization',
    'Competitive factory pricing',
    'Reliable supply schedules',
    'Eco-friendly recyclable PP materials'
  ];

  // 4. Why Choose Content
  const whyContent = getSec('why_choose');
  const whyEyebrow = (whyContent.eyebrow as string) || 'OUR ADVANTAGES';
  const whyHeading = (whyContent.heading as string) || (whyContent.title as string) || 'Why Choose Us';
  const whyDescription = (whyContent.description as string) || 'We combine advanced technology, quality materials and customer-centric approach to deliver the best polypropylene solutions.';
  const pillars = (whyContent.pillars as Array<{ title: string; description: string }>) || 
                  (whyContent.reasons as Array<{ title: string; description: string }>) || [
    { title: 'High-Quality Materials', description: 'Premium grade raw materials for long-lasting performance.' },
    { title: 'Advanced Technology', description: 'State-of-the-art manufacturing facilities.' },
    { title: 'Custom Solutions', description: 'Products tailored to your industry needs.' },
    { title: 'Reliable Supply', description: 'Consistent quality and on-time delivery.' },
    { title: 'Cost Effective', description: 'Maximum value for your investment.' },
    { title: 'Expert Support', description: 'Dedicated team for technical and after-sales support.' }
  ];

  // 5. Quality Commitment Content
  const qualContentData = getSec('quality_commitment');
  const qualEyebrow = (qualContentData.eyebrow as string) || 'OUR COMMITMENT';
  const qualHeading = (qualContentData.heading as string) || (qualContentData.title as string) || 'Quality Commitment';
  const qualBody = (qualContentData.content as string) || 'We are committed to delivering polypropylene sheets and PP products that meet the highest standards of quality, durability and safety.';
  const qualParams = (qualContentData.parameters as string[]) || (qualContentData.standards as string[]) || [
    'Strict quality control',
    'Durable and reliable products',
    'Consistent performance',
    'Compliance with industry standards'
  ];

  // 6. Markets Content
  const mktContentData = getSec('markets');
  const mktEyebrow = (mktContentData.eyebrow as string) || 'SUPPLYING QUALITY WORLDWIDE';
  const mktHeading = (mktContentData.heading as string) || (mktContentData.title as string) || 'Markets We Serve';
  const mktBody = (mktContentData.content as string) || (mktContentData.subtitle as string) || 'Our products are trusted by clients across India and global markets.';
  const mktRegions = (mktContentData.regions as string[]) || ['India', 'Middle East', 'Asia', 'Africa', 'Europe', 'Americas'];

  // 7. Final CTA Content
  const ctaContentData = getSec('final_cta');
  const ctaHeading = (ctaContentData.heading as string) || (ctaContentData.headline as string) || "Let's Build A Stronger Tomorrow";
  const ctaSubheadline = (ctaContentData.subheadline as string) || 'Get in touch with our team for product inquiries, custom solutions, or bulk orders. We are here to assist.';
  const ctaPrimaryLabel = (ctaContentData.primary_cta_label as string) || (ctaContentData.button_text as string) || 'Contact Us';
  const ctaPrimaryUrl = (ctaContentData.primary_cta_url as string) || '/contact';
  const ctaSecondaryLabel = (ctaContentData.secondary_cta_label as string) || 'Request a Quote';
  const ctaSecondaryUrl = (ctaContentData.secondary_cta_url as string) || '/contact';

  // Hero feature cards
  const heroMetrics = [
    { label: 'Premium Quality', icon: Shield },
    { label: 'Custom Solutions', icon: Gem },
    { label: 'Bulk Supply Support', icon: Leaf },
    { label: 'On-Time Delivery', icon: Droplet },
  ];

  // Right-side hero feature tags
  const heroSideTags = [
    'LIGHTWEIGHT',
    'CHEMICAL RESISTANT',
    'DURABLE',
    'ECO-FRIENDLY'
  ];

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
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Light background, large typography, integrated visual)    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/25 via-slate-50/30 to-white pt-8 sm:pt-12 lg:pt-16 pb-8 lg:pb-12 border-b border-slate-100" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left items-start space-y-4 sm:space-y-5">
              
              {/* Eyebrow */}
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                {heroEyebrow}
              </span>

              {/* Main Headline */}
              <h1 id="hero-heading" className="text-3xl xs:text-4xl sm:text-5xl lg:text-[46px] xl:text-[52px] font-extrabold tracking-tight leading-[1.12] text-slate-900">
                {heroHeadline}
              </h1>

              {/* Subheadline Paragraph */}
              <p className="text-sm sm:text-base lg:text-[17px] text-slate-600 max-w-xl leading-relaxed font-normal">
                {heroSubheadline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-md">
                <Link
                  href={heroPrimaryUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 text-sm font-bold tracking-wide transition-all shadow-sm shadow-blue-600/25 cursor-pointer"
                >
                  <span>{heroPrimaryLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={heroSecondaryUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-6 py-3 text-sm font-bold tracking-wide transition-all shadow-2xs cursor-pointer"
                >
                  <span>{heroSecondaryLabel}</span>
                </Link>
              </div>
            </div>

            {/* Right Media Image Container (Naturally integrated visual + side callout tags) */}
            <div className="lg:col-span-5 w-full pt-4 lg:pt-0 flex items-center justify-center relative">
              <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] lg:h-[420px] max-w-[500px] flex items-center justify-center">
                {heroImage ? (
                  <Image
                    src={getOptimizedImageUrl(heroImage, { quality: 'best', sharpen: 90, upscale: true })}
                    alt="Twinplast Polymers Polypropylene Extrusion Product Showcase"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-contain filter drop-shadow-xl transition-transform duration-500 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <Layers className="w-12 h-12 text-blue-600 opacity-60" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Polypropylene Extrusion Line
                    </span>
                  </div>
                )}
              </div>

              {/* Right Side Bullet Features */}
              <div className="hidden xl:flex flex-col gap-3 pl-4 border-l border-slate-200/80 text-[11px] font-bold tracking-wider text-slate-400">
                {heroSideTags.map((tag) => (
                  <span key={tag} className="hover:text-blue-600 transition-colors">
                    · {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Inline Trust Metrics Strip */}
          <div className="pt-8 mt-8 border-t border-slate-200/70">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {heroMetrics.map((m) => (
                <div key={m.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <m.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT OUR COMPANY                                                     */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left side details */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                  {aboutEyebrow}
                </span>
                <div className="w-8 h-0.5 bg-blue-600 rounded-full mb-2" />
                <h2 id="about-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {aboutHeading}
                </h2>
                <p className="text-xs font-semibold text-slate-400 pt-0.5">
                  {aboutSubheadline}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {aboutBody}
              </p>
              
              <div className="pt-2">
                <Link
                  href={aboutCtaUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-600/20"
                >
                  <span>{aboutCtaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Gallery / Media Slot Showcase */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
              <div className="col-span-2 relative border border-slate-200 bg-slate-50 rounded-xl overflow-hidden min-h-[220px] shadow-2xs group">
                <ImageContainer src={aboutMainImage} alt="Twinplast Polymers manufacturing facility in Thoothukudi" aspectRatio="video" fit="cover" />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white px-3 py-1 rounded-md text-[11px] font-bold tracking-wider">
                  Engineering Polymer Solutions
                </div>
              </div>
              <div className="relative border border-slate-200 bg-slate-50 rounded-xl overflow-hidden min-h-[160px] shadow-2xs group">
                <ImageContainer src={aboutSecondary1} alt="Automated polypropylene extrusion line machinery" aspectRatio="square" fit="cover" />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
                  Advanced Manufacturing
                </div>
              </div>
              <div className="relative border border-slate-200 bg-slate-50 rounded-xl overflow-hidden min-h-[160px] shadow-2xs group">
                <ImageContainer src={aboutSecondary2} alt="Stacked finished polymer partition layer pads" aspectRatio="square" fit="cover" />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
                  Consistent Quality
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VISION & MISSION (Pure Editorial Layout: Clean, Typographic, Minimal)  */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80" aria-label="Vision and Mission">
        <div className="mx-auto max-w-7xl space-y-8">
          
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
              OUR DIRECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Vision &amp; Mission
            </h2>
          </div>

          {/* 2-Column Editorial Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2">
            
            {/* Vision */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">{visionTitle}</h3>
              </div>
              <div className="w-12 h-0.5 bg-blue-600" />
              <p className="text-sm text-slate-600 leading-relaxed font-normal pt-1">
                {visionText}
              </p>
            </div>

            {/* Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">{missionTitle}</h3>
              </div>
              <div className="w-12 h-0.5 bg-blue-600" />
              <p className="text-sm text-slate-600 leading-relaxed font-normal pt-1">
                {missionText}
              </p>
            </div>

          </div>

          {/* Objectives Horizontal Row */}
          {objectives && objectives.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
                CORE OPERATIONAL OBJECTIVES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {objectives.map((obj) => (
                  <div key={obj} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRODUCT SHOWCASE (Horizontal Carousel)                                 */}
      {/* ========================================================================= */}
      <ProductCarousel products={products} />

      {/* ========================================================================= */}
      {/* 5. INDUSTRIES & APPLICATIONS (Compact icon cards)                         */}
      {/* ========================================================================= */}
      <IndustriesSection 
        industries={industries} 
        title="Industries & Applications" 
        subtitle="Our polypropylene sheets and PP products are widely used across industries, delivering reliable performance in challenging environments." 
      />

      {/* ========================================================================= */}
      {/* 6. WHY CHOOSE US (Dark Navy Two-Column: 2x3 Grid Left + Image Right)       */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#06142c] text-white relative overflow-hidden border-t border-slate-800" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content: Eyebrow + Heading + 2x3 Feature Grid */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
                  {whyEyebrow}
                </span>
                <h2 id="why-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                  {whyHeading}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {whyDescription}
                </p>
              </div>

              {/* 2x3 Compact Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-xl bg-[#0a1835]/90 border border-blue-900/40 hover:border-blue-500/50 transition-all duration-200 space-y-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{pillar.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Media Column: Large Product / Factory Showcase Image */}
            <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden border border-blue-900/50 shadow-2xl bg-[#0a1835]">
              {aboutSecondary2 ? (
                <Image
                  src={getOptimizedImageUrl(aboutSecondary2, { quality: 'best', sharpen: 90, upscale: true })}
                  alt="Finished polypropylene sheet products ready for industrial dispatch"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a1835] to-[#06142c]">
                  <Layers className="w-16 h-16 text-blue-500/40" />
                </div>
              )}
              
              {/* Overlay Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06142c] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
                  BUILT FOR
                </span>
                <p className="text-lg font-extrabold text-white tracking-tight">
                  A STRONGER TOMORROW
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MANUFACTURING PROCESS (Horizontal Connected Pipeline)                  */}
      {/* ========================================================================= */}
      <ManufacturingProcessSection steps={steps} />

      {/* ========================================================================= */}
      {/* 8. QUALITY COMMITMENT                                                    */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100" aria-labelledby="quality-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Heading + Paragraph + 2x2 Checks */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                  {qualEyebrow}
                </span>
                <h2 id="quality-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {qualHeading}
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {qualBody}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {qualParams.map((param) => (
                  <div key={param} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{param}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Precision Quality Visual Card */}
            <div className="lg:col-span-5 relative w-full h-[220px] sm:h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs group">
              {aboutSecondary1 ? (
                <Image
                  src={getOptimizedImageUrl(aboutSecondary1, { quality: 'best', sharpen: 90, upscale: true })}
                  alt="Precision measurement and extrusion tolerance inspection"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Shield className="w-10 h-10 text-blue-600" />
                  <p className="text-sm font-bold text-slate-900">Extrusion Quality Inspection</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="w-6 h-0.5 bg-blue-500 mb-1" />
                <p className="text-xs font-extrabold uppercase tracking-wider text-white">
                  QUALITY IN EVERY SHEET
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CERTIFICATIONS & TRUST                                                */}
      {/* ========================================================================= */}
      <CertificationsTrustSection certifications={certifications} />

      {/* ========================================================================= */}
      {/* 10. MARKETS WE SERVE                                                     */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100" aria-label="Markets">
        <div className="mx-auto max-w-7xl text-center space-y-8">
          
          <div className="max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
              {mktEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mktHeading}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {mktBody}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-5xl mx-auto">
            {mktRegions.map((region) => (
              <div key={region} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 shadow-2xs">
                <Globe2 className="w-5 h-5 text-blue-600" />
                <span>{region}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FINAL CTA                                                            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden py-18 sm:py-22 px-4 sm:px-6 lg:px-8 border-t border-slate-900" aria-labelledby="cta-heading">
        <div className="absolute inset-0 z-0">
          {ctaBgImage ? (
            <Image
              src={getOptimizedImageUrl(ctaBgImage, { quality: 'best', sharpen: 90, upscale: true })}
              alt="Industrial texture background"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
            />
          ) : (
            <div className="w-full h-full bg-[#06152b] pointer-events-none" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#06152b] via-[#06152b]/90 to-[#0b294d]/80 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
          <div className="text-center lg:text-left space-y-2.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
              B2B ENQUIRY PATHWAY
            </span>
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {ctaHeading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {ctaSubheadline}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-center">
            <Link
              href={ctaPrimaryUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-slate-50 text-blue-900 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>{ctaPrimaryLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={ctaSecondaryUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/60 bg-transparent text-white hover:bg-white/10 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{ctaSecondaryLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
