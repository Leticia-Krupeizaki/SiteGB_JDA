import type { Metadata } from 'next';
import { RemovalRequestsBoard } from '@/components/admin/RemovalRequestsBoard';

export const metadata: Metadata = { title: 'Pedidos de retirada' };

export default function RetiradasPage() {
  return <RemovalRequestsBoard />;
}
