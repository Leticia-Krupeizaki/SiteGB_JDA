import { categoryLabel } from '@/data/mural';
import type { PublicMuralPost } from '@/types/mural';

const tones = ['bg-gb-navy', 'bg-gb-ink', 'bg-gb-navy-dark'];

/** Quadro gráfico no lugar da foto, enquanto não houver fotos aprovadas reais. */
export function DemoPhotoTile({ post, index, large = false }: { post: PublicMuralPost; index: number; large?: boolean }) {
  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden p-4 text-gb-white ${tones[index % tones.length]}`}
      style={{ aspectRatio: post.aspectRatio }}
    >
      <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_12px)]" />
      <span className="relative self-start border border-dashed border-gb-line/60 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
        Exemplo
      </span>
      <span className={`relative font-display font-bold uppercase ${large ? 'text-5xl' : 'text-2xl'}`}>{categoryLabel[post.category]}</span>
    </div>
  );
}
