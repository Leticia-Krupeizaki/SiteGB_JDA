import type { MuralCategory, MuralStatus, Prisma, RemovalRequestStatus } from '@/generated/prisma/client';
import { db } from '@/lib/db/client';
import { getSignedUrl } from '@/lib/storage';
import { ModerationError, removePost } from './moderation';

/**
 * Consultas do painel. Ao contrário das públicas, trazem contato e dados de
 * moderação; só podem ser chamadas depois de requireAdminApi/requireAdminPage.
 */
const adminSelect = {
  id: true,
  status: true,
  category: true,
  studentName: true,
  contactType: true,
  contactValue: true,
  caption: true,
  showNamePublicly: true,
  showCaptionPublicly: true,
  originalObjectKey: true,
  width: true,
  height: true,
  privacyPolicyVersion: true,
  privacyAcceptedAt: true,
  publicationConsentVersion: true,
  publicationConsentAt: true,
  guardianAuthorizationStatus: true,
  thirdPartyRightsReviewed: true,
  approvedAt: true,
  rejectionReason: true,
  createdAt: true,
  removedAt: true,
  moderatedBy: { select: { email: true, name: true } },
  _count: { select: { removalRequests: { where: { status: 'OPEN' as const } } } },
} satisfies Prisma.MuralPostSelect;

type AdminRow = Prisma.MuralPostGetPayload<{ select: typeof adminSelect }>;

async function toAdminPost(row: AdminRow) {
  const { originalObjectKey, _count, moderatedBy, ...rest } = row;
  return {
    ...rest,
    moderatedBy: moderatedBy ? (moderatedBy.name ?? moderatedBy.email) : null,
    openRemovalRequests: _count.removalRequests,
    /** URL assinada de 5 minutos para a foto privada. */
    imageUrl: await getSignedUrl(originalObjectKey),
  };
}

export type AdminMuralPost = Awaited<ReturnType<typeof toAdminPost>>;

/** Datas do filtro em horário de Brasília (sem horário de verão desde 2019). */
const dayStart = (day: string) => new Date(`${day}T00:00:00-03:00`);
const dayEnd = (day: string) => new Date(`${day}T23:59:59.999-03:00`);

export async function listAdminPosts(filters: { status?: MuralStatus; category?: MuralCategory; from?: string; to?: string; cursor?: string; limit: number }) {
  const where: Prisma.MuralPostWhereInput = {
    ...(filters.status && { status: filters.status }),
    ...(filters.category && { category: filters.category }),
    ...((filters.from || filters.to) && {
      createdAt: { ...(filters.from && { gte: dayStart(filters.from) }), ...(filters.to && { lte: dayEnd(filters.to) }) },
    }),
  };
  // Pendentes: mais antigas primeiro (fila). Demais: mais recentes primeiro.
  const direction = filters.status === 'PENDING' || filters.status === 'AWAITING_GUARDIAN_AUTHORIZATION' ? 'asc' : 'desc';

  const [rows, counts] = await Promise.all([
    db().muralPost.findMany({
      where,
      orderBy: [{ createdAt: direction }, { id: direction }],
      take: filters.limit + 1,
      ...(filters.cursor && { cursor: { id: filters.cursor }, skip: 1 }),
      select: adminSelect,
    }),
    db().muralPost.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const hasMore = rows.length > filters.limit;
  const page = hasMore ? rows.slice(0, filters.limit) : rows;
  return {
    items: await Promise.all(page.map(toAdminPost)),
    nextCursor: hasMore ? page[page.length - 1].id : null,
    counts: Object.fromEntries(counts.map((c) => [c.status, c._count._all])) as Partial<Record<MuralStatus, number>>,
  };
}

export async function getAdminPost(id: string) {
  const row = await db().muralPost.findUnique({ where: { id }, select: adminSelect });
  return row ? toAdminPost(row) : null;
}

export async function getAuditTrail(postId: string) {
  const events = await db().muralModerationEvent.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, action: true, previousStatus: true, nextStatus: true, reason: true, createdAt: true, admin: { select: { email: true, name: true } } },
  });
  return events.map(({ admin, ...event }) => ({ ...event, admin: admin ? (admin.name ?? admin.email) : null }));
}

export async function addNote(postId: string, note: string, adminId: string) {
  const exists = await db().muralPost.findUnique({ where: { id: postId }, select: { id: true } });
  if (!exists) throw new ModerationError('NOT_FOUND', 'Foto não encontrada.');
  await db().muralModerationEvent.create({ data: { postId, adminId, action: 'NOTE', reason: note } });
}

export async function listRemovalRequests(status: RemovalRequestStatus) {
  return db().muralRemovalRequest.findMany({
    where: { status },
    orderBy: { createdAt: status === 'OPEN' ? 'asc' : 'desc' },
    take: 100,
    select: {
      id: true,
      requesterContact: true,
      reason: true,
      status: true,
      createdAt: true,
      resolvedAt: true,
      resolutionNote: true,
      postId: true,
      post: { select: { status: true, category: true } },
      resolvedBy: { select: { email: true, name: true } },
    },
  });
}

export async function resolveRemovalRequest(
  id: string,
  input: { status: 'RESOLVED' | 'DISMISSED'; resolutionNote: string; removePost: boolean },
  adminId: string,
) {
  const request = await db().muralRemovalRequest.findUnique({ where: { id }, include: { post: { select: { status: true } } } });
  if (!request) throw new ModerationError('NOT_FOUND', 'Pedido não encontrado.');
  if (request.status !== 'OPEN') throw new ModerationError('INVALID_TRANSITION', 'Este pedido já foi tratado.');

  if (input.removePost) {
    if (!request.postId) throw new ModerationError('INVALID_TRANSITION', 'O pedido não está vinculado a uma foto. Remova a foto pela lista.');
    if (request.post?.status !== 'REMOVED') {
      await removePost(request.postId, `Pedido de retirada: ${input.resolutionNote}`, { adminId });
    }
  }

  const updated = await db().muralRemovalRequest.updateMany({
    where: { id, status: 'OPEN' },
    data: { status: input.status, resolutionNote: input.resolutionNote, resolvedAt: new Date(), resolvedById: adminId },
  });
  if (updated.count === 0) throw new ModerationError('CONFLICT', 'O pedido foi tratado por outra pessoa.');
}
