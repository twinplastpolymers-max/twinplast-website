import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/public';

export interface PublicShellData {
  publicPhone: string;
  internationalPhone: string;
  whatsappNumber: string;
  secondaryPhone: string;
  publicEmail: string;
  publicAddress: string;
  products: Array<{ title: string; slug: string }>;
  solutions: Array<{ id: string; title: string }>;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

const EMPTY_SHELL_DATA: PublicShellData = {
  publicPhone: '',
  internationalPhone: '',
  whatsappNumber: '',
  secondaryPhone: '',
  publicEmail: '',
  publicAddress: '',
  products: [],
  solutions: [],
  socialLinks: {},
};

export const PUBLIC_REVALIDATE_SECONDS = 300;

export const getPublicShellData = unstable_cache(
  async (): Promise<PublicShellData> => {
    const supabase = createPublicClient();
    if (!supabase) return EMPTY_SHELL_DATA;

    try {
      const [{ data: settingRes }, { data: productRes }, { data: industryRes }] = await Promise.all([
        supabase.from('company_settings').select('key, value'),
        supabase
          .from('products')
          .select('title, slug')
          .eq('active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('industries')
          .select('id, title')
          .eq('active', true)
          .order('display_order', { ascending: true }),
      ]);

      let publicPhone = '';
      let internationalPhone = '';
      let whatsappNumber = '';
      let secondaryPhone = '';
      let publicEmail = '';
      let publicAddress = '';
      let socialLinks: PublicShellData['socialLinks'] = {};

      if (settingRes) {
        const settings = settingRes as Array<{ key: string; value: unknown }>;
        const pPhone = settings.find((s) => s.key === 'primary_phone' || s.key === 'public_phone')?.value;
        const pIntlPhone = settings.find((s) => s.key === 'international_phone')?.value;
        const waPhone = settings.find(
          (s) => s.key === 'whatsapp_number' || s.key === 'public_whatsapp' || s.key === 'whatsapp'
        )?.value;
        const sPhone = settings.find((s) => s.key === 'secondary_phone' || s.key === 'alternate_phone')?.value;
        const pEmail = settings.find(
          (s) => s.key === 'official_email' || s.key === 'primary_email' || s.key === 'public_email'
        )?.value;
        const pAddr = settings.find((s) => s.key === 'public_address')?.value;

        const socObj = (settings.find((s) => s.key === 'social_links')?.value || {}) as Record<string, string>;
        const fb =
          typeof socObj.facebook === 'string'
            ? socObj.facebook
            : ((settings.find((s) => s.key === 'facebook_url')?.value as string) || '');
        const ig =
          typeof socObj.instagram === 'string'
            ? socObj.instagram
            : ((settings.find((s) => s.key === 'instagram_url')?.value as string) || '');
        const tw =
          typeof socObj.twitter === 'string'
            ? socObj.twitter
            : ((settings.find((s) => s.key === 'twitter_url')?.value as string) || '');
        const yt =
          typeof socObj.youtube === 'string'
            ? socObj.youtube
            : ((settings.find((s) => s.key === 'youtube_url')?.value as string) || '');

        if (typeof pPhone === 'string' && pPhone.trim()) publicPhone = pPhone.trim();
        if (typeof pIntlPhone === 'string' && pIntlPhone.trim()) internationalPhone = pIntlPhone.trim();

        if (typeof waPhone === 'string' && waPhone.trim()) {
          whatsappNumber = waPhone.trim();
        } else if (typeof socObj.whatsapp_number === 'string' && socObj.whatsapp_number.trim()) {
          whatsappNumber = socObj.whatsapp_number.trim();
        } else if (typeof socObj.whatsapp === 'string' && socObj.whatsapp.trim()) {
          whatsappNumber = socObj.whatsapp.trim();
        }

        if (typeof sPhone === 'string' && sPhone.trim()) secondaryPhone = sPhone.trim();
        if (typeof pEmail === 'string' && pEmail.trim()) publicEmail = pEmail.trim();
        if (typeof pAddr === 'string' && pAddr.trim()) publicAddress = pAddr.trim();

        socialLinks = {
          facebook: fb.trim(),
          instagram: ig.trim(),
          twitter: tw.trim(),
          youtube: yt.trim(),
        };
      }

      return {
        publicPhone,
        internationalPhone,
        whatsappNumber,
        secondaryPhone,
        publicEmail,
        publicAddress,
        products: productRes || [],
        solutions: industryRes || [],
        socialLinks,
      };
    } catch {
      return EMPTY_SHELL_DATA;
    }
  },
  ['public-shell-data'],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ['public-shell', 'public-catalog', 'company-settings'],
  }
);
