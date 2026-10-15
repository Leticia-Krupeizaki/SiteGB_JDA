import { NextResponse } from 'next/server';
import { logServerError } from '@/lib/api/errors';
import { db } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Healthcheck do container: o app responde e alcança o banco. Sem detalhes na resposta. */
export async function GET() {
  try {
    await db().$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    logServerError('GET /api/health', error);
    return NextResponse.json({ ok: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
