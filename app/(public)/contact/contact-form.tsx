'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { submitEnquiry } from '@/app/actions';

export function ContactForm() {
  const searchParams = useSearchParams();
  const selectedProduct = searchParams.get('product') || '';

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    company: '',
    message: selectedProduct 
      ? `Regarding: ${selectedProduct}. Please send specifications and pricing details.` 
      : '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await submitEnquiry({
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        message: formData.message,
      });

      if (response.success) {
        setStatus('success');
        setFormData({ customer_name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(response.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during submission.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Contact Form - Left 7 columns */}
      <div className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">
          B2B Enquiry Form
        </h2>
        <p className="text-xs text-muted mb-6 uppercase tracking-wider font-semibold">
          Fields marked with * are required
        </p>

        {status === 'success' ? (
          <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/60 p-6 text-center space-y-3">
            <h3 className="text-base font-bold text-accent-green">Enquiry Sent Successfully</h3>
            <p className="text-sm text-muted max-w-sm mx-auto">
              Your product specifications request has been logged in our system. A Twinplast Polymers sales representative will contact you shortly.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-xs font-bold text-accent-green hover:underline uppercase tracking-wider cursor-pointer"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Enquiry Form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer_name" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Full Name *
                </label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-surface-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-surface-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-surface-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-surface-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="e.g. 95853 88444"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Specifications / Enquiry details *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-surface-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-y"
                placeholder="Include details such as GSM targets, sheet thickness, color specifications, and quantity requirements."
              />
            </div>

            {status === 'error' && (
              <p className="text-xs font-semibold text-accent-red">
                Error: {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'submitting' ? 'Logging Enquiry...' : 'Submit B2B Request'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Corporate Info - Right 5 columns */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-foreground">Plant Contact Details</h2>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Phone className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Direct Phone</span>
              <a href="tel:+919585388444" className="text-sm font-semibold text-foreground hover:text-accent transition-colors block mt-0.5">
                +91 95853 88444
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Official Email</span>
              <a href="mailto:twinplastpolymers@gmail.com" className="text-sm font-semibold text-foreground hover:text-accent transition-colors block mt-0.5">
                twinplastpolymers@gmail.com
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div className="text-sm text-muted leading-relaxed">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-0.5">Physical Address</span>
              <strong className="text-foreground font-semibold block">Twinplast Polymers Pvt. Ltd.</strong>
              <p>SF.NO.1/2A1, South Sillukanpatti Village,</p>
              <p>Milavittan, Thoothukudi,</p>
              <p>Tamil Nadu, India &bull; 628101</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
