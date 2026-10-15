import type { NextConfig } from 'next';

/** Domínio de leitura do bucket público (fotos aprovadas do mural), liberado no next/image. */
function publicStoragePattern() {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (!base) return [];
  const url = new URL(base);
  return [
    {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/$/, '')}/**`,
    },
  ];
}

const nextConfig: NextConfig = {
  images: { remotePatterns: publicStoragePattern() },
};

export default nextConfig;
