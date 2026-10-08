import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Factory, Truck, Layers, Mail, HelpCircle } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Corrugated Sheet Manufacturer in Coimbatore | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD manufactures heavy-duty PP Corrugated Sheets, Sunpack Boards, Layer Pads, and Floor Protection Sheets for pump, engineering, textile machinery, and automotive industries in Coimbatore, Tiruppur, and Erode.',
  alternates: {
    canonical: getSiteUrl('/locations/coimbatore'),
  },
  openGraph: {
    title: 'PP Corrugated Sheet Manufacturer in Coimbatore | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD manufactures heavy-duty PP Corrugated Sheets, Sunpack Boards, Layer Pads, and Floor Protection Sheets for pump, engineering, textile machinery, and automotive industries in Coimbatore, Tiruppur, and Erode.',
    url: getSiteUrl('/locations/coimbatore'),
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
    title: 'PP Corrugated Sheet Manufacturer in Coimbatore | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD supplies industrial PP fluted sheets and protective packaging to Coimbatore engineering and manufacturing clusters.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: 'Heavy-duty fluted polypropylene sheets built for engineering spares, pump castings, and machined component separation.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'Corona-treated polypropylene advertising boards for retail branding, outdoor display boards, and promotional signboards across Coimbatore.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Durable, waterproof fluted plastic sheets for protecting vitrified tile, Italian marble, and wooden flooring during interior work.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Sealed-edge polypropylene dividers for multi-tier pallet packing in food processing, beverage bottling, and textile yarn cones.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Rigid twin-wall polypropylene boards delivering impact resistance and chemical inertness for industrial dunnage.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Custom returnable transit packaging (RTP) boxes engineered for Coimbatore pump, motor, and auto-ancillary supply chains.',
  },
];

const faqs = [
  {
    q: 'Do you supply PP corrugated sheets to Kurichi, SIDCO, and Ganapathy industrial areas in Coimbatore?',
    a: 'Yes, Twinplast Polymers delivers direct factory consignments to all major industrial clusters in Coimbatore including Kurichi, Malumichampatti, SIDCO, Ganapathy, Peelamedu, as well as Tiruppur and Erode.',
  },
  {
    q: 'What GSM and thickness options are available for heavy engineering packaging?',
    a: 'We manufacture PP fluted sheets from 2 mm to 10 mm in thickness and 200 GSM to 1500 GSM. For heavy engineering and machined components, we recommend 5 mm to 8 mm sheets with high GSM for maximum puncture resistance.',
  },
  {
    q: 'Can we order customized sheet dimensions for textile and garment export packaging?',
    a: 'Yes, we provide custom length cutting and precision die-cutting according to your exact box or pallet dimensions to minimize material waste.',
  },
  {
    q: 'What is the standard delivery lead time to Coimbatore?',
    a: 'Dispatches from our state-of-the-art extrusion facility in Thoothukudi typically arrive in Coimbatore within 24 hours of dispatch.',
  },
];

export default function CoimbatoreLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/coimbatore')}#webpage`,
    name: 'PP Corrugated Sheet Manufacturer in Coimbatore | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations/coimbatore'),
    description:
      'Twinplast Polymers PVT LTD supplies industrial-grade PP corrugated sheets, Sunpack boards, and layer pads across Coimbatore manufacturing clusters.',
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
        name: 'Coimbatore',
        item: getSiteUrl('/locations/coimbatore'),
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
            <span className="text-white font-bold">Coimbatore</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Factory className="w-3.5 h-3.5" />
              <span>Direct Extrusion Manufacturer Supply to Coimbatore</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Corrugated Sheet Manufacturer in Coimbatore
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers PVT LTD delivers industrial-grade polypropylene fluted sheets, heavy-duty separator pads, Sunpack advertising boards, and floor protection rolls across Coimbatore, Tiruppur, and the Kongu region. Engineered for pump manufacturers, textile machinery builders, and foundries at direct factory rates.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request Coimbatore Quote
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
              Engineered for Coimbatore’s Industrial Demands
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              High tensile strength, chemical resistance, and direct factory pricing for the Manchester of South India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Highway Freight to Coimbatore & Tiruppur</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless next-day road dispatches from Thoothukudi directly to Coimbatore industrial belts and Tiruppur apparel hubs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Heavy Machinery & Pump Dunnage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-density fluted sheets capable of resisting heavy oil, grease, and mechanical vibration during pump and motor transit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Textile & Garment Export Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Waterproof, dust-free layer pads and custom PP boxes designed for fabric protection and export carton reinforcement.
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
                Products Available for Coimbatore Dispatch
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Customizable in standard sheet dimensions (8x4, 6x4 ft), rolls, and precision die-cut components.
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
              Frequently Asked Questions — Coimbatore Supply
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Information on engineering specifications, delivery timelines, and bulk factory orders.
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
            Get Direct Factory Pricing for Coimbatore & Western Tamil Nadu
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Connect with our technical team for custom GSM requirements, sample evaluation, and logistics quotes to Coimbatore.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Coimbatore Sales Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
