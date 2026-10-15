import type { MuralStatus } from '@/types/mural';
import type { AuditEvent, GuardianStatus, RemovalRequestStatus } from './types';

export const statusLabel: Record<MuralStatus, string> = {
  PENDING: 'Pendente',
  AWAITING_GUARDIAN_AUTHORIZATION: 'Aguardando autorização',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
  REMOVED: 'Removida',
};

/** Ordem das abas do painel. */
export const statusTabs: { id: MuralStatus; label: string }[] = [
  { id: 'PENDING', label: 'Pendentes' },
  { id: 'AWAITING_GUARDIAN_AUTHORIZATION', label: 'Aguardando autorização' },
  { id: 'APPROVED', label: 'Aprovadas' },
  { id: 'REJECTED', label: 'Rejeitadas' },
  { id: 'REMOVED', label: 'Removidas' },
];

export const guardianLabel: Record<GuardianStatus, string> = {
  NOT_EVALUATED: 'Não avaliado',
  NOT_REQUIRED: 'Não há menores na foto',
  REQUIRED_PENDING: 'Há menores · autorização pendente',
  RECEIVED: 'Há menores · autorização recebida',
};

export const actionLabel: Record<AuditEvent['action'], string> = {
  SUBMITTED: 'Enviada pelo site',
  AWAITING_GUARDIAN: 'Aguardando autorização dos responsáveis',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
  REMOVED: 'Removida do mural',
  NOTE: 'Observação interna',
};

export const removalStatusLabel: Record<RemovalRequestStatus, string> = {
  OPEN: 'Abertos',
  RESOLVED: 'Resolvidos',
  DISMISSED: 'Descartados',
};

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
