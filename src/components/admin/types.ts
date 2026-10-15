import type { ContactType, MuralCategory, MuralStatus } from '@/types/mural';

/** Formatos que o painel recebe das APIs /api/admin (datas chegam como texto ISO). */
export type GuardianStatus = 'NOT_EVALUATED' | 'NOT_REQUIRED' | 'REQUIRED_PENDING' | 'RECEIVED';

export type AdminPost = {
  id: string;
  status: MuralStatus;
  category: MuralCategory;
  studentName: string;
  contactType: ContactType;
  contactValue: string;
  caption: string | null;
  showNamePublicly: boolean;
  showCaptionPublicly: boolean;
  width: number;
  height: number;
  privacyPolicyVersion: string;
  privacyAcceptedAt: string;
  publicationConsentVersion: string;
  publicationConsentAt: string;
  guardianAuthorizationStatus: GuardianStatus;
  thirdPartyRightsReviewed: boolean;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  removedAt: string | null;
  moderatedBy: string | null;
  openRemovalRequests: number;
  imageUrl: string;
};

export type AdminPostPage = { items: AdminPost[]; nextCursor: string | null; counts: Partial<Record<MuralStatus, number>> };

export type AuditEvent = {
  id: string;
  action: 'SUBMITTED' | 'AWAITING_GUARDIAN' | 'APPROVED' | 'REJECTED' | 'REMOVED' | 'NOTE';
  previousStatus: MuralStatus | null;
  nextStatus: MuralStatus | null;
  reason: string | null;
  createdAt: string;
  admin: string | null;
};

export type RemovalRequestStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export type AdminRemovalRequest = {
  id: string;
  requesterContact: string;
  reason: string;
  status: RemovalRequestStatus;
  createdAt: string;
  resolvedAt: string | null;
  resolutionNote: string | null;
  postId: string | null;
  post: { status: MuralStatus; category: MuralCategory } | null;
  resolvedBy: { email: string; name: string | null } | null;
};
