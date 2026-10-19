import Image from 'next/image';
import selo from '@/assets/selo-escola-premium-2026.jpg';

/**
 * Selo "Escola Premium · Certificação 2026" da Gracie Barra, arquivo enviado
 * pelo cliente (original em assets/marca/). É um JPG com cantos pretos, sem
 * transparência: usar SÓ sobre fundo preto. `mix-blend-lighten` deixa o preto
 * dos cantos sumir sobre a textura do fundo sem alterar o dourado nem o branco.
 * Não sobrepor nada ao selo nem distorcer (regras da marca, p. 18–19).
 */
export function PremiumSeal({ className = '', priority = false, sizes }: { className?: string; priority?: boolean; sizes: string }) {
  return (
    <Image
      src={selo}
      alt="Selo Escola Premium Gracie Barra, certificação 2026"
      sizes={sizes}
      priority={priority}
      className={`aspect-square h-auto mix-blend-lighten ${className}`}
    />
  );
}
