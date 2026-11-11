import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { FloatingContactButton } from '@/components/shared/FloatingContactButton';
import { getPublicShellData } from '@/lib/public-data';

export const revalidate = 300;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    publicPhone,
    whatsappNumber,
    secondaryPhone,
    publicEmail,
    publicAddress,
    products,
    solutions,
    socialLinks,
  } = await getPublicShellData();

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
