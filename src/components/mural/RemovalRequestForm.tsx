'use client';

import { useState, type FormEvent } from 'react';
import type { ApiErrorBody } from '@/lib/api/errors';
import { fieldErrorsFrom, removalRequestSchema } from '@/lib/validation/mural';

const inputClass = 'focus-ring mt-1 block w-full border-2 border-gb-line bg-gb-white px-3 text-base text-gb-ink aria-[invalid=true]:border-gb-red';

/** Pedido de retirada de uma foto do mural, enviado para a equipe analisar. */
export function RemovalRequestForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = removalRequestSchema.safeParse(data);
    if (!result.success) return setErrors(fieldErrorsFrom(result.error));

    setErrors({});
    setFormError(null);
    setSending(true);
    try {
      const response = await fetch('/api/mural/removal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (response.ok) return setDone(true);
      const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
      if (body?.fieldErrors) setErrors(body.fieldErrors);
      else setFormError(body?.message ?? 'Não foi possível enviar agora.');
    } catch {
      setFormError('Sem conexão com o servidor. Tente de novo.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <p role="status" className="border-l-4 border-gb-navy bg-gb-white p-4 text-gb-ink">
        Pedido recebido. A equipe vai analisar e retornar pelo contato informado.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-3">
      <div>
        <label htmlFor="requesterContact" className="text-sm font-semibold text-gb-ink">
          Seu WhatsApp ou e-mail
        </label>
        <input
          id="requesterContact"
          name="requesterContact"
          className={`${inputClass} min-h-11`}
          aria-invalid={!!errors.requesterContact}
          aria-describedby={errors.requesterContact ? 'requesterContact-erro' : undefined}
        />
        {errors.requesterContact && (
          <p id="requesterContact-erro" className="mt-1 text-sm font-semibold text-gb-red">
            {errors.requesterContact}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="reason" className="text-sm font-semibold text-gb-ink">
          Qual foto e por quê
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          maxLength={1000}
          className={`${inputClass} py-2`}
          aria-invalid={!!errors.reason}
          aria-describedby={errors.reason ? 'reason-erro' : undefined}
        />
        {errors.reason && (
          <p id="reason-erro" className="mt-1 text-sm font-semibold text-gb-red">
            {errors.reason}
          </p>
        )}
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="removal-website">Não preencha este campo</label>
        <input id="removal-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {formError && (
        <p role="alert" className="text-sm font-semibold text-gb-red">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="focus-ring min-h-11 border-2 border-gb-ink px-4 font-display font-semibold uppercase text-gb-ink hover:bg-gb-ink hover:text-gb-white disabled:opacity-60"
      >
        {sending ? 'Enviando…' : 'Pedir retirada'}
      </button>
    </form>
  );
}
