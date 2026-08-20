'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const errorParam = searchParams.get('error');
  const initialErrorMsg = errorParam === 'unauthorized'
    ? 'Access denied. Administrator privileges are required to view the admin console.'
    : '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(initialErrorMsg);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Authenticate credentials via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        setErrorMsg(authError?.message || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // 2. Query user_roles table to verify administrator permissions
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        // Non-admin authenticated user: sign them out immediately
        await supabase.auth.signOut();
        setErrorMsg('Access denied. This account does not possess administrator permissions.');
        setIsLoading(false);
        return;
      }

      // 3. Clear error and redirect to Dashboard home
      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMsg('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm animate-fade-in">
      <div className="text-center">
        <Link href="/" className="font-bold text-2xl text-blue-600 dark:text-blue-400">
          Twinplast Polymers
        </Link>
        <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Admin Console Portal
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in with your administrative account to manage content
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleLogin} aria-label="Admin Sign In">
        <div>
          <label htmlFor="email-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="admin@twinplast.com"
          />
        </div>

        <div>
          <label htmlFor="password-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Password
          </label>
          <input
            id="password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {errorMsg && (
          <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-3 text-xs text-amber-800 dark:text-amber-400 leading-normal">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 transition-all cursor-pointer"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          &larr; Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm text-center text-sm text-slate-500">
          Loading Console Login...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
