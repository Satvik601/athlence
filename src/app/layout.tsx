import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { JsonLd } from '@/components/ui/JsonLd';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { env, PLAUSIBLE_DOMAIN } from '@/lib/env';
import '@/styles/globals.css';

/*
 * Brief §6 — Display: Druk Wide / wide grotesque. Body: Söhne / Inter.
 * In a real build, next/font/local self-hosts these via /public/fonts/*.woff2.
 * For this scaffold, the fallback stack ('Anton', 'Inter', system-ui) ensures
 * the page renders correctly without the licensed files present.
 *
 * Brief §11 — exact title and description per brief.
 */

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: 'ATHLENCE — Built for Movement | BLAZE Energy',
    template: '%s | ATHLENCE',
  },
  description:
    'ATHLENCE is a performance-culture brand built for a generation obsessed with becoming better. BLAZE Energy is the first product powering the movement.',
  applicationName: 'ATHLENCE',
  authors: [{ name: 'ATHLENCE' }],
  keywords: ['ATHLENCE', 'BLAZE', 'energy drink', 'performance', 'Gen Z athletes', 'HYROX', 'movement', 'run club'],
  openGraph: {
    type: 'website',
    siteName: 'ATHLENCE',
    title: 'ATHLENCE — Built for Movement',
    description: 'The movement and the fuel. BLAZE is the first product powering it.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'ATHLENCE — Built for Movement' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATHLENCE — Built for Movement',
    description: 'The movement and the fuel.',
    images: ['/api/og'],
  },
  robots: env.NODE_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Brief §8 — preload hero poster, the LCP candidate */}
        <link rel="preload" as="image" href="/hero-poster.avif" type="image/avif" fetchPriority="high" />
        <JsonLd />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>

        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.tagged-events.js"
            strategy="afterInteractive"
          />
        )}

        {env.META_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${env.META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
