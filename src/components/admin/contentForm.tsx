'use client';

import { useEffect, useState } from 'react';

/** Peças comuns dos formulários de conteúdo (fotos do site e currículos). */

export const maxContentFileBytes = 20 * 1024 * 1024;
export const imageAccept = 'image/jpeg,image/png,image/webp';

export const primaryButton = 'focus-ring min-h-11 bg-gb-ink px-4 font-display font-semibold uppercase text-gb-white hover:bg-gb-navy disabled:opacity-50';
export const secondaryButton = 'focus-ring min-h-11 border-2 border-gb-ink px-4 font-display font-semibold uppercase disabled:opacity-50';
export const fileInputClass =
  'focus-ring mt-1 block w-full text-sm file:mr-4 file:min-h-11 file:border-0 file:bg-gb-ink file:px-4 file:font-semibold file:text-gb-white';
export const textInputClass = 'focus-ring mt-1 block w-full border-2 border-gb-line px-3 py-2';

/** URL local para pré-visualizar o arquivo escolhido (liberada ao trocar ou sair). */
export function useObjectUrl(blob: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) return setUrl(null);
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}

/** Checagem rápida no navegador; o servidor confere de verdade (magic bytes, decodificação). */
export function checkImageFile(file: File): string | null {
  if (!imageAccept.split(',').includes(file.type)) return 'Envie uma imagem em JPG, PNG ou WebP.';
  if (file.size > maxContentFileBytes) return 'O arquivo deve ter no máximo 20 MB.';
  return null;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm font-semibold text-gb-red">
      {message}
    </p>
  );
}

const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2026-11" → "novembro de 2026". */
export const formatMonth = (month: string) => monthName.format(new Date(`${month}-01T00:00:00Z`));
