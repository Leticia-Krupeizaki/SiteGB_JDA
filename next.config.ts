import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Servidor autocontido para a imagem Docker (deploy no Coolify).
  output: 'standalone',
};

export default nextConfig;
