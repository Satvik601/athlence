import Image from 'next/image';
import dynamic from 'next/dynamic';
import { RotatingHeadline } from './RotatingHeadline';
import { HeroCTAs } from './HeroCTAs';
import { getHeroContent } from '@/lib/sanity';

/*
 * Brief §5.1 — Hero. Most important section. First impression in 2 seconds.
 *
 * RENDERING STRATEGY (critical for LCP < 2.5s, brief §8):
 *   1. <Image> poster is the LCP element. RSC, priority, fetchPriority=high,
 *      preloaded in <head>, AVIF.
 *   2. Headline is real <h1> HTML — accessible and SEO-targeted.
 *   3. R3F can scene mounts on top of poster after idle + in-view, then
 *      fades poster out. So users see something in <1s, cinematic upgrade
 *      arrives without blocking metrics.
 *
 * Brief §5.1 — copy hierarchy: ATHLENCE eyebrow → BIG rotating headline →
 *   movement subhead → two CTAs. ATHLENCE named BEFORE BLAZE.
 */

const BlazeCanScene = dynamic(
  () => import('./BlazeCanScene').then((m) => m.BlazeCanScene),
  { ssr: false, loading: () => null },
);

export async function Hero() {
  const content = await getHeroContent();

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden bg-ink vignette grain"
      aria-label="ATHLENCE — Built for Movement"
    >
      {/* LCP element — static AVIF poster */}
      <div className="absolute inset-0">
        <Image
          src="/hero-poster.avif"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center opacity-80"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
      </div>

      <BlazeCanScene />

      <div className="relative z-10 container min-h-[100svh] flex flex-col justify-between pt-28 md:pt-32 pb-12 md:pb-20">
        <p className="font-mono text-caption uppercase tracking-[0.3em] text-chrome-lo">
          <span className="text-signal">●</span>&nbsp;&nbsp;ATHLENCE / THE MOVEMENT
        </p>

        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          <h1 className="font-display text-display-xl uppercase leading-[0.92] tracking-tight">
            <RotatingHeadline phrases={content.phrases} />
          </h1>
          <p className="mt-8 md:mt-10 font-sans text-body-lg text-chrome max-w-xl">
            {content.subheadline}
          </p>
        </div>

        <HeroCTAs
          primary={content.ctaPrimary ?? 'Join the Movement'}
          secondary={content.ctaSecondary ?? 'Get Early Access'}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3 pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-chrome-lo">Scroll</span>
        <span className="w-px h-12 bg-gradient-to-b from-chrome-lo to-transparent" />
      </div>
    </section>
  );
}
