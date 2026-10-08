import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Factory, Truck, Layers, Mail, HelpCircle } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Corrugated Sheet Manufacturer in Thoothukudi & Madurai | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD operates high-capacity extrusion lines in Thoothukudi, manufacturing PP Corrugated Sheets, Sunpack Boards, Layer Pads, and Floor Protection Sheets for port export, agro-processing, and manufacturing across Thoothukudi, Madurai, and Tirunelveli.',
  alternates: {
    canonical: getSiteUrl('/locations/thoothukudi'),
  },
  openGraph: {
    title: 'PP Corrugated Sheet Manufacturer in Thoothukudi & Madurai | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD operates high-capacity extrusion lines in Thoothukudi, manufacturing PP Corrugated Sheets, Sunpack Boards, Layer Pads, and Floor Protection Sheets for port export, agro-processing, and manufacturing across Thoothukudi, Madurai, and Tirunelveli.',
    url: getSiteUrl('/locations/thoothukudi'),
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
    title: 'PP Corrugated Sheet Manufacturer in Thoothukudi & Madurai | Twinplast Polymers PVT LTD',
    description:
      'Direct factory gate supply of PP fluted sheets, export layer pads, and Sunpack printing sheets in Thoothukudi, Madurai, and Tirunelveli.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: 'Extruded polypropylene fluted sheets manufactured right at our Thoothukudi facility for port packaging, chemical storage, and industrial dividers.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'High-dyne corona-treated advertising sheets for vibrant screen and UV printing across Madurai, Tirunelveli, and Southern Tamil Nadu.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Heavy-duty fluted polypropylene rolls and sheets providing scratch-proof flooring defense for residential and commercial construction.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Food-grade, sealed-edge hygienic layer pads for maritime export containers, beverage can palletization, and agro-product stacking.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Lightweight, twin-wall structured polypropylene sheets resistant to salt air, chemical fumes, and high humidity.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Custom returnable transit packaging (RTP) boxes engineered for export cargo, agro-produce, and engineering components.',
  },
];

const faqs = [
  {
    q: 'Where is the Twinplast Polymers manufacturing plant located?',
    a: 'Our modern extrusion and converting facility is situated in Thoothukudi (Tuticorin), Tamil Nadu, offering direct access to the V.O. Chidambaranar Port and southern national highway networks.',
  },
  {
    q: 'Can customers arrange direct factory-gate pickup in Thoothukudi?',
    a: 'Yes, industrial clients and transport contractors can collect custom orders directly from our factory gate in Thoothukudi with prior dispatch scheduling.',
  },
  {
    q: 'Do you deliver to Madurai, Tirunelveli, and Virudhunagar?',
    a: 'Yes, we provide same-day or next-day dedicated freight dispatches across Madurai, Tirunelveli, Virudhunagar, Sivakasi, Nagercoil, and Tenkasi.',
  },
  {
    q: 'Can you supply export-grade packaging sheets for shipping containers via VOC Port?',
    a: 'Yes, we manufacture heavy-gauge PP layer pads, pallet liners, and container wall protectors engineered specifically for international ocean freight.',
  },
];

export default function ThoothukudiLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/thoothukudi')}#webpage`,
    name: 'PP Corrugated Sheet Manufacturer in Thoothukudi & Madurai | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations/thoothukudi'),
    description:
      'Twinplast Polymers PVT LTD manufactures industrial PP corrugated sheets, Sunpack boards, and export layer pads from our factory in Thoothukudi, Tamil Nadu.',
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
        name: 'Thoothukudi',
        item: getSiteUrl('/locations/thoothukudi'),
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
            <span className="text-white font-bold">Thoothukudi</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Factory className="w-3.5 h-3.5" />
              <span>Direct Extrusion Facility in Thoothukudi, Tamil Nadu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Corrugated Sheet Manufacturer in Thoothukudi & Madurai
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers PVT LTD operates high-capacity polypropylene extrusion lines in Thoothukudi, Tamil Nadu. We supply factory-direct PP corrugated fluted sheets, export-ready layer pads, Sunpack advertising boards, and floor protection rolls across Thoothukudi, Madurai, Tirunelveli, and southern industrial corridors.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request Factory Quote
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
              Factory-Direct Advantages at Thoothukudi
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Zero intermediary markups, immediate factory gate access, and strategic proximity to VOC Port.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Factory Gate Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Source directly from the extrusion line with maximum cost efficiency on commercial and wholesale sheet orders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Rapid Southern Corridor Logistics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Same-day and next-day deliveries across Madurai, Tirunelveli, Sivakasi, Virudhunagar, and Kanyakumari.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Port & Maritime Export Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Durable, salt-air resistant layer pads and pallet dividers designed for containerized international sea freight.
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
                Products Manufactured at Our Thoothukudi Plant
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
              Frequently Asked Questions — Factory Direct Supply
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Information on factory pickups, production capacities, and localized distribution.
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
            Visit or Order Directly from Our Thoothukudi Extrusion Plant
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Contact our factory sales office for direct pricing, custom sheet runs, and local freight coordination across Southern Tamil Nadu.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Factory Sales Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
