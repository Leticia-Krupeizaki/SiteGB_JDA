'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Toast = { id: number; tone: 'success' | 'error'; message: string };

const ToastContext = createContext<(tone: Toast['tone'], message: string) => void>(() => undefined);

/** Avisos curtos de sucesso e erro, lidos por leitores de tela (aria-live). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((tone: Toast['tone'], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, tone, message }]);
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), tone === 'error' ? 8000 : 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:left-auto sm:items-end">
        {toasts.map((toast) => (
          <p
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto max-w-sm px-4 py-3 font-semibold shadow-lg ${toast.tone === 'error' ? 'bg-gb-red text-gb-white' : 'bg-gb-ink text-gb-white'}`}
          >
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
