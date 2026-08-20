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
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 cursor-pointer disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      <span>{isPending ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}
