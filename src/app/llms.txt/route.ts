import { buildLlmsTxt } from '@/lib/llms';

/** /llms.txt: resumo em Markdown para IAs (padrão llmstxt.org). Gerado no build. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
