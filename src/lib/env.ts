import { z } from 'zod';

/*
 * Brief §13 — Env validation. Throws in production, warns in dev.
 * Every secret is optional at boot so dev can run without all integrations
 * wired; production CI sets all required vars or fails the build.
 */
const schema = z.object({
  SITE_URL: z.string().url().default('https://athlence.com'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  SANITY_PROJECT_ID: z.string().optional(),
  SANITY_DATASET: z.string().default('production'),
  SANITY_API_READ_TOKEN: z.string().optional(),
  SANITY_PREVIEW_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  CONVERTKIT_API_KEY: z.string().optional(),
  CONVERTKIT_FORM_ID: z.string().optional(),

  INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
  INSTAGRAM_USER_ID: z.string().optional(),

  META_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),

  KV_REST_API_URL: z.string().optional(),
  KV_REST_API_TOKEN: z.string().optional(),

  ALLOWED_SIGNUP_ORIGINS: z.string().optional(),
});

const parsed = schema.safeParse({
  SITE_URL: process.env.SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  SANITY_DATASET: process.env.SANITY_DATASET,
  SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
  SANITY_PREVIEW_SECRET: process.env.SANITY_PREVIEW_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONVERTKIT_API_KEY: process.env.CONVERTKIT_API_KEY,
  CONVERTKIT_FORM_ID: process.env.CONVERTKIT_FORM_ID,
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_USER_ID: process.env.INSTAGRAM_USER_ID,
  META_PIXEL_ID: process.env.META_PIXEL_ID,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  ALLOWED_SIGNUP_ORIGINS: process.env.ALLOWED_SIGNUP_ORIGINS,
});

if (!parsed.success) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables: ' + JSON.stringify(parsed.error.flatten(), null, 2));
  } else {
    console.warn('[env] some env vars missing; using defaults', parsed.error.flatten());
  }
}

export const env = parsed.success ? parsed.data : schema.parse({});
export const PLAUSIBLE_DOMAIN = env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
