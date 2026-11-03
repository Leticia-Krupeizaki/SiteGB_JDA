import { randomUUID } from 'node:crypto';
import { cache } from 'react';
import { curriculumGroups, type Curriculum } from '@/data/curriculums';
import { db } from '@/lib/db/client';
import { putObject, publicUrl } from '@/lib/storage';
import { ContentError, contentChanged, deleteReplaced, readContent } from './cache';
import { processContentImage } from './image';

/** Mesmas medidas dos pôsteres padrão: 1800 px para ler, miniatura para o card. */
const posterSizes = { full: { width: 1800 }, preview: { width: 800 } };

const allCurriculums = curriculumGroups.flatMap((group) => group.items);

type StoredPoster = Pick<Curriculum, 'slug' | 'version' | 'referenceMonth' | 'preview' | 'full'>;

async function loadStored(): Promise<StoredPoster[]> {
  const rows = await db().curriculumPoster.findMany();
  return rows.map((row) => ({
    slug: row.slug,
    version: row.version,
    referenceMonth: row.referenceMonth ?? undefined,
    preview: { src: publicUrl(row.previewKey), width: row.previewWidth, height: row.previewHeight },
    full: { src: publicUrl(row.fullKey), width: row.fullWidth, height: row.fullHeight },
  }));
}

/** Grupos de currículos com os pôsteres enviados pelo painel no lugar dos padrões. */
export const getCurriculumGroups = cache(async () => {
  const stored = new Map((await readContent('curriculums', loadStored, [])).map((poster) => [poster.slug, poster]));
  return curriculumGroups.map((group) => ({
    ...group,
    items: group.items.map((item): Curriculum => {
      const poster = stored.get(item.slug);
      return poster ? { ...item, ...poster, custom: true } : item;
    }),
  }));
});

export type AdminCurriculum = {
  slug: string;
  group: string;
  title: string;
  version: string;
  referenceMonth: string | null;
  previewUrl: string;
  custom: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

/** Lista do painel, sempre direto do banco. */
export async function listCurriculumsForAdmin(): Promise<AdminCurriculum[]> {
  const rows = await db().curriculumPoster.findMany({ include: { updatedBy: { select: { name: true, email: true } } } });
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return curriculumGroups.flatMap((group) =>
    group.items.map((item) => {
      const row = bySlug.get(item.slug);
      return {
        slug: item.slug,
        group: group.title,
        title: item.title,
        version: row?.version ?? item.version,
        referenceMonth: row?.referenceMonth ?? null,
        previewUrl: row ? publicUrl(row.previewKey) : item.preview.src,
        custom: !!row,
        updatedAt: row?.updatedAt.toISOString() ?? null,
        updatedBy: row ? (row.updatedBy?.name ?? row.updatedBy?.email ?? null) : null,
      };
    }),
  );
}

function curriculumOrThrow(slug: string) {
  const item = allCurriculums.find((curriculum) => curriculum.slug === slug);
  if (!item) throw new ContentError(404, 'NOT_FOUND', 'Currículo não encontrado.');
  return item;
}

/**
 * Publica um pôster novo (ou só atualiza versão e mês, se `poster` vier vazio e o
 * currículo já tiver pôster enviado). Os arquivos antigos saem do storage depois.
 */
export async function saveCurriculum(
  slug: string,
  input: { poster: Uint8Array | null; version: string | null; referenceMonth: string | null },
  adminId: string,
): Promise<void> {
  const item = curriculumOrThrow(slug);
  const previous = await db().curriculumPoster.findUnique({ where: { slug } });
  // Sem versão no envio, mantém a que já estava (enviada antes ou a do pôster padrão).
  const version = input.version ?? previous?.version ?? item.version;
  const meta = { version, referenceMonth: input.referenceMonth, updatedById: adminId };

  if (!input.poster) {
    if (!previous) throw new ContentError(422, 'PHOTO_REQUIRED', 'Escolha o arquivo do currículo.', { poster: 'Escolha o arquivo do currículo.' });
    await db().curriculumPoster.update({ where: { slug }, data: meta });
    contentChanged();
    return;
  }

  // Qualidade alta: o texto do pôster é pequeno.
  const [full, preview] = await processContentImage(input.poster, [posterSizes.full, posterSizes.preview], 88);
  const fullKey = `curriculos/${randomUUID()}.webp`;
  const previewKey = `curriculos/${randomUUID()}.webp`;
  await putObject('public', fullKey, full.data, full.contentType);
  await putObject('public', previewKey, preview.data, preview.contentType);
  const data = {
    ...meta,
    fullKey,
    fullWidth: full.width,
    fullHeight: full.height,
    previewKey,
    previewWidth: preview.width,
    previewHeight: preview.height,
  };
  try {
    await db().curriculumPoster.upsert({ where: { slug }, create: { slug, ...data }, update: data });
  } catch (error) {
    await Promise.all([deleteReplaced(fullKey), deleteReplaced(previewKey)]);
    throw error;
  }
  if (previous) await Promise.all([deleteReplaced(previous.fullKey), deleteReplaced(previous.previewKey)]);
  contentChanged();
}

/** Volta ao pôster padrão do código. */
export async function resetCurriculum(slug: string): Promise<void> {
  curriculumOrThrow(slug);
  const previous = await db().curriculumPoster.findUnique({ where: { slug } });
  if (!previous) return;
  await db().curriculumPoster.delete({ where: { slug } });
  await Promise.all([deleteReplaced(previous.fullKey), deleteReplaced(previous.previewKey)]);
  contentChanged();
}
