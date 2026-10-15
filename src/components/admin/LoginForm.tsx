'use client';

import { useState, type FormEvent } from 'react';
import { AdminApiError, adminFetch } from './api';

const inputClass = 'focus-ring mt-1 block min-h-12 w-full border-2 border-gb-line bg-gb-white px-3 text-base aria-[invalid=true]:border-gb-red';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      await adminFetch('/api/admin/login', { method: 'POST', body: { email: data.get('email'), password: data.get('password') } });
      window.location.assign('/admin/mural');
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors);
      }
      setBusy(false);
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p role="alert" className="border-2 border-gb-red p-3 font-semibold text-gb-red">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="font-display text-lg font-semibold uppercase tracking-wide">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} aria-invalid={!!fieldErrors.email} />
      </div>
      <div>
        <label htmlFor="password" className="font-display text-lg font-semibold uppercase tracking-wide">
          Senha
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} aria-invalid={!!fieldErrors.password} />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="focus-ring min-h-12 w-full bg-gb-red px-6 font-display text-xl font-semibold uppercase text-gb-white hover:bg-gb-red-dark disabled:opacity-70"
      >
        {busy ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
