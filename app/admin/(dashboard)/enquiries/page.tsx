import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Enquiries | Twinplast Admin',
  description: 'View and process incoming B2B business inquiries.',
};

export default function AdminEnquiriesPage() {
  const dummyEnquiries = [
    {
      id: '1',
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      company: 'Southern Packaging Co.',
      message: 'Looking for a quotation of 5000 units of PP Sunpack Sheets (4mm thickness) delivered to Tuticorin Port.',
      status: 'new',
      date: 'Aug 20, 2026',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Client Enquiries
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review and update status of B2B sheets and polymer product requests.
        </p>
      </div>

      <div className="space-y-4">
        {dummyEnquiries.map((e) => (
          <div
            key={e.id}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">{e.name}</span>
                {e.company && (
                  <span className="text-slate-400 dark:text-slate-500 text-xs sm:inline-block sm:before:content-['|'] sm:before:mx-2 block">
                    {e.company}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                  New
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{e.date}</span>
              </div>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p className="whitespace-pre-line">{e.message}</p>
              <div className="pt-2 flex flex-col gap-1 text-xs text-slate-400">
                <p>Email: <a href={`mailto:${e.email}`} className="text-blue-600 hover:underline">{e.email}</a></p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
              >
                Mark as In-Progress
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors cursor-pointer"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
