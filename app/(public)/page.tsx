import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Sliders, Layers, Clock, ArrowRight, ChevronRight, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Product } from '@/types';

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

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) {
      hasDbError = true;
    } else {
      products = data || [];
    }
  } catch {
    hasDbError = true;
  }

  const capabilities = [
    { metric: '2021', label: 'Established', desc: 'Extrusion plant founded in Thoothukudi, Tamil Nadu.' },
    { metric: '6', label: 'Core Categories', desc: 'Verified PP sheet configurations for diverse packaging and layout protection.' },
    { metric: 'CUSTOM', label: 'Specifications', desc: 'Calibrated to client GSM weight, thickness, sheet size, and color requirements.' },
    { metric: 'B2B', label: 'Target Scope', desc: 'Dedicated commercial delivery channels and high-load industrial applications.' },
  ];

  const values = [
    { title: 'High Quality Materials', desc: 'Manufactured with premium raw polypropylene polymers for long-term sheet durability and impact strength.', icon: Award },
    { title: 'Custom Solutions', desc: 'Extruded precisely to match client targets for thickness, color coatings, size cuts, and GSM weights.', icon: Sliders },
    { title: 'Wide Applications', desc: 'Engineered for packaging boxes, advertising print boards, separation dividers, and structural floor protection.', icon: Layers },
    { title: 'Timely Delivery', desc: 'Reliable distribution networks delivering consistent supply batches directly from our plant in Tamil Nadu.', icon: Clock },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* 1. LIGHT HERO SECTION */}
      <section className="relative bg-slate-50 dark:bg-slate-900/40 py-20 px-4 sm:px-6 lg:px-8 border-b border-surface-border animate-fade-in" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                PP Sheet Manufacturer &bull; Tamil Nadu
              </span>
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                Durable. Reliable.<br />
                <span className="text-accent">Designed to Protect.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Twinplast Polymers Private Limited is an industrial manufacturer of polypropylene sheet solutions, supplying fluted partition pads, advertising boards, and flooring guards from our Thoothukudi facility.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/95 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-sm"
                >
                  Explore Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
            
            {/* Right Media Frame - Styled to elegantly receive future images */}
            <div className="lg:col-span-5 w-full max-w-lg mx-auto lg:max-w-none">
              <div className="p-2 border border-surface-border bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <ImageContainer
                  src="brand/twinplast-hero-visual"
                  alt="Industrial Polypropylene Extrusion Visual"
                  aspectRatio="square"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED CAPABILITY / STRENGTH SECTION */}
      <section className="bg-white dark:bg-slate-950 border-b border-surface-border py-12 px-4" aria-label="Capabilities Overview">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.label} className="flex flex-col p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-surface-border text-center sm:text-left">
                <span className="text-3xl font-extrabold text-accent leading-none">
                  {cap.metric}
                </span>
                <span className="text-sm font-bold text-foreground mt-2">
                  {cap.label}
                </span>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIGHT/WHITE PRODUCT SHOWCASE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950" aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Our Capabilities
              </span>
              <h2 id="products-heading" className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-1">
                Polypropylene Sheet Range
              </h2>
              <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
                Extruded using high-grade polymers, our sheet structures support industrial packaging fabrication, temporary floor shielding, and corporate printing layouts.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 mt-4 md:mt-0 text-sm font-bold text-accent hover:text-accent/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded px-0.5"
            >
              <span>View Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Database Content Checker - Graceful B2B Empty State */}
          {products.length === 0 || hasDbError ? (
            <div className="rounded-2xl border border-surface-border bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-foreground">Catalog Update in Progress</h3>
              <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">
                We are currently indexing our latest manufactured PP sheet catalog items. For bulk orders, custom dimensions, GSM inquiries, or colors, please contact our factory team.
              </p>
              <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-muted">
                <div>Phone: <span className="font-bold text-foreground">+91 95853 88444</span></div>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>Email: <span className="font-bold text-foreground">twinplastpolymers@gmail.com</span></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex flex-col bg-white dark:bg-slate-900 border border-surface-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <ImageContainer
                    src={prod.image_cloudinary_public_id}
                    alt={prod.title}
                    aspectRatio="video"
                  />
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
                        {prod.category}
                      </span>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                        {prod.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted leading-relaxed flex-1 line-clamp-3">
                      {prod.description}
                    </p>
                    <div className="pt-4 border-t border-secondary/50 flex justify-end">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent group-hover:underline"
                        aria-label={`View ${prod.title}`}
                      >
                        <span>View Product</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. DARK VALUE / WHY-TWINPLAST BAND */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground border-y border-slate-800" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              B2B Partner Advantages
            </span>
            <h2 id="why-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Why Partner With Twinplast?
            </h2>
            <p className="text-sm text-slate-400">
              Extruded quality, custom sizing, and structural durability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col space-y-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{v.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIGHT ABOUT SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/40" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side details */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Corporate Profile
              </span>
              <h2 id="about-heading" className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Twinplast Polymers Pvt. Ltd.
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Established in 2021 in Thoothukudi, Tamil Nadu, Twinplast Polymers Private Limited is an industrial manufacturer specializing in polypropylene sheet extrusion.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Operating with rigid quality checkpoints, we customize GSM parameters, sheet thickness, color pigments, and cut dimensions to match client specifications for shipping partitions, print signage, and floor protection.
              </p>
              
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-slate-800 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Know More About Us
                </Link>
              </div>
            </div>

            {/* Right side side-images grid - Clean frames styled to receive future uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 p-1.5 border border-surface-border bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <ImageContainer src="brand/twinplast-plant-facade" alt="Thoothukudi plant facade" aspectRatio="video" />
              </div>
              <div className="p-1.5 border border-surface-border bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <ImageContainer src="brand/twinplast-extrusion-line" alt="Sheet extrusion layout" aspectRatio="square" />
              </div>
              <div className="p-1.5 border border-surface-border bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                <ImageContainer src="brand/twinplast-sheet-stack" alt="Polypropylene stack storage" aspectRatio="square" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIGHT/DISTINCT VISION + MISSION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-surface-border" aria-label="Strategic Mandates">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Vision */}
            <div className="bg-slate-50 dark:bg-slate-900 border-t-4 border-accent p-8 rounded-b-xl shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Corporate Direction</span>
                <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
                <p className="text-sm text-muted leading-relaxed">
                  &ldquo;To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service.&rdquo;
                </p>
              </div>
              <div className="w-6 h-0.5 bg-accent/25 mt-4" />
            </div>
            
            {/* Mission */}
            <div className="bg-slate-50 dark:bg-slate-900 border-t-4 border-accent p-8 rounded-b-xl shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Commitment Objective</span>
                <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
                <p className="text-sm text-muted leading-relaxed">
                  &ldquo;To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to our customers while continuously improving our manufacturing capabilities and product range.&rdquo;
                </p>
              </div>
              <div className="w-6 h-0.5 bg-accent/25 mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. STRONG CONTRAST CTA SECTION */}
      <section className="bg-accent text-accent-foreground py-16 px-4 sm:px-6 lg:px-8 text-center" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Need a Custom PP Sheet Solution?
          </h2>
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed">
            Contact us to discuss your targets for GSM weight, sheet thickness, dimensional sizing, and colors. Our Thoothukudi team is equipped to support customized bulk packaging or floor guard requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white text-accent hover:bg-slate-50 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent text-white hover:bg-white/10 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us
            </Link>
          </div>
          
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-200">
            <HelpCircle className="w-4 h-4 opacity-80" />
            <span>Direct Plant Hotline: +91 95853 88444</span>
          </div>
        </div>
      </section>
    </div>
  );
}
