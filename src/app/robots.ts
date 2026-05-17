import type { MetadataRoute } from 'next';

/*
 * Brief §11 — robots.txt generated at build time.
 * Brief §14 — staging environments must not be indexed.
 *
 * VERCEL_ENV is set automatically on Vercel:
 *   - 'production' on the production branch
 *   - 'preview' on PR/branch deploys
 *   - 'development' locally
 *
 * Only production gets crawlable. Everything else returns Disallow: /.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || 'https://athlence.com';
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
