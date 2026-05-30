'use client';

import { useEffect, useState } from 'react';

/*
 * Brief §4 — Nav structure:
 *   ATHLENCE (logo/home) → The Movement → BLAZE → Culture → Community → Story → CTA: GET EARLY ACCESS
 *
 * ATHLENCE is BIG (it's the parent brand and home link).
 * BLAZE sits in the link list as just another section — visible but not
 * elevated. This is the hierarchy in microcosm.
 *
 * Brief §9 — mobile burger panel, single-thumb, 48×48 targets.
 * Transparent over hero, solidifies on scroll past 80px.
 */
const LINKS = [
  { href: '#movement', label: 'The Movement' },
  { href: '#blaze', label: 'BLAZE' },
  { href: '#culture', label: 'Culture' },
  { href: '#community', label: 'Community' },
  { href: '#story', label: 'Story' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || open
            ? 'bg-ink/80 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav aria-label="Primary" className="container flex items-center justify-between h-16 md:h-20">
         <a href="#hero" aria-label="ATHLENCE home" className="flex items-center">
  <img src="/Final_Logo.png" alt="ATHLENCE" className="h-24 md:h-28 w-auto" />
</a>
          <ul className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="font-mono text-caption uppercase tracking-[0.2em] text-chrome hover:text-chrome-hi transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#community"
                className="inline-flex items-center px-5 py-2.5 bg-signal hover:bg-signal-hot text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
              >
                Get Early Access
              </a>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 -mr-3"
          >
            <span className={`block w-6 h-px bg-chrome-hi transition-transform ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-6 h-px bg-chrome-hi transition-transform ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </nav>
      </header>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-30 bg-ink md:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="container pt-24 pb-12 flex flex-col h-full">
          <ul className="space-y-6 flex-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block font-display text-display-md uppercase tracking-tight chrome-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#community"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-5 bg-signal text-chrome-hi font-mono text-caption uppercase tracking-[0.2em]"
          >
            Get Early Access
          </a>
        </div>
      </div>
    </>
  );
}
