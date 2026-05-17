import { z } from 'zod';
import { NextResponse } from 'next/server';
import { subscribe } from '@/lib/esp';
import { env } from '@/lib/env';

/*
 * Brief §12 — /api/signup
 *   - Zod validation (server-side, mirrors client)
 *   - Honeypot check (silent reject)
 *   - Rate limit 5/min/IP via Vercel KV
 *   - Calls ESP adapter (Resend / ConvertKit)
 *   - utm_source tagged from cookie
 *   - Double opt-in handled by ESP (or manual confirmation email)
 */

export const runtime = 'edge';

const schema = z.object({
  firstName: z.string().max(40).optional(),
  email: z.string().email(),
  city: z.string().max(60).optional(),
  url: z.string().max(0).optional(), // honeypot
});

async function rateLimit(ip: string): Promise<boolean> {
  if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) return true; // no KV = allow
  try {
    const key = `rl:signup:${ip}`;
    const r = await fetch(`${env.KV_REST_API_URL}/incr/${key}`, {
      headers: { Authorization: `Bearer ${env.KV_REST_API_TOKEN}` },
    });
    const { result } = (await r.json()) as { result: number };
    if (result === 1) {
      await fetch(`${env.KV_REST_API_URL}/expire/${key}/60`, {
        headers: { Authorization: `Bearer ${env.KV_REST_API_TOKEN}` },
      });
    }
    return result <= 5;
  } catch {
    return true; // fail-open on KV outage
  }
}

function readCookie(cookieHeader: string, name: string): string | undefined {
  const m = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';
  const allowed = await rateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (parsed.data.url) {
    // Honeypot — silent success to confuse bots
    return NextResponse.json({ ok: true });
  }

  const utmSource = readCookie(req.headers.get('cookie') ?? '', 'utm_source');
  const result = await subscribe({
    email: parsed.data.email,
    firstName: parsed.data.firstName,
    city: parsed.data.city,
    utmSource,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? 'esp_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
