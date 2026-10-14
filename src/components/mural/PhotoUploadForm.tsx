'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { muralCategories, muralLimits, muralPolicyVersions } from '@/data/mural';
import { muralSubmissionSchema, validatePhotoFile } from '@/lib/validation/mural';

type Errors = Partial<Record<string, string>>;

const labelClass = 'block font-display text-lg font-semibold uppercase tracking-wide';
const inputClass = 'focus-ring mt-2 block min-h-12 w-full border-2 border-gb-line bg-gb-white px-3 text-base aria-[invalid=true]:border-gb-red';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm font-semibold text-gb-red">
      {message}
    </p>
  );
}

/**
 * Formulário do mural. Nesta fase NÃO envia nada: valida os dados no navegador
 * e mostra como será a confirmação. O envio real chega com o backend (Etapa 4).
 */
export function PhotoUploadForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = muralSubmissionSchema.safeParse({
      senderName: data.get('senderName') ?? '',
      contactType: data.get('contactType') ?? undefined,
      contactValue: data.get('contactValue') ?? '',
      category: data.get('category') || undefined,
      caption: data.get('caption') ?? '',
      acceptPrivacy: data.get('acceptPrivacy') === 'on',
      acceptPublication: data.get('acceptPublication') === 'on',
      declareImageRights: data.get('declareImageRights') === 'on',
      website: data.get('website') ?? '',
    });

    const next: Errors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
    }
    const fileError = validatePhotoFile(file);
    if (fileError) next.photo = fileError;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="border-l-4 border-gb-navy bg-gb-white p-6 focus:outline-none">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-gb-mute">Demonstração · nada foi enviado</p>
        <p className="mt-2 font-display text-3xl font-bold uppercase">Formulário válido</p>
        <p className="mt-3 text-gb-mute">Na versão final, esta é a mensagem que o aluno vai ver:</p>
        <blockquote className="mt-3 border-l-2 border-gb-red pl-4 text-lg">
          Recebemos sua foto! Ela será analisada pela equipe antes de aparecer no mural.
        </blockquote>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setFile(null);
            setCaption('');
          }}
          className="focus-ring mt-6 min-h-12 border-2 border-gb-ink px-6 font-display text-lg font-semibold uppercase"
        >
          Testar de novo
        </button>
      </div>
    );
  }

  const errorList = Object.values(errors).filter(Boolean);
  const describedBy = (name: string) => (errors[name] ? `${name}-erro` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-2 border-gb-red bg-gb-white p-4 focus:outline-none">
          <p className="font-semibold text-gb-red">Corrija {errorList.length === 1 ? 'o campo abaixo' : `os ${errorList.length} campos abaixo`}:</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {errorList.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="senderName" className={labelClass}>
          Seu nome
        </label>
        <p className="text-sm text-gb-mute">Não é publicado automaticamente.</p>
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
        <p id="caption-contador" className="mt-1 text-right text-sm text-gb-mute tabular-nums">
          {caption.length}/{muralLimits.captionMaxLength}
        </p>
        <FieldError id="caption-erro" message={errors.caption} />
      </div>

      {/* Honeypot contra robôs: invisível para pessoas. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-3 border-t-2 border-gb-ink pt-5">
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

      <button type="submit" className="focus-ring min-h-12 w-full bg-gb-red px-6 font-display text-xl font-semibold uppercase text-gb-white hover:bg-gb-red-dark sm:w-auto">
        Enviar foto para análise
      </button>
    </form>
  );
}
