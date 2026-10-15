'use client';

import { useState, type FormEvent } from 'react';
import type { ApiErrorBody } from '@/lib/api/errors';
import { fieldErrorsFrom, removalRequestSchema } from '@/lib/validation/mural';
import { WizardNav, WizardProgress, WizardStep, useWizard, type WizardStepDef } from './Wizard';

const labelClass = 'block font-display text-lg font-semibold uppercase tracking-wide';
const inputClass = 'focus-ring mt-2 block min-h-12 w-full border-2 border-gb-line bg-gb-white px-3 text-base aria-[invalid=true]:border-gb-red';

const steps: WizardStepDef[] = [
  { title: 'Qual foto', fields: ['reason'] },
  { title: 'Seu contato', fields: ['requesterContact'] },
];

/** Pedido de retirada de uma foto do mural, enviado para a equipe analisar. No celular, passo a passo. */
export function RemovalRequestForm() {
  const wizard = useWizard(steps);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setFormError(null);
    const result = removalRequestSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    const all = result.success ? {} : fieldErrorsFrom(result.error);

    if (wizard.shouldAdvance) {
      const stepErrors = wizard.errorsIn(all, wizard.current);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) wizard.goTo(wizard.current + 1);
      return;
    }

    if (!result.success) {
      setErrors(all);
      if (wizard.isMobile) wizard.goTo(wizard.firstStepWithError(all));
      return;
    }

    setErrors({});
    setSending(true);
    try {
      const response = await fetch('/api/mural/removal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (response.ok) return setDone(true);
      const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
      if (body?.fieldErrors) {
        setErrors(body.fieldErrors);
        if (wizard.isMobile) wizard.goTo(wizard.firstStepWithError(body.fieldErrors));
      } else setFormError(body?.message ?? 'Não foi possível enviar agora.');
    } catch {
      setFormError('Sem conexão com o servidor. Tente de novo.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <p role="status" className="border-l-4 border-gb-navy bg-gb-white p-6 text-lg">
        Pedido recebido. A equipe vai analisar e retornar pelo contato informado.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onChange={(event) => {
        // O aviso de um campo some assim que ele é alterado.
        const name = (event.target as { name?: string }).name ?? '';
        if (!errors[name]) return;
        setErrors((current) => {
          const next = { ...current };
          delete next[name];
          return next;
        });
      }}
      className="space-y-6"
    >
      <WizardProgress wizard={wizard} />

      <WizardStep wizard={wizard} index={0}>
        <div>
          <label htmlFor="reason" className={labelClass}>
            Qual foto e por quê
          </label>
          <p className="text-sm text-gb-mute">Descreva a foto (categoria, evento, quem aparece) para a equipe encontrar.</p>
          <textarea
            id="reason"
            name="reason"
            rows={4}
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
      </WizardStep>

      <WizardStep wizard={wizard} index={1}>
        <div>
          <label htmlFor="requesterContact" className={labelClass}>
            Seu WhatsApp ou e-mail
          </label>
          <p className="text-sm text-gb-mute">A equipe usa só para responder sobre o pedido.</p>
          <input
            id="requesterContact"
            name="requesterContact"
            className={inputClass}
            aria-invalid={!!errors.requesterContact}
            aria-describedby={errors.requesterContact ? 'requesterContact-erro' : undefined}
          />
          {errors.requesterContact && (
            <p id="requesterContact-erro" className="mt-1 text-sm font-semibold text-gb-red">
              {errors.requesterContact}
            </p>
          )}
        </div>
      </WizardStep>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="removal-website">Não preencha este campo</label>
        <input id="removal-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {formError && (
        <p role="alert" className="border-2 border-gb-red bg-gb-white p-4 font-semibold text-gb-red">
          {formError}
        </p>
      )}

      <WizardNav wizard={wizard} submitLabel="Pedir remoção" sending={sending} />
    </form>
  );
}
