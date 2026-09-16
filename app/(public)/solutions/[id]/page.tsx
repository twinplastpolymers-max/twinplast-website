import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageContainer } from '@/components/shared/ImageContainer';
import { Industry } from '@/types';
import { getSiteUrl } from '@/lib/site';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/shared/CtaBanner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const canonicalUrl = getSiteUrl(`/solutions/${id}`);

  try {
    const supabase = await createClient();
    const { data: industry } = await supabase
      .from('industries')
      .select('title, description')
      .or(`id.eq.${id},title.ilike.%${decodeURIComponent(id).replace(/-/g, '%')}%`)
      .eq('active', true)
      .limit(1)
      .maybeSingle() as unknown as { data: Industry | null };

    if (!industry) {
      return { title: 'Solution Not Found | Twinplast Polymers' };
    }

    const title = `${industry.title} Solution | Twinplast Polymers`;
    const description = industry.description;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Industry Solution Detail | Twinplast Polymers',
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { id } = await params;
  let industry: Industry | null = null;
  let otherIndustries: Industry[] = [];

  try {
    const supabase = await createClient();
    
    // Fetch target industry by ID or title match
    const { data } = await supabase
      .from('industries')
      .select('*')
      .or(`id.eq.${id},title.ilike.%${decodeURIComponent(id).replace(/-/g, '%')}%`)
      .eq('active', true)
      .limit(1)
      .maybeSingle();

    if (data) {
      industry = data as unknown as Industry;
    }

    // Fetch other active industries for recommendations
    const { data: others } = await supabase
      .from('industries')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (others) {
      otherIndustries = (others as unknown as Industry[]).filter((item) => item.id !== industry?.id);
    }
  } catch {
    industry = null;
  }

  if (!industry) {
    notFound();
  }

  const solutionSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${getSiteUrl(`/solutions/${industry.id}`)}#service`,
    name: industry.title,
    description: industry.description,
    provider: {
      '@type': 'Organization',
      '@id': `${getSiteUrl('/')}#organization`,
      name: 'Twinplast Polymers Private Limited',
    },
    url: getSiteUrl(`/solutions/${industry.id}`),
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
        name: 'Solutions',
        item: getSiteUrl('/solutions'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: industry.title,
        item: getSiteUrl(`/solutions/${industry.id}`),
      },
    ],
  };

  return (
    <div className="flex-1 bg-slate-50">
      <JsonLd data={[solutionSchema, breadcrumbSchema]} />

      {/* Main Solution Content */}
      <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#1a1464] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/solutions" className="hover:text-[#1a1464] transition-colors">Solutions</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{industry.title}</span>
          </nav>

          {/* Solution Detail Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              
              {/* Image Section - Left 5 cols */}
              <div className="lg:col-span-5 relative bg-slate-100 min-h-[280px] sm:min-h-[380px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-slate-200/80">
                <ImageContainer
                  src={industry.image_cloudinary_public_id || industry.image_url}
                  alt={industry.title}
                  aspectRatio="square"
                  fit="cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Section - Right 7 cols */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1a1464] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Industry Application & Solution</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                    {industry.title}
                  </h1>

                  <div className="prose prose-slate max-w-none mb-6">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                      {industry.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Customized Extrusion & Sizing</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Heavy Duty Industrial Grade</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Weather & Impact Resistance</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Eco-Friendly & 100% Recyclable</span>
                    </div>
                  </div>
                </div>

                {/* Enquiry Action Button */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/contact?product=${encodeURIComponent(industry.title)}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-[#1a1464] hover:bg-[#13104f] text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1464]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Enquire Now for {industry.title}</span>
                  </Link>

                  <Link
                    href="/solutions"
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All Solutions</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Other Solutions Navigation Grid */}
          {otherIndustries.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Explore Other Solutions
                </h2>
                <Link href="/solutions" className="text-xs font-bold text-[#1a1464] hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherIndustries.slice(0, 3).map((other) => (
                  <div key={other.id} className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                    <div className="h-44 relative bg-slate-100 overflow-hidden">
                      <ImageContainer
                        src={other.image_cloudinary_public_id || other.image_url}
                        alt={other.title}
                        aspectRatio="wide"
                        fit="cover"
                        unstyled
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm mb-1.5 line-clamp-1">
                          {other.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {other.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <Link
                          href={`/solutions/${other.id}`}
                          className="inline-flex items-center justify-between text-[#1a1464] hover:text-blue-700 text-xs font-bold uppercase tracking-wider w-full"
                        >
                          <span>View Solution</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom CTA Banner */}
      <CtaBanner />
    </div>
  );
}
