/*
 * Brief §5.9 — Footer is minimal, premium, dark:
 *   ATHLENCE wordmark, social, contact email, legal links, copyright,
 *   plus BLAZE wordmark with "The first product from ATHLENCE."
 *
 * The BLAZE acknowledgement strip is the final visible reinforcement of
 * the parent-brand → first-product hierarchy.
 */
export function Footer() {
  return (
    <footer className="relative bg-ink border-t border-white/5">
      <div className="container py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="font-display text-display-md uppercase tracking-tight chrome-text">ATHLENCE</p>
          <p className="mt-4 max-w-sm font-sans text-body text-chrome-lo">
            A performance-culture brand for a generation obsessed with becoming better.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-caption uppercase tracking-[0.2em] text-chrome-lo">Social</p>
          <ul className="mt-4 space-y-2 font-sans text-body text-chrome">
            <li><a href="https://instagram.com/athlence" className="hover:text-chrome-hi">Instagram</a></li>
            <li><a href="https://youtube.com/@athlence" className="hover:text-chrome-hi">YouTube</a></li>
            <li><a href="https://tiktok.com/@athlence" className="hover:text-chrome-hi">TikTok</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="font-mono text-caption uppercase tracking-[0.2em] text-chrome-lo">Contact</p>
          <address className="mt-4 not-italic font-sans text-body text-chrome">
            <a href="mailto:hello@athlence.com" className="hover:text-chrome-hi">hello@athlence.com</a>
          </address>
          <nav aria-label="Legal" className="mt-6">
            <ul className="flex gap-6 font-mono text-caption uppercase tracking-[0.2em] text-chrome-lo">
              <li><a href="/privacy" className="hover:text-chrome-hi">Privacy</a></li>
              <li><a href="/terms" className="hover:text-chrome-hi">Terms</a></li>
              <li><a href="/contact" className="hover:text-chrome-hi">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="container py-6 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-chrome-lo">
          <span className="text-chrome">BLAZE</span> · The first product from ATHLENCE.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-chrome-lo">
          © {new Date().getFullYear()} ATHLENCE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
