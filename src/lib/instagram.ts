import { env } from './env';

/*
 * Brief §5.7 + §8 — Instagram Graph API ingestion, 60-min server cache,
 * graceful failure (Meta outage must not break the page).
 *
 * Strategy:
 *   1. Try Graph API (server-side, edge-cacheable).
 *   2. On failure, try last successful response from Vercel KV.
 *   3. On total failure, return 8 placeholder tiles so layout doesn't shift.
 */

export type IgPost = {
  id: string;
  permalink: string;
  thumbnail: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
};

const PLACEHOLDER: IgPost[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `placeholder-${i}`,
  permalink: 'https://instagram.com/athlence',
  thumbnail: '',
  caption: '',
  mediaType: 'IMAGE',
}));

export async function getInstagramFeed(limit = 8): Promise<IgPost[]> {
  if (!env.INSTAGRAM_ACCESS_TOKEN || !env.INSTAGRAM_USER_ID) {
    return PLACEHOLDER.slice(0, limit);
  }

  const fields = 'id,permalink,thumbnail_url,media_url,caption,media_type';
  const url = `https://graph.instagram.com/${env.INSTAGRAM_USER_ID}/media?fields=${fields}&limit=${limit}&access_token=${env.INSTAGRAM_ACCESS_TOKEN}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`IG ${res.status}`);
    const json = (await res.json()) as { data: Array<{ id: string; permalink: string; thumbnail_url?: string; media_url: string; caption?: string; media_type: IgPost['mediaType'] }> };
    const posts: IgPost[] = json.data.map((p) => ({
      id: p.id,
      permalink: p.permalink,
      thumbnail: p.thumbnail_url ?? p.media_url,
      caption: (p.caption ?? '').slice(0, 120),
      mediaType: p.media_type,
    }));
    await persistFallback(posts);
    return posts;
  } catch (err) {
    console.warn('[instagram] graph failed, trying KV fallback', err);
    const cached = await readFallback();
    return cached.length > 0 ? cached : PLACEHOLDER.slice(0, limit);
  }
}

async function persistFallback(posts: IgPost[]): Promise<void> {
  if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) return;
  try {
    await fetch(`${env.KV_REST_API_URL}/set/ig_fallback`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.KV_REST_API_TOKEN}` },
      body: JSON.stringify(posts),
    });
  } catch {
    /* non-fatal */
  }
}

async function readFallback(): Promise<IgPost[]> {
  if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) return [];
  try {
    const r = await fetch(`${env.KV_REST_API_URL}/get/ig_fallback`, {
      headers: { Authorization: `Bearer ${env.KV_REST_API_TOKEN}` },
    });
    if (!r.ok) return [];
    const { result } = (await r.json()) as { result: string };
    return result ? (JSON.parse(result) as IgPost[]) : [];
  } catch {
    return [];
  }
}
