'use client';

import { useEffect, type ReactNode } from 'react';
import { isIOSSafari, prefersReducedMotion, whenIdle } from '@/lib/motion';

/*
 * Brief §6 — smooth scrolling, cinematic transitions.
 * Brief §9 — smooth scroll must NOT break native iOS Safari momentum or pull-to-refresh.
 *
 * Lenis is dynamic-imported behind whenIdle() so it doesn't block hydration
 * or LCP measurement. Total Lenis weight: ~6KB gz.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (isIOSSafari()) return; // preserve native momentum
    if (prefersReducedMotion()) return;

    let raf = 0;
    const cleanup = { current: () => {} };

    whenIdle(() => {
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.05,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          wheelMultiplier: 0.9,
          touchMultiplier: 1.4,
          infinite: false,
        });

        const tick = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        cleanup.current = () => {
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      });
    });

    return () => cleanup.current();
  }, []);

  return <>{children}</>;
}
