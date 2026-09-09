'use client';

import { useState } from 'react';
import { Save, Home, Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { 
  HomepageSection, 
  HeroSectionContent, 
  AboutSectionContent, 
  VisionMissionSectionContent, 
  WhyChooseSectionContent, 
  QualityCommitmentSectionContent, 
  MarketsSectionContent, 
  FinalCtaSectionContent 
} from '@/types';
import { useToast } from '@/components/ui/Toast';

interface HomepageCMSManagerProps {
  initialSections: HomepageSection[];
}

export function HomepageCMSManager({ initialSections }: HomepageCMSManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'vision_mission' | 'why_choose' | 'quality_commitment' | 'markets' | 'final_cta'>('hero');
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to extract JSON content safely
  const getSectionContent = (key: string) => {
    const sec = sections.find((s) => s.section_key === key);
    return (sec?.content as Record<string, unknown>) || {};
  };

  // State maps per section (with fallback alias support to preserve all content variants)
  // 1. Hero
  const heroData = getSectionContent('hero');
  const [heroEyebrow, setHeroEyebrow] = useState<string>((heroData.eyebrow as string) || (heroData.badge_text as string) || 'PREMIUM POLYPROPYLENE MANUFACTURER');
  const [heroHeadline, setHeroHeadline] = useState<string>((heroData.headline as string) || 'Polypropylene Sheets & Industrial PP Solutions');
  const [heroSubheadline, setHeroSubheadline] = useState<string>((heroData.subheadline as string) || '');
  const [heroPrimaryCtaLabel, setHeroPrimaryCtaLabel] = useState<string>((heroData.primary_cta_label as string) || (heroData.primary_cta_text as string) || 'Request a Quote');
  const [heroPrimaryCtaUrl, setHeroPrimaryCtaUrl] = useState<string>((heroData.primary_cta_url as string) || '/contact');
  const [heroSecondaryCtaLabel, setHeroSecondaryCtaLabel] = useState<string>((heroData.secondary_cta_label as string) || (heroData.secondary_cta_text as string) || 'Explore Products');
  const [heroSecondaryCtaUrl, setHeroSecondaryCtaUrl] = useState<string>((heroData.secondary_cta_url as string) || '/products');
  const [heroLocation, setHeroLocation] = useState<string>((heroData.location as string) || 'Thoothukudi, Tamil Nadu, India');

  // 2. About
  const aboutData = getSectionContent('about');
  const [aboutEyebrow, setAboutEyebrow] = useState<string>((aboutData.eyebrow as string) || 'ABOUT TWINPLAST POLYMERS');
  const [aboutHeading, setAboutHeading] = useState<string>((aboutData.heading as string) || (aboutData.title as string) || 'Twinplast Polymers Private Limited');
  const [aboutSubheadline, setAboutSubheadline] = useState<string>((aboutData.subheadline as string) || (aboutData.subtitle as string) || 'Established in 2021 in Thoothukudi, Tamil Nadu, India.');
  const [aboutContent, setAboutContent] = useState<string>((aboutData.content as string) || '');
  const [aboutCtaLabel, setAboutCtaLabel] = useState<string>((aboutData.cta_label as string) || 'Know More About Us');
  const [aboutCtaUrl, setAboutCtaUrl] = useState<string>((aboutData.cta_url as string) || '/about');

  // 3. Vision Mission
  const vmData = getSectionContent('vision_mission');
  const visionObj = (vmData.vision as Record<string, string>) || {};
  const missionObj = (vmData.mission as Record<string, string>) || {};
  const [visionTitle, setVisionTitle] = useState<string>(visionObj.title || (vmData.vision_title as string) || 'Our Vision');
  const [visionContent, setVisionContent] = useState<string>(visionObj.content || (vmData.vision_text as string) || '');
  const [missionTitle, setMissionTitle] = useState<string>(missionObj.title || (vmData.mission_title as string) || 'Our Mission');
  const [missionContent, setMissionContent] = useState<string>(missionObj.content || (vmData.mission_text as string) || '');
  const [objectives, setObjectives] = useState<string[]>((vmData.objectives as string[]) || []);

  // 4. Why Choose
  const whyData = getSectionContent('why_choose');
  const [whyEyebrow, setWhyEyebrow] = useState<string>((whyData.eyebrow as string) || 'WHY CHOOSE TWINPLAST POLYMERS');
  const [whyHeading, setWhyHeading] = useState<string>((whyData.heading as string) || (whyData.title as string) || 'Why Choose Twinplast');
  const [pillars, setPillars] = useState<Array<{ title: string; description: string }>>(
    (whyData.pillars as Array<{ title: string; description: string }>) || 
    (whyData.reasons as Array<{ title: string; description: string }>) || 
    []
  );

  // 5. Quality Commitment
  const qualData = getSectionContent('quality_commitment');
  const [qualHeading, setQualHeading] = useState<string>((qualData.heading as string) || (qualData.title as string) || 'Quality Commitment');
  const [qualContent, setQualContent] = useState<string>((qualData.content as string) || '');
  const [qualParams, setQualParams] = useState<string[]>(
    (qualData.parameters as string[]) || (qualData.standards as string[]) || []
  );

  // 6. Markets
  const mktData = getSectionContent('markets');
  const [mktHeading, setMktHeading] = useState<string>((mktData.heading as string) || (mktData.title as string) || 'Markets We Serve');
  const [mktContent, setMktContent] = useState<string>((mktData.content as string) || (mktData.subtitle as string) || '');
  const [mktRegions, setMktRegions] = useState<string[]>((mktData.regions as string[]) || []);

  // 7. Final CTA
  const ctaData = getSectionContent('final_cta');
  const [ctaHeading, setCtaHeading] = useState<string>((ctaData.heading as string) || (ctaData.headline as string) || 'Looking for a Reliable PP Sheet Solution?');
  const [ctaSubheadline, setCtaSubheadline] = useState<string>((ctaData.subheadline as string) || '');
  const [ctaPrimaryLabel, setCtaPrimaryLabel] = useState<string>((ctaData.primary_cta_label as string) || (ctaData.button_text as string) || 'Request a Quote');
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState<string>((ctaData.primary_cta_url as string) || (ctaData.button_url as string) || '/contact');
  const [ctaSecondaryLabel, setCtaSecondaryLabel] = useState<string>((ctaData.secondary_cta_label as string) || 'Contact Us');
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState<string>((ctaData.secondary_cta_url as string) || '/contact');

  // Generic Save Handler for Active Tab
  const handleSaveSection = async (sectionKey: string, payloadContent: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .upsert(
          { section_key: sectionKey, content: payloadContent },
          { onConflict: 'section_key' }
        )
        .select()
        .single();

      if (error) throw error;

      setSections((prev) => {
        const idx = prev.findIndex((s) => s.section_key === sectionKey);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data as HomepageSection;
          return updated;
        }
        return [...prev, data as HomepageSection];
      });

      toast.success('Section Saved', `Homepage "${sectionKey}" section content updated.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save query failed.';
      toast.error('Save Failed', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const saveHero = () => {
    const payload: HeroSectionContent = {
      eyebrow: heroEyebrow,
      headline: heroHeadline,
      subheadline: heroSubheadline,
      primary_cta_label: heroPrimaryCtaLabel,
      primary_cta_url: heroPrimaryCtaUrl,
      secondary_cta_label: heroSecondaryCtaLabel,
      secondary_cta_url: heroSecondaryCtaUrl,
      location: heroLocation,
    };
    handleSaveSection('hero', payload as unknown as Record<string, unknown>);
  };

  const saveAbout = () => {
    const payload: AboutSectionContent = {
      eyebrow: aboutEyebrow,
      heading: aboutHeading,
      subheadline: aboutSubheadline,
      content: aboutContent,
      cta_label: aboutCtaLabel,
      cta_url: aboutCtaUrl,
    };
    handleSaveSection('about', payload as unknown as Record<string, unknown>);
  };

  const saveVisionMission = () => {
    const payload: VisionMissionSectionContent = {
      vision: { title: visionTitle, content: visionContent },
      mission: { title: missionTitle, content: missionContent },
      objectives,
    };
    handleSaveSection('vision_mission', payload as unknown as Record<string, unknown>);
  };

  const saveWhyChoose = () => {
    const payload: WhyChooseSectionContent = {
      eyebrow: whyEyebrow,
      heading: whyHeading,
      pillars,
    };
    handleSaveSection('why_choose', payload as unknown as Record<string, unknown>);
  };

  const saveQuality = () => {
    const payload: QualityCommitmentSectionContent = {
      heading: qualHeading,
      content: qualContent,
      parameters: qualParams,
    };
    handleSaveSection('quality_commitment', payload as unknown as Record<string, unknown>);
  };

  const saveMarkets = () => {
    const payload: MarketsSectionContent = {
      heading: mktHeading,
      content: mktContent,
      regions: mktRegions,
    };
    handleSaveSection('markets', payload as unknown as Record<string, unknown>);
  };

  const saveFinalCta = () => {
    const payload: FinalCtaSectionContent = {
      heading: ctaHeading,
      subheadline: ctaSubheadline,
      primary_cta_label: ctaPrimaryLabel,
      primary_cta_url: ctaPrimaryUrl,
      secondary_cta_label: ctaSecondaryLabel,
      secondary_cta_url: ctaSecondaryUrl,
    };
    handleSaveSection('final_cta', payload as unknown as Record<string, unknown>);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Homepage Content Manager (CMS)</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edit structured text content, headlines, CTAs, and lists rendered across the homepage.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { key: 'hero', label: 'Hero Section' },
          { key: 'about', label: 'About Company' },
          { key: 'vision_mission', label: 'Vision & Mission' },
          { key: 'why_choose', label: 'Why Choose' },
          { key: 'quality_commitment', label: 'Quality' },
          { key: 'markets', label: 'Markets' },
          { key: 'final_cta', label: 'Final CTA' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-950 border-t-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        
        {/* 1. HERO SECTION TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Hero Section Settings
            </h2>

            <div>
              <label htmlFor="hero-eyebrow" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Eyebrow Tag</label>
              <input
                id="hero-eyebrow"
                type="text"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="hero-headline" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Main Headline *</label>
              <input
                id="hero-headline"
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="hero-subheadline" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Supporting Subheadline</label>
              <textarea
                id="hero-subheadline"
                rows={3}
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hero-p-label" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Primary CTA Label</label>
                <input
                  id="hero-p-label"
                  type="text"
                  value={heroPrimaryCtaLabel}
                  onChange={(e) => setHeroPrimaryCtaLabel(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="hero-p-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Primary CTA Destination URL</label>
                <input
                  id="hero-p-url"
                  type="text"
                  value={heroPrimaryCtaUrl}
                  onChange={(e) => setHeroPrimaryCtaUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                />
              </div>

              <div>
                <label htmlFor="hero-s-label" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Secondary CTA Label</label>
                <input
                  id="hero-s-label"
                  type="text"
                  value={heroSecondaryCtaLabel}
                  onChange={(e) => setHeroSecondaryCtaLabel(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="hero-s-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Secondary CTA Destination URL</label>
                <input
                  id="hero-s-url"
                  type="text"
                  value={heroSecondaryCtaUrl}
                  onChange={(e) => setHeroSecondaryCtaUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hero-loc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Location Display Text</label>
              <input
                id="hero-loc"
                type="text"
                value={heroLocation}
                onChange={(e) => setHeroLocation(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveHero}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Hero Section</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ABOUT COMPANY TAB */}
        {activeTab === 'about' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              About Section Settings
            </h2>

            <div>
              <label htmlFor="about-eyebrow" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Eyebrow Tag</label>
              <input
                id="about-eyebrow"
                type="text"
                value={aboutEyebrow}
                onChange={(e) => setAboutEyebrow(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="about-heading" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Heading</label>
              <input
                id="about-heading"
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="about-subheadline" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Subheadline / Plant Location Note</label>
              <input
                id="about-subheadline"
                type="text"
                value={aboutSubheadline}
                onChange={(e) => setAboutSubheadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="about-content" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Company Introduction Content</label>
              <textarea
                id="about-content"
                rows={5}
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="about-cta-label" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">CTA Button Label</label>
                <input
                  id="about-cta-label"
                  type="text"
                  value={aboutCtaLabel}
                  onChange={(e) => setAboutCtaLabel(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="about-cta-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">CTA Destination URL</label>
                <input
                  id="about-cta-url"
                  type="text"
                  value={aboutCtaUrl}
                  onChange={(e) => setAboutCtaUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveAbout}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save About Section</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. VISION & MISSION TAB */}
        {activeTab === 'vision_mission' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Vision &amp; Mission Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="v-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Vision Title</label>
                <input
                  id="v-title"
                  type="text"
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
                <label htmlFor="v-content" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Vision Statement</label>
                <textarea
                  id="v-content"
                  rows={4}
                  value={visionContent}
                  onChange={(e) => setVisionContent(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="m-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mission Title</label>
                <input
                  id="m-title"
                  type="text"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
                <label htmlFor="m-content" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mission Statement</label>
                <textarea
                  id="m-content"
                  rows={4}
                  value={missionContent}
                  onChange={(e) => setMissionContent(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
                />
              </div>
            </div>

            {/* Mission Objectives List Control */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Mission Objectives List ({objectives.length})
                </span>
                <button
                  type="button"
                  onClick={() => setObjectives([...objectives, 'New Objective'])}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Objective
                </button>
              </div>

              <div className="space-y-2">
                {objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono w-6">{idx + 1}.</span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => {
                        const updated = [...objectives];
                        updated[idx] = e.target.value;
                        setObjectives(updated);
                      }}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setObjectives(objectives.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveVisionMission}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Vision &amp; Mission</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. WHY CHOOSE TAB */}
        {activeTab === 'why_choose' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Why Choose Section Settings
            </h2>

            <div>
              <label htmlFor="why-eyebrow" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Eyebrow Tag</label>
              <input
                id="why-eyebrow"
                type="text"
                value={whyEyebrow}
                onChange={(e) => setWhyEyebrow(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="why-heading" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Heading</label>
              <input
                id="why-heading"
                type="text"
                value={whyHeading}
                onChange={(e) => setWhyHeading(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            {/* Pillars List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Value Pillars ({pillars.length})
                </span>
                <button
                  type="button"
                  onClick={() => setPillars([...pillars, { title: 'New Pillar', description: 'Pillar description' }])}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Pillar
                </button>
              </div>

              <div className="space-y-3">
                {pillars.map((pil, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-500">Pillar {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setPillars(pillars.filter((_, i) => i !== idx))}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pil.title}
                      onChange={(e) => {
                        const updated = [...pillars];
                        updated[idx].title = e.target.value;
                        setPillars(updated);
                      }}
                      placeholder="Title"
                      className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <textarea
                      rows={2}
                      value={pil.description}
                      onChange={(e) => {
                        const updated = [...pillars];
                        updated[idx].description = e.target.value;
                        setPillars(updated);
                      }}
                      placeholder="Description"
                      className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveWhyChoose}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Why Choose Section</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. QUALITY COMMITMENT TAB */}
        {activeTab === 'quality_commitment' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Quality Commitment Settings
            </h2>

            <div>
              <label htmlFor="q-heading" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Heading</label>
              <input
                id="q-heading"
                type="text"
                value={qualHeading}
                onChange={(e) => setQualHeading(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="q-content" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quality Statement Content</label>
              <textarea
                id="q-content"
                rows={4}
                value={qualContent}
                onChange={(e) => setQualContent(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
              />
            </div>

            {/* Quality Parameters List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Quality Parameters ({qualParams.length})
                </span>
                <button
                  type="button"
                  onClick={() => setQualParams([...qualParams, 'New Parameter'])}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Parameter
                </button>
              </div>

              <div className="space-y-2">
                {qualParams.map((param, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono w-6">{idx + 1}.</span>
                    <input
                      type="text"
                      value={param}
                      onChange={(e) => {
                        const updated = [...qualParams];
                        updated[idx] = e.target.value;
                        setQualParams(updated);
                      }}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setQualParams(qualParams.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveQuality}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Quality Section</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. MARKETS TAB */}
        {activeTab === 'markets' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Markets We Serve Settings
            </h2>

            <div>
              <label htmlFor="m-heading" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Heading</label>
              <input
                id="m-heading"
                type="text"
                value={mktHeading}
                onChange={(e) => setMktHeading(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="m-content" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Market Description Content</label>
              <textarea
                id="m-content"
                rows={4}
                value={mktContent}
                onChange={(e) => setMktContent(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
              />
            </div>

            {/* Regions List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Market Regions ({mktRegions.length})
                </span>
                <button
                  type="button"
                  onClick={() => setMktRegions([...mktRegions, 'New Region'])}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Region
                </button>
              </div>

              <div className="space-y-2">
                {mktRegions.map((reg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono w-6">{idx + 1}.</span>
                    <input
                      type="text"
                      value={reg}
                      onChange={(e) => {
                        const updated = [...mktRegions];
                        updated[idx] = e.target.value;
                        setMktRegions(updated);
                      }}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setMktRegions(mktRegions.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveMarkets}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Markets Section</span>
              </button>
            </div>
          </div>
        )}

        {/* 7. FINAL CTA TAB */}
        {activeTab === 'final_cta' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Final B2B CTA Banner Settings
            </h2>

            <div>
              <label htmlFor="cta-heading" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Heading</label>
              <input
                id="cta-heading"
                type="text"
                value={ctaHeading}
                onChange={(e) => setCtaHeading(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="cta-subheadline" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Supporting Subheadline</label>
              <textarea
                id="cta-subheadline"
                rows={3}
                value={ctaSubheadline}
                onChange={(e) => setCtaSubheadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cta-p-label" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Primary CTA Label</label>
                <input
                  id="cta-p-label"
                  type="text"
                  value={ctaPrimaryLabel}
                  onChange={(e) => setCtaPrimaryLabel(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="cta-p-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Primary CTA Destination URL</label>
                <input
                  id="cta-p-url"
                  type="text"
                  value={ctaPrimaryUrl}
                  onChange={(e) => setCtaPrimaryUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                />
              </div>

              <div>
                <label htmlFor="cta-s-label" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Secondary CTA Label</label>
                <input
                  id="cta-s-label"
                  type="text"
                  value={ctaSecondaryLabel}
                  onChange={(e) => setCtaSecondaryLabel(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="cta-s-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Secondary CTA Destination URL</label>
                <input
                  id="cta-s-url"
                  type="text"
                  value={ctaSecondaryUrl}
                  onChange={(e) => setCtaSecondaryUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={saveFinalCta}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Final CTA Section</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
