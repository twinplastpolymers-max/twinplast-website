import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { FloatingContactButton } from '@/components/shared/FloatingContactButton';
import { createClient } from '@/lib/supabase/server';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let publicPhone = '+91 95853 88444';
  let publicEmail = 'twinplastpolymers@gmail.com';
  let publicAddress = 'SF.NO.1/2A1, South Sillukanpatti Village, Milavittan, Thoothukudi, Tamil Nadu • 628101';

  let products: Array<{ title: string; slug: string }> = [];

  try {
    const supabase = await createClient();
    const [{ data: settingRes }, { data: productRes }] = await Promise.all([
      supabase.from('company_settings').select('*'),
      supabase.from('products').select('title, slug').eq('active', true).order('display_order', { ascending: true }),
    ]);

    if (productRes) {
      products = productRes;
    }

    if (settingRes) {
      const settings = settingRes as Array<{ key: string; value: unknown }>;
      const pPhone = settings.find((s) => s.key === 'public_phone')?.value;
      const pEmail = settings.find((s) => s.key === 'public_email')?.value;
      const pAddr = settings.find((s) => s.key === 'public_address')?.value;

      if (typeof pPhone === 'string' && pPhone.trim()) publicPhone = pPhone;
      if (typeof pEmail === 'string' && pEmail.trim()) publicEmail = pEmail;
      if (typeof pAddr === 'string' && pAddr.trim()) publicAddress = pAddr;
    }
  } catch {
    // Fallback to verified default values
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Header publicPhone={publicPhone} publicEmail={publicEmail} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer
        publicPhone={publicPhone}
        publicEmail={publicEmail}
        publicAddress={publicAddress}
        products={products}
      />
      <FloatingContactButton phone={publicPhone} />
    </div>
  );
}
