import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, MapPin, Factory, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'PP Sheet Supply Locations in South India | Twinplast Polymers PVT LTD',
  description:
    'Twinplast Polymers PVT LTD manufactures and supplies high-grade PP Corrugated, Sunpack, Hollow and Layer Pad sheets across Tamil Nadu, Kerala, Karnataka and South India.',
  alternates: {
    canonical: getSiteUrl('/locations'),
  },
  openGraph: {
    title: 'PP Sheet Supply Locations in South India | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD manufactures and supplies high-grade PP Corrugated, Sunpack, Hollow and Layer Pad sheets across Tamil Nadu, Kerala, Karnataka and South India.',
    url: getSiteUrl('/locations'),
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
    title: 'PP Sheet Supply Locations in South India | Twinplast Polymers PVT LTD',
    description:
      'Twinplast Polymers PVT LTD manufactures and supplies high-grade PP Corrugated, Sunpack, Hollow and Layer Pad sheets across Tamil Nadu, Kerala, Karnataka and South India.',
    images: [getSiteUrl('/logo.png')],
  },
};

const locations = [
  {
    name: 'Tamil Nadu',
    href: '/locations/tamil-nadu',
    tag: 'Primary Manufacturing Facility',
    headline: 'Direct Extrusion Plant & Statewide Distribution',
    description:
      'Our primary manufacturing plant in Thoothukudi (Tuticorin) operates high-speed extrusion lines delivering PP corrugated, Sunpack, and hollow sheets across Chennai, Coimbatore, Madurai, Salem, Tiruppur, and all districts of Tamil Nadu.',
    highlights: ['Thoothukudi Extrusion Plant', 'Statewide Direct Freight', 'Custom GSM (200–1500) & Sizing'],
    ctaText: 'PP Sheet Manufacturer in Tamil Nadu',
  },
  {
    name: 'Kerala',
    href: '/locations/kerala',
    tag: 'Interstate Supply Hub',
    headline: 'Moisture-Proof Polymer Packaging for Coastal Industries',
    description:
      'Fast, reliable supply of 100% waterproof PP fluted sheets, layer pads, and Sunpack advertising boards to Kochi, Ernakulam, Thiruvananthapuram, Kozhikode, Thrissur, and Palakkad.',
    highlights: ['Swift Interstate Transit (NH 744 / NH 544)', '100% Water & Weatherproof', 'Beverage & Export Packaging'],
    ctaText: 'PP Sheet Supplier in Kerala',
  },
  {
    name: 'Karnataka',
    href: '/locations/karnataka',
    tag: 'Industrial & Automotive Logistics',
    headline: 'High-Strength Fluted Sheets for Manufacturing Corridors',
    description:
      'Supplying automotive tier-1 vendors, electronics packaging hubs, and commercial real estate developers in Bengaluru, Mysuru, Hubballi-Dharwad, Belagavi, and Mangaluru via NH 44 corridor.',
    highlights: ['Bengaluru & Peenya Freight Corridor', 'Returnable Transit Packaging (RTP)', 'Anti-Static & Heavy-Duty Options'],
    ctaText: 'PP Sheet Supplier in Karnataka',
  },
];

export default function LocationsOverviewPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${getSiteUrl('/locations')}#collection`,
    name: 'PP Sheet Supply Locations in South India | Twinplast Polymers PVT LTD',
    url: getSiteUrl('/locations'),
    description:
      'Twinplast Polymers PVT LTD manufactures and supplies high-grade PP Corrugated, Sunpack, Hollow and Layer Pad sheets across Tamil Nadu, Kerala, Karnataka and South India.',
    publisher: {
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
    ],
  };

  return (
    <div className="flex-1 bg-white">
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Locations</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>South India Supply & Logistics Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              PP Sheet Supply Locations
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Twinplast Polymers PVT LTD operates an advanced extrusion plant in Thoothukudi, Tamil Nadu, supplying engineered polypropylene fluted sheets, Sunpack boards, and packaging products across South India.
            </p>
          </div>
        </div>
      </section>

      {/* Locations Cards Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <div
                key={loc.name}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {loc.tag}
                    </span>
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      <Link href={loc.href}>{loc.name}</Link>
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{loc.headline}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{loc.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Key Highlights
                    </span>
                    {loc.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={loc.href}
                    className="inline-flex w-full items-center justify-between px-4 py-3 bg-[#1a1464] hover:bg-[#13104f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs group/btn"
                  >
                    <span>{loc.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Major Industrial & Commercial Supply Hubs */}
          <div className="mt-14">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Major Industrial & Commercial Supply Hubs
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Explore dedicated regional supply specifications, logistics corridors, and industrial dunnage solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/locations/india"
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Pan-India Supply</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    All India Manufacturer
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    National supply of PP corrugated sheets, Sunpack boards, and export packaging across India.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                  <span>View National Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/locations/chennai"
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Automotive & Electronics</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Chennai & Sriperumbudur
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Fluted dunnage sheets and returnable packaging for Sriperumbudur, Oragadam, and Ambattur.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                  <span>View Chennai Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/locations/coimbatore"
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Engineering & Pumps</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Coimbatore & Tiruppur
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Heavy-duty PP sheets for pump castings, textile machinery, and Tiruppur apparel packaging.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                  <span>View Coimbatore Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/locations/bengaluru"
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Tech & Aerospace</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Bengaluru & Peenya
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    ESD anti-static PP sheets, hardware boxes, and luxury floor protection rolls in Karnataka.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                  <span>View Bengaluru Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/locations/kochi"
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Coastal & Packaging</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Kochi & Ernakulam
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    100% waterproof PP sheets, beverage layer pads, and Sunpack outdoor advertising boards.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                  <span>View Kochi Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/locations/thoothukudi"
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Factory Gate Supply</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Thoothukudi & Madurai
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Direct factory gate pickup, VOC port container packaging, and Southern Tamil Nadu distribution.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                  <span>View Factory Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Product Reference Section */}
          <div className="mt-14 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Direct Factory Orders Across All Regions</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Custom GSM specifications, sheet dimensions, corona treatment, and volume dispatches available for all locations.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
              >
                Request Regional Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
