'use client';

import { useState } from 'react';
import { Save, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SettingRow {
  key: string;
  value: unknown;
}

interface SettingsManagerProps {
  initialSettings: SettingRow[];
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  // Parse initial values
  const getSettingVal = (key: string, defaultValue: unknown = '') => {
    const row = initialSettings.find((s) => s.key === key);
    return row ? row.value : defaultValue;
  };

  // State mapping
  const [companyName, setCompanyName] = useState<string>(getSettingVal('company_name', 'Twinplast Polymers Pvt. Ltd.') as string);
  const [publicPhone, setPublicPhone] = useState<string>(getSettingVal('public_phone', '+91 95853 88444') as string);
  const [publicEmail, setPublicEmail] = useState<string>(getSettingVal('public_email', 'twinplastpolymers@gmail.com') as string);
  const [publicAddress, setPublicAddress] = useState<string>(getSettingVal('public_address', 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan, Thoothukudi, Tamil Nadu, 628101') as string);
  
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

    const settingsPayloads = [
      { key: 'company_name', value: companyName },
      { key: 'public_phone', value: publicPhone },
      { key: 'public_email', value: publicEmail },
      { key: 'public_address', value: publicAddress },
      { key: 'website_metadata', value: { title: seoTitle, description: seoDescription } },
      { key: 'business_info', value: { established } },
    ];

    try {
      let hasError = false;
      let lastErrorMessage = '';

      // Perform upsert checks for each whitelist key
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
        setErrorMsg(lastErrorMessage || 'Failed to update settings parameters.');
      } else {
        setSuccessMsg('Corporate settings parameters updated successfully.');
      }
    } catch {
      setErrorMsg('A connection error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Company Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure business profile metadata rendered dynamically across the site.
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

      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent border-b border-slate-100 dark:border-slate-900 pb-2">
            General Specifications
          </h3>

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
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
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
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent border-b border-slate-100 dark:border-slate-900 pb-2">
            Factory Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone-number" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Public Phone
              </label>
              <input
                id="phone-number"
                type="text"
                required
                value={publicPhone}
                onChange={(e) => setPublicPhone(e.target.value)}
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Public Email
              </label>
              <input
                id="email-address"
                type="email"
                required
                value={publicEmail}
                onChange={(e) => setPublicEmail(e.target.value)}
                disabled={isSaving}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
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
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent border-b border-slate-100 dark:border-slate-900 pb-2">
            SEO & Website Metadata
          </h3>

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
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
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
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-y"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-900">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
