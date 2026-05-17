import { env } from './env';

/*
 * Brief §13 — All editable copy lives in CMS. No hard-coded copy in components.
 * Brief §8  — Cache CMS responses at the edge for ≥60 minutes (revalidate: 3600).
 *
 * If no Sanity project is configured, fetchers return hard-coded launch
 * defaults so the site builds and previews before the CMS is wired in.
 *
 * Schemas live in /sanity/schemas/*.ts and map 1:1 to the fetchers below.
 */

type SanityClient = {
  fetch: <T>(
    query: string,
    params?: Record<string, unknown>,
    opts?: { next?: { revalidate: number } }
  ) => Promise<T>;
};

let clientPromise: Promise<SanityClient | null> | null = null;

function getClient(): Promise<SanityClient | null> {
  if (clientPromise) return clientPromise;
  if (!env.SANITY_PROJECT_ID) return Promise.resolve(null);
  clientPromise = import('@sanity/client')
    .then(({ createClient }) =>
      createClient({
        projectId: env.SANITY_PROJECT_ID!,
        dataset: env.SANITY_DATASET,
        apiVersion: '2024-05-01',
        useCdn: env.NODE_ENV === 'production',
        token: env.SANITY_API_READ_TOKEN,
        perspective: 'published',
      }) as unknown as SanityClient
    )
    .catch((err) => {
      console.error('[sanity] failed to init client', err);
      return null;
    });
  return clientPromise;
}

async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  const c = await getClient();
  if (!c) return fallback;
  try {
    const res = await c.fetch<T>(query, {}, { next: { revalidate: 3600 } });
    return res ?? fallback;
  } catch (err) {
    console.error('[sanity] fetch failed, using fallback:', err);
    return fallback;
  }
}

/* ------------------------------------------------------------ image url */

/**
 * Lightweight image URL builder. Avoids pulling @sanity/image-url into the
 * client bundle. Asset refs from GROQ look like:
 *   image-abc123-1200x800-jpg
 */
export type SanityImageRef = {
  asset: { _ref?: string; _id?: string; url?: string };
  alt?: string;
};

export function urlForRef(ref: SanityImageRef | undefined, w = 1600, q = 80): string {
  if (!ref?.asset) return '';
  if (ref.asset.url) {
    return `${ref.asset.url}?w=${w}&q=${q}&auto=format`;
  }
  const id = ref.asset._ref || ref.asset._id;
  if (!id || !env.SANITY_PROJECT_ID) return '';
  const stripped = id.replace(/^image-/, '');
  const lastDash = stripped.lastIndexOf('-');
  if (lastDash === -1) return '';
  const idAndDims = stripped.slice(0, lastDash);
  const fmt = stripped.slice(lastDash + 1);
  return `https://cdn.sanity.io/images/${env.SANITY_PROJECT_ID}/${env.SANITY_DATASET}/${idAndDims}.${fmt}?w=${w}&q=${q}&auto=format`;
}

/* ------------------------------------------------------------ Hero */

export type HeroContent = {
  phrases: string[];
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export const getHeroContent = (): Promise<HeroContent> =>
  safeFetch<HeroContent>(
    `*[_type == "hero"][0]{ phrases, subheadline, ctaPrimary, ctaSecondary }`,
    {
      phrases: ['BUILT FOR MOVEMENT', 'ENERGY FOR THE OBSESSED', 'PERFORMANCE MODE', 'NO OFF SWITCH'],
      subheadline:
        'ATHLENCE is the movement for a generation obsessed with becoming better. BLAZE is the first product powering it.',
      ctaPrimary: 'Get Early Access',
      ctaSecondary: 'See the Movement',
    }
  );

/* ------------------------------------------------------------ Vision (Movement) */

export type VisionContent = {
  eyebrow: string;
  heading: string;
  body: string;
  values: string[];
};

export const getVisionContent = (): Promise<VisionContent> =>
  safeFetch<VisionContent>(
    `*[_type == "vision"][0]{ eyebrow, heading, body, values }`,
    {
      eyebrow: 'The Movement',
      heading: 'For a generation obsessed with becoming better.',
      body:
        'ATHLENCE is the home for athletes, runners, lifters, fighters, and creator-athletes shaping modern performance culture. Ambition. Discipline. Movement. Sharpened daily, refused to be average.',
      values: ['Ambition', 'Discipline', 'Movement', 'Performance', 'Energy', 'Competition'],
    }
  );

/* ------------------------------------------------------------ Blaze */

export type BlazeContent = {
  eyebrow: string;
  beats: string[];
  closer: string;
  telemetry: { label: string; value: string }[];
};

export const getBlazeContent = (): Promise<BlazeContent> =>
  safeFetch<BlazeContent>(
    `*[_type == "blaze"][0]{ eyebrow, beats, closer, telemetry }`,
    {
      eyebrow: 'The First Product',
      beats: ['ENERGY.', 'FOR THE OBSESSED.', 'BLAZE.'],
      closer:
        'BLAZE is the first product from ATHLENCE — a performance energy drink built for the run, the lift, the race. Clean caffeine, real ingredients, designed to be lived in.',
      telemetry: [
        { label: 'PROFILE', value: 'CLEAN CAFFEINE' },
        { label: 'STATE', value: 'PERFORMANCE MODE' },
        { label: 'LAUNCH', value: 'COMING SOON' },
      ],
    }
  );

/* ------------------------------------------------------------ Culture */

export type CultureContent = {
  eyebrow: string;
  heading: string;
  marquee: string[];
  media: Array<{ image: SanityImageRef; alt: string; tag?: string }>;
};

export const getCultureContent = (): Promise<CultureContent> =>
  safeFetch<CultureContent>(
    `*[_type == "culture"][0]{
      eyebrow, heading, marquee,
      media[]{ alt, tag, image{ asset->{_id, url} } }
    }`,
    {
      eyebrow: 'Performance Culture',
      heading: 'The work is the religion.',
      marquee: ['WAKE EARLY', 'TRAIN HARDER', 'FAIL FORWARD', 'NO OFF SWITCH', 'OUTWORK YESTERDAY', 'BUILT FOR MOVEMENT'],
      media: [],
    }
  );

/* ------------------------------------------------------------ Community */

export type CommunityContent = {
  eyebrow: string;
  heading: string;
  body: string;
  programmes: string[];
};

export const getCommunityContent = (): Promise<CommunityContent> =>
  safeFetch<CommunityContent>(
    `*[_type == "community"][0]{ eyebrow, heading, body, programmes }`,
    {
      eyebrow: 'Join the Movement',
      heading: "You've seen the vision. Now join.",
      body:
        "Be one of the first inside. No spam, no noise — only drop dates, athlete drops, and movement events. You're early. So is BLAZE.",
      programmes: [
        'ATHLENCE Run Clubs',
        'Athlete Ambassadors',
        'Creator Collaborations',
        'Performance Challenges',
        'Community Events',
        'Fitness Partnerships',
      ],
    }
  );

/* ------------------------------------------------------------ Founder */

export type FounderContent = {
  eyebrow: string;
  heading: string;
  note: string;
  signature: string;
  reelUrl?: string;
  reelPoster?: SanityImageRef;
  reelCaption: string;
};

export const getFounderContent = (): Promise<FounderContent> =>
  safeFetch<FounderContent>(
    `*[_type == "founder"][0]{
      eyebrow, heading, note, signature, reelUrl, reelCaption,
      reelPoster{ asset->{_id, url} }
    }`,
    {
      eyebrow: 'Founder Journey',
      heading: 'Built by hand. Tested in the gym.',
      note:
        'ATHLENCE started in a room with a notebook, a kettlebell, and a question: what would the perfect fuel actually feel like? Eighteen months on formula, design, and manufacturing — listening to athletes, not focus groups. BLAZE is what we got. It will not be the last thing we make.',
      signature: '— The Founder',
      reelCaption: '▸ Behind the scenes · Factory · 03:41',
    }
  );

/* ------------------------------------------------------------ Future Products */

export type FutureProduct = {
  name: string;
  teaser: string;
  silhouette?: SanityImageRef;
};

export type FutureContent = {
  eyebrow: string;
  heading: string;
  body: string;
  products: FutureProduct[];
  disclaimer: string;
};

export const getFutureContent = (): Promise<FutureContent> =>
  safeFetch<FutureContent>(
    `*[_type == "future"][0]{
      eyebrow, heading, body, disclaimer,
      products[]{ name, teaser, silhouette{ asset->{_id, url} } }
    }`,
    {
      eyebrow: 'The Future of ATHLENCE',
      heading: 'BLAZE is the start.',
      body:
        'ATHLENCE is a scalable ecosystem for athletes who refuse to plateau. BLAZE is the first chapter — the fuel. What comes next is the rest of the system.',
      products: [
        { name: 'HONEY', teaser: 'Single-origin energy. Field-tested.' },
        { name: 'GUMMIES', teaser: 'Functional chews. No sugar crash.' },
        { name: 'ATHLETE ECOSYSTEM', teaser: 'Run clubs, ambassadors, and creator drops.' },
      ],
      disclaimer: 'Concept renders. Final products in development.',
    }
  );

/* ------------------------------------------------------------ Site Settings */

export type SiteSettings = {
  instagramHandle: string;
  youtubeHandle: string;
  tiktokHandle: string;
  contactEmail: string;
  legalEntity: string;
};

export const getSiteSettings = (): Promise<SiteSettings> =>
  safeFetch<SiteSettings>(
    `*[_type == "settings"][0]{ instagramHandle, youtubeHandle, tiktokHandle, contactEmail, legalEntity }`,
    {
      instagramHandle: 'athlence',
      youtubeHandle: 'athlence',
      tiktokHandle: 'athlence',
      contactEmail: 'hello@athlence.com',
      legalEntity: 'ATHLENCE Performance Ltd.',
    }
  );

/* ------------------------------------------------------------ Legal */

export type LegalDocument = {
  title: string;
  body: string;
  effectiveDate: string;
};

export const getLegalDocument = (slug: 'privacy' | 'terms'): Promise<LegalDocument> =>
  safeFetch<LegalDocument>(
    `*[_type == "legal" && slug.current == "${slug}"][0]{ title, body, effectiveDate }`,
    slug === 'privacy'
      ? {
          title: 'Privacy Policy',
          body:
            'ATHLENCE collects only the data needed to send you launch communications: your email, optional first name, and optional city. We never sell your data. We use ConvertKit or Resend as our email service provider, Plausible for privacy-friendly analytics, and Meta Pixel for advertising attribution where consent is given. You can unsubscribe at any time via any email we send.',
          effectiveDate: '2025-01-01',
        }
      : {
          title: 'Terms of Service',
          body:
            'These terms govern your use of athlence.com. By submitting your email you agree to receive launch updates from ATHLENCE Performance Ltd. ATHLENCE is the parent brand; BLAZE is the first product. Final product specifications, pricing, and availability are subject to change. Concept imagery on this site is illustrative only.',
          effectiveDate: '2025-01-01',
        }
  );
