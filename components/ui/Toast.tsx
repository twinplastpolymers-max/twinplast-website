'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration: number = 4500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 visible toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast('success', title, message),
    [showToast]
  );
  const error = useCallback(
    (title: string, message?: string) => showToast('error', title, message),
    [showToast]
  );
  const info = useCallback(
    (title: string, message?: string) => showToast('info', title, message),
    [showToast]
  );
  const warning = useCallback(
    (title: string, message?: string) => showToast('warning', title, message),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      
      {/* Global Fixed Toast Container - Visible regardless of scroll position */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-slide-in-right ${
              t.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/50 text-white dark:bg-slate-950/95 dark:border-emerald-500/60 ring-1 ring-emerald-500/20'
                : t.type === 'error'
                ? 'bg-slate-900/95 border-red-500/50 text-white dark:bg-slate-950/95 dark:border-red-500/60 ring-1 ring-red-500/20'
                : t.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/50 text-white dark:bg-slate-950/95 dark:border-amber-500/60 ring-1 ring-amber-500/20'
                : 'bg-slate-900/95 border-blue-500/50 text-white dark:bg-slate-950/95 dark:border-blue-500/60 ring-1 ring-blue-500/20'
            }`}
          >
            {t.type === 'success' && (
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {t.type === 'error' && (
              <div className="p-1 rounded-lg bg-red-500/20 text-red-400 flex-shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {t.type === 'warning' && (
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            {t.type === 'info' && (
              <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400 flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-sm font-bold tracking-tight text-white">{t.title}</p>
              {t.message && (
                <p className="text-xs text-slate-300 mt-1 leading-snug font-medium">
                  {t.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
    };
  }
  return context;
}
