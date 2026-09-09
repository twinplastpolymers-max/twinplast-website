'use client';

import { useState } from 'react';
import { Save, ShieldAlert, CheckCircle2, Loader2, Phone, Mail, Building } from 'lucide-react';
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
    return row ? row.value : defaultValue;
  };

  // General Company Settings
  const [companyName, setCompanyName] = useState<string>(getSettingVal('company_name', 'Twinplast Polymers Pvt. Ltd.') as string);
  const [publicAddress, setPublicAddress] = useState<string>(getSettingVal('public_address', 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan, Thoothukudi, Tamil Nadu, 628101') as string);
  
  // Explicit Primary Contact Designation
  // Default values check existing public_phone / primary_phone / public_email / primary_email
  const initialPhone = (getSettingVal('primary_phone') || getSettingVal('public_phone') || '+91 95853 88444') as string;
  const initialEmail = (getSettingVal('primary_email') || getSettingVal('public_email') || 'twinplastpolymers@gmail.com') as string;

  const [primaryPhoneChoice, setPrimaryPhoneChoice] = useState<'p1' | 'p2' | 'custom'>(
    initialPhone === '+91 95853 88444' ? 'p1' : initialPhone === '+91 96458 32154' ? 'p2' : 'custom'
  );
  const [customPhone, setCustomPhone] = useState<string>(initialPhone);

  const [primaryEmailChoice, setPrimaryEmailChoice] = useState<'e1' | 'e2' | 'custom'>(
    initialEmail === 'twinplastpolymers@gmail.com' ? 'e1' : initialEmail === 'info@twinplastpolymers.com' ? 'e2' : 'custom'
  );
  const [customEmail, setCustomEmail] = useState<string>(initialEmail);

  // Official & Alternate contacts (stored separately)
  const [officialEmail, setOfficialEmail] = useState<string>((getSettingVal('official_email', 'info@twinplastpolymers.com')) as string);
  const [alternatePhone, setAlternatePhone] = useState<string>((getSettingVal('alternate_phone', '+91 96458 32154')) as string);
  const [alternateEmail, setAlternateEmail] = useState<string>((getSettingVal('alternate_email', 'info@twinplastpolymers.com')) as string);

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

  // Resolved public primary phone & email
  const resolvedPrimaryPhone =
    primaryPhoneChoice === 'p1' ? '+91 95853 88444' : primaryPhoneChoice === 'p2' ? '+91 96458 32154' : customPhone;

  const resolvedPrimaryEmail =
    primaryEmailChoice === 'e1' ? 'twinplastpolymers@gmail.com' : primaryEmailChoice === 'e2' ? 'info@twinplastpolymers.com' : customEmail;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const settingsPayloads = [
      { key: 'company_name', value: companyName },
      { key: 'public_phone', value: resolvedPrimaryPhone },
      { key: 'public_email', value: resolvedPrimaryEmail },
      { key: 'primary_phone', value: resolvedPrimaryPhone },
      { key: 'primary_email', value: resolvedPrimaryEmail },
      { key: 'alternate_phone', value: alternatePhone },
      { key: 'official_email', value: officialEmail },
      { key: 'alternate_email', value: alternateEmail },
      { key: 'public_address', value: publicAddress },
      { key: 'website_metadata', value: { title: seoTitle, description: seoDescription } },
      { key: 'business_info', value: { established } },
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
        const msg = 'Corporate settings & explicit primary contacts saved successfully.';
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
          <span>Site Settings &amp; Primary Contact Designation</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure business metadata and explicitly designate the public Primary Contact rendered across public channels.
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

        {/* Explicit Primary Contact Designation Section */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Explicit Primary Contact Designation</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Only the explicitly designated Primary Contact details will propagate to public header/hero/footer call/email links and JSON-LD. Alternate contacts remain stored in settings.
            </p>
          </div>

          {/* Phone Designation */}
          <div className="space-y-3 bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Designate Public Primary Phone *
            </span>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="primaryPhoneChoice"
                  checked={primaryPhoneChoice === 'p1'}
                  onChange={() => setPrimaryPhoneChoice('p1')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="font-mono text-slate-900 dark:text-slate-100">+91 95853 88444</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">(Production Phone)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="primaryPhoneChoice"
                  checked={primaryPhoneChoice === 'p2'}
                  onChange={() => setPrimaryPhoneChoice('p2')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="font-mono text-slate-900 dark:text-slate-100">+91 96458 32154</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">(Company Doc Phone)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="primaryPhoneChoice"
                  checked={primaryPhoneChoice === 'custom'}
                  onChange={() => setPrimaryPhoneChoice('custom')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Phone Number</span>
              </label>
            </div>

            {primaryPhoneChoice === 'custom' && (
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            )}

            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
              Active Public Primary Phone: <span className="font-mono font-bold">{resolvedPrimaryPhone}</span>
            </div>
          </div>

          {/* Email Designation */}
          <div className="space-y-3 bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              Designate Public Primary Email *
            </span>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="primaryEmailChoice"
                  checked={primaryEmailChoice === 'e1'}
                  onChange={() => setPrimaryEmailChoice('e1')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="font-mono text-slate-900 dark:text-slate-100">twinplastpolymers@gmail.com</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">(Production Email)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="primaryEmailChoice"
                  checked={primaryEmailChoice === 'e2'}
                  onChange={() => setPrimaryEmailChoice('e2')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="font-mono text-slate-900 dark:text-slate-100">info@twinplastpolymers.com</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">(Official Business Email)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="primaryEmailChoice"
                  checked={primaryEmailChoice === 'custom'}
                  onChange={() => setPrimaryEmailChoice('custom')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Email Address</span>
              </label>
            </div>

            {primaryEmailChoice === 'custom' && (
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="contact@twinplastpolymers.com"
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            )}

            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
              Active Public Primary Email: <span className="font-mono font-bold">{resolvedPrimaryEmail}</span>
            </div>
          </div>
        </div>

        {/* Official & Alternate Contacts Stored Separately */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-900 pb-2">
            Official &amp; Alternate Contacts (Stored Separately)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="official-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Official Business Email
              </label>
              <input
                id="official-email"
                type="email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
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
