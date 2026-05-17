import { Eyebrow } from '../ui/Eyebrow';

/*
 * Brief §5.8 — The Future of ATHLENCE.
 *
 * Brief mandate: "Visual: silhouettes or stylised concept renders of the
 * future products. Do NOT show fake finished packaging."
 *
 * Inline SVG silhouettes (~6KB total). No "Buy" CTAs. No flavour grids.
 * Just the gesture of what's coming. Reinforces: BLAZE is one product
 * among many that will live under ATHLENCE.
 */
type Product = { name: string; status: string; year: string; Silhouette: () => JSX.Element };

const PRODUCTS: Product[] = [
  { name: 'BLAZE Energy', status: 'Live', year: '2026', Silhouette: CanSilhouette },
  { name: 'Honey Pre-Workout Shot', status: 'In Development', year: '2026/27', Silhouette: ShotSilhouette },
  { name: 'Energy Gummies', status: 'Concept', year: '2027', Silhouette: GummySilhouette },
  { name: '·', status: 'The next one', year: 'TBA', Silhouette: NextSilhouette },
];

export function FutureProducts() {
  return (
    <section id="future" aria-labelledby="future-heading" className="relative bg-ink py-section overflow-hidden">
      <div className="container">
        <div className="max-w-3xl">
          <Eyebrow color="electric">The Future</Eyebrow>
          <h2 id="future-heading" className="mt-6 font-display text-display-lg uppercase leading-[0.96] chrome-text">
            One movement. Many products.
          </h2>
          <p className="mt-8 font-sans text-body-lg text-chrome max-w-2xl">
            BLAZE is the first. Next come honey pre-workout shots, energy gummies, and the rest of the ATHLENCE athlete ecosystem. Each engineered for a different moment — all powering the same movement.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS.map((p, i) => (
            <li
              key={i}
              className="group relative aspect-[3/4] border border-white/10 bg-ink-2 p-5 md:p-6 flex flex-col justify-between overflow-hidden transition-colors hover:border-signal"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-chrome-lo">
                0{i + 1} / {p.year}
              </p>
              <div className="flex-1 flex items-center justify-center my-4">
                <p.Silhouette />
              </div>
              <div>
                <p className="font-display text-sm md:text-base uppercase tracking-[0.05em] text-chrome-hi leading-tight">
                  {p.name}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
                  {p.status}
                </p>
              </div>
              <span
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'radial-gradient(circle at 50% 100%, rgba(225,29,42,0.18), transparent 70%)' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CanSilhouette() {
  return (
    <svg viewBox="0 0 80 160" className="h-32 md:h-40 text-chrome-lo group-hover:text-chrome-hi transition-colors" fill="currentColor" aria-hidden="true">
      <rect x="14" y="16" width="52" height="128" rx="2" />
      <rect x="14" y="16" width="52" height="6" opacity="0.6" />
      <rect x="14" y="138" width="52" height="6" opacity="0.6" />
    </svg>
  );
}

function ShotSilhouette() {
  return (
    <svg viewBox="0 0 80 160" className="h-32 md:h-40 text-chrome-lo group-hover:text-chrome-hi transition-colors" fill="currentColor" aria-hidden="true">
      <path d="M28 30 L52 30 L54 50 L54 130 Q54 144 40 144 Q26 144 26 130 L26 50 Z" />
      <rect x="32" y="20" width="16" height="14" rx="1" opacity="0.7" />
    </svg>
  );
}

function GummySilhouette() {
  return (
    <svg viewBox="0 0 80 160" className="h-32 md:h-40 text-chrome-lo group-hover:text-chrome-hi transition-colors" fill="currentColor" aria-hidden="true">
      <g>
        <rect x="14" y="56" width="22" height="22" rx="6" />
        <rect x="44" y="44" width="22" height="22" rx="6" opacity="0.85" />
        <rect x="20" y="82" width="22" height="22" rx="6" opacity="0.7" />
        <rect x="46" y="78" width="22" height="22" rx="6" opacity="0.55" />
        <rect x="28" y="106" width="22" height="22" rx="6" opacity="0.4" />
      </g>
    </svg>
  );
}

function NextSilhouette() {
  return (
    <svg viewBox="0 0 80 160" className="h-32 md:h-40 text-chrome-lo group-hover:text-signal transition-colors" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <rect x="14" y="16" width="52" height="128" rx="2" strokeDasharray="3 5" />
      <text x="40" y="92" textAnchor="middle" fontSize="32" fontFamily="Druk Wide, sans-serif" fontWeight="700" fill="currentColor" stroke="none">?</text>
    </svg>
  );
}
