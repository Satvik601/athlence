# public/ — static assets

These files are served at the site root (no `/public` prefix in URLs).

## Required for launch

| File | Spec | Used by |
| --- | --- | --- |
| `hero-poster.avif` | 1920×1080, AVIF | Hero LCP image (`src/app/layout.tsx` preloads, `src/components/hero/Hero.tsx` renders) |
| `og-default.png` | 1200×630, PNG | OG fallback (the `/api/og` route generates dynamically, this is the safe static fallback) |
| `favicon.ico` | 32×32 multi-res .ico | Browser tab |
| `icon.png` | 512×512, PNG | App icons (PWA, etc.) |
| `apple-icon.png` | 180×180, PNG | iOS home-screen icon |

## Optional

| Path | Spec | Notes |
| --- | --- | --- |
| `fonts/druk-wide-bold.woff2` | WOFF2 | Drop in and uncomment `@font-face` in `src/styles/globals.css` |
| `fonts/sohne.woff2` | WOFF2 | Same |
| `videos/founder-reel.mp4` | ≤ 3MB, 720p, muted, looping | Used by `src/components/founder/Founder.tsx` if no Sanity URL is set |
| `3d/blaze.glb` | Draco-compressed | When final BLAZE 3D arrives. See `docs/HANDOVER.md` for swap procedure. |

## How asset paths work

- `public/hero-poster.avif` → reachable at `/hero-poster.avif`
- `public/images/foo.png` → reachable at `/images/foo.png`
- Next.js will optimise images served via `<Image src="/...">` with `next/image`

All asset paths in this codebase point to the locations listed above. If you move or rename a file, search the codebase for the old path before deleting.
