import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';

// A área administrativa (Etapa 5) será protegida no servidor; o robots apenas evita indexação.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
