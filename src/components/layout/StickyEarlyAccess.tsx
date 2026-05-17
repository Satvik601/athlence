'use client';

import { useEffect, useState } from 'react';

/*
 * Brief §9 — Sticky GET EARLY ACCESS button after hero scrolls out of view.
 * Anchored to safe-area-inset-bottom, dismisses when Community is in view
 * (no double-CTA noise on the form section).
 */
export function StickyEarlyAccess() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('#hero');
    const community = document.querySelector('#community');
    if (!hero || !community) return;

    const heroObs = new IntersectionObserver(
      ([e]) => setVisible(!e.isIntersecting),
      { threshold: 0.1 },
    );
    const communityObs = new IntersectionObserver(
      ([e]) => setHidden(e.isIntersecting),
      { threshold: 0.3 },
    );
    heroObs.observe(hero);
    communityObs.observe(community);
    return () => { heroObs.disconnect(); communityObs.disconnect(); };
  }, []);

  if (!visible || hidden) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden safe-bottom px-5 pt-3 bg-gradient-to-t from-ink via-ink/95 to-transparent">
      <a
        href="#community"
        className="block w-full text-center py-4 bg-signal hover:bg-signal-hot text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
      >
        Get Early Access
      </a>
    </div>
  );
}
