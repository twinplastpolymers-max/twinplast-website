import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-900 bg-[#06152b] text-slate-200 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand/About column - Left 5 cols */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="relative h-16 w-60 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded">
              <Image
                src="/logo-white.png"
                alt="Twinplast Polymers Logo"
                fill
                priority
                sizes="260px"
                className="object-contain object-left" // Fully white logo on dark footer
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Twinplast Polymers Private Limited is a specialized B2B manufacturer of polypropylene fluted sheets. Established in 2021 in Thoothukudi, Tamil Nadu, we engineer durable packaging, separations, and flooring protection products.
            </p>
          </div>

          {/* Quick Links column - Mid 3 cols */}
          <div className="md:col-span-3 md:pl-8 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Quick Links
            </span>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Products', href: '/products' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Products column - Right-mid 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Our Products
            </span>
            <ul className="space-y-3">
              {[
                { label: 'PP Corrugated Sheets', href: '/products' },
                { label: 'Layer Pad Sheets', href: '/products' },
                { label: 'Floor Protection Sheets', href: '/products' },
                { label: 'Sunpack / PP Sheets', href: '/products' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information column - Right 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Contact Us
            </span>
            <address className="not-italic space-y-3 text-sm text-slate-400">
              <p className="leading-relaxed text-xs">
                SF.NO.1/2A1, South Sillukanpatti Village,<br />
                Milavittan, Thoothukudi,<br />
                Tamil Nadu &bull; 628101
              </p>
              
              <div className="pt-2 space-y-1 text-xs">
                <p>
                  P: <a href="tel:+919585388444" className="text-white hover:text-blue-400 transition-colors font-bold">+91 95853 88444</a>
                </p>
                <p>
                  E: <a href="mailto:twinplastpolymers@gmail.com" className="text-white hover:text-blue-400 transition-colors font-bold">twinplastpolymers@gmail.com</a>
                </p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Twinplast Polymers Pvt. Ltd. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://www.ekodrix.com/"
              className="text-sm text-slate-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5 inline-flex items-center gap-1"
            >
              Crafted with love by <span className="inline-flex items-center font-semibold">Ek<Image src="/ekodrix-logo.png" alt="o" width={14} height={14} className="mx-0.5 inline-block rounded-full align-middle" />drix</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
