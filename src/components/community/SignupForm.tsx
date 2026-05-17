'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { track } from '@/lib/analytics';

/*
 * Brief §5.5 — Email capture: first name (optional), email (required),
 *   city (optional). Single-step, inline validation, success state with
 *   social links.
 *
 * Brief §12 — Honeypot (`url`, off-screen) + rate limit (server-side).
 *   Double opt-in via ESP. NO reCAPTCHA v2.
 *
 * Brief §10 — visible <label> per input, aria-invalid + aria-describedby
 *   on errors, aria-live="polite" success state.
 *
 * Brief §12 — events: signup_started (first focus), signup_completed (success),
 *   ig_follow_click (on success CTA click).
 *
 * Brief §8 — useTransition keeps INP < 200ms during submit.
 */

const schema = z.object({
  firstName: z.string().max(40).optional(),
  email: z.string().email('Enter a valid email'),
  city: z.string().max(60).optional(),
  url: z.string().max(0, 'bot').optional(), // honeypot
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function SignupForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onFirstFocus() {
    if (started) return;
    setStarted(true);
    track('signup_started');
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      firstName: (fd.get('firstName') as string) || undefined,
      email: (fd.get('email') as string) || '',
      city: (fd.get('city') as string) || undefined,
      url: (fd.get('url') as string) || '',
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    if (parsed.data.url) return; // silent bot reject

    startTransition(async () => {
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });
        if (!res.ok) throw new Error('signup_failed');
        setSuccess(true);
        track('signup_completed');
      } catch {
        setError('Something went wrong. Try again.');
      }
    });
  }

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative bg-ink-3 border border-signal/50 p-8 md:p-10 overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(225,29,42,0.5), transparent 60%)',
          }}
        />
        <p className="relative font-mono text-caption uppercase tracking-[0.3em] text-signal">Confirmed</p>
        <h3 className="relative mt-4 font-display text-display-md uppercase leading-[1.05] chrome-text">
          Welcome to the movement.
        </h3>
        <p className="relative mt-4 font-sans text-body-lg text-chrome">
          You&apos;re early — so is BLAZE. Check your inbox to confirm.
        </p>
        <a
          href="https://instagram.com/athlence"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('ig_follow_click', { from: 'signup_success' })}
          className="relative mt-8 inline-flex items-center px-6 py-3 bg-signal hover:bg-signal-hot text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
        >
          Follow on Instagram
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onFocus={onFirstFocus} noValidate className="bg-ink-3 p-8 md:p-10 border border-white/10">
      <p className="font-mono text-caption uppercase tracking-[0.3em] text-signal">Early Access</p>
      <p className="mt-4 font-display text-2xl md:text-3xl uppercase leading-[1.05] chrome-text">
        Be on the list.
      </p>

      <div className="mt-8 space-y-5">
        <Field label="First name (optional)" name="firstName" autoComplete="given-name" error={errors.firstName} />
        <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
        <Field label="City (optional)" name="city" autoComplete="address-level2" error={errors.city} />

        {/* Honeypot — hidden from real users, sweet to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-0">
          <label htmlFor="url">Leave blank</label>
          <input id="url" name="url" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {error && (
          <p role="alert" className="font-mono text-caption uppercase tracking-[0.2em] text-signal">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-7 py-4 bg-signal hover:bg-signal-hot disabled:opacity-60 text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
        >
          {isPending ? 'Joining…' : 'Join the Movement'}
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-lo">
          By signing up you agree to our <a href="/privacy" className="underline">Privacy Policy</a>. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
};

function Field({ label, name, type = 'text', required, autoComplete, error }: FieldProps) {
  const errId = `${name}-err`;
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-caption uppercase tracking-[0.2em] text-chrome-lo mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        className={`w-full bg-transparent border ${error ? 'border-signal' : 'border-chrome/20 focus:border-chrome-hi'} px-4 py-3.5 font-sans text-body text-chrome-hi placeholder:text-chrome-lo outline-none transition-colors`}
      />
      {error && (
        <p id={errId} className="mt-2 font-mono text-caption uppercase tracking-[0.2em] text-signal">
          {error}
        </p>
      )}
    </div>
  );
}
