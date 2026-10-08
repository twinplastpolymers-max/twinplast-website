import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Factory, Truck, Layers, Mail, HelpCircle } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Corrugated Sheet Manufacturer in Kochi | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD manufactures 100% waterproof PP Corrugated Sheets, PP Layer Pads, Sunpack Boards, and Floor Protection Sheets for seafood, beverage, pharmaceutical, and construction industries across Kochi, Ernakulam, and Kerala.',
  alternates: {
    canonical: getSiteUrl('/locations/kochi'),
  },
  openGraph: {
    title: 'PP Corrugated Sheet Manufacturer in Kochi | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD manufactures 100% waterproof PP Corrugated Sheets, PP Layer Pads, Sunpack Boards, and Floor Protection Sheets for seafood, beverage, pharmaceutical, and construction industries across Kochi, Ernakulam, and Kerala.',
    url: getSiteUrl('/locations/kochi'),
    siteName: 'Twinplast Polymers PVT LTD',
    type: 'website',
    images: [
      {
        url: getSiteUrl('/logo.png'),
        width: 572,
        height: 436,
        alt: 'Twinplast Polymers PVT LTD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PP Corrugated Sheet Manufacturer in Kochi | Twinplast Polymers PVT LTD',
    description:
      'Direct manufacturer supply of waterproof PP fluted sheets, seafood layer pads, and Sunpack printing sheets in Kochi and Ernakulam.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: '100% waterproof and moisture-impervious polypropylene fluted sheets ideal for seafood processing, coastal cargo packaging, and industrial dunnage.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'Corona-treated polypropylene advertising board engineered for high-resolution screen printing, outdoor brand campaigns, and retail signs across Kerala.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Durable, waterproof fluted plastic sheets safeguarding premium tile, marble, and granite flooring during Kochi commercial and residential interiors.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Hygienic, washable, sealed-edge separator pads for multi-tier can, glass bottle, and beverage palletization in automated bottling lines.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Lightweight, rigid twin-wall polypropylene boards providing complete rot resistance and insulation in high-humidity coastal climates.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Reusable, moisture-proof plastic boxes designed for seafood cold chain storage, spice exports, and fresh agricultural produce transit.',
  },
];

const faqs = [
  {
    q: 'Do you deliver PP corrugated sheets directly to Kochi, Ernakulam, and Aluva?',
    a: 'Yes, Twinplast Polymers provides direct factory dispatches across Kerala including Kochi, Ernakulam, Aluva, Kalamassery, Kakkanad, Thrissur, and Kozhikode.',
  },
  {
    q: 'Are your PP sheets and layer pads certified for food and seafood contact?',
    a: 'Yes, our polypropylene sheets are 100% food-grade virgin polymer based, hygienic, non-toxic, chemical-resistant, and fully washable, making them ideal for seafood processing and beverage bottling plants.',
  },
  {
    q: 'Can Sunpack sheets withstand Kerala’s heavy monsoon and humid climate?',
    a: 'Polypropylene fluted sheets are 100% waterproof and do not rot, peel, or warp when exposed to rain, humidity, or harsh weather conditions, making them far superior to traditional paperboard or plywood.',
  },
  {
    q: 'What is the delivery time from Thoothukudi to Kochi?',
    a: 'Orders are dispatched directly via dedicated interstate road logistics, reaching Kochi within 24 to 36 hours.',
  },
];

export default function KochiLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/kochi')}#webpage`,
    name: 'PP Corrugated Sheet Manufacturer in Kochi | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations/kochi'),
    description:
      'Twinplast Polymers PVT LTD supplies waterproof PP corrugated sheets, layer pads, and Sunpack boards across Kochi and Kerala.',
    isPartOf: {
      '@id': `${getSiteUrl('/')}#website`,
    },
    about: {
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
        name: 'Locations',
        item: getSiteUrl('/locations'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Kochi',
        item: getSiteUrl('/locations/kochi'),
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="flex-1 bg-white">
      <JsonLd data={[pageSchema, breadcrumbSchema, faqSchema]} />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/locations" className="text-slate-400 hover:text-white transition-colors">
              Locations
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Kochi</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Factory className="w-3.5 h-3.5" />
              <span>Direct Extrusion Manufacturer Supply to Kochi & Kerala</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Corrugated Sheet Manufacturer in Kochi
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers PVT LTD manufactures premium, 100% waterproof polypropylene corrugated sheets, beverage layer pads, Sunpack printing boards, and floor protection rolls across Kochi, Ernakulam, and all districts of Kerala. Direct factory pricing with complete resistance to coastal humidity and moisture.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request Kochi Quote
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-700"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Advantages */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Kerala Industries Choose Twinplast
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Zero water absorption, high hygienic standards, and reliable logistics across the Malabar and Travancore corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Interstate Freight to Kochi & Ernakulam</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct road transport from Thoothukudi via Tirunelveli-Kollam and Madurai corridors ensuring timely delivery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">100% Moisture & Cold-Chain Resistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Will not absorb moisture, harbor bacteria, or degrade in refrigerated seafood storage and damp coastal warehouses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Weatherproof Advertising & Signboards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Corona-treated Sunpack sheets designed to endure Kerala’s intense monsoons for outdoor advertising campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufactured Products Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Products Available for Kochi & Kerala Dispatch
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Custom GSM options from 200 to 1500 GSM and thicknesses from 2 mm to 10 mm.
              </p>
            </div>
            <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <span>View Full Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.slug} className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between bg-white group">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Layers className="w-4 h-4" />
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                      {prod.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prod.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/contact?product=${encodeURIComponent(prod.title)}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions — Kochi Supply
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Information on product specifications, weatherproofing, and direct ordering in Kerala.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Contact CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Order Waterproof PP Corrugated Sheets for Kochi & Kerala
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Contact our Kerala customer support desk for direct factory quotes, technical samples, and logistics scheduling.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Kochi Sales Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
