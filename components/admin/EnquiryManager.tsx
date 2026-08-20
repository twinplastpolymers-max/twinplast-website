'use client';

import { useState } from 'react';
import { Search, Mail, Phone, Clock, FileText, CheckCircle2, Archive, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Enquiry } from '@/types';

interface EnquiryManagerProps {
  initialEnquiries: Enquiry[];
}

export function EnquiryManager({ initialEnquiries }: EnquiryManagerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Mutation loaders state
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Status updating handler
  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in_progress' | 'resolved' | 'archived') => {
    setLoadingId(id);
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (!error) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
      // Graceful error handling
    } finally {
      setLoadingId(null);
    }
  };

  // Filter Logic: status match and search query match
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    
    const matchesSearch = 
      e.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Helper status color styling
  const statusBadges = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    resolved: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    archived: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400',
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Client Enquiries
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review and process incoming fluted sheet and polymer specifications inquiries.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search enquiries by name, company, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          {['All', 'new', 'in_progress', 'resolved', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              type="button"
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-950 text-foreground shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'in_progress' ? 'In Progress' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Stack */}
      <div className="space-y-4">
        {filteredEnquiries.map((e) => {
          const dateString = new Date(e.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={e.id}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Card Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-900 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {e.customer_name}
                  </h3>
                  {e.company && (
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block sm:inline-block sm:mt-0 sm:before:content-['|'] sm:before:mx-2 mt-0.5">
                      {e.company}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                    statusBadges[e.status as keyof typeof statusBadges]
                  }`}>
                    {e.status === 'in_progress' ? 'In Progress' : e.status}
                  </span>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dateString}</span>
                  </div>
                </div>
              </div>

              {/* Message Payload */}
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg border border-slate-100 dark:border-slate-900">
                {e.message}
              </div>

              {/* Details and Actions Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 pt-2">
                
                {/* Contact Coordinates */}
                <div className="flex flex-col sm:flex-row gap-3 text-xs">
                  <a
                    href={`mailto:${e.email}`}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-500 dark:text-blue-400 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{e.email}</span>
                  </a>
                  
                  {e.phone && (
                    <a
                      href={`tel:${e.phone}`}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{e.phone}</span>
                    </a>
                  )}
                </div>

                {/* Operations Buttons */}
                <div className="flex gap-2 justify-end items-center">
                  {loadingId === e.id ? (
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  ) : (
                    <>
                      {e.status !== 'new' && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'new')}
                          type="button"
                          className="inline-flex items-center gap-1 rounded bg-secondary hover:bg-slate-200 text-secondary-foreground px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Mark New</span>
                        </button>
                      )}
                      
                      {e.status !== 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'in_progress')}
                          type="button"
                          className="inline-flex items-center gap-1 rounded bg-secondary hover:bg-slate-200 text-secondary-foreground px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>In-Progress</span>
                        </button>
                      )}

                      {e.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'resolved')}
                          type="button"
                          className="inline-flex items-center gap-1 rounded bg-green-600 hover:bg-green-500 text-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      )}

                      {e.status !== 'archived' && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'archived')}
                          type="button"
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {filteredEnquiries.length === 0 && (
          <div className="rounded-xl border border-surface-border bg-white dark:bg-slate-950 p-12 text-center text-sm text-muted shadow-sm">
            No inquiries match selected status filter or search parameters.
          </div>
        )}
      </div>
    </div>
  );
}
