import { getSiteImages } from '@/lib/content/site-images';
import { SitePhoto } from './SitePhoto';

/**
 * Selo "Escola Premium · Certificação 2026" da Gracie Barra, arquivo enviado
 * pelo cliente (original em assets/marca/; trocável no painel, ex.: selo do ano
 * seguinte). É um JPG com cantos pretos, sem transparência: usar SÓ sobre fundo
 * preto. `mix-blend-lighten` deixa o preto dos cantos sumir sobre a textura do
 * fundo sem alterar o dourado nem o branco.
 * Não sobrepor nada ao selo nem distorcer (regras da marca, p. 18–19).
 */
export async function PremiumSeal({ className = '', priority = false, sizes }: { className?: string; priority?: boolean; sizes: string }) {
  const seal = (await getSiteImages())['marca-selo-premium'];
  if (!seal) return null;
  return <SitePhoto image={seal} sizes={sizes} priority={priority} className={`aspect-square h-auto object-contain mix-blend-lighten ${className}`} />;
}
