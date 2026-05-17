import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — ATHLENCE',
  description: 'The terms under which ATHLENCE provides this site.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
        <h1 className="font-display text-display-md leading-[0.95]">Terms of Service</h1>
        <p className="mt-4 text-sm text-black/60">Last updated: May 2026</p>

        <div className="mt-12 max-w-none space-y-8 text-[17px] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl tracking-wide">1. Acceptance</h2>
            <p>
              By using athlence.com you agree to these terms. If you don&apos;t agree,
              please don&apos;t use the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">2. What this site is</h2>
            <p>
              This site is the digital home of ATHLENCE — a performance-culture
              brand — and the launch destination for BLAZE Energy Drink. We do not
              currently sell anything through this site. The early-access list is a
              free signup with no purchase obligation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">3. Your account</h2>
            <p>
              We don&apos;t have accounts yet. When we add them, these terms will be
              updated.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">4. Content and IP</h2>
            <p>
              All content on this site — logos, copy, photography, videos, 3D
              renders, code — is owned by ATHLENCE or licensed to us. You may
              share it on social media with credit. You may not reproduce it
              commercially without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">5. Health and safety</h2>
            <p>
              BLAZE is an energy drink. When it ships, the packaging will carry
              standard energy-drink advisories. ATHLENCE is performance culture, not
              medical advice. Talk to a doctor if you have caffeine sensitivities.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">6. Third-party services</h2>
            <p>
              We use Sanity for content, Resend or ConvertKit for email, Plausible
              for analytics, and Meta Pixel for ad attribution. Those services have
              their own terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">7. Limitation of liability</h2>
            <p>
              The site is provided as-is. We aren&apos;t liable for indirect or
              consequential damages arising from your use of it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">8. Changes</h2>
            <p>
              We may update these terms. Material changes will be flagged on the
              site or by email to the early-access list.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-wide">9. Contact</h2>
            <p>
              Questions: <a href="mailto:hello@athlence.com" className="underline">hello@athlence.com</a>.
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
