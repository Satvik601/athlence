import type { MetadataRoute } from 'next';

/*
 * Brief §11 — sitemap.xml generated at build time.
 * Anchors are not separately listed (Google handles in-page anchors via the
 * homepage entry).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || 'https://athlence.com';
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
