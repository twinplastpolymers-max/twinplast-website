import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Settings | Twinplast Admin',
  description: 'Manage Twinplast global business settings.',
};

export default function AdminSettingsPage() {
  const currentSettings = {
    name: 'Twinplast Polymers Pvt. Ltd.',
    location: 'Thoothukudi (Tuticorin), Tamil Nadu, India.',
    established: '2021',
    email: 'info@twinplast.com',
    phone: '',
    address: 'Thoothukudi, Tamil Nadu, India.',
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Company Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure business profile metadata rendered dynamically across the site.
        </p>
      </div>

      <form className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label htmlFor="company-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            defaultValue={currentSettings.name}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="established-year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Established Year
          </label>
          <input
            id="established-year"
            type="text"
            defaultValue={currentSettings.established}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Contact Email
          </label>
          <input
            id="email-address"
            type="email"
            defaultValue={currentSettings.email}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="address-info" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Factory Address / Location
          </label>
          <textarea
            id="address-info"
            rows={3}
            defaultValue={currentSettings.address}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
