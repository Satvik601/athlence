import type { Metadata } from 'next';
import Link from 'next/link';

/*
 * Brief §4 — legal pages on a "paper" theme.
 * Brief §10 — readable, accessible. WCAG 2.1 AA.
 *
 * Theme switch is data-theme="paper" on the wrapper. globals.css scopes
 * the token overrides so this page reads black-on-cream.
 */

export const metadata: Metadata = {
  title: 'Privacy Policy — ATHLENCE',
  description: 'How ATHLENCE handles your data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div data-theme="paper" className="min-h-screen bg-[var(--paper)] text-[var(--paper-ink)]">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
          <Link href="/" className="font-display text-xl tracking-[0.2em]">
            ATHLENCE
          </Link>
          <Link href="/" className="text-sm underline underline-offset-4">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-black/60">
          ATHLENCE / Legal
        </p>
        <h1 className="font-display text-display-md leading-[0.95]">Privacy Policy</h1>
        <p className="mt-4 text-sm text-black/60">Last updated: May 2026</p>

        <div className="prose prose-neutral mt-12 max-w-none space-y-8 text-[17px] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl tracking-wide">Who we are</h2>
            <p>
              ATHLENCE is a performance-culture brand. BLAZE is our first product.
              This policy explains what data we collect when you visit{' '}
              <strong>athlence.com</strong> or sign up for early access.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">What we collect</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Email address</strong> — required when you join the early-access list. Used to send you launch updates and confirmation emails.
              </li>
              <li>
                <strong>First name and city</strong> — optional. We use these to personalise messages.
              </li>
              <li>
                <strong>Usage data</strong> — anonymous, aggregated. We use Plausible Analytics, which does not use cookies or collect personal data.
              </li>
              <li>
                <strong>Ad attribution</strong> — if you arrived from an ad campaign, Meta Pixel records that event. You can opt out via your browser settings.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">What we don&apos;t collect</h2>
            <p>
              We do not collect payment information on this site — there is nothing
              to buy yet. We do not sell your data. We do not share your data with
              advertisers beyond standard Meta Pixel attribution.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">Your rights</h2>
            <p>
              You can request a copy of your data, request deletion, or unsubscribe
              at any time. Email <a href="mailto:hello@athlence.com" className="underline">hello@athlence.com</a>.
              Every email we send you includes a one-click unsubscribe link.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">Cookies</h2>
            <p>
              We use a single first-party cookie to remember your UTM source if you
              arrived from a campaign link. No third-party tracking cookies are
              loaded by this site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">Updates</h2>
            <p>
              We may update this policy as the product evolves. Material changes
              will be communicated to anyone on the early-access list.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-black/60">
          © {new Date().getFullYear()} ATHLENCE. BLAZE · The first product from ATHLENCE.
        </div>
      </footer>
    </div>
  );
}
