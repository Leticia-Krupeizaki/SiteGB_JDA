import type { Metadata } from 'next';
import { SiteImagesBoard } from '@/components/admin/SiteImagesBoard';
import { contentRoles, requireAdminPage } from '@/lib/auth/guard';
import { listSiteImagesForAdmin } from '@/lib/content/site-images';

export const metadata: Metadata = { title: 'Fotos do site' };

export default async function FotosPage() {
  await requireAdminPage(contentRoles);
  return <SiteImagesBoard items={await listSiteImagesForAdmin()} />;
}
