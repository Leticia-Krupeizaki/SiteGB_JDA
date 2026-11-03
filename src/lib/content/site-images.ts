import { randomUUID } from 'node:crypto';
import type { StaticImageData } from 'next/image';
import { cache } from 'react';
import { siteImageSlotByKey, siteImageSlots } from '@/data/site-images';
import { db } from '@/lib/db/client';
import { putObject, publicUrl } from '@/lib/storage';
import { ContentError, contentChanged, deleteReplaced, readContent } from './cache';
import { processContentImage } from './image';

/**
 * Foto pronta para o site. `custom`: veio do painel (arquivo no storage, já no
 * tamanho certo, então vai com `unoptimized`); senão é a imagem padrão do código.
 */
export type SiteImage = { src: StaticImageData; alt: string; custom: boolean };

type StoredImage = { slot: string; url: string; width: number; height: number; alt: string };

async function loadStored(): Promise<StoredImage[]> {
  const rows = await db().siteImage.findMany();
  return rows.map((row) => ({ slot: row.slot, url: publicUrl(row.objectKey), width: row.width, height: row.height, alt: row.alt }));
}

/** Foto de cada espaço (enviada pelo painel ou padrão); `null` = ainda sem foto. */
export const getSiteImages = cache(async (): Promise<Record<string, SiteImage | null>> => {
  const stored = new Map((await readContent('site-images', loadStored, [])).map((image) => [image.slot, image]));
  return Object.fromEntries(
    siteImageSlots.map((slot) => {
      const image = stored.get(slot.key);
      if (image) return [slot.key, { src: { src: image.url, width: image.width, height: image.height }, alt: image.alt, custom: true }];
      return [slot.key, slot.default && { ...slot.default, custom: false }];
    }),
  );
});

export type AdminSiteImage = {
  key: string;
  group: string;
  label: string;
  hint: string;
  suggestedAlt: string;
  /** Imagem que o site mostra agora (enviada ou padrão). */
  current: null | { url: string; alt: string };
  custom: boolean;
  hasDefault: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

/** Lista do painel, sempre direto do banco. */
export async function listSiteImagesForAdmin(): Promise<AdminSiteImage[]> {
  const rows = await db().siteImage.findMany({ include: { updatedBy: { select: { name: true, email: true } } } });
  const bySlot = new Map(rows.map((row) => [row.slot, row]));
  return siteImageSlots.map((slot) => {
    const row = bySlot.get(slot.key);
    const current = row ? { url: publicUrl(row.objectKey), alt: row.alt } : slot.default && { url: slot.default.src.src, alt: slot.default.alt };
    return {
      key: slot.key,
      group: slot.group,
      label: slot.label,
      hint: slot.hint,
      suggestedAlt: current?.alt ?? slot.suggestedAlt ?? '',
      current,
      custom: !!row,
      hasDefault: !!slot.default,
      updatedAt: row?.updatedAt.toISOString() ?? null,
      updatedBy: row ? (row.updatedBy?.name ?? row.updatedBy?.email ?? null) : null,
    };
  });
}

function slotOrThrow(key: string) {
  const slot = siteImageSlotByKey.get(key);
  if (!slot) throw new ContentError(404, 'NOT_FOUND', 'Espaço de foto não encontrado.');
  return slot;
}

/**
 * Troca a foto de um espaço (ou só o texto alternativo, se `photo` vier vazio e o
 * espaço já tiver foto enviada). A foto antiga sai do storage depois que o banco
 * já aponta para a nova.
 */
export async function saveSiteImage(key: string, input: { photo: Uint8Array | null; alt: string }, adminId: string): Promise<void> {
  const slot = slotOrThrow(key);
  const previous = await db().siteImage.findUnique({ where: { slot: key } });

  if (!input.photo) {
    if (!previous) throw new ContentError(422, 'PHOTO_REQUIRED', 'Escolha uma foto.', { photo: 'Escolha uma foto.' });
    await db().siteImage.update({ where: { slot: key }, data: { alt: input.alt, updatedById: adminId } });
    contentChanged();
    return;
  }

  const [image] = await processContentImage(input.photo, [{ width: slot.maxSide, height: slot.maxSide }], 82);
  const objectKey = `site/${randomUUID()}.webp`;
  await putObject('public', objectKey, image.data, image.contentType);
  const data = { objectKey, width: image.width, height: image.height, alt: input.alt, updatedById: adminId };
  try {
    await db().siteImage.upsert({ where: { slot: key }, create: { slot: key, ...data }, update: data });
  } catch (error) {
    await deleteReplaced(objectKey);
    throw error;
  }
  if (previous) await deleteReplaced(previous.objectKey);
  contentChanged();
}

/** Volta à imagem padrão do código (ou ao quadro "a definir", se não houver). */
export async function resetSiteImage(key: string): Promise<void> {
  slotOrThrow(key);
  const previous = await db().siteImage.findUnique({ where: { slot: key } });
  if (!previous) return;
  await db().siteImage.delete({ where: { slot: key } });
  await deleteReplaced(previous.objectKey);
  contentChanged();
}
