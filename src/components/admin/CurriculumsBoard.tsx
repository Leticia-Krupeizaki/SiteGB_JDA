'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { AdminCurriculum } from '@/lib/content/curriculums';
import { AdminApiError, adminFetch } from './api';
import { ConfirmDialog } from './ConfirmDialog';
import {
  checkImageFile,
  FieldError,
  fileInputClass,
  formatMonth,
  imageAccept,
  maxContentFileBytes,
  primaryButton,
  secondaryButton,
  textInputClass,
  useObjectUrl,
} from './contentForm';
import { pdfToImage } from './pdfToImage';
import { useToast } from './Toast';

function CurriculumRow({ item, month }: { item: AdminCurriculum; month: string }) {
  const router = useRouter();
  const toast = useToast();
  const [poster, setPoster] = useState<Blob | null>(null);
  const [note, setNote] = useState<string>();
  const [converting, setConverting] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(item.referenceMonth ?? month);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [resetError, setResetError] = useState<string>();
  const preview = useObjectUrl(poster);
  const id = `curriculo-${item.slug}`;

  const choose = async (file: File | null) => {
    setErrors({});
    setNote(undefined);
    setPoster(null);
    if (!file) return;
    if (file.type !== 'application/pdf') {
      const problem = checkImageFile(file);
      if (problem) return setErrors({ poster: problem });
      return setPoster(file);
    }
    if (file.size > maxContentFileBytes) return setErrors({ poster: 'O arquivo deve ter no máximo 20 MB.' });
    setConverting(true);
    try {
      const { blob, pages } = await pdfToImage(file);
      setPoster(blob);
      if (pages > 1) setNote(`O PDF tem ${pages} páginas: só a primeira vai para o site.`);
    } catch {
      setErrors({ poster: 'Não foi possível ler o PDF. Confira o arquivo ou envie uma imagem do pôster.' });
    } finally {
      setConverting(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!poster && !item.custom) return setErrors({ poster: 'Escolha o arquivo do currículo.' });
    setBusy(true);
    setErrors({});
    const form = new FormData();
    if (poster) form.set('poster', poster, 'curriculo');
    form.set('referenceMonth', referenceMonth);
    try {
      await adminFetch(`/api/admin/curriculums/${item.slug}`, { method: 'PUT', body: form });
      toast('success', poster ? `Currículo ${item.title} publicado.` : `Dados do currículo ${item.title} salvos.`);
      // A lista volta do servidor com nova data: a linha é recriada limpa (ver `key`).
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
      await adminFetch(`/api/admin/curriculums/${item.slug}`, { method: 'DELETE' });
      toast('success', `Currículo ${item.title} voltou ao original.`);
      setConfirming(false);
      router.refresh();
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="grid gap-4 bg-gb-white p-4 sm:grid-cols-[10rem_1fr]">
      <div className="relative self-start">
        {/* eslint-disable-next-line @next/next/no-img-element -- prévia no painel (arquivo local ou já publicado) */}
        <img src={preview ?? item.previewUrl} alt="" className="w-full border border-gb-line" />
        {preview && <span className="absolute top-1 left-1 bg-gb-red px-1.5 py-0.5 text-xs font-bold uppercase text-gb-white">Prévia</span>}
      </div>
      <form onSubmit={submit} noValidate className="space-y-3">
        <h3 className="font-display text-2xl font-bold uppercase leading-tight">Currículo {item.title}</h3>

        <div>
          <label htmlFor={`${id}-arquivo`} className="text-sm font-semibold">
            Novo currículo (PDF ou imagem JPG, PNG, WebP; até 20 MB)
          </label>
          <input
            id={`${id}-arquivo`}
            type="file"
            accept={`application/pdf,${imageAccept}`}
            onChange={(event) => void choose(event.target.files?.[0] ?? null)}
            aria-invalid={!!errors.poster}
            aria-describedby={errors.poster ? `${id}-arquivo-erro` : undefined}
            className={fileInputClass}
          />
          {converting && <p className="mt-1 text-sm">Lendo o PDF…</p>}
          {note && <p className="mt-1 text-sm font-semibold">{note}</p>}
          <FieldError id={`${id}-arquivo-erro`} message={errors.poster} />
        </div>

        <div className="sm:max-w-xs">
            <label htmlFor={`${id}-mes`} className="text-sm font-semibold">
              Mês de referência
            </label>
            <input
              id={`${id}-mes`}
              type="month"
              value={referenceMonth}
              onChange={(event) => setReferenceMonth(event.target.value)}
              aria-invalid={!!errors.referenceMonth}
              aria-describedby={errors.referenceMonth ? `${id}-mes-erro` : undefined}
              className={textInputClass}
            />
            <FieldError id={`${id}-mes-erro`} message={errors.referenceMonth} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy || converting || (!poster && !item.custom)} className={primaryButton}>
            {busy ? 'Enviando…' : poster || !item.custom ? 'Publicar currículo' : 'Salvar mês'}
          </button>
          {item.custom && (
            <button type="button" disabled={busy} onClick={() => setConfirming(true)} className={secondaryButton}>
              Voltar ao original
            </button>
          )}
        </div>
      </form>
      <ConfirmDialog
        open={confirming}
        title="Voltar ao pôster original?"
        description={`O currículo ${item.title} volta a mostrar o pôster que veio com o site. O arquivo enviado é apagado.`}
        confirmLabel="Voltar ao original"
        danger
        busy={busy}
        error={resetError}
        onConfirm={() => void reset()}
        onCancel={() => setConfirming(false)}
      />
    </li>
  );
}

/** Troca mensal dos pôsteres de currículo da página Programas. `month`: mês atual (AAAA-MM). */
export function CurriculumsBoard({ items, month }: { items: AdminCurriculum[]; month: string }) {
  const groups = [...new Set(items.map((item) => item.group))];
  const pending = items.filter((item) => item.referenceMonth !== month).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-bold uppercase">Currículos</h1>
        <p className="mt-2 max-w-3xl text-gb-mute">
          Envie o currículo novo de cada turma (o PDF da Gracie Barra serve: a primeira página vira imagem), confira a prévia e publique. A página
          Programas mostra a troca na hora, só para visualização, sem download.
        </p>
        <p className="mt-3 font-semibold" role="status">
          {pending === 0 ? `Todos os currículos estão em dia (${formatMonth(month)}).` : `${pending} de ${items.length} ainda sem atualização em ${formatMonth(month)}.`}
        </p>
      </div>
      {groups.map((group, index) => (
        <section key={group} aria-labelledby={`grupo-${index}`}>
          <h2 id={`grupo-${index}`} className="font-display text-2xl font-bold uppercase text-gb-navy">
            {group}
          </h2>
          <ul className="mt-4 grid gap-5 xl:grid-cols-2">
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <CurriculumRow key={`${item.slug}-${item.updatedAt}`} item={item} month={month} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
