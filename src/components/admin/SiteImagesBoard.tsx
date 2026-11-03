'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { AdminSiteImage } from '@/lib/content/site-images';
import { AdminApiError, adminFetch } from './api';
import { ConfirmDialog } from './ConfirmDialog';
import { checkImageFile, FieldError, fileInputClass, imageAccept, primaryButton, secondaryButton, textInputClass, useObjectUrl } from './contentForm';
import { formatDateTime } from './labels';
import { useToast } from './Toast';

function SlotCard({ item }: { item: AdminSiteImage }) {
  const router = useRouter();
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState(item.suggestedAlt);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [resetError, setResetError] = useState<string>();
  const preview = useObjectUrl(file);
  const id = `foto-${item.key}`;

  const choose = (chosen: File | null) => {
    const problem = chosen && checkImageFile(chosen);
    setErrors(problem ? { photo: problem } : {});
    setFile(problem ? null : chosen);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file && !item.custom) return setErrors({ photo: 'Escolha uma foto.' });
    setBusy(true);
    setErrors({});
    const form = new FormData();
    if (file) form.set('photo', file);
    form.set('alt', alt);
    try {
      await adminFetch(`/api/admin/site-images/${item.key}`, { method: 'PUT', body: form });
      toast('success', file ? `Foto "${item.label}" publicada.` : 'Texto alternativo salvo.');
      // A lista volta do servidor com nova data: o card é recriado limpo (ver `key`).
      router.refresh();
    } catch (err) {
      if (err instanceof AdminApiError && Object.keys(err.fieldErrors).length > 0) setErrors(err.fieldErrors);
      else toast('error', err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setBusy(true);
    setResetError(undefined);
    try {
      await adminFetch(`/api/admin/site-images/${item.key}`, { method: 'DELETE' });
      toast('success', item.hasDefault ? 'Imagem padrão restaurada.' : 'Foto removida do site.');
      setConfirming(false);
      router.refresh();
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setBusy(false);
    }
  };

  const shown = preview ?? item.current?.url;

  return (
    <li className="flex flex-col bg-gb-white">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gb-ink">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- prévia no painel (arquivo local ou já publicado)
          <img src={shown} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="border border-dashed border-gb-line/50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gb-line">Sem foto</span>
        )}
        {preview && <span className="absolute top-2 left-2 bg-gb-red px-2 py-1 text-xs font-bold uppercase text-gb-white">Prévia · não publicada</span>}
      </div>
      <form onSubmit={submit} className="flex flex-1 flex-col gap-3 p-4" noValidate>
        <div>
          <h3 className="font-display text-xl font-bold uppercase leading-tight">{item.label}</h3>
          <p className="mt-1 text-sm text-gb-mute">{item.hint}</p>
          <p className="mt-2 text-sm font-semibold">
            {item.custom
              ? `Enviada em ${formatDateTime(item.updatedAt!)}${item.updatedBy ? ` por ${item.updatedBy}` : ''}`
              : item.hasDefault
                ? 'Imagem padrão do site'
                : 'Sem foto: o site mostra o quadro "a definir"'}
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-arquivo`} className="text-sm font-semibold">
            {item.current ? 'Nova foto' : 'Foto'} (JPG, PNG ou WebP, até 20 MB)
          </label>
          <input
            id={`${id}-arquivo`}
            type="file"
            accept={imageAccept}
            onChange={(event) => choose(event.target.files?.[0] ?? null)}
            aria-invalid={!!errors.photo}
            aria-describedby={errors.photo ? `${id}-arquivo-erro` : undefined}
            className={fileInputClass}
          />
          <FieldError id={`${id}-arquivo-erro`} message={errors.photo} />
        </div>
        <div>
          <label htmlFor={`${id}-alt`} className="text-sm font-semibold">
            Descrição da foto (para quem usa leitor de tela)
          </label>
          <textarea
            id={`${id}-alt`}
            rows={2}
            maxLength={300}
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            aria-invalid={!!errors.alt}
            aria-describedby={errors.alt ? `${id}-alt-erro` : undefined}
            className={textInputClass}
          />
          <FieldError id={`${id}-alt-erro`} message={errors.alt} />
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <button type="submit" disabled={busy || (!file && !item.custom)} className={primaryButton}>
            {busy ? 'Enviando…' : file || !item.custom ? 'Publicar foto' : 'Salvar descrição'}
          </button>
          {item.custom && (
            <button type="button" disabled={busy} onClick={() => setConfirming(true)} className={secondaryButton}>
              {item.hasDefault ? 'Voltar ao padrão' : 'Remover foto'}
            </button>
          )}
        </div>
      </form>
      <ConfirmDialog
        open={confirming}
        title={item.hasDefault ? 'Voltar à imagem padrão?' : 'Remover a foto?'}
        description={
          item.hasDefault
            ? `"${item.label}" volta a mostrar a imagem original do site. A foto enviada é apagada.`
            : `"${item.label}" volta a mostrar o quadro "a definir". A foto enviada é apagada.`
        }
        confirmLabel={item.hasDefault ? 'Voltar ao padrão' : 'Remover'}
        danger
        busy={busy}
        error={resetError}
        onConfirm={() => void reset()}
        onCancel={() => setConfirming(false)}
      />
    </li>
  );
}

/** Todas as fotos do site, agrupadas pela página onde aparecem. */
export function SiteImagesBoard({ items }: { items: AdminSiteImage[] }) {
  const groups = [...new Set(items.map((item) => item.group))];
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-bold uppercase">Fotos do site</h1>
        <p className="mt-2 max-w-3xl text-gb-mute">
          Escolha a foto nova, confira a prévia e publique. O site mostra a troca na hora. A foto é reduzida e otimizada automaticamente, e os dados de
          localização (GPS) do arquivo são apagados.
        </p>
      </div>
      {groups.map((group, index) => (
        <section key={group} aria-labelledby={`grupo-${index}`}>
          <h2 id={`grupo-${index}`} className="font-display text-2xl font-bold uppercase text-gb-navy">
            {group}
          </h2>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <SlotCard key={`${item.key}-${item.updatedAt}`} item={item} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
