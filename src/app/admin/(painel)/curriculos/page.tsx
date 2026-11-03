import type { Metadata } from 'next';
import { CurriculumsBoard } from '@/components/admin/CurriculumsBoard';
import { contentRoles, requireAdminPage } from '@/lib/auth/guard';
import { listCurriculumsForAdmin } from '@/lib/content/curriculums';
import { academyTimeZone } from '@/lib/schedule';

export const metadata: Metadata = { title: 'Currículos' };

/** Mês atual no fuso da academia, AAAA-MM. */
function currentMonth(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: academyTimeZone, year: 'numeric', month: '2-digit' }).format(new Date()).slice(0, 7);
}

export default async function CurriculosPage() {
  await requireAdminPage(contentRoles);
  return <CurriculumsBoard items={await listCurriculumsForAdmin()} month={currentMonth()} />;
}
