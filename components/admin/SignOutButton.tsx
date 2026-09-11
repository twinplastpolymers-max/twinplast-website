'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      type="button"
      disabled={isPending}
      className="flex items-center gap-3 w-full px-3.5 py-2 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 cursor-pointer disabled:opacity-50"
    >
      <LogOut className="w-3.5 h-3.5 text-red-500" />
      <span>{isPending ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}
