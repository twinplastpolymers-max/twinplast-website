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
                <div className="p-5 mt-4 rounded-xl border border-amber-200 bg-[#FFF9EB]">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#B45309] block mb-4">
                    International &amp; Export Orders
                  </span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    {/* Call Option */}
                    <a
                      href={`tel:${internationalPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-3 group flex-1"
                    >
                      <div className="w-11 h-11 flex items-center justify-center shrink-0 bg-[#FDE68A] text-[#D97706] rounded-xl group-hover:bg-[#FCD34D] transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[15px] font-bold text-slate-900 block group-hover:text-[#B45309] transition-colors leading-tight">
                          Call Us
                        </span>
                        <span className="text-[15px] font-semibold text-[#B45309] mt-0.5 block">
                          {internationalPhone}
                        </span>
                      </div>
                    </a>

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-10 bg-amber-200/60"></div>

                    {/* WhatsApp Option */}
                    <a
                      href={`https://wa.me/${internationalPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group flex-1"
                    >
                      <div className="w-11 h-11 flex items-center justify-center shrink-0 bg-[#DCFCE7] text-[#16A34A] rounded-xl group-hover:bg-[#BBF7D0] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[15px] font-bold text-slate-900 block group-hover:text-[#16A34A] transition-colors leading-tight">
                          WhatsApp
                        </span>
                        <span className="text-[15px] font-semibold text-[#B45309] mt-0.5 block">
                          {internationalPhone}
                        </span>
                      </div>
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
