import Link from 'next/link';

/*
 * Brief §4 — branded 404 on-tone with the rest of the site.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--ink)] px-6 text-center text-[var(--silver)]">
      {/* Atmospheric red wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 50%, rgba(225,29,42,0.25) 0%, transparent 70%)',
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--chrome-2)]">
          ATHLENCE / 404
        </p>
        <h1 className="mt-6 font-display text-[clamp(5rem,18vw,12rem)] leading-[0.85]">
          OFF<br />ROUTE.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[var(--chrome)]">
          This page isn&apos;t part of the movement. Yet.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--signal)] px-7 font-mono text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[var(--signal-2)]"
          >
            Back to home
          </Link>
          <Link
            href="/#community"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--chrome)] px-7 font-mono text-sm uppercase tracking-[0.2em] text-[var(--silver)] transition hover:border-[var(--silver)]"
          >
            Join the movement
          </Link>
        </div>
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--chrome-2)]">
          BLAZE · The first product from ATHLENCE
        </p>
      </div>
    </div>
  );
}
