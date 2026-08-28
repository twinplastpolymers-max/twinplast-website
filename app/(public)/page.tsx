import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sliders, 
  Layers, 
  Shield,
  Leaf,
  Droplet,
  Gem,
  Activity, 
  CheckCircle,
  Eye,
  Target,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  Users
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product, HomepageMedia } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

import { getSiteUrl } from '@/lib/site';

import { JsonLd } from '@/components/shared/JsonLd';

export const metadata: Metadata = {
  title: 'Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu',
  description: 'Twinplast Polymers Private Limited is a PP sheet manufacturer in Thoothukudi, Tamil Nadu, supplying PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheets for B2B industrial applications.',
  alternates: {
    canonical: getSiteUrl('/'),
  },
  openGraph: {
    title: 'Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu',
    description: 'Twinplast Polymers Private Limited is a PP sheet manufacturer in Thoothukudi, Tamil Nadu, supplying PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection and Box sheets for B2B industrial applications.',
    url: getSiteUrl('/'),
    type: 'website',
  },
};

export default async function HomePage() {
  let products: Product[] = [];
  let hasDbError = false;

  // Homepage media slots
  let heroImage: string | null = null;
  let aboutMainImage: string | null = null;
  let aboutSecondary1: string | null = null;
  let aboutSecondary2: string | null = null;
  let ctaBgImage: string | null = null;

  try {
    const supabase = await createClient();
    
    // 1. Fetch active products
    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (prodError) {
      hasDbError = true;
    } else {
      products = prodData || [];
    }

    // 2. Fetch homepage CMS media slots
    const { data: rawMedia } = await supabase
      .from('homepage_media')
      .select('*');

    if (rawMedia) {
      const mediaData = rawMedia as unknown as HomepageMedia[];
      heroImage = mediaData.find((m) => m.slot === 'hero')?.image_cloudinary_public_id || null;
      aboutMainImage = mediaData.find((m) => m.slot === 'about_main')?.image_cloudinary_public_id || null;
      aboutSecondary1 = mediaData.find((m) => m.slot === 'about_secondary_1')?.image_cloudinary_public_id || null;
      aboutSecondary2 = mediaData.find((m) => m.slot === 'about_secondary_2')?.image_cloudinary_public_id || null;
      ctaBgImage = mediaData.find((m) => m.slot === 'cta_background')?.image_cloudinary_public_id || null;
    }
  } catch {
    hasDbError = true;
  }

  const heroMetrics = [
    { label: 'Premium Quality', icon: Shield },
    { label: 'Lightweight & Durable', icon: Leaf },
    { label: 'Moisture & Chemical Resistant', icon: Droplet },
    { label: 'Custom Sizes Available', icon: Gem },
  ];

  const mainAdvantages = [
    {
      title: 'High Quality Materials',
      desc: 'Premium grade virgin PP raw materials for maximum tensile strength and finish.',
      icon: Shield,
    },
    {
      title: 'Advanced Manufacturing',
      desc: 'Modern automated extrusion lines ensuring precise flute thickness and GSM tolerance.',
      icon: Sliders,
    },
    {
      title: 'Custom Solutions',
      desc: 'Available in diverse GSM grades, thicknesses, custom sizes and colors to meet your needs.',
      icon: Activity,
    },
  ];

  const bottomFeatures = [
    { label: 'Consistent Quality', icon: Shield },
    { label: 'Precision Engineering', icon: Target },
    { label: 'On-Time Delivery', icon: Clock },
    { label: 'Dedicated Support', icon: Users },
  ];

  const aboutPoints = [
    'Quality Assured Extrusion',
    'Competitive Factory Pricing',
    'Dedicated B2B Support',
    '100% Eco-Friendly & Recyclable'
  ];

  const strengths = [
    { value: '10+', label: 'Years of Experience', desc: 'Deep technical polymer manufacturing expertise.' },
    { value: '200+', label: 'Enterprise Clients', desc: 'Trusted B2B supply and distribution network.' },
    { value: '500+', label: 'Pads Delivered Daily', desc: 'High-capacity automated output facility.' },
    { value: '50+', label: 'Product Specifications', desc: 'Tailored grades, GSM, colors, and cuts.' }
  ];

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${getSiteUrl('/')}#organization`,
    name: 'Twinplast Polymers Private Limited',
    url: getSiteUrl('/'),
    logo: getSiteUrl('/logo.png'),
    description: 'Twinplast Polymers Private Limited is a specialized B2B manufacturer of PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection, and Box sheets located in Thoothukudi, Tamil Nadu, India.',
    foundingDate: '2021',
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
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-slate-900 font-sans">
      <JsonLd data={organizationSchema} />
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-slate-50/40 to-white dark:from-slate-900/30 dark:via-slate-950 dark:to-slate-950 pt-5 sm:pt-10 lg:pt-16 pb-8 lg:pb-16 border-b border-slate-100 dark:border-slate-800 min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] flex flex-col justify-center" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left items-start space-y-4 sm:space-y-6">
              
              {/* Eyebrow Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider self-start shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
                <span>PREMIUM QUALITY</span>
              </div>

              {/* Headline */}
              <h1 id="hero-heading" className="text-3xl xs:text-4xl sm:text-5xl lg:text-[48px] xl:text-[54px] font-extrabold tracking-tight leading-[1.12] lg:leading-[1.14] text-slate-900 dark:text-white">
                Durable. Reliable.<br />
                <span className="text-blue-600 dark:text-blue-400"> Designed to Protect.</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-normal">
                Manufacturer of high-quality PP Corrugated Sheets, Layer Pad Sheets, Floor Protection Sheets &amp; more for multiple industries.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-start pt-1 w-full max-w-md">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-md shadow-blue-600/25 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-2xs active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Mobile/Tablet Product Showcase Card */}
            <div className="lg:hidden w-full pt-2 sm:pt-4">
              <div className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-slate-100/90 via-blue-50/40 to-slate-50/70 dark:from-slate-900/80 dark:via-slate-900/40 dark:to-slate-950 border border-blue-100/80 dark:border-slate-800 p-3 sm:p-5 shadow-sm overflow-hidden">
                
                {/* Floating Product Badge Top-Left inside card */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs font-semibold shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>PP Corrugated Sheets</span>
                </div>

                {/* Soft blue radial glow behind product */}
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-200/40 dark:bg-blue-600/20 blur-2xl pointer-events-none" />

                {/* Geometric concentric arcs in background */}
                <div className="absolute -top-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-blue-200/40 dark:border-blue-900/30 pointer-events-none" />
                <div className="absolute -top-6 -right-6 w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-blue-200/30 dark:border-blue-900/20 pointer-events-none" />

                {/* 3x4 Dot grid matrix overlay bottom-left */}
                <svg className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-12 h-16 sm:w-16 sm:h-20 text-blue-300/40 dark:text-blue-600/20 pointer-events-none" fill="currentColor" viewBox="0 0 40 50">
                  <circle cx="5" cy="5" r="2" /><circle cx="20" cy="5" r="2" /><circle cx="35" cy="5" r="2" />
                  <circle cx="5" cy="18" r="2" /><circle cx="20" cy="18" r="2" /><circle cx="35" cy="18" r="2" />
                  <circle cx="5" cy="31" r="2" /><circle cx="20" cy="31" r="2" /><circle cx="35" cy="31" r="2" />
                  <circle cx="5" cy="44" r="2" /><circle cx="20" cy="44" r="2" /><circle cx="35" cy="44" r="2" />
                </svg>

                {/* Integrated Product Image */}
                <div className="relative w-full h-[220px] xs:h-[240px] sm:h-[320px] z-10 pt-6">
                  {heroImage ? (
                    <Image
                      src={getOptimizedImageUrl(heroImage, { quality: 'best', sharpen: 90, upscale: true })}
                      alt="Twinplast Polymers PP Corrugated Sheets Stack"
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-contain object-right-bottom pointer-events-none p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Select Hero Image in CMS
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sub-bar metrics: Horizontal row on desktop, 4-column modern card on mobile matching reference */}
          <div className="pt-6 sm:pt-10 mt-6 sm:mt-10">
            {/* Mobile 4-Column Feature Card (Matching reference design bottom bar) */}
            <div className="lg:hidden bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-100 dark:border-slate-800 p-2.5 sm:p-3.5 shadow-xs grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800">
              {heroMetrics.map((m) => (
                <div key={m.label} className="flex flex-col items-center text-center px-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 shadow-2xs">
                    <m.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight tracking-tight">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop Metrics Row */}
            <div className="hidden lg:flex items-center justify-between gap-6 lg:gap-8 max-w-4xl border-t border-slate-100 dark:border-slate-800/80 pt-8 mt-8">
              {heroMetrics.map((m) => (
                <div key={m.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
                    <m.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Large Right-Anchored Image (Breaks out to viewport right edge) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[48vw] xl:w-[50vw] 2xl:w-[52vw] h-full pointer-events-none z-0">
          <div className="relative w-full h-full flex items-center justify-end">
            {heroImage ? (
              <Image
                src={getOptimizedImageUrl(heroImage, { quality: 'best', sharpen: 90, upscale: true })}
                alt="Twinplast Polymers PP Corrugated Sheets Stack"
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 50vw, 800px"
                className="object-contain object-right"
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. OUR PRODUCTS SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950" aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 border-b border-slate-100 dark:border-slate-900 pb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MANUFACTURING PRODUCT RANGE</span>
              </div>
              <h2 id="products-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Our Products
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              High-performance polypropylene corrugated sheets and solutions engineered for packaging, layer pads, and surface protection.
            </p>
          </div>

          {hasDbError ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Unable to load products right now. Please check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden bg-slate-50/80 dark:bg-slate-900/60 p-3 border-b border-slate-100 dark:border-slate-850">
                    <ImageContainer
                      src={prod.image_cloudinary_public_id}
                      alt={prod.title}
                      aspectRatio="tall"
                      fit="contain"
                      unstyled
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                      {prod.description}
                    </p>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-end">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 dark:text-blue-400 group-hover:gap-2 transition-all"
                        aria-label={`View ${prod.title}`}
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY CHOOSE TWINPLAST POLYMERS (High-Tech Dark Manufacturing Section) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#06142c] text-white relative overflow-hidden border-y border-slate-800" aria-labelledby="why-heading">
        
        {/* Ambient Radial Glow */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>WHY CHOOSE TWINPLAST POLYMERS?</span>
            </div>
            <h2 id="why-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Key Manufacturing <span className="text-blue-500">Advantages</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Precision extrusion, stringent GSM tolerance, and durable industrial performance.
            </p>
            <div className="w-12 h-0.5 bg-blue-500 rounded-full mx-auto pt-0.5 mt-3" />
          </div>

          {/* 3 Stacked Advantage Cards matching reference screenshot */}
          <div className="space-y-4 max-w-4xl mx-auto mb-8 sm:mb-10">
            {mainAdvantages.map((card) => (
              <div 
                key={card.title} 
                className="relative group rounded-2xl bg-gradient-to-r from-[#0b1c3d]/90 via-[#0a1835]/80 to-[#0b1c3d]/90 border border-blue-900/40 hover:border-blue-500/50 p-4 sm:p-6 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-900/20 overflow-hidden flex items-center justify-between gap-3 sm:gap-4"
              >
                {/* Subtle hover background highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Left Side: Icon Container + Text */}
                <div className="flex items-center gap-3.5 sm:gap-6 relative z-10 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-950/90 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-md shadow-blue-950/50 group-hover:scale-105 group-hover:border-blue-400/60 transition-all">
                    <card.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="space-y-1 text-left min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">{card.title}</h3>
                    <div className="w-6 h-0.5 bg-blue-500/80 rounded-full" />
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">{card.desc}</p>
                  </div>
                </div>

                {/* Right Side: Decorative Dot Grid Matrix & Circular Action Button */}
                <div className="flex items-center gap-3 sm:gap-4 relative z-10 shrink-0">
                  {/* Decorative 4x4 Dot Matrix (Visible on sm and up) */}
                  <svg className="hidden sm:block w-10 h-10 sm:w-12 sm:h-12 text-blue-500/20 pointer-events-none" fill="currentColor" viewBox="0 0 40 40">
                    <circle cx="5" cy="5" r="1.5" /><circle cx="16" cy="5" r="1.5" /><circle cx="27" cy="5" r="1.5" /><circle cx="38" cy="5" r="1.5" />
                    <circle cx="5" cy="16" r="1.5" /><circle cx="16" cy="16" r="1.5" /><circle cx="27" cy="16" r="1.5" /><circle cx="38" cy="16" r="1.5" />
                    <circle cx="5" cy="27" r="1.5" /><circle cx="16" cy="27" r="1.5" /><circle cx="27" cy="27" r="1.5" /><circle cx="38" cy="27" r="1.5" />
                    <circle cx="5" cy="38" r="1.5" /><circle cx="16" cy="38" r="1.5" /><circle cx="27" cy="38" r="1.5" /><circle cx="38" cy="38" r="1.5" />
                  </svg>

                  {/* Circular Arrow Button */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 4-Feature Strip Card matching reference screenshot */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#0a1835]/90 via-[#0c1d42]/80 to-[#0a1835]/90 border border-blue-900/40 p-3.5 sm:p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-blue-900/30">
            {bottomFeatures.map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center p-2 pt-3 sm:pt-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2 shadow-2xs">
                  <f.icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/10" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left side details - 5 Columns */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1.5">
                  ABOUT US
                </span>
                <h2 id="about-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
                  Trusted Manufacturer of PP Sheet Products
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Twinplast Polymers is a leading manufacturer of high-quality PP Corrugated Sheets, Layer Pad Sheets, Floor Protection Sheets and related products. We are committed to providing durable, reliable and cost-effective solutions for multiple industries.
              </p>
              
              {/* Modern Checkmark Pill Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {aboutPoints.map((pt) => (
                  <div key={pt} className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pt}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span>Know More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right side visual gallery - 7 Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 p-2 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-xs">
                <ImageContainer src={aboutMainImage} alt="Twinplast Polymers factory building" aspectRatio="video" fit="cover" />
              </div>
              <div className="p-2 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-xs">
                <ImageContainer src={aboutSecondary1} alt="Polypropylene extrusion machinery in Thoothukudi facility" aspectRatio="square" fit="cover" />
              </div>
              <div className="p-2 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-xs">
                <ImageContainer src={aboutSecondary2} alt="Stacked finished polymer partition pad cuts" aspectRatio="square" fit="cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR STRENGTH / STATS CARDS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900" aria-label="Our Strengths">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
              PROVEN TRACK RECORD
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white uppercase tracking-tight">
              Our Strength &amp; Capacity
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {strengths.map((str) => (
              <div 
                key={str.label} 
                className="flex flex-col p-5 sm:p-6 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-900/60 dark:to-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 text-center shadow-2xs hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
                  {str.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-3 block leading-tight">
                  {str.label}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed hidden sm:block">
                  {str.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VISION + MISSION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-900" aria-label="Strategic Mandates">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Vision Card */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                      CORPORATE DIRECTION
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">Our Vision</h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  &ldquo;To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service.&rdquo;
                </p>
              </div>
              <div className="w-12 h-1 bg-blue-600/20 rounded-full" />
            </div>
            
            {/* Mission Card */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500" />
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                      COMMITMENT OBJECTIVE
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">Our Mission</h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  &ldquo;To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to our customers while continuously improving our manufacturing capabilities and product range.&rdquo;
                </p>
              </div>
              <div className="w-12 h-1 bg-indigo-600/20 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOM SOLUTION B2B CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900" aria-labelledby="cta-heading">
        
        {/* Background Image slot with fallback */}
        <div className="absolute inset-0 z-0">
          {ctaBgImage ? (
            <ImageContainer 
              src={ctaBgImage} 
              alt="Industrial texture background" 
              className="w-full h-full rounded-none border-none pointer-events-none" 
            />
          ) : (
            <div className="w-full h-full bg-[#06152b] pointer-events-none" />
          )}
          
          {/* Deep Navy/Blue gradient overlay for high contrast text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#06152b] via-[#06152b]/95 to-[#0b294d]/85 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
          <div className="text-center lg:text-left space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
              Need a Custom Solution?
            </span>
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We Are Here to Help You
            </h2>
            <p className="text-xs sm:text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Tell us your requirement and our team will provide the best solution for your business.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-blue-900 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-transparent text-white hover:bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
