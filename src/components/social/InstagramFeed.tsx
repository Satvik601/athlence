import { getInstagramFeed } from '@/lib/instagram';

/*
 * Brief §5.7 — Instagram feed. RSC, fetches server-side with 60min edge cache.
 *
 * Layout: horizontal scroll-snap strip on mobile, 4-col grid on desktop.
 */
export async function InstagramFeed() {
  const posts = await getInstagramFeed(8);

  return (
    <div className="mt-8 flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-5 md:mx-0 px-5 md:px-0 pb-4 md:pb-0">
      {posts.map((p, i) => (
        <a
          key={p.id}
          href={p.permalink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.caption ? `Instagram post: ${p.caption}` : 'Instagram post'}
          className="relative shrink-0 w-[60vw] md:w-auto aspect-square snap-center group overflow-hidden bg-ink-3"
        >
          {p.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.thumbnail} alt={p.caption || `ATHLENCE post ${i + 1}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            /* Placeholder when token absent — branded swatch, never empty */
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  i % 2
                    ? 'radial-gradient(ellipse at 30% 30%, rgba(225,29,42,0.35), transparent 60%), #111114'
                    : 'radial-gradient(ellipse at 70% 70%, rgba(124,196,255,0.25), transparent 60%), #1a1a1f',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute bottom-3 left-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-chrome-hi opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
            {p.caption || '@athlence'}
          </span>
        </a>
      ))}
    </div>
  );
}
