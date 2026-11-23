import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Site 100% estático: `npm run build` gera HTML, CSS, JS e imagens em out/.
  output: 'export',
  // Sem servidor não há otimizador de imagens: os arquivos em src/assets e public/
  // já são publicados no tamanho certo (ver src/data/site-images.ts).
  images: { unoptimized: true },
};

export default nextConfig;
