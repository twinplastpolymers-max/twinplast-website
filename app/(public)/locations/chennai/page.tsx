import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Factory, Truck, Layers, Mail, CheckCircle2, HelpCircle } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Corrugated Sheet Manufacturer in Chennai | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD supplies premium PP Corrugated Sheets, Sunpack Boards, Hollow Sheets, Layer Pads, and Floor Protection Sheets to automotive, electronics, and export industries in Chennai, Sriperumbudur, and Oragadam.',
  alternates: {
    canonical: getSiteUrl('/locations/chennai'),
  },
  openGraph: {
    title: 'PP Corrugated Sheet Manufacturer in Chennai | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD supplies premium PP Corrugated Sheets, Sunpack Boards, Hollow Sheets, Layer Pads, and Floor Protection Sheets to automotive, electronics, and export industries in Chennai, Sriperumbudur, and Oragadam.',
    url: getSiteUrl('/locations/chennai'),
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
    title: 'PP Corrugated Sheet Manufacturer in Chennai | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD supplies premium PP Corrugated Sheets, Sunpack Boards, Hollow Sheets, Layer Pads, and Floor Protection Sheets to automotive and industrial hubs across Chennai.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: 'Impact-absorbing fluted polypropylene sheet designed for returnable dunnage, protective packaging, and automotive part dividers.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'Corona-treated polypropylene advertising board optimized for high-resolution screen printing, election signage, and POS retail displays.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Tough, waterproof protective sheet safeguarding tile, granite, and marble flooring during Chennai interior finishing and renovation.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Hygienic, sealed-edge separator sheet for automated pallet stacking in beverage, food processing, and pharmaceutical plants.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Twin-wall structured polypropylene sheet offering lightweight rigidity, thermal insulation, and total moisture resistance.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Custom reusable returnable transit packaging (RTP) boxes tailored for automotive assembly lines and electronic components in Chennai.',
  },
];

const faqs = [
  {
    q: 'Do you deliver PP corrugated sheets directly to Sriperumbudur, Oragadam, and Ambattur in Chennai?',
    a: 'Yes, Twinplast Polymers provides regular direct freight dispatches from our Thoothukudi extrusion facility to major industrial corridors in Chennai including Sriperumbudur, Oragadam, Maraimalai Nagar, Ambattur, Guindy, and Gummidipoondi.',
  },
  {
    q: 'Can you customize sheet thickness and GSM for Chennai automotive suppliers?',
    a: 'Yes. We manufacture PP sheets from 2 mm to 10 mm in thickness and 200 GSM to 1500 GSM, with customized options for anti-static (ESD) protection, flame retardancy, and UV stabilization for automotive part handling.',
  },
  {
    q: 'What is the minimum order quantity (MOQ) for custom Sunpack sheets in Chennai?',
    a: 'We accommodate both prototype trial batches and commercial full-truckload (FTL) orders. Contact our sales team for exact GSM and size MOQ thresholds.',
  },
  {
    q: 'How fast can PP sheets be delivered to Chennai?',
    a: 'Standard production orders are dispatched promptly with transit times typically between 24 to 48 hours to Chennai and surrounding industrial zones.',
  },
];

export default function ChennaiLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/chennai')}#webpage`,
    name: 'PP Corrugated Sheet Manufacturer in Chennai | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations/chennai'),
    description:
      'Twinplast Polymers PVT LTD supplies industrial-grade PP corrugated sheets, Sunpack boards, and layer pads across Chennai manufacturing clusters.',
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
        name: 'Chennai',
        item: getSiteUrl('/locations/chennai'),
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
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/locations" className="text-slate-400 hover:text-white transition-colors">
              Locations
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Chennai</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Factory className="w-3.5 h-3.5" />
              <span>Direct Extrusion Manufacturer Supply to Chennai</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Corrugated Sheet Manufacturer in Chennai
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers PVT LTD supplies industrial-grade polypropylene fluted sheets, Sunpack boards, and custom corrugated plastic packaging across Chennai. Serving tier-1 automotive vendors in Sriperumbudur and Oragadam, electronics manufacturers, and commercial signage houses, we deliver custom GSM (200–1500) and thicknesses (2–10 mm) at direct factory pricing.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request Chennai Quote
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

      {/* Chennai Industrial Advantages */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Chennai Industries Choose Twinplast
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              High-capacity extrusion lines, customized GSM formulations, and rapid delivery along the South India freight corridor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Logistics to Sriperumbudur & Oragadam</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regular direct truck freight from our Thoothukudi extrusion plant to Chennai industrial zones ensuring steady assembly-line supply.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Automotive Returnable Transit Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tough polypropylene fluted sheets engineered for reusable bins, dunnage separators, and export packaging boxes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Corona Treated for Vibrant Signage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sunpack advertising boards with 38–44 dyne/cm surface tension optimized for Chennai commercial screen printing and advertising campaigns.
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
                Products Available for Chennai Delivery
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Customizable in standard and custom sheet dimensions, colors, and GSM specifications.
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
              Frequently Asked Questions — Chennai Supply
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Information on ordering, delivery corridors, and custom parameters for Chennai clients.
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
            Order PP Sheets Direct from the Manufacturer for Chennai
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Contact our sales desk for bulk pricing, customized thickness sampling, and dispatch schedules to Chennai.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Chennai Sales Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
