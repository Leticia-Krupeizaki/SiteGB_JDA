import { NextResponse } from 'next/server';
import { muralCategories } from '@/data/mural';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({ items: muralCategories });
}
