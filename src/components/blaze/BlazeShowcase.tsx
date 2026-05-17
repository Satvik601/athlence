'use client';

import { useEffect, useRef } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import { prefersReducedMotion, whenIdle } from '@/lib/motion';

/*
 * Brief §5.3 — BLAZE Product Showcase.
 *
 * EXPLICIT BRIEF CONSTRAINT:
 *   "Do not lay this section out like a typical e-commerce product page
 *   (image grid + ingredient list + add-to-cart). It should feel like a
 *   product film."
 *
 * Layout is intentionally CINEMATIC:
 *   - Three scenes scrolled through (Built / Tuned / Charged)
 *   - Sticky can column on desktop with GSAP-driven rotation
 *   - Mobile: no pin (preserves iOS momentum per brief §9), entry rotation only
 *   - No price, no spec sheet, no ingredients
 *
 * Copy direction: "energy, identity, culture, performance vibe.
 *   Avoid medical, supplement, or claims-driven language."
 */

const SCENES = [
  { eyebrow: 'Built', title: 'Forged for the obsessed.', body: 'A black-and-chrome shell. Cold metal. A signal-red band. The first object in the ATHLENCE ecosystem.' },
  { eyebrow: 'Tuned', title: 'Engineered for the run.', body: 'Clean energy, no wasted weight. Made for pre-workout, pre-race, pre-everything.' },
  { eyebrow: 'Charged', title: 'Energy with an identity.', body: 'Not a supplement. Not a gimmick. Fuel that knows what it is — and who it’s for.' },
];

export function BlazeShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 768px)').matches) return; // mobile: no pin

    let cleanup = () => {};
    whenIdle(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current || !canRef.current) return;

      const trig = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (canRef.current) {
            canRef.current.style.transform =
              `translateY(${-(p * 30)}px) rotate(${p * 35}deg) scale(${1 + p * 0.12})`;
          }
        },
      });
      cleanup = () => trig.kill();
    });
    return () => cleanup();
  }, []);

  return (
    <section
      id="blaze"
      ref={sectionRef}
      aria-labelledby="blaze-heading"
      className="relative bg-ink-2 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--chrome) 1px, transparent 1px), linear-gradient(90deg, var(--chrome) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="relative container py-section grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <div className="relative">
            <Eyebrow color="electric">First Product · BLAZE Energy</Eyebrow>
            <h2 id="blaze-heading" className="sr-only">BLAZE Energy</h2>
            <div ref={canRef} className="mt-8 relative h-[420px] md:h-[600px] flex items-center justify-center transition-transform duration-300 ease-out">
              <BlazeCanSVG />
              <div className="absolute inset-x-8 bottom-2 h-12 rounded-full bg-signal/30 blur-2xl" />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 space-y-32 md:space-y-[40vh]">
          {SCENES.map((scene, i) => (
            <article key={i}>
              <p className="font-mono text-caption uppercase tracking-[0.3em] text-signal">
                0{i + 1} — {scene.eyebrow}
              </p>
              <h3 className="mt-5 font-display text-display-md uppercase leading-[1.05] chrome-text">
                {scene.title}
              </h3>
              <p className="mt-6 max-w-md font-sans text-body-lg text-chrome">
                {scene.body}
              </p>
            </article>
          ))}
        </div>
      </div>

      <p className="container pb-16 font-mono text-caption uppercase tracking-[0.3em] text-chrome-lo">
        BLAZE is the first product. <span className="text-chrome-hi">ATHLENCE is the movement.</span>
      </p>
    </section>
  );
}

/* Inline SVG can — same visual language as the R3F can.
   Acts as the reduced-motion / no-WebGL fallback for the showcase. */
function BlazeCanSVG() {
  return (
    <svg viewBox="0 0 240 360" className="w-auto h-full drop-shadow-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="canBody" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0a0a0b" />
          <stop offset="40%" stopColor="#2a2a2f" />
          <stop offset="55%" stopColor="#c7ccd1" />
          <stop offset="70%" stopColor="#2a2a2f" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </linearGradient>
        <linearGradient id="canRim" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#5a5f66" />
          <stop offset="50%" stopColor="#eff2f5" />
          <stop offset="100%" stopColor="#5a5f66" />
        </linearGradient>
        <linearGradient id="canBand" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7a0f17" />
          <stop offset="50%" stopColor="#ff2a3a" />
          <stop offset="100%" stopColor="#7a0f17" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="160" height="280" rx="6" fill="url(#canBody)" />
      <rect x="40" y="40" width="160" height="14" fill="url(#canRim)" />
      <ellipse cx="120" cy="40" rx="80" ry="6" fill="#1a1a1f" stroke="url(#canRim)" strokeWidth="2" />
      <rect x="40" y="306" width="160" height="14" fill="url(#canRim)" />
      <rect x="40" y="190" width="160" height="36" fill="url(#canBand)" />
      <text x="120" y="214" textAnchor="middle" fontFamily="Druk Wide, Anton, sans-serif" fontWeight="700" fontSize="20" fill="#eff2f5" letterSpacing="4">BLAZE</text>
      <text x="120" y="100" textAnchor="middle" fontFamily="Druk Wide, Anton, sans-serif" fontWeight="700" fontSize="9" fill="#c7ccd1" letterSpacing="3" opacity="0.7">ATHLENCE</text>
      <g fill="#eff2f5" opacity="0.18">
        <circle cx="70" cy="120" r="1.5" />
        <circle cx="180" cy="160" r="2" />
        <circle cx="60" cy="240" r="1.2" />
        <circle cx="170" cy="270" r="1.8" />
        <circle cx="90" cy="280" r="1" />
      </g>
    </svg>
  );
}
