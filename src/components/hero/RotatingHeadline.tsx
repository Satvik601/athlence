'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/*
 * Brief §5.1 — Rotate among: BUILT FOR MOVEMENT, ENERGY FOR THE OBSESSED,
 *   PERFORMANCE MODE, NO OFF SWITCH.
 *
 * Real text node (not a baked image). Wrapped in a key that re-triggers the
 * CSS `phrase-in` keyframe on change. Reduced-motion: first phrase static.
 * 6s cadence matches R3F float loop so the page feels like one composition.
 */
export function RotatingHeadline({ phrases }: { phrases: string[] }) {
  const safe = phrases.length > 0 ? phrases : ['BUILT FOR MOVEMENT'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (safe.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % safe.length), 6000);
    return () => clearInterval(id);
  }, [safe.length]);

  return (
    <span key={index} className="inline-block animate-phrase-in chrome-text">
      {safe[index]}
    </span>
  );
}
