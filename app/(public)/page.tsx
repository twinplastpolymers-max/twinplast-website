import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Star, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Maximize2,
  CheckCircle,
  Truck,
  Eye,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product, HomepageMedia } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export const metadata: Metadata = {
  title: 'Twinplast Polymers | Industrial PP Sheets Manufacturer | Thoothukudi',
  description: 'Twinplast Polymers Private Limited manufactures premium PP Corrugated, Sunpack, Hollow, Layer Pad, and Floor Protection sheets in Thoothukudi, Tamil Nadu. Established in 2021.',
  openGraph: {
    title: 'Twinplast Polymers | Premium PP Sheets Manufacturer',
    description: 'High-quality Polypropylene sheet solutions custom manufactured in Thoothukudi, Tamil Nadu. Established 2021.',
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
    { label: 'Premium Quality', icon: Star },
    { label: 'Strong & Durable', icon: ShieldCheck },
    { label: 'Lightweight & Reusable', icon: Layers },
    { label: 'Custom Sizes Available', icon: Maximize2 },
  ];

  const whyChooseUs = [
    { title: 'High Quality Materials', desc: 'Premium grade virgin PP raw materials for maximum tensile strength and finish.', icon: CheckCircle },
    { title: 'Advanced Manufacturing', desc: 'Modern automated extrusion lines ensuring precise flute thickness and GSM tolerance.', icon: Sliders },
    { title: 'Custom Solutions', desc: 'Available in diverse GSM grades, thicknesses, custom corona treatments & tailored sizes.', icon: Activity },
    { title: 'Wide Applications', desc: 'Engineered for packaging, logistics separations, construction protection & print signage.', icon: Layers },
    { title: 'Timely Delivery', desc: 'Reliable pan-India delivery network with committed high-volume turnaround timelines.', icon: Truck },
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

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-slate-900 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white dark:from-slate-900/20 dark:via-slate-950 dark:to-slate-950 pt-8 sm:pt-12 lg:pt-16 pb-12 lg:pb-16 border-b border-slate-100 dark:border-slate-800 min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] flex flex-col justify-center" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-5 sm:space-y-6">
              
              {/* Eyebrow Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider self-center lg:self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span>PREMIUM QUALITY</span>
              </div>

              {/* Headline */}
              <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-extrabold tracking-tight leading-[1.14] text-slate-900 dark:text-white">
                Durable. Reliable.<br className="hidden sm:inline" />
                <span className="text-blue-600 dark:text-blue-400"> Designed to Protect.</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Manufacturer of high-quality PP Corrugated Sheets, Layer Pad Sheets, Floor Protection Sheets &amp; more for multiple industries.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-1">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white/80 hover:bg-slate-50 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 px-6 py-3.5 text-sm font-bold tracking-wide transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-2xs"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Mobile/Tablet Inline Product Image (Clean, elevated card) */}
            <div className="lg:hidden flex items-center justify-center w-full my-2">
              <div className="relative w-full max-w-[480px] h-[240px] sm:h-[320px] p-3 rounded-2xl bg-gradient-to-b from-slate-50/90 to-slate-100/40 dark:from-slate-900/50 dark:to-slate-900/20 border border-slate-200/60 dark:border-slate-800 shadow-xs">
                {heroImage ? (
                  <Image
                    src={getOptimizedImageUrl(heroImage, { quality: 'best', sharpen: 90, upscale: true })}
                    alt="Twinplast Polymers PP Corrugated Sheets Stack"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-contain object-center pointer-events-none p-2"
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

          {/* Sub-bar metrics: Horizontal row on desktop, 2x2 modern micro-cards on mobile */}
          <div className="pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 md:flex md:flex-wrap items-center justify-between gap-3 sm:gap-6 lg:gap-8 max-w-4xl">
            {heroMetrics.map((m) => (
              <div 
                key={m.label} 
                className="flex items-center gap-2.5 p-2.5 sm:p-0 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 sm:bg-transparent border border-slate-100 dark:border-slate-800/60 sm:border-none transition-colors"
              >
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
                <span>OUR PRODUCTS</span>
              </div>
              <h2 id="products-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Wide Range of PP Sheet Solutions
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md hidden lg:block leading-relaxed font-medium">
                We manufacture a wide range of PP sheets designed for packaging, construction, signage, and industrial applications.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-2xs shrink-0"
              >
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Catalog Render */}
          {products.length === 0 || hasDbError ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Catalog Updating</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our plant is currently updating sheet specifications. Please contact our Thoothukudi headquarters for bulk order weights, dimensions, or custom color inquiries.
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-center gap-4 text-xs text-slate-400 font-semibold">
                <div>Phone: <a href="tel:+919585388444" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">+91 95853 88444</a></div>
                <div>Email: <a href="mailto:twinplastpolymers@gmail.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">twinplastpolymers@gmail.com</a></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="flex flex-col bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
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
                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md mb-1.5">
                        {prod.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {prod.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">
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

      {/* 3. WHY CHOOSE TWINPLAST POLYMERS (Modern High-Tech Dark Grid) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#06152b] text-white relative overflow-hidden border-y border-slate-800" aria-labelledby="why-heading">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
              WHY CHOOSE TWINPLAST POLYMERS?
            </span>
            <h2 id="why-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Key Manufacturing Advantages
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Precision extrusion, stringent GSM tolerance, and durable industrial performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {whyChooseUs.map((v) => (
              <div 
                key={v.title} 
                className="flex flex-col items-start sm:items-center text-left sm:text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:border-blue-400/30 transition-all duration-300 space-y-3 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center shrink-0 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/25 transition-all">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{v.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
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
