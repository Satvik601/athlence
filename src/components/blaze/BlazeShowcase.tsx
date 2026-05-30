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
    <img
      src="/blaze-can-front.png"
      alt="BLAZE Energy Drink"
      className="h-full w-auto object-contain drop-shadow-2xl"
    />
  );
}
