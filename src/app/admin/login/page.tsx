import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { getSession } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Entrar' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  if (await getSession()) redirect('/admin/mural');
  const { erro } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm border-t-4 border-gb-red bg-gb-white p-6 sm:p-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-gb-navy">Gracie Barra Jardim das Américas</p>
        <h1 className="mt-1 font-display text-4xl font-bold uppercase">Painel do mural</h1>
        <p className="mt-2 text-gb-mute">Acesso restrito à equipe de moderação.</p>
        {erro === 'permissao' && (
          <p role="alert" className="mt-4 font-semibold text-gb-red">
            Sua conta não tem permissão para o painel.
          </p>
        )}
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
