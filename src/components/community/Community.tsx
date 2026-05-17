import { Eyebrow } from '../ui/Eyebrow';
import { SignupForm } from './SignupForm';
import { InstagramFeed } from '../social/InstagramFeed';
import { track } from '@/lib/analytics';

/*
 * Brief §5.5 — Community / Movement. Primary lead-capture moment.
 *
 * Layout:
 *   - Atmospheric red wash (signal-driven, restrained)
 *   - Two-col desktop: pitch + programmes + socials | signup form
 *   - Single-col mobile, sticky CTA dismisses while this section is in view
 *
 * Brief §5.7 — Live Instagram feed embedded at bottom of Community
 *   (proof of life; "the site stays alive between deploys").
 *
 * Future programmes mentioned per brief:
 *   ATHLENCE run clubs, athlete ambassadors, creator collaborations,
 *   performance challenges, community events, fitness partnerships.
 */
const PROGRAMMES = [
  'ATHLENCE Run Clubs',
  'Athlete Ambassadors',
  'Creator Collaborations',
  'Performance Challenges',
  'Community Events',
  'Fitness Partnerships',
];

export function Community() {
  return (
    <section id="community" aria-labelledby="community-heading" className="relative bg-ink-2 overflow-hidden">
      {/* Atmospheric wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(225,29,42,0.18), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(124,196,255,0.12), transparent 50%)',
        }}
      />

      <div className="relative container py-section grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-6">
          <Eyebrow>The Community</Eyebrow>
          <h2 id="community-heading" className="mt-6 font-display text-display-lg uppercase leading-[0.94] chrome-text">
            Join the movement.
            <br />
            Be early.
          </h2>
          <p className="mt-8 font-sans text-body-lg text-chrome max-w-xl">
            BLAZE drops to founding-list members first. Run-club invites, drop alerts, athlete content. No spam — just signal.
          </p>

          {/* Programmes list */}
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
            {PROGRAMMES.map((p) => (
              <li key={p} className="font-mono text-caption uppercase tracking-[0.2em] text-chrome flex items-center gap-2">
                <span className="inline-block w-1 h-1 bg-signal" />
                {p}
              </li>
            ))}
          </ul>

          {/* Socials */}
          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { name: 'Instagram', href: 'https://instagram.com/athlence' },
              { name: 'YouTube', href: 'https://youtube.com/@athlence' },
              { name: 'TikTok', href: 'https://tiktok.com/@athlence' },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2.5 border border-chrome/30 hover:border-signal text-chrome hover:text-chrome-hi font-mono text-caption uppercase tracking-[0.2em] transition-colors"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-6">
          <SignupForm />
        </div>
      </div>

      {/* Brief §5.7 — Instagram feed embedded here */}
      <div className="relative container pb-section">
        <Eyebrow color="chrome">Live · Instagram</Eyebrow>
        <h3 className="mt-6 font-display text-display-md uppercase leading-tight chrome-text">
          From the field.
        </h3>
        <InstagramFeed />
      </div>
    </section>
  );
}
