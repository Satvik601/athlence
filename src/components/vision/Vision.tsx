import { Eyebrow } from '../ui/Eyebrow';
import { getVisionContent } from '@/lib/sanity';

/*
 * Brief §5.2 — ATHLENCE Brand Vision. Emotional anchor of the site.
 * Introduces ATHLENCE as the parent brand and the movement.
 * Sells identity, NOT product.
 *
 * Asymmetric 2-col desktop breaks the grid (manifesto offset right).
 * Single column on mobile.
 *
 * Last line explicitly stages the hierarchy:
 *   "BLAZE is the first product. It will not be the last."
 */
export async function Vision() {
  const c = await getVisionContent();

  return (
    <section
      id="movement"
      aria-labelledby="movement-heading"
      className="relative bg-ink-2 py-section overflow-hidden"
    >
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* Image column (decorative gradient panel since no photo asset present) */}
        <div className="md:col-span-5">
          <div
            className="aspect-[4/5] relative overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 20% 0%, rgba(124,196,255,0.18), transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(225,29,42,0.25), transparent 55%), linear-gradient(180deg, #111114, #0a0a0b)',
            }}
            aria-hidden
          >
            {/* Diagonal scan lines */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, transparent 0 12px, rgba(255,255,255,0.5) 12px 13px)',
              }}
            />
            <p className="absolute bottom-6 left-6 font-mono text-caption uppercase tracking-[0.3em] text-chrome-lo">
              {c.eyebrow}
            </p>
          </div>
        </div>

        {/* Manifesto */}
        <div className="md:col-span-6 md:col-start-7">
          <Eyebrow>The Movement</Eyebrow>
          <h2 id="movement-heading" className="mt-6 font-display text-display-lg uppercase leading-[0.96] chrome-text">
            {c.heading}
          </h2>
          <p className="mt-8 font-sans text-body-lg text-chrome max-w-xl">
            {c.body}
          </p>

          {/* Values strip */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-caption uppercase tracking-[0.2em] text-chrome-lo">
            {c.values.map((v) => (
              <li key={v} className="flex items-center gap-2">
                <span className="inline-block w-1 h-1 bg-signal" />
                {v}
              </li>
            ))}
          </ul>

          <p className="mt-12 font-display text-display-md uppercase leading-[1.05] chrome-text">
            BLAZE is the first product.
            <br />
            <span className="text-chrome-lo">It will not be the last.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
