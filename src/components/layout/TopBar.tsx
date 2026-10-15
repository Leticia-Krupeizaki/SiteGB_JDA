import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { LockIcon } from '@/components/ui/icons';

/**
 * Faixa fina acima do cabeçalho com o acesso da equipe ao painel. Fica fora do
 * cabeçalho para não disputar espaço com o menu. A proteção do painel é o
 * login (senha com hash, limite de tentativas), não esconder o endereço.
 */
export function TopBar() {
  return (
    <div className="bg-gb-ink text-gb-line">
      <Container className="flex h-9 items-center">
        <Link
          href="/admin/login"
          rel="nofollow"
          className="focus-ring inline-flex min-h-8 items-center gap-1.5 border border-white/25 px-2.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors hover:border-gb-white hover:text-gb-white"
        >
          <LockIcon className="h-3.5 w-3.5" />
          Entrar
          <span className="sr-only"> na área administrativa</span>
        </Link>
      </Container>
    </div>
  );
}
