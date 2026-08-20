import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Award, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Activity, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product, HomepageMedia } from '@/types';

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
    { label: 'Premium Quality', icon: Award },
    { label: 'Strong & Durable', icon: ShieldCheck },
    { label: 'Lightweight & Reusable', icon: Layers },
    { label: 'Custom Sizes Available', icon: CheckCircle },
  ];

  const whyChooseUs = [
    { title: 'High Quality Materials', desc: 'Premium grade PP raw materials for superior performance.', icon: Award },
    { title: 'Advanced Manufacturing', desc: 'Modern machines and technology for precise thickness and finish.', icon: Sliders },
    { title: 'Custom Solutions', desc: 'Available in various colors, thicknesses and sizes as per your needs.', icon: Activity },
    { title: 'Wide Applications', desc: 'Used in packaging, logistics, construction, printing, industry and more.', icon: Layers },
    { title: 'Timely Delivery', desc: 'Reliable delivery and consistent supply for all your requirements.', icon: Truck },
  ];

  const aboutPoints = [
    'Quality Assured Products',
    'Competitive Pricing',
    'Customer Satisfaction',
    'Eco-Friendly & Recyclable'
  ];

  const strengths = [
    { value: '10+', label: 'Years of Experience', desc: 'Deep technical manufacturing expertise.' },
    { value: '200+', label: 'Happy Customers', desc: 'Trusted B2B distribution network.' },
    { value: '500+', label: 'Products Delivered Daily', desc: 'High capacity automated output.' },
    { value: '50+', label: 'Products Available', desc: 'Tailored grades, GSM, and sizes.' }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-slate-900 font-sans">
      
      {/* 1. HERO SECTION (Light, confident, aligned with reference) */}
      <section className="relative bg-slate-50 dark:bg-slate-900/10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                PREMIUM QUALITY
              </span>
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                Durable. Reliable.<br />
                <span className="text-blue-600 dark:text-blue-400">Designed to Protect.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Manufacturer of high-quality PP Corrugated Sheets, Layer Pad Sheets, Floor Protection Sheets & more for multiple industries.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-sm font-bold tracking-wider transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Explore Products &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 px-6 py-3.5 text-sm font-bold tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Request a Quote &rarr;
                </Link>
              </div>

              {/* Sub-bar metrics overlay */}
              <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-y-4 gap-x-6">
                {heroMetrics.map((m) => (
                  <div key={m.label} className="flex items-center gap-2.5 justify-center lg:justify-start">
                    <div className="p-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <m.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Media Frame */}
            <div className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none">
              <div className="p-2 border border-slate-200/50 bg-white dark:bg-slate-950 rounded-2xl shadow-sm">
                <ImageContainer
                  src={heroImage}
                  alt="Twinplast Polymers fluted sheet stacked together"
                  aspectRatio="video"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR PRODUCTS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950" aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-100 dark:border-slate-900 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                OUR PRODUCTS
              </span>
              <h2 id="products-heading" className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Wide Range of PP Sheet Solutions
              </h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md hidden lg:block leading-normal font-semibold">
                We manufacture a wide range of PP sheets designed for packaging, construction, signage, and industrial applications.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>View All Products &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Catalog Render */}
          {products.length === 0 || hasDbError ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Catalog Updating</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our plant is currently updating sheet specifications. Please contact our Thoothukudi headquarters for bulk order weights, dimensions, or custom color inquiries.
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-center gap-4 text-xs text-slate-400 font-semibold">
                <div>Phone: <span className="text-slate-700 dark:text-slate-300 font-bold">+91 95853 88444</span></div>
                <div>Email: <span className="text-slate-700 dark:text-slate-300 font-bold">twinplastpolymers@gmail.com</span></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <ImageContainer
                    src={prod.image_cloudinary_public_id}
                    alt={prod.title}
                    aspectRatio="video"
                  />
                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                        {prod.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {prod.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">
                      {prod.description}
                    </p>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-end">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        aria-label={`View ${prod.title}`}
                      >
                        <span>View Product &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY CHOOSE TWINPLAST POLYMERS (Dark navy feature band matching reference) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#06152b] text-white border-y border-slate-900" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              WHY CHOOSE TWINPLAST POLYMERS?
            </span>
            <h2 id="why-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              Key Quality Advantages
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-slate-800">
            {whyChooseUs.map((v) => (
              <div key={v.title} className="flex flex-col items-center text-center p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{v.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION (Visual editorial composition matching reference) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/10" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side details - 5 Columns */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                  ABOUT US
                </span>
                <h2 id="about-heading" className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  Trusted Manufacturer of PP Sheet Products
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Twinplast Polymers is a leading manufacturer of high-quality PP Corrugated Sheets, Layer Pad Sheets, Floor Protection Sheets and related products. We are committed to providing durable, reliable and cost-effective solutions for multiple industries.
              </p>
              
              {/* Bullet list checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {aboutPoints.map((pt) => (
                  <div key={pt} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{pt}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Know More About Us &rarr;
                </Link>
              </div>
            </div>

            {/* Right side visual gallery - 7 Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="col-span-2 p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-sm">
                <ImageContainer src={aboutMainImage} alt="Twinplast Polymers factory building" aspectRatio="video" />
              </div>
              <div className="p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-sm">
                <ImageContainer src={aboutSecondary1} alt="Polypropylene extrusion machinery in Thoothukudi facility" aspectRatio="square" />
              </div>
              <div className="p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-sm">
                <ImageContainer src={aboutSecondary2} alt="Stacked finished polymer partition pad cuts" aspectRatio="square" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR STRENGTH / STATS CARDS */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900" aria-label="Our Strengths">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white uppercase tracking-wide">
              &mdash; Our Strength &mdash;
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengths.map((str) => (
              <div key={str.label} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-center shadow-sm">
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                  {str.value}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-3 block leading-tight">
                  {str.label}
                </span>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {str.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VISION + MISSION (Balanced editorial panels matching reference) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-900" aria-label="Strategic Mandates">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Vision Card */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 border-l-4 border-l-blue-600 p-8 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                  CORPORATE DIRECTION
                </span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Our Vision</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  &ldquo;To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service.&rdquo;
                </p>
              </div>
              <div className="w-12 h-1 bg-blue-600/20 rounded" />
            </div>
            
            {/* Mission Card */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 border-l-4 border-l-blue-600 p-8 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                  COMMITMENT OBJECTIVE
                </span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Our Mission</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  &ldquo;To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to our customers while continuously improving our manufacturing capabilities and product range.&rdquo;
                </p>
              </div>
              <div className="w-12 h-1 bg-blue-600/20 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOM SOLUTION B2B CTA (Image background + navy overlay matching reference) */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900" aria-labelledby="cta-heading">
        
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

        <div className="relative z-20 mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
              Need a Custom Solution?
            </span>
            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We Are Here to Help You
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Tell us your requirement and our team will provide the best solution for your business.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full sm:w-auto justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-slate-50 text-blue-900 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              Request a Quote &rarr;
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/60 bg-transparent text-white hover:bg-white/10 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              Contact Us &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
