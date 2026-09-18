'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { submitEnquiry } from '@/app/actions';

export interface HomeContactSectionProps {
  phone?: string;
  email?: string;
  address?: string;
  initialProduct?: string;
  products?: string[];
  solutions?: string[];
  internationalPhone?: string;
}

export function HomeContactSection({
  phone,
  email,
  address,
  initialProduct = '',
  products,
  solutions,
  internationalPhone,
}: HomeContactSectionProps) {
  const searchParams = useSearchParams();
  const rawProduct = searchParams.get('product') || initialProduct || '';

  const formatProductName = (name: string) => {
    if (!name) return '';
    if (name.includes('-') && !name.includes(' ')) {
      return name
        .split('-')
        .map((w) => (w.toLowerCase() === 'pp' ? 'PP' : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(' ');
    }
    return name;
  };

  const selectedProduct = formatProductName(rawProduct);

  const productOptions = products || [];
  const solutionOptions = solutions || [];
  const allOptions = [...productOptions, ...solutionOptions];
  const customSelectedOption = selectedProduct && !allOptions.includes(selectedProduct) ? selectedProduct : null;

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    company: '',
    product: selectedProduct,
    solution: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, product: selectedProduct }));
    }
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        setStatus('success');
        setFormData({
          customer_name: '',
          email: '',
          phone: '',
          company: '',
          product: '',
          solution: '',
          message: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Failed to submit enquiry.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Side: Contact Information (No Box, Pure Content) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 id="contact-heading" className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
                For Enquiry and Contact
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Connect with our factory team directly for product inquiries, custom PP sheet specifications, and orders.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {phone && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Phone
                    </span>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors block mt-0.5">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Email
                    </span>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors block mt-0.5">
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Factory Address
                    </span>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed mt-0.5">
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {internationalPhone && (
                <div className="flex items-start gap-4 p-4 mt-4 rounded-xl border border-amber-200 bg-amber-50">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-amber-100 text-amber-600 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-md font-bold uppercase tracking-wider text-amber-800 block">
                      International &amp; Export Orders
                    </span>
                    <a
                      href={`tel:${internationalPhone.replace(/\s+/g, '')}`}
                      className="text-base font-bold text-slate-900 hover:text-amber-600 transition-colors block mt-1"
                    >
                      {internationalPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Client Enter Option (No box border, no border radius, underline inputs) */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your details below and our team will get back to you promptly.
              </p>
            </div>

            {formData.product && (
              <div className="mb-6 flex items-center gap-2 p-3 bg-blue-50 border-l-2 border-blue-600 text-xs text-slate-700">
                <span>Selected Product:</span>
                <span className="font-bold text-blue-900">{formData.product}</span>
              </div>
            )}

            {status === 'success' ? (
              <div className="p-6 bg-slate-50 border-l-4 border-blue-600 space-y-2">
                <p className="text-sm font-semibold text-slate-900">Thank you! Your enquiry has been received.</p>
                <p className="text-xs text-slate-600">Our representative will get in touch with you shortly.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:underline cursor-pointer uppercase tracking-wider"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Your Name *"
                      className="w-full bg-transparent border-b border-slate-300 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-none focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address *"
                      className="w-full bg-transparent border-b border-slate-300 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-none focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="w-full bg-transparent border-b border-slate-300 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-none focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full bg-transparent border-b border-slate-300 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-none focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={formData.product}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, product: val }));
                    }}
                    className={`w-full bg-transparent border-b border-slate-300 py-3 text-sm rounded-none focus:outline-none focus:border-blue-600 transition-colors cursor-pointer ${formData.product ? 'text-slate-900 font-medium' : 'text-slate-400'
                      }`}
                  >
                    <option value="" disabled className="text-slate-400">
                      Select Product / Requirement *
                    </option>

                    {customSelectedOption && (
                      <option value={customSelectedOption} className="text-slate-900 bg-white py-1">
                        {customSelectedOption}
                      </option>
                    )}

                    <optgroup label="Products Catalog">
                      {productOptions.map((p) => (
                        <option key={p} value={p} className="text-slate-900 bg-white py-1">
                          {p}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Industry Solutions">
                      {solutionOptions.map((s) => (
                        <option key={s} value={s} className="text-slate-900 bg-white py-1">
                          {s}
                        </option>
                      ))}
                    </optgroup>

                    <option value="General Enquiry / Custom Order" className="text-slate-900 bg-white py-1">
                      General Enquiry / Custom Order
                    </option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your Message / Requirements"
                    className="w-full bg-transparent border-b border-slate-300 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-none focus:outline-none focus:border-blue-600 transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 font-medium">
                    {errorMessage}
                  </p>
                )}

                <div className="flex justify-center sm:justify-start">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-8 py-3.5 rounded-none transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
