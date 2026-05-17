/*
 * Brief §12 — Conversion events fired to Meta Pixel + analytics tool:
 *   hero_cta_click, signup_started, signup_completed, ig_follow_click
 *
 * Single dispatcher so the rest of the app doesn't import third parties.
 */

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
    fbq?: (cmd: string, name: string, props?: Record<string, string>) => void;
  }
}

export type AnalyticsEvent = 'hero_cta_click' | 'signup_started' | 'signup_completed' | 'ig_follow_click';

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function track(event: AnalyticsEvent, props: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  const utm = readCookie('utm_source');
  const enriched = utm ? { ...props, utm_source: utm } : props;
  try {
    window.plausible?.(event, { props: enriched });
    window.fbq?.('trackCustom', event, enriched);
  } catch (err) {
    // Never let analytics break the page
    console.warn('[analytics]', err);
  }
}
