import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Factory, Truck, Layers, Mail, HelpCircle } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Corrugated Sheet Manufacturer in Bengaluru | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD supplies high-grade PP Corrugated Sheets, ESD Anti-Static Fluted Sheets, Sunpack Boards, Layer Pads, and Floor Protection Sheets to electronics, aerospace, and manufacturing hubs in Bengaluru, Peenya, and Bommasandra.',
  alternates: {
    canonical: getSiteUrl('/locations/bengaluru'),
  },
  openGraph: {
    title: 'PP Corrugated Sheet Manufacturer in Bengaluru | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD supplies high-grade PP Corrugated Sheets, ESD Anti-Static Fluted Sheets, Sunpack Boards, Layer Pads, and Floor Protection Sheets to electronics, aerospace, and manufacturing hubs in Bengaluru, Peenya, and Bommasandra.',
    url: getSiteUrl('/locations/bengaluru'),
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
    title: 'PP Corrugated Sheet Manufacturer in Bengaluru | Twinplast Polymers PVT LTD',
    description:
      'Direct manufacturer supply of PP fluted sheets, ESD conductive packaging, and floor protection rolls across Bengaluru and Karnataka.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: 'Versatile fluted polypropylene board engineered for industrial partitions, returnable dunnage, and precision hardware cushioning.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'Corona-treated polypropylene advertising sheet for high-definition screen printing, corporate signage, and retail POS displays in Bengaluru.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Heavy-duty impact protection sheet safeguarding tiles, marble, granite, and wooden floors in Bengaluru luxury residential and commercial fit-outs.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Smooth, washable, and edge-sealed divider boards designed for automated palletizing in beverage, chemical, and pharma manufacturing.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Twin-wall polypropylene structured sheet combining ultralight weight with structural rigidity and complete water resistance.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Custom ESD anti-static and standard returnable transit packaging (RTP) boxes tailored for Bengaluru electronics and hardware assembly lines.',
  },
];

const faqs = [
  {
    q: 'Do you deliver PP corrugated sheets directly to Peenya, Bommasandra, and Whitefield in Bengaluru?',
    a: 'Yes, Twinplast Polymers operates direct logistics dispatches to all major industrial clusters across Bengaluru including Peenya Industrial Estate, Bommasandra, Electronic City, Whitefield, Bidadi, and Hosur border corridors.',
  },
  {
    q: 'Do you offer anti-static (ESD) corrugated sheets for electronics packaging?',
    a: 'Yes, we manufacture specialized ESD conductive and anti-static PP corrugated sheets engineered to protect sensitive electronic components, PCB assemblies, and semiconductor devices from electrostatic discharge.',
  },
  {
    q: 'Can real estate builders and interior contractors order bulk Floor Protection Sheets in Bengaluru?',
    a: 'Yes, we provide bulk rolls and cut-to-size floor protection sheets (2 mm to 4 mm thickness) with rapid delivery directly to project job sites across Bengaluru.',
  },
  {
    q: 'What is the standard lead time for deliveries to Bengaluru?',
    a: 'Direct dispatches from our extrusion plant reach Bengaluru within 24 to 48 hours via dedicated freight corridors.',
  },
];

export default function BengaluruLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/bengaluru')}#webpage`,
    name: 'PP Corrugated Sheet Manufacturer in Bengaluru | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations/bengaluru'),
    description:
      'Twinplast Polymers PVT LTD supplies industrial-grade PP corrugated sheets, ESD anti-static packaging, Sunpack boards, and layer pads across Bengaluru manufacturing clusters.',
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
        name: 'Bengaluru',
        item: getSiteUrl('/locations/bengaluru'),
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
            <span className="text-white font-bold">Bengaluru</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Factory className="w-3.5 h-3.5" />
              <span>Direct Manufacturer Supply to Bengaluru & Karnataka</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Corrugated Sheet Manufacturer in Bengaluru
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers PVT LTD manufactures and supplies high-performance polypropylene corrugated sheets, ESD anti-static dunnage, Sunpack advertising boards, and floor protection sheets across Bengaluru. Serving tier-1 electronics, automotive, aerospace, and construction sectors at direct manufacturer rates.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request Bengaluru Quote
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
              Built for Bengaluru’s High-Tech & Industrial Ecosystem
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Specialized polymer grades, precision custom sizing, and direct factory dispatch to Silicon Valley of India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Logistics to Peenya & Bommasandra</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regular consolidated and full-truckload freight delivering directly to industrial hubs across Bengaluru and Hosur.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">ESD Anti-Static Electronics Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Surface resistivity controlled PP fluted sheets engineered for safe handling of PCB boards, electronic components, and sensors.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Architectural Floor Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tough, impact-resistant fluted polypropylene rolls preventing scratches and damage during luxury interior fit-outs.
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
                Products Available for Bengaluru Delivery
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Customizable in thickness from 2 mm to 10 mm and weights from 200 GSM to 1500 GSM.
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
              Frequently Asked Questions — Bengaluru Supply
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Information on ESD specifications, ordering, and delivery schedules to Karnataka.
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
            Direct Extrusion Manufacturer Supply for Bengaluru & Karnataka
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Contact our engineering sales team to discuss technical specifications, volume pricing, and swift dispatch to Bengaluru.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Bengaluru Sales Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
