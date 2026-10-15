import type { Metadata } from 'next';
import { ModerationBoard } from '@/components/admin/ModerationBoard';
import { isUuid } from '@/lib/api/admin';

export const metadata: Metadata = { title: 'Fotos do mural' };

export default async function AdminMuralPage({ searchParams }: { searchParams: Promise<{ foto?: string }> }) {
  const { foto } = await searchParams;
  return <ModerationBoard initialPostId={foto && isUuid(foto) ? foto : undefined} />;
}
