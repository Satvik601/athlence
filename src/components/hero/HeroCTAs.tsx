'use client';

import { track } from '@/lib/analytics';

/*
 * Brief §5.1 — Primary: JOIN THE MOVEMENT (scrolls to email capture).
 *              Secondary: GET EARLY ACCESS / COMING SOON (opens modal).
 *
 * Brief §12 — hero_cta_click event fires on click with cta label as prop.
 */
export function HeroCTAs({ primary, secondary }: { primary: string; secondary: string }) {
  const openEarlyAccess = () => {
    track('hero_cta_click', { cta: 'early_access' });
    window.dispatchEvent(new CustomEvent('athlence:open-early-access'));
    // Fallback: smooth-scroll to community section if no modal mounted
    document.querySelector('#community')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md">
      <a
        href="#community"
        onClick={() => track('hero_cta_click', { cta: 'join_movement' })}
        className="inline-flex items-center justify-center px-7 py-4 bg-signal hover:bg-signal-hot text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
      >
        {primary}
      </a>
      <button
        type="button"
        onClick={openEarlyAccess}
        className="inline-flex items-center justify-center px-7 py-4 border border-chrome/40 hover:border-chrome-hi text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
      >
        {secondary}
      </button>
    </div>
  );
}
