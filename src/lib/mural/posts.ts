import { randomUUID } from 'node:crypto';
import type { MuralCategory as DbCategory } from '@/generated/prisma/client';
import { muralPolicyVersions } from '@/data/mural';
import { db } from '@/lib/db/client';
import { deleteObject, publicUrl, putObject } from '@/lib/storage';
import type { MuralSubmission } from '@/lib/validation/mural';
import type { MuralCategory, PublicMuralPage, PublicMuralPost } from '@/types/mural';
import type { ProcessedImage } from './image';

/**
 * Grava um envio público como PENDING. A imagem vai para o bucket privado
 * com nome aleatório; nenhuma URL pública é criada aqui.
 */
export async function createSubmission(input: MuralSubmission, image: ProcessedImage): Promise<{ id: string; status: 'PENDING' }> {
  const objectKey = `originals/${randomUUID()}.webp`;
  await putObject('private', objectKey, image.data, image.contentType);

  const now = new Date();
  const caption = input.caption?.trim() || null;
  try {
    const post = await db().muralPost.create({
      data: {
        studentName: input.senderName.trim(),
        contactType: input.contactType,
        contactValue: input.contactValue.trim(),
        caption,
        category: input.category as DbCategory,
        status: 'PENDING',
        showNamePublicly: input.showNamePublicly,
        showCaptionPublicly: caption !== null,
        originalObjectKey: objectKey,
        width: image.width,
        height: image.height,
        privacyPolicyVersion: muralPolicyVersions.privacy,
        privacyAcceptedAt: now,
        publicationConsentVersion: muralPolicyVersions.publicationConsent,
        publicationConsentAt: now,
        events: { create: { action: 'SUBMITTED', nextStatus: 'PENDING' } },
      },
      select: { id: true },
    });
    return { id: post.id, status: 'PENDING' };
  } catch (error) {
    // Sem registro no banco, a imagem não deve ficar órfã no storage.
    await deleteObject('private', objectKey).catch(() => undefined);
    throw error;
  }
}

const publicSelect = {
  id: true,
  category: true,
  studentName: true,
  showNamePublicly: true,
  caption: true,
  showCaptionPublicly: true,
  publicObjectKey: true,
  width: true,
  height: true,
} as const;

type PublicRow = {
  id: string;
  category: DbCategory;
  studentName: string;
  showNamePublicly: boolean;
  caption: string | null;
  showCaptionPublicly: boolean;
  publicObjectKey: string | null;
  width: number;
  height: number;
};

/** Só campos publicáveis; nome e legenda apenas com consentimento. */
export function toPublicPost(row: PublicRow): PublicMuralPost {
  return {
    id: row.id,
    category: row.category,
    ...(row.showNamePublicly && { studentName: row.studentName }),
    ...(row.showCaptionPublicly && row.caption && { caption: row.caption }),
    imageUrl: publicUrl(row.publicObjectKey!),
    width: row.width,
    height: row.height,
  };
}

/** Fotos aprovadas, mais recentes primeiro, com paginação por cursor. */
export async function listPublicPosts({ category, cursor, limit }: { category?: MuralCategory; cursor?: string; limit: number }): Promise<PublicMuralPage> {
  const rows = await db().muralPost.findMany({
    where: { status: 'APPROVED', publicObjectKey: { not: null }, ...(category && { category }) },
    orderBy: [{ approvedAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    select: publicSelect,
  });
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  return { items: page.map(toPublicPost), nextCursor: hasMore ? page[page.length - 1].id : null };
}

/** Pedido de retirada. Se o ID não existir, o pedido fica sem vínculo para a equipe analisar. */
export async function createRemovalRequest(input: { requesterContact: string; reason: string; postId?: string }): Promise<{ id: string }> {
  const postId = input.postId ? (await db().muralPost.findUnique({ where: { id: input.postId }, select: { id: true } }))?.id : undefined;
  return db().muralRemovalRequest.create({
    data: { requesterContact: input.requesterContact, reason: input.reason, postId },
    select: { id: true },
  });
}
