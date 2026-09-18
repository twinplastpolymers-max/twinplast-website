import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { FloatingContactButton } from '@/components/shared/FloatingContactButton';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let publicPhone = '';
  let whatsappNumber = '';
  let secondaryPhone = '';
  let publicEmail = '';
  let publicAddress = '';

  let products: Array<{ title: string; slug: string }> = [];
  let solutions: Array<{ id: string; title: string }> = [];

  let socialLinks: { facebook?: string; instagram?: string; youtube?: string; twitter?: string } = {};

  try {
    const supabase = await createClient();
    const [{ data: settingRes }, { data: productRes }, { data: industryRes }] = await Promise.all([
      supabase.from('company_settings').select('*'),
      supabase.from('products').select('title, slug').eq('active', true).order('display_order', { ascending: true }),
      supabase.from('industries').select('id, title').eq('active', true).order('display_order', { ascending: true }),
    ]);

    if (productRes) {
      products = productRes;
    }

    if (industryRes) {
      solutions = industryRes;
    }

    if (settingRes) {
      const settings = settingRes as Array<{ key: string; value: unknown }>;
      const pPhone = settings.find((s) => s.key === 'primary_phone' || s.key === 'public_phone')?.value;
      const waPhone = settings.find((s) => s.key === 'whatsapp_number' || s.key === 'public_whatsapp' || s.key === 'whatsapp')?.value;
      const sPhone = settings.find((s) => s.key === 'secondary_phone' || s.key === 'alternate_phone')?.value;
      const pEmail = settings.find((s) => s.key === 'official_email' || s.key === 'primary_email' || s.key === 'public_email')?.value;
      const pAddr = settings.find((s) => s.key === 'public_address')?.value;

      const socObj = (settings.find((s) => s.key === 'social_links')?.value || {}) as Record<string, string>;
      const fb = typeof socObj.facebook === 'string' ? socObj.facebook : (settings.find((s) => s.key === 'facebook_url')?.value as string || '');
      const ig = typeof socObj.instagram === 'string' ? socObj.instagram : (settings.find((s) => s.key === 'instagram_url')?.value as string || '');
      const tw = typeof socObj.twitter === 'string' ? socObj.twitter : (settings.find((s) => s.key === 'twitter_url')?.value as string || '');
      const yt = typeof socObj.youtube === 'string' ? socObj.youtube : (settings.find((s) => s.key === 'youtube_url')?.value as string || '');

      if (typeof pPhone === 'string' && pPhone.trim()) publicPhone = pPhone.trim();
      
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
  } catch {
    // Keep empty state if settings fetch fails
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Header
        publicPhone={publicPhone}
        secondaryPhone={secondaryPhone}
        whatsappNumber={whatsappNumber}
        publicEmail={publicEmail}
        socialLinks={socialLinks}
        products={products}
        solutions={solutions}
      />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer
        publicPhone={publicPhone}
        whatsappNumber={whatsappNumber}
        publicEmail={publicEmail}
        publicAddress={publicAddress}
        products={products}
      />
      <FloatingContactButton phone={publicPhone} whatsappNumber={whatsappNumber} />
    </div>
  );
}
