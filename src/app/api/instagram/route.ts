import { NextRequest, NextResponse } from 'next/server';
import { getInstagramFeed } from '@/lib/instagram';

/*
 * Brief §5.7 — IG feed served via Graph API, edge-cached 60min minimum.
 *
 * Primary path is server-side in <InstagramFeed /> (RSC). This route exists for:
 *   - client-side optional revalidation (?revalidate=1)
 *   - third-party tools that want a JSON endpoint
 *
 * Auth via INSTAGRAM_ACCESS_TOKEN. Falls through to KV cache then placeholder tiles.
 */
export const runtime = 'edge';
export const revalidate = 3600; // 60min per brief §8

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const force = url.searchParams.get('revalidate') === '1';
  const limit = Number(url.searchParams.get('limit') ?? '8');

  try {
    const items = await getInstagramFeed(Math.min(Math.max(limit, 1), 24));

    return NextResponse.json(
      { items, count: items.length },
      {
        headers: {
          // Cache at edge for 60min, allow stale-while-revalidate for 24h
          'Cache-Control': force
            ? 'no-store'
            : 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    // Never break the section — return empty array, log the failure.
    console.error('[api/instagram] fetch failed', err);
    return NextResponse.json(
      { items: [], count: 0, error: 'fetch_failed' },
      { status: 200 }
    );
  }
}
