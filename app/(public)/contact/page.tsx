import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Request B2B Quote | Twinplast Polymers',
  description: 'Submit your fluted sheet or polymer product specifications to the Twinplast Polymers plant in Thoothukudi, Tamil Nadu. Established 2021.',
};

export default function ContactPage() {
  return (
    <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Partner With Twinplast
          </h1>
          <p className="mt-2 text-base text-muted max-w-2xl">
            Contact our factory sales team directly for custom order quotes, bulk requirements, or application advice.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted">Loading B2B Form...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
