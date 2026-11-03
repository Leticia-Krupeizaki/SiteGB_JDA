import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { ToastProvider } from '@/components/admin/Toast';
import { requireAdminPage } from '@/lib/auth/guard';

/** Toda página dentro deste grupo exige sessão válida no servidor. */
export default async function PainelLayout({ children }: { children: ReactNode }) {
  const { admin } = await requireAdminPage();

  return (
    <ToastProvider>
      <header className="bg-gb-ink text-gb-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="font-display text-xl font-extrabold uppercase tracking-wide">
              Gracie Barra · Painel
            </p>
            <p className="text-sm text-gb-line">
              {admin.name ?? admin.email} · {admin.role === 'ADMIN' ? 'Administrador' : 'Moderador'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="focus-ring text-sm font-semibold underline">
              Ver site<span className="sr-only"> (abre em nova aba)</span>
            </a>
            <LogoutButton />
          </div>
        </div>
        <AdminNav role={admin.role} />
      </header>
      <main id="conteudo" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </ToastProvider>
  );
}
