'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { submitEnquiry } from '@/app/actions';

interface ContactFormProps {
  phone?: string;
  email?: string;
  address?: string;
}

export function ContactForm({ phone, email, address }: ContactFormProps) {
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

  const cleanPhone = phone ? phone.replace(/[^+\d]/g, '') : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Form Container - Left 7 columns */}
      <div className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-6">Send Us a Direct Message</h2>
        
        {status === 'success' ? (
          <div className="p-6 bg-accent/10 border border-accent/20 rounded-xl text-center space-y-3">
            <h3 className="text-lg font-bold text-accent">Enquiry Submitted</h3>
            <p className="text-sm text-muted">
              Thank you for contacting Twinplast. Our sales engineering team will respond within 24 business hours.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-4 px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Send Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="customer_name" className="block text-xs font-semibold text-foreground mb-1">
                Full Name *
              </label>
              <input
                id="customer_name"
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 bg-background border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1">
                  Business Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-foreground mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 95853 88444"
                  className="w-full px-3.5 py-2.5 bg-background border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-semibold text-foreground mb-1">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your company / business entity"
                className="w-full px-3.5 py-2.5 bg-background border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-foreground mb-1">
                Enquiry Details / Requirements
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Specify GSM, sheet dimensions, thickness, color, and required quantity..."
                className="w-full px-3.5 py-2.5 bg-background border border-surface-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'submitting' ? 'Submitting Enquiry...' : 'Submit Enquiry'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Corporate Info - Right 5 columns */}
      {(phone || email || address) && (
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-foreground">Plant Contact Details</h2>
            
            {phone && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Direct Phone</span>
                  <a href={`tel:${cleanPhone}`} className="text-sm font-semibold text-foreground hover:text-accent transition-colors block mt-0.5">
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {email && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Official Email</span>
                  <a href={`mailto:${email}`} className="text-sm font-semibold text-foreground hover:text-accent transition-colors block mt-0.5">
                    {email}
                  </a>
                </div>
              </div>
            )}

            {address && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div className="text-sm text-muted leading-relaxed">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-0.5">Physical Address</span>
                  <strong className="text-foreground font-semibold block">Twinplast Polymers Pvt. Ltd.</strong>
                  <p>{address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
