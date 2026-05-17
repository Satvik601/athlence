import { Eyebrow } from '../ui/Eyebrow';
import { getFounderContent } from '@/lib/sanity';

/*
 * Brief §5.6 — Founder Journey. Short, raw, ambitious, authentic.
 * Behind-the-scenes visuals. Plain language. NO PR voice.
 *
 * Animation: minimal — the restraint is the point.
 * Layout: stacks on mobile (reel first), desktop reverses (copy left, reel right).
 */
export async function Founder() {
  const c = await getFounderContent();

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative bg-ink py-section overflow-hidden"
    >
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="md:col-span-7 md:order-1 order-2">
          <Eyebrow>The Story</Eyebrow>
          <h2 id="story-heading" className="mt-6 font-display text-display-lg uppercase leading-[0.96] chrome-text">
            {c.heading}
          </h2>
          <p className="mt-8 font-sans text-body-lg text-chrome max-w-xl">
            {c.note}
          </p>
          <p className="mt-8 font-mono text-caption uppercase tracking-[0.2em] text-chrome-lo">
            — Founder, ATHLENCE
          </p>
        </div>

        <div className="md:col-span-5 md:order-2 order-1">
          <figure className="relative aspect-[3/4] bg-ink-3 overflow-hidden">
            {/* Real production: <video muted loop playsinline preload="metadata" poster> */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 40% 30%, rgba(225,29,42,0.4), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124,196,255,0.18), transparent 55%), linear-gradient(180deg, #1a1a1f, #0a0a0b)',
              }}
            />
            {/* Scanline overlay for raw documentary feel */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-20 motion-reduce:opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.5) 2px 3px)',
              }}
            />
            {/* Centre play indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-chrome-hi/60 flex items-center justify-center">
                <span className="w-0 h-0 border-l-[14px] border-l-chrome-hi border-y-[10px] border-y-transparent ml-1" aria-hidden />
              </div>
            </div>
            <figcaption className="absolute bottom-4 left-4 right-4 font-mono text-caption uppercase tracking-[0.2em] text-chrome-hi">
              {c.reelCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
