import { randomUUID } from 'node:crypto';
import type { GuardianAuthorizationStatus, MuralStatus } from '@/generated/prisma/client';
import { db } from '@/lib/db/client';
import { deleteObject, getObjectBytes, putObject } from '@/lib/storage';
import { makePublicDerivative } from './image';

/**
 * Transições de moderação (spec §9.6 e §9.7). Base do painel da Etapa 5.
 * Toda transição é atômica (`where: { id, status }`) e gera MuralModerationEvent.
 */
export class ModerationError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'INVALID_TRANSITION' | 'AUTHORIZATION_REQUIRED' | 'REASON_REQUIRED' | 'CONFLICT',
    message: string,
  ) {
    super(message);
  }
}

type Actor = { adminId?: string | null };

const reviewable: MuralStatus[] = ['PENDING', 'AWAITING_GUARDIAN_AUTHORIZATION'];

async function load(id: string) {
  const post = await db().muralPost.findUnique({ where: { id } });
  if (!post) throw new ModerationError('NOT_FOUND', 'Foto não encontrada.');
  return post;
}

/** Muda o status só se ainda estiver como lido; senão outra pessoa moderou antes. */
async function transition(
  id: string,
  from: MuralStatus,
  to: MuralStatus,
  action: 'AWAITING_GUARDIAN' | 'APPROVED' | 'REJECTED' | 'REMOVED',
  data: Record<string, unknown>,
  { adminId }: Actor,
  reason?: string,
) {
  await db().$transaction(async (tx) => {
    const updated = await tx.muralPost.updateMany({ where: { id, status: from }, data: { ...data, status: to } });
    if (updated.count === 0) throw new ModerationError('CONFLICT', 'A foto foi moderada por outra pessoa. Atualize a lista.');
    await tx.muralModerationEvent.create({
      data: { postId: id, adminId: adminId ?? null, action, previousStatus: from, nextStatus: to, reason: reason ?? null },
    });
  });
}

export async function markAwaitingGuardian(id: string, actor: Actor = {}, reason?: string) {
  const post = await load(id);
  if (post.status !== 'PENDING') throw new ModerationError('INVALID_TRANSITION', 'Só fotos pendentes podem aguardar autorização.');
  await transition(id, post.status, 'AWAITING_GUARDIAN_AUTHORIZATION', 'AWAITING_GUARDIAN', { guardianAuthorizationStatus: 'REQUIRED_PENDING' }, actor, reason);
}

/**
 * Aprova e gera o derivado público. Exige revisão de direitos de terceiros e
 * autorização de responsáveis resolvida (não exigida ou recebida).
 */
export async function approvePost(
  id: string,
  review: { guardianAuthorizationStatus: GuardianAuthorizationStatus; thirdPartyRightsReviewed: boolean },
  actor: Actor = {},
) {
  const post = await load(id);
  if (!reviewable.includes(post.status)) throw new ModerationError('INVALID_TRANSITION', 'Esta foto não está aguardando moderação.');
  if (!review.thirdPartyRightsReviewed) throw new ModerationError('AUTHORIZATION_REQUIRED', 'Confirme a revisão dos direitos de imagem.');
  if (review.guardianAuthorizationStatus !== 'NOT_REQUIRED' && review.guardianAuthorizationStatus !== 'RECEIVED') {
    throw new ModerationError('AUTHORIZATION_REQUIRED', 'A autorização dos responsáveis ainda não foi resolvida.');
  }

  const derivative = await makePublicDerivative(await getObjectBytes('private', post.originalObjectKey));
  const publicKey = `mural/${randomUUID()}.webp`;
  await putObject('public', publicKey, derivative.data, derivative.contentType);

  try {
    await transition(
      id,
      post.status,
      'APPROVED',
      'APPROVED',
      {
        publicObjectKey: publicKey,
        width: derivative.width,
        height: derivative.height,
        guardianAuthorizationStatus: review.guardianAuthorizationStatus,
        thirdPartyRightsReviewed: true,
        approvedAt: new Date(),
        moderatedById: actor.adminId ?? null,
      },
      actor,
    );
  } catch (error) {
    await deleteObject('public', publicKey).catch(() => undefined);
    throw error;
  }
}

export async function rejectPost(id: string, reason: string, actor: Actor = {}) {
  if (!reason.trim()) throw new ModerationError('REASON_REQUIRED', 'Informe o motivo da rejeição.');
  const post = await load(id);
  if (!reviewable.includes(post.status)) throw new ModerationError('INVALID_TRANSITION', 'Esta foto não está aguardando moderação.');
  await transition(id, post.status, 'REJECTED', 'REJECTED', { rejectionReason: reason.trim(), moderatedById: actor.adminId ?? null }, actor, reason.trim());
}

/** Retira do mural e apaga o derivado público. O original privado segue a política de retenção. */
export async function removePost(id: string, reason: string, actor: Actor = {}) {
  const post = await load(id);
  if (post.status === 'REMOVED') throw new ModerationError('INVALID_TRANSITION', 'A foto já foi removida.');
  await transition(id, post.status, 'REMOVED', 'REMOVED', { publicObjectKey: null, removedAt: new Date(), moderatedById: actor.adminId ?? null }, actor, reason);
  if (post.publicObjectKey) await deleteObject('public', post.publicObjectKey);
}
