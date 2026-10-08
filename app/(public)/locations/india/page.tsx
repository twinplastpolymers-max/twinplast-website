import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Factory, Truck, Layers, Mail, CheckCircle2, HelpCircle } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Corrugated Sheet Manufacturer in India | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD is a direct polypropylene (PP) extrusion manufacturer in India producing PP Corrugated Sheets, Sunpack Boards, Hollow Sheets, Layer Pads, and Floor Protection Sheets (200–1500 GSM, 2–10 mm).',
  alternates: {
    canonical: getSiteUrl('/locations/india'),
  },
  openGraph: {
    title: 'PP Corrugated Sheet Manufacturer in India | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD is a direct polypropylene (PP) extrusion manufacturer in India producing PP Corrugated Sheets, Sunpack Boards, Hollow Sheets, Layer Pads, and Floor Protection Sheets (200–1500 GSM, 2–10 mm).',
    url: getSiteUrl('/locations/india'),
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
    title: 'PP Corrugated Sheet Manufacturer in India | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD is a direct polypropylene (PP) extrusion manufacturer in India producing PP Corrugated Sheets, Sunpack Boards, Hollow Sheets, Layer Pads, and Floor Protection Sheets.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: 'Lightweight, shock-absorbing fluted polypropylene sheet engineered for returnable industrial packaging and cushioning partitions.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'Corona-treated advertising and signage board offering high dyne level surface tension for vibrant UV flatbed and screen printing.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Dual-wall extruded polypropylene structured sheet with superior rigidity, thermal insulation, and waterproof durability.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Heavy-duty impact protection board defending tiles, Italian marble, and wooden flooring against heavy site traffic during construction.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Sealed-edge hygienic separator sheet designed for automated can, glass bottle, and beverage palletizing in industrial bottling plants.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Collapsible, reusable Returnable Transit Packaging (RTP) boxes engineered for automotive parts, retail, and closed-loop logistics.',
  },
];

const faqs = [
  {
    q: 'What is the manufacturing capacity and sheet specification range at Twinplast Polymers?',
    a: 'Twinplast Polymers manufactures PP fluted and corrugated sheets with thickness ranging from 2 mm to 10 mm and weight densities from 200 GSM to 1500 GSM, with standard and custom dimensions up to 2000 mm in width.',
  },
  {
    q: 'Do you provide corona treatment for printing on Sunpack sheets?',
    a: 'Yes, our Sunpack sheets undergo inline electronic corona treatment ensuring a surface tension of 38 to 44 dynes/cm, ensuring excellent ink adhesion for screen printing, digital printing, and vinyl graphic lamination.',
  },
  {
    q: 'Can PP corrugated sheets replace traditional paper corrugated boxes across India?',
    a: 'Yes. PP corrugated sheets are 100% waterproof, chemical-resistant, oil-resistant, tear-proof, and reusable for more than 50+ logistics cycles, significantly reducing total packaging cost per trip compared to paper cardboard.',
  },
  {
    q: 'What is the standard delivery timeline for bulk orders across India?',
    a: 'Direct factory dispatches operate with dedicated freight partners connecting South India and national industrial transport corridors, delivering standard orders within 3 to 7 business days depending on delivery location and customization requirements.',
  },
];

export default function IndiaLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/india')}#webpage`,
    name: 'PP Corrugated Sheet Manufacturer in India | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations/india'),
    description:
      'Twinplast Polymers PVT LTD is an advanced polypropylene sheet manufacturer in India supplying PP corrugated sheets, Sunpack boards, and layer pads across industrial supply chains.',
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
        name: 'India',
        item: getSiteUrl('/locations/india'),
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
            <span className="text-white font-bold">India</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Factory className="w-3.5 h-3.5" />
              <span>Direct Polymer Extrusion Manufacturer • ISO 9001:2015</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Corrugated Sheet Manufacturer in India
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers PVT LTD is an advanced polypropylene sheet extrusion manufacturer in India. Operating high-precision extrusion machinery in Thoothukudi, Tamil Nadu, we supply high-grade PP Corrugated Sheets, Sunpack Advertising Boards, PP Hollow Sheets, Layer Pads, and Floor Protection sheets to OEM manufacturers, tier-1 suppliers, export packaging houses, and commercial printers nationwide.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request National Quotation
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-700"
              >
                Explore PP Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Matrix */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Manufacturing & Technical Parameters
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineered using virgin and impact-modified polypropylene polymers for demanding industrial environments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">Thickness Range</span>
              <p className="text-xl font-extrabold text-slate-900">2.0 mm to 10.0 mm</p>
              <p className="text-xs text-slate-500 leading-relaxed">Precision calibrated wall thickness and rib spacing for high flexural rigidity.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">GSM Density</span>
              <p className="text-xl font-extrabold text-slate-900">200 GSM to 1500 GSM</p>
              <p className="text-xs text-slate-500 leading-relaxed">Custom density formulation balancing lightweight transit and heavy load-bearing strength.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">Color Masterbatches</span>
              <p className="text-xl font-extrabold text-slate-900">Full Spectrum</p>
              <p className="text-xs text-slate-500 leading-relaxed">Blue, White, Yellow, Green, Black, Red, Grey, and custom Pantone matching on demand.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">Surface Treatment</span>
              <p className="text-xl font-extrabold text-slate-900">38–44 Dynes Corona</p>
              <p className="text-xs text-slate-500 leading-relaxed">UV stabilization, ESD anti-static treatment, and corona discharge treatment for printing.</p>
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
                Polypropylene Sheet Products Manufactured
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Custom cut sheets, sealed edges, roll forms, and fabricated containers.
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

      {/* Why Choose Twinplast Nationally */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Why Indian Industries Partner with Twinplast
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Direct factory pricing without intermediary markups, backed by rigorous quality assurance and dependable nationwide logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-white text-base">Direct Factory Gate Rates</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Save significantly on bulk recurring packaging volume by sourcing directly from our high-capacity extrusion manufacturing facility.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-white text-base">Consistent GSM & Thickness</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated extrusion thickness gauges ensure uniform GSM distribution, preventing soft spots and premature container collapse.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-white text-base">100% Eco-Friendly & Recyclable</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero harmful plasticizers or heavy metals. Polypropylene is 100% reusable and easily recycled into sustainable circular economy loops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Common questions about PP corrugated sheet manufacturing, custom extrusion, and national ordering.
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

      {/* Inquiry CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Request Bulk PP Sheet Quotes Across India
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Connect with our technical sales team for sample swatch kits, custom GSM thickness formulations, and volume dispatch schedules.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Sales Team</span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
