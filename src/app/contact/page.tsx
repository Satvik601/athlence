import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact — ATHLENCE',
  description: 'Talk to ATHLENCE.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--silver)]">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
          <Link href="/" className="font-display text-xl tracking-[0.2em]">
            ATHLENCE
          </Link>
          <Link href="/" className="text-sm text-[var(--chrome)] underline underline-offset-4 hover:text-[var(--silver)]">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--chrome-2)]">
          ATHLENCE / Contact
        </p>
        <h1 className="font-display text-display-md leading-[0.95]">Get in touch.</h1>
        <p className="mt-6 max-w-xl text-lg text-[var(--chrome)]">
          We&apos;re a small team building something ambitious. Email us — we read
          every message.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-[var(--charcoal)] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--chrome-2)]">
              General
            </p>
            <a
              href="mailto:hello@athlence.com"
              className="mt-2 block font-display text-2xl text-[var(--silver)] hover:text-[var(--signal)]"
            >
              hello@athlence.com
            </a>
          </div>

          <div className="rounded-lg border border-white/10 bg-[var(--charcoal)] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--chrome-2)]">
              Press
            </p>
            <a
              href="mailto:press@athlence.com"
              className="mt-2 block font-display text-2xl text-[var(--silver)] hover:text-[var(--signal)]"
            >
              press@athlence.com
            </a>
          </div>

          <div className="rounded-lg border border-white/10 bg-[var(--charcoal)] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--chrome-2)]">
              Athletes & creators
            </p>
            <a
              href="mailto:athletes@athlence.com"
              className="mt-2 block font-display text-2xl text-[var(--silver)] hover:text-[var(--signal)]"
            >
              athletes@athlence.com
            </a>
          </div>

          <div className="rounded-lg border border-white/10 bg-[var(--charcoal)] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--chrome-2)]">
              Find us
            </p>
            <div className="mt-2 flex gap-4">
              <a href="https://instagram.com/athlence" className="text-[var(--silver)] hover:text-[var(--signal)]">
                Instagram
              </a>
              <a href="https://youtube.com/@athlence" className="text-[var(--silver)] hover:text-[var(--signal)]">
                YouTube
              </a>
              <a href="https://tiktok.com/@athlence" className="text-[var(--silver)] hover:text-[var(--signal)]">
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--chrome-2)]">
            BLAZE · The first product from ATHLENCE.
          </p>
        </div>
      </main>
    </div>
  );
}
