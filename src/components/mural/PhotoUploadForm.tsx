'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { muralCategories, muralLimits, muralPolicyVersions } from '@/data/mural';
import type { ApiErrorBody } from '@/lib/api/errors';
import { fieldErrorsFrom, muralFormValues, muralSubmissionSchema, validatePhotoFile } from '@/lib/validation/mural';
import { WizardNav, WizardProgress, WizardStep, useWizard, type WizardStepDef } from './Wizard';

type Errors = Partial<Record<string, string>>;

const labelClass = 'block font-display text-lg font-semibold uppercase tracking-wide';
const inputClass = 'focus-ring mt-2 block min-h-12 w-full border-2 border-gb-line bg-gb-white px-3 text-base aria-[invalid=true]:border-gb-red';

/** Etapas do celular. No computador, as mesmas seções aparecem em sequência. */
const steps: WizardStepDef[] = [
  { title: 'A foto', fields: ['photo'] },
  { title: 'Sobre a foto', fields: ['category', 'caption', 'showNamePublicly'] },
  { title: 'Seus dados', fields: ['senderName', 'contactType', 'contactValue'] },
  { title: 'Autorizações', fields: ['acceptPrivacy', 'acceptPublication', 'declareImageRights'] },
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm font-semibold text-gb-red">
      {message}
    </p>
  );
}

/**
 * Formulário do mural. Valida no navegador para dar retorno rápido e envia
 * para POST /api/mural, que repete toda a validação. A foto entra como pendente.
 * No celular vira passo a passo (ver Wizard.tsx).
 */
export function PhotoUploadForm() {
  const wizard = useWizard(steps);
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  /** O aviso de um campo some assim que ele é alterado. */
  const clearError = (name: string) => {
    const key = name === 'contactType' ? 'contactValue' : name;
    if (!errors[key] && !errors[name]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      delete next[name];
      return next;
    });
  };

  /** No celular, volta para a etapa do primeiro erro; no computador, foca o resumo de erros. */
  const showErrors = (next: Errors) => {
    setErrors(next);
    if (wizard.isMobile) wizard.goTo(wizard.firstStepWithError(next));
    else requestAnimationFrame(() => summaryRef.current?.focus());
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setFormError(null);
    const data = new FormData(event.currentTarget);
    const result = muralSubmissionSchema.safeParse(muralFormValues(data));

    const all: Errors = result.success ? {} : fieldErrorsFrom(result.error);
    const fileError = validatePhotoFile(file);
    if (fileError) all.photo = fileError;

    // Celular: o botão principal avança, validando só a etapa atual.
    if (wizard.shouldAdvance) {
      const stepErrors = wizard.errorsIn(all, wizard.current);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) wizard.goTo(wizard.current + 1);
      return;
    }

    if (Object.keys(all).length > 0) return showErrors(all);

    // Garante o arquivo escolhido, mesmo se o input tiver sido limpo.
    data.set('photo', file!);
    setErrors({});
    setSending(true);
    try {
      const response = await fetch('/api/mural', { method: 'POST', body: data });
      if (response.ok) return setDone(true);
      const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
      if (body?.fieldErrors && Object.keys(body.fieldErrors).length > 0) return showErrors(body.fieldErrors);
      setFormError(body?.message ?? 'Não foi possível enviar agora. Tente novamente em alguns minutos.');
    } catch {
      setFormError('Sem conexão com o servidor. Verifique sua internet e tente de novo.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="border-l-4 border-gb-navy bg-gb-white p-6 focus:outline-none">
        <p className="font-display text-3xl font-bold uppercase">Foto recebida!</p>
        <p className="mt-3 text-lg">Recebemos sua foto! Ela será analisada pela equipe antes de aparecer no mural.</p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setFile(null);
            setCaption('');
            wizard.reset();
          }}
          className="focus-ring mt-6 min-h-12 border-2 border-gb-ink px-6 font-display text-lg font-semibold uppercase"
        >
          Enviar outra foto
        </button>
      </div>
    );
  }

  const errorList = Object.values(errors).filter(Boolean);
  const describedBy = (name: string) => (errors[name] ? `${name}-erro` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} onChange={(event) => clearError((event.target as { name?: string }).name ?? '')} className="space-y-6">
      <WizardProgress wizard={wizard} />

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-2 border-gb-red bg-gb-white p-4 focus:outline-none max-md:hidden">
          <p className="font-semibold text-gb-red">Corrija {errorList.length === 1 ? 'o campo abaixo' : `os ${errorList.length} campos abaixo`}:</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {errorList.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <WizardStep wizard={wizard} index={0}>
        <div>
          <label htmlFor="photo" className={labelClass}>
            Foto
          </label>
          <p className="text-sm text-gb-mute">JPG, PNG ou WebP, até 10 MB. Uma foto por envio.</p>
          <input
            id="photo"
            name="photo"
            type="file"
            accept={muralLimits.acceptedTypes.join(',')}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="focus-ring mt-2 block w-full text-sm file:mr-4 file:min-h-11 file:border-0 file:bg-gb-ink file:px-4 file:font-semibold file:text-gb-white"
            aria-invalid={!!errors.photo}
            aria-describedby={describedBy('photo')}
          />
          <FieldError id="photo-erro" message={errors.photo} />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element -- prévia local do arquivo escolhido
            <img src={preview} alt="Prévia da foto escolhida" className="mt-3 max-h-64 w-auto max-w-full border-2 border-gb-line object-contain" />
          )}
        </div>
      </WizardStep>

      <WizardStep wizard={wizard} index={1}>
        <div>
          <label htmlFor="category" className={labelClass}>
            Categoria
          </label>
          <select id="category" name="category" defaultValue="" className={inputClass} aria-invalid={!!errors.category} aria-describedby={describedBy('category')}>
            <option value="" disabled>
              Escolha uma categoria
            </option>
            {muralCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <FieldError id="category-erro" message={errors.category} />
        </div>

        <div>
          <label htmlFor="caption" className={labelClass}>
            Legenda <span className="font-sans text-sm font-normal normal-case tracking-normal text-gb-mute">(opcional)</span>
          </label>
          <textarea
            id="caption"
            name="caption"
            rows={3}
            maxLength={muralLimits.captionMaxLength}
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className={`${inputClass} py-2`}
            aria-invalid={!!errors.caption}
            aria-describedby={`caption-contador ${describedBy('caption') ?? ''}`.trim()}
          />
          <p id="caption-contador" className="mt-1 flex justify-between gap-4 text-sm text-gb-mute">
            <span>Se preenchida, aparece junto da foto depois de aprovada.</span>
            <span className="tabular-nums">
              {caption.length}/{muralLimits.captionMaxLength}
            </span>
          </p>
          <FieldError id="caption-erro" message={errors.caption} />
        </div>

        <label className="flex gap-3">
          <input type="checkbox" name="showNamePublicly" className="mt-1 h-5 w-5 shrink-0 accent-gb-navy" />
          <span className="text-sm leading-relaxed">
            Pode mostrar meu nome junto da foto no mural. <span className="text-gb-mute">(opcional)</span>
          </span>
        </label>
      </WizardStep>

      <WizardStep wizard={wizard} index={2}>
        <div>
          <label htmlFor="senderName" className={labelClass}>
            Seu nome
          </label>
          <p className="text-sm text-gb-mute">Só aparece no mural se você marcar &quot;Pode mostrar meu nome junto da foto&quot;.</p>
          <input id="senderName" name="senderName" autoComplete="name" className={inputClass} aria-invalid={!!errors.senderName} aria-describedby={describedBy('senderName')} />
          <FieldError id="senderName-erro" message={errors.senderName} />
        </div>

        <fieldset>
          <legend className={labelClass}>Contato</legend>
          <p className="text-sm text-gb-mute">Usado só pela equipe, caso seja preciso falar com você sobre a foto.</p>
          <div className="mt-2 flex gap-6">
            {[
              ['WHATSAPP', 'WhatsApp'],
              ['EMAIL', 'E-mail'],
            ].map(([value, label]) => (
              <label key={value} className="flex min-h-11 items-center gap-2">
                <input type="radio" name="contactType" value={value} defaultChecked={value === 'WHATSAPP'} className="h-5 w-5 accent-gb-navy" />
                {label}
              </label>
            ))}
          </div>
          <label htmlFor="contactValue" className="sr-only">
            WhatsApp ou e-mail
          </label>
          <input id="contactValue" name="contactValue" className={inputClass} aria-invalid={!!errors.contactValue} aria-describedby={describedBy('contactValue')} />
          <FieldError id="contactValue-erro" message={errors.contactValue || errors.contactType} />
        </fieldset>
      </WizardStep>

      {/* Honeypot contra robôs: invisível para pessoas. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <WizardStep wizard={wizard} index={3}>
        <fieldset className="space-y-3 md:border-t-2 md:border-gb-ink md:pt-5">
          <legend className="sr-only">Autorizações</legend>
          {[
            ['acceptPrivacy', `Li e aceito a política de privacidade (versão ${muralPolicyVersions.privacy}).`],
            ['acceptPublication', `Autorizo o uso e a publicação desta foto no mural da academia (termo versão ${muralPolicyVersions.publicationConsent}).`],
            ['declareImageRights', 'Declaro que tenho direito de enviar esta imagem e autorização das pessoas que aparecem nela. Fotos com menores de idade só são publicadas após autorização dos responsáveis.'],
          ].map(([name, text]) => (
            <div key={name}>
              <label className="flex gap-3">
                <input type="checkbox" name={name} className="mt-1 h-5 w-5 shrink-0 accent-gb-navy" aria-invalid={!!errors[name]} aria-describedby={describedBy(name)} />
                <span className="text-sm leading-relaxed">{text}</span>
              </label>
              <FieldError id={`${name}-erro`} message={errors[name]} />
            </div>
          ))}
        </fieldset>
      </WizardStep>

      {formError && (
        <p role="alert" className="border-2 border-gb-red bg-gb-white p-4 font-semibold text-gb-red">
          {formError}
        </p>
      )}

      <WizardNav wizard={wizard} submitLabel="Enviar foto para análise" sending={sending} />
    </form>
  );
}
