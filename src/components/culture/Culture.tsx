import { Eyebrow } from '../ui/Eyebrow';

/*
 * Brief §5.4 — Performance Culture. "I want to be part of this culture."
 *
 * Layout:
 *   - Top + bottom marquee strips (opposing directions) for kinetic balance
 *   - 3-up image strips desktop, horizontal scroll-snap reel mobile
 *   - Sells identity & lifestyle — NOT ingredients or specs
 *
 * Animation:
 *   - Marquee = pure CSS keyframes, no JS, paused on reduced-motion via media query
 *
 * Performance:
 *   - When real video assets are wired, use <video muted loop playsinline
 *     preload="none"> + Intersection-observer-driven .play()/pause()
 */
const PHRASES = ['RUN.', 'LIFT.', 'FIGHT.', 'REPEAT.', 'BUILT FOR THE OBSESSED.', '24:00 / 7:00 / NO OFF SWITCH.', 'ENERGY IS A LANGUAGE.'];

const STRIPS = [
  { caption: 'Run club · 5AM · East London', tint: 'rgba(225,29,42,0.25)' },
  { caption: 'HYROX prep · indoor track', tint: 'rgba(124,196,255,0.22)' },
  { caption: 'Late-night gym · Berlin', tint: 'rgba(255,42,58,0.2)' },
];

export function Culture() {
  return (
    <section id="culture" aria-labelledby="culture-heading" className="relative bg-ink">
      {/* Top marquee */}
      <div role="presentation" aria-hidden="true" className="relative w-full overflow-hidden border-y border-white/10 bg-ink-2">
        <div className="flex animate-marquee whitespace-nowrap py-5 motion-reduce:animate-none">
          {[...PHRASES, ...PHRASES].map((p, i) => (
            <span key={i} className="font-display text-display-md uppercase tracking-tight mx-8 chrome-text inline-flex items-center gap-8">
              {p}
              <span className="inline-block w-2 h-2 rotate-45 bg-signal" />
            </span>
          ))}
        </div>
      </div>

      <div className="container py-section">
        <div className="max-w-3xl">
          <Eyebrow>Performance Culture</Eyebrow>
          <h2 id="culture-heading" className="mt-6 font-display text-display-lg uppercase leading-[0.96] chrome-text">
            Built by athletes. Shaped by the obsessed.
          </h2>
          <p className="mt-6 font-sans text-body-lg text-chrome max-w-2xl">
            Run clubs at dawn. Lifting at midnight. Fighters, sprinters, creator-athletes. Modern performance culture, captured in motion.
          </p>
        </div>

        <div className="mt-16 flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-5 md:mx-0 px-5 md:px-0 pb-4 md:pb-0">
          {STRIPS.map((s, i) => (
            <figure
              key={i}
              className="relative shrink-0 w-[78vw] md:w-auto snap-center group overflow-hidden"
              style={{ aspectRatio: '4 / 5' }}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                style={{
                  background: `radial-gradient(ellipse at center, ${s.tint}, transparent 65%), linear-gradient(180deg, #111114, #0a0a0b)`,
                }}
              />
              {/* Subtle texture lines suggest athletic motion */}
              <div
                className="absolute inset-0 opacity-[0.15]"
                aria-hidden
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px)',
                  maskImage: 'linear-gradient(180deg, transparent, black 40%, black 70%, transparent)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 font-mono text-caption uppercase tracking-[0.2em] text-chrome-hi">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Bottom marquee — opposite direction */}
      <div role="presentation" aria-hidden="true" className="relative w-full overflow-hidden border-y border-white/10 bg-ink-2">
        <div className="flex animate-marquee whitespace-nowrap py-5 motion-reduce:animate-none" style={{ animationDirection: 'reverse', animationDuration: '36s' }}>
          {[...PHRASES, ...PHRASES].reverse().map((p, i) => (
            <span key={i} className="font-display text-display-md uppercase tracking-tight mx-8 text-chrome-lo">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
