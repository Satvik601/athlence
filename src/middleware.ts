import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
 * Brief §12 — Track utm_source through to ESP.
 *
 * Captures the first-touch utm_source on landing and stores it in a cookie
 * for 30 days. The signup endpoint reads this cookie and forwards the value
 * to the ESP as a subscriber field — closing the campaign-attribution loop.
 *
 * Same logic for utm_medium / utm_campaign — kept lean to one cookie per param.
 *
 * Runs on the Edge for zero overhead; skipped for static assets and the API.
 */

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;

  for (const key of UTM_PARAMS) {
    const value = url.searchParams.get(key);
    if (value && !req.cookies.get(key)) {
      res.cookies.set(key, value, {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        httpOnly: false, // analytics in client needs to read
        sameSite: 'lax',
        secure: true,
      });
    }
  }

  return res;
}

export const config = {
  // Skip Next internals, API routes (they read the cookie themselves) and
  // image optimisation. Everything else passes through to capture UTMs.
  matcher: ['/((?!_next/static|_next/image|favicon|api|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|gif|mp4|webm)$).*)'],
};
