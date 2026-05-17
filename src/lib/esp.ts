import { env } from './env';

/*
 * Brief §12 — Email capture pushes to chosen ESP (ConvertKit / Klaviyo / Resend)
 * with utm_source tag. Double opt-in confirmation, branded.
 *
 * Adapter pattern lets the deploy choose which ESP to use without code changes.
 */

export type SubscribeInput = {
  email: string;
  firstName?: string;
  city?: string;
  utmSource?: string;
};

export async function subscribe(input: SubscribeInput): Promise<{ ok: boolean; error?: string }> {
  // ConvertKit — native double opt-in via form
  if (env.CONVERTKIT_API_KEY && env.CONVERTKIT_FORM_ID) {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${env.CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: env.CONVERTKIT_API_KEY,
        email: input.email,
        first_name: input.firstName,
        fields: { city: input.city, utm_source: input.utmSource },
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: 'esp_failed' };
  }

  // Resend — manual double opt-in via confirmation email
  if (env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ATHLENCE <movement@athlence.com>',
        to: input.email,
        subject: "Confirm you're in.",
        html: confirmationHtml(input),
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: 'esp_failed' };
  }

  // No ESP configured — accept locally (dev mode), log warning
  console.warn('[esp] No ESP configured; signup accepted but not persisted:', input.email);
  return { ok: true };
}

function confirmationHtml(input: SubscribeInput): string {
  return `
    <div style="font-family:Söhne,Inter,system-ui,sans-serif;background:#0a0a0b;color:#eff2f5;padding:48px 24px;max-width:560px;margin:0 auto">
      <p style="font-family:'Druk Wide','Anton',sans-serif;font-size:28px;letter-spacing:0.02em;text-transform:uppercase;color:#e11d2a;margin:0 0 16px">ATHLENCE</p>
      <h1 style="font-family:'Druk Wide','Anton',sans-serif;font-size:40px;letter-spacing:-0.01em;line-height:1.05;text-transform:uppercase;margin:0 0 24px">Welcome to the movement.</h1>
      <p style="font-size:16px;line-height:1.6;color:#c7ccd1;margin:0 0 24px">
        ${input.firstName ? `${input.firstName}, ` : ''}you're early. So is BLAZE.
      </p>
      <p style="font-size:16px;line-height:1.6;color:#c7ccd1;margin:0 0 32px">
        Click below to confirm your spot. We'll send launch news, drops, and run-club invites — nothing else.
      </p>
      <a href="https://athlence.com/api/confirm?email=${encodeURIComponent(input.email)}" style="display:inline-block;background:#e11d2a;color:#fff;text-decoration:none;padding:16px 28px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">Confirm</a>
      <p style="font-size:12px;color:#5a5f66;margin:48px 0 0;letter-spacing:0.1em;text-transform:uppercase">BLAZE · The first product from ATHLENCE.</p>
    </div>`;
}
