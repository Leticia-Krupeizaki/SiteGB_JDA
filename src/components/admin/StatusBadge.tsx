import type { MuralStatus } from '@/types/mural';
import { statusLabel } from './labels';

const tones: Record<MuralStatus, string> = {
  PENDING: 'border-gb-ink bg-gb-white text-gb-ink',
  AWAITING_GUARDIAN_AUTHORIZATION: 'border-gb-navy bg-gb-white text-gb-navy',
  APPROVED: 'border-gb-navy bg-gb-navy text-gb-white',
  REJECTED: 'border-gb-red bg-gb-white text-gb-red',
  REMOVED: 'border-gb-mute bg-gb-line text-gb-mute',
};

export function StatusBadge({ status }: { status: MuralStatus }) {
  return <span className={`inline-block border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${tones[status]}`}>{statusLabel[status]}</span>;
}
