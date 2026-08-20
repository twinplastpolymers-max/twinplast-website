import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand/About column - Left 5 cols */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="relative h-12 w-52 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded">
              <Image
                src="/logo.png"
                alt="Twinplast Polymers Logo"
                fill
                sizes="208px"
                className="object-contain brightness-0 invert" // Fully white logo on dark footer
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Twinplast Polymers Private Limited is a specialized B2B manufacturer of polypropylene fluted sheets. Established in 2021 in Thoothukudi, Tamil Nadu, we engineer durable packaging, separations, and flooring protection products.
            </p>
          </div>

          {/* Quick Links column - Mid 3 cols */}
          <div className="md:col-span-3 md:pl-8 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Corporate Navigation
            </span>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
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

          {/* Address/Contact column - Right 4 cols */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Plant Headquarters
            </span>
            <address className="not-italic space-y-3 text-sm text-slate-400">
              <p className="font-bold text-white">Twinplast Polymers Pvt. Ltd.</p>
              <p className="leading-relaxed">
                SF.NO.1/2A1, South Sillukanpatti Village,<br />
                Milavittan, Thoothukudi,<br />
                Tamil Nadu, India &bull; 628101
              </p>
              
              <div className="pt-2 space-y-1.5 border-t border-slate-900">
                <p>
                  Phone:{' '}
                  <a
                    href="tel:+919585388444"
                    className="text-white hover:text-accent font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                  >
                    +91 95853 88444
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:twinplastpolymers@gmail.com"
                    className="text-white hover:text-accent font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                  >
                    twinplastpolymers@gmail.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Twinplast Polymers Private Limited. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="text-xs text-slate-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
            >
              Management Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
