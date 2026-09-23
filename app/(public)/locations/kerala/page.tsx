import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, Layers, Mail } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Sheet Supplier in Kerala | Twinplast Polymers',
  description:
    'Twinplast Polymers supplies PP Corrugated, Hollow, Sunpack and Layer Pad sheets to packaging, textile and manufacturing businesses across Kerala from our Thoothukudi, Tamil Nadu facility.',
  alternates: {
    canonical: getSiteUrl('/locations/kerala'),
  },
  openGraph: {
    title: 'PP Sheet Supplier in Kerala | Twinplast Polymers',
    description:
      'Twinplast Polymers supplies PP Corrugated, Hollow, Sunpack and Layer Pad sheets to packaging, textile and manufacturing businesses across Kerala from our Thoothukudi, Tamil Nadu facility.',
    url: getSiteUrl('/locations/kerala'),
    type: 'website',
    images: [
      {
        url: getSiteUrl('/logo.png'),
        width: 512,
        height: 512,
        alt: 'Twinplast Polymers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PP Sheet Supplier in Kerala | Twinplast Polymers',
    description:
      'Twinplast Polymers supplies PP Corrugated, Hollow, Sunpack and Layer Pad sheets to packaging, textile and manufacturing businesses across Kerala from our Thoothukudi, Tamil Nadu facility.',
    images: [getSiteUrl('/logo.png')],
  },
};

const products = [
  {
    title: 'PP Corrugated Sheet',
    slug: 'pp-corrugated-sheet',
    desc: 'Lightweight fluted polypropylene sheet engineered for packaging, cushioning, and protective partitions.',
  },
  {
    title: 'Sunpack Sheet',
    slug: 'sunpack-sheet',
    desc: 'Corona-treated polypropylene advertising board optimized for high-resolution screen and digital printing.',
  },
  {
    title: 'PP Hollow Sheet',
    slug: 'pp-hollow-sheet',
    desc: 'Twin-wall structured polypropylene sheet providing high rigidity, insulation, and impact resistance.',
  },
  {
    title: 'Floor Protection Sheet',
    slug: 'floor-protection-sheet',
    desc: 'Durable, impact-absorbing sheet designed to protect tile, marble, and granite flooring during interior finishing.',
  },
  {
    title: 'PP Layer Pad',
    slug: 'pp-layer-pad',
    desc: 'Hygienic, waterproof separator sheet with sealed edges for beverage, can, and container stacking.',
  },
  {
    title: 'PP Corrugated Box',
    slug: 'pp-corrugated-box',
    desc: 'Custom collapsible and reusable transit packaging boxes designed for industrial logistics and material handling.',
  },
];

const solutions = [
  { title: 'Produce & Agricultural Packaging', href: '/solutions' },
  { title: 'Commercial Signage & Sunpack Boards', href: '/solutions' },
  { title: 'Building & Flooring Protection', href: '/solutions' },
  { title: 'Beverage & Glass Bottle Separators', href: '/solutions' },
];

export default function KeralaLocationPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getSiteUrl('/locations/kerala')}#webpage`,
    name: 'PP Sheet Supplier in Kerala | Twinplast Polymers',
    url: getSiteUrl('/locations/kerala'),
    description:
      'Twinplast Polymers supplies PP Corrugated, Hollow, Sunpack and Layer Pad sheets to packaging, textile and manufacturing businesses across Kerala from our Thoothukudi, Tamil Nadu facility.',
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
        item: getSiteUrl('/locations/kerala'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Kerala',
        item: getSiteUrl('/locations/kerala'),
      },
    ],
  };

  return (
    <div className="flex-1 bg-white">
      <JsonLd data={[pageSchema, breadcrumbSchema]} />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-300">Locations</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Kerala</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <Truck className="w-3.5 h-3.5" />
              <span>Direct Supply & Logistics Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PP Sheet Supply to Kerala
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
              Twinplast Polymers Private Limited supplies premium PP Corrugated, Sunpack, Hollow, Layer Pad, and Floor Protection sheets to businesses throughout Kerala. Manufactured at our Thoothukudi facility in Tamil Nadu, our sheets are dispatched with short transit times to Kochi, Ernakulam, Thiruvananthapuram, Kozhikode, Thrissur, Palakkad, and Kollam.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Request Kerala Quote
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

      {/* Supply Advantages Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Why Kerala Businesses Partner with Twinplast
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Direct manufacturer pricing, prompt South India logistics, and water-resistant polymer products ideal for coastal climates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Swift Inter-State Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strategic transport connectivity via NH 744 (Kollam-Thirumangalam) and NH 544 (Salem-Kochi) ensuring dependable delivery schedules across Kerala.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">100% Moisture & Weatherproof</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Polypropylene fluted sheets do not absorb moisture, rot, or degrade in humid tropical weather, making them the superior alternative to paper corrugated sheets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Custom GSM & Dimensions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sheets custom-extruded from 200 GSM to 1500 GSM and 2 mm to 10 mm thickness tailored to your exact application needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Products Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                PP Products Available for Kerala
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Engineered for packaging, structural protection, and commercial signage.
              </p>
            </div>
            <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <span>View Full Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.slug} className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between bg-white group">
                <div className="space-y-2">
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
                    className="text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Applications Across Kerala Industries
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Supplying agricultural exporters, beverage manufacturers, advertising printers, and construction contractors in Kerala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solutions.map((sol) => (
              <div key={sol.title} className="p-4 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">{sol.title}</span>
                <Link href={sol.href} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Contact CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Request Bulk PP Sheet Quotes for Kerala
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Contact our sales desk to discuss dispatch timelines, custom dimension specifications, and bulk volume rates for Kerala delivery.
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
