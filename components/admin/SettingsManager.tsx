'use client';

import { useState } from 'react';
import { Save, ShieldAlert, CheckCircle2, Loader2, Phone, Mail, Building, MessageCircle, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

interface SettingRow {
  key: string;
  value: unknown;
}

interface SettingsManagerProps {
  initialSettings: SettingRow[];
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  // Parse initial values
  const getSettingVal = (key: string, defaultValue: unknown = '') => {
    const row = initialSettings.find((s) => s.key === key);
    return row && row.value !== null && row.value !== undefined ? row.value : defaultValue;
  };

  // General Company Settings
  const [companyName, setCompanyName] = useState<string>(getSettingVal('company_name', 'Twinplast Polymers Pvt. Ltd.') as string);
  const [publicAddress, setPublicAddress] = useState<string>(getSettingVal('public_address', 'South Silukkanpatti, Tuticorin, Tamilnadu, India') as string);

  // Direct Phone & WhatsApp Numbers
  const [primaryPhone, setPrimaryPhone] = useState<string>(
    (getSettingVal('primary_phone') || getSettingVal('public_phone') || '+91 95853 88444') as string
  );
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    (getSettingVal('whatsapp_number') || getSettingVal('secondary_phone') || '+91 96458 32154') as string
  );

  // Official & Alternate contacts
  const [officialEmail, setOfficialEmail] = useState<string>(
    (getSettingVal('official_email') || getSettingVal('primary_email') || getSettingVal('public_email') || 'info@twinplastpolymers.com') as string
  );
  const [alternatePhone, setAlternatePhone] = useState<string>((getSettingVal('alternate_phone', '+91 96458 32154')) as string);
  const [alternateEmail, setAlternateEmail] = useState<string>((getSettingVal('alternate_email', 'info@twinplastpolymers.com')) as string);

  // Social Media Links
  const initialSocial = (getSettingVal('social_links', {}) || {}) as Record<string, string>;
  const [facebookUrl, setFacebookUrl] = useState<string>(
    (initialSocial.facebook || getSettingVal('facebook_url', 'https://facebook.com')) as string
  );
  const [instagramUrl, setInstagramUrl] = useState<string>(
    (initialSocial.instagram || getSettingVal('instagram_url', 'https://instagram.com')) as string
  );
  const [youtubeUrl, setYoutubeUrl] = useState<string>(
    (initialSocial.youtube || getSettingVal('youtube_url', 'https://youtube.com')) as string
  );

  // JSON website_metadata
  const meta = getSettingVal('website_metadata', {}) as Record<string, string>;
  const [seoTitle, setSeoTitle] = useState<string>(meta.title || 'Twinplast Polymers | Industrial PP Sheets');
  const [seoDescription, setSeoDescription] = useState<string>(meta.description || 'Polypropylene fluted sheet manufacturer in Tamil Nadu.');

  // JSON business_info
  const biz = getSettingVal('business_info', {}) as Record<string, string>;
  const [established, setEstablished] = useState<string>(biz.established || '2021');

  // Loader / feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const cleanPrimaryPhone = primaryPhone.trim();
    const cleanWhatsappNumber = whatsappNumber.trim();
    const cleanOfficialEmail = officialEmail.trim();

    const settingsPayloads = [
      { key: 'company_name', value: companyName.trim() },
      { key: 'public_phone', value: cleanPrimaryPhone },
      { key: 'primary_phone', value: cleanPrimaryPhone },
      { key: 'whatsapp_number', value: cleanWhatsappNumber },
      { key: 'public_whatsapp', value: cleanWhatsappNumber },
      { key: 'secondary_phone', value: cleanWhatsappNumber || alternatePhone.trim() },
      { key: 'public_email', value: cleanOfficialEmail },
      { key: 'primary_email', value: cleanOfficialEmail },
      { key: 'official_email', value: cleanOfficialEmail },
      { key: 'alternate_phone', value: alternatePhone.trim() },
      { key: 'alternate_email', value: alternateEmail.trim() },
      { key: 'public_address', value: publicAddress.trim() },
      { key: 'facebook_url', value: facebookUrl.trim() },
      { key: 'instagram_url', value: instagramUrl.trim() },
      { key: 'youtube_url', value: youtubeUrl.trim() },
      {
        key: 'social_links',
        value: {
          facebook: facebookUrl.trim(),
          instagram: instagramUrl.trim(),
          youtube: youtubeUrl.trim(),
          whatsapp: cleanWhatsappNumber ? `https://wa.me/${cleanWhatsappNumber.replace(/[^+\d]/g, '').replace('+', '')}` : '',
          whatsapp_number: cleanWhatsappNumber,
        },
      },
      { key: 'website_metadata', value: { title: seoTitle.trim(), description: seoDescription.trim() } },
      { key: 'business_info', value: { established: established.trim() } },
    ];

    try {
      let hasError = false;
      let lastErrorMessage = '';

      for (const item of settingsPayloads) {
        const { error } = await supabase
          .from('company_settings')
          .upsert(
            { key: item.key, value: item.value },
            { onConflict: 'key' }
          );

        if (error) {
          hasError = true;
          lastErrorMessage = error.message;
        }
      }

      if (hasError) {
        const msg = lastErrorMessage || 'Failed to update settings parameters.';
        setErrorMsg(msg);
        toast.error('Failed to Update Settings', msg);
      } else {
        const msg = 'Site contact numbers and official business settings saved successfully.';
        setSuccessMsg(msg);
        toast.success('Settings Saved', msg);
      }
    } catch {
      const err = 'A connection error occurred while saving.';
      setErrorMsg(err);
      toast.error('Network Error', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Site Settings &amp; Contact Numbers</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your site contact numbers, WhatsApp redirect number, official email, and corporate metadata.
        </p>
      </div>

      {successMsg && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 p-4 text-sm text-green-800 dark:text-green-400 flex items-start gap-2">
          <Save className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 p-4 text-sm text-red-800 dark:text-red-400 flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        
        {/* Company Identity */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-900 pb-2">
            Company Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="established-year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Established Year
              </label>
              <input
                id="established-year"
                type="text"
                required
                value={established}
                onChange={(e) => setEstablished(e.target.value)}
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Public Contact Numbers Section */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Public Contact Numbers</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Phone number displays first across all public channels. WhatsApp number displays second and handles all WhatsApp icon redirects across the website.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primary-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Phone Number (1st Place) *</span>
              </label>
              <input
                id="primary-phone"
                type="text"
                required
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                placeholder="+91 95853 88444"
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Displayed first on header, call buttons &amp; contact pages</span>
            </div>

            <div>
              <label htmlFor="whatsapp-number" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                <span>WhatsApp Number (2nd Place) *</span>
              </label>
              <input
                id="whatsapp-number"
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 96458 32154"
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">All site WhatsApp icons redirect to this number</span>
            </div>
          </div>
        </div>

        {/* Official & Alternate Contacts Stored Separately */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-900 pb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>Official Business Email &amp; Plant Address</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="official-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Official Business Email *
              </label>
              <input
                id="official-email"
                type="email"
                required
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                disabled={isSaving}
                placeholder="info@twinplastpolymers.com"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Used for site email display &amp; enquiry notifications</span>
            </div>

            <div>
              <label htmlFor="alternate-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Alternate Phone Number
              </label>
              <input
                id="alternate-phone"
                type="text"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="alternate-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Alternate Email Address
            </label>
            <input
              id="alternate-email"
              type="email"
              value={alternateEmail}
              onChange={(e) => setAlternateEmail(e.target.value)}
              disabled={isSaving}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="address-info" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Physical Plant Address
            </label>
            <textarea
              id="address-info"
              rows={3}
              required
              value={publicAddress}
              onChange={(e) => setPublicAddress(e.target.value)}
              disabled={isSaving}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Social Media Links &amp; Profiles</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Configure URLs for header &amp; footer social icons. Leaving a field blank will use platform defaults.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="facebook-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Facebook Page URL
              </label>
              <input
                id="facebook-url"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com"
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="instagram-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Instagram Profile URL
              </label>
              <input
                id="instagram-url"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com"
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="youtube-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                YouTube Channel URL
              </label>
              <input
                id="youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com"
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-900 pb-2">
            SEO &amp; Site-Wide Metadata
          </h2>

          <div>
            <label htmlFor="seo-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              SEO Title Tag
            </label>
            <input
              id="seo-title"
              type="text"
              required
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              disabled={isSaving}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="seo-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              SEO Meta Description
            </label>
            <textarea
              id="seo-desc"
              rows={3}
              required
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              disabled={isSaving}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-900">
          <div className="flex-1 text-xs">
            {isSaving && (
              <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving settings...
              </span>
            )}
            {!isSaving && successMsg && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> {successMsg}
              </span>
            )}
            {!isSaving && errorMsg && (
              <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold animate-fade-in">
                <ShieldAlert className="w-4 h-4" /> {errorMsg}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
