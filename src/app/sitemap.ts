import type { MetadataRoute } from 'next';
import { mainNavigation } from '@/config/navigation';
import { siteUrl } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return mainNavigation.map((item) => ({
    url: new URL(item.href, siteUrl).toString(),
    changeFrequency: item.href === '/horarios' ? 'monthly' : 'yearly',
    priority: item.href === '/' ? 1 : 0.7,
  }));
}
