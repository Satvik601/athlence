# HANDOVER — Operating the ATHLENCE site

For developers and the marketing team after launch.

---

## 1. Deploy

### Production deploy (Vercel)

1. Push to `main`. Vercel auto-deploys.
2. Verify the deploy at the preview URL **before** promoting to `athlence.com`.
3. Promote via the Vercel dashboard if you have a manual-promotion gate, otherwise it's live the moment `main` updates.

### Required production env vars (Vercel → Project → Settings → Environment Variables)

| Variable | Required? | Why |
| --- | --- | --- |
| `SITE_URL` | yes | Absolute canonical URLs, OG images, sitemap |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | recommended | Analytics |
| `META_PIXEL_ID` | recommended | Ad attribution |
| `SANITY_PROJECT_ID` | yes for CMS | CMS reads |
| `SANITY_DATASET` | yes for CMS | Defaults to `production` |
| `SANITY_API_VERSION` | yes for CMS | Defaults to `2024-05-01` |
| `INSTAGRAM_ACCESS_TOKEN` | yes for live IG feed | Else placeholders |
| `INSTAGRAM_USER_ID` | yes for live IG feed | Else placeholders |
| `CONVERTKIT_API_KEY` + `CONVERTKIT_FORM_ID` | one ESP required | OR Resend |
| `RESEND_API_KEY` + `RESEND_FROM` | one ESP required | OR ConvertKit |
| `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` | yes for prod | Rate limit + IG cache |
| `BASIC_AUTH_USER` + `BASIC_AUTH_PASS` | preview only | Gates preview branches |

The site will render fully without any of these — every integration has a graceful fallback. They unlock real functionality, not visual completeness.

### Preview environment

Every PR opens a preview at `<branch>-athlence.vercel.app`, gated by basic auth (`middleware.ts`). Marketing and stakeholders use this for review. The `robots.txt` returns `Disallow: /` on preview hosts so they never get indexed.

---

## 2. Editing content (no-code, for marketing)

All editable copy lives in Sanity Studio at `https://athlence.com/studio` (production) or `<preview>.vercel.app/studio` (preview).

### What you can edit without a developer

| Section | What's editable | Schema |
| --- | --- | --- |
| Site settings | Title, meta description, social handles, IG handle | `siteSettings` |
| Hero | Rotating headline phrases (array), sub-headline, CTA labels | `hero` |
| Vision | Manifesto headline, body copy, values strip, hierarchy line | `vision` |
| Culture | Marquee phrases, strip card images and captions | `culture` |
| Founder | Founder note, reel video URL, caption | `founder` |
| Future Products | Card titles, status labels, target years, silhouette type | `future` |

### Image uploads

Sanity runs every upload through automatic optimisation (resize + format conversion). Hero images should be uploaded at 2400px on the longest edge for crisp rendering on retina displays.

### Preview before publish

Sanity Studio includes a "Preview" button on every document. Click it to see your changes on a staging URL before hitting Publish.

---

## 3. Swapping the BLAZE 3D asset

When the final BLAZE can `.glb` arrives from the 3D vendor, follow this procedure:

1. Compress the geometry:
   ```bash
   pnpm dlx gltf-pipeline -i blaze.glb -o public/3d/blaze.glb -d
   ```
2. Compress the textures (if not already KTX2):
   ```bash
   pnpm dlx @gltf-transform/cli ktx public/3d/blaze.glb public/3d/blaze.glb
   ```
3. Open `src/components/hero/BlazeCanScene.tsx`. Find the comment that begins `// SWAP PROCEDURE`. It explains exactly what to replace.
4. The procedural placeholder is a `<mesh>` group. Delete it. Add:
   ```tsx
   import { useGLTF } from '@react-three/drei';
   const { scene } = useGLTF('/3d/blaze.glb');
   return <primitive object={scene} dispose={null} />;
   ```
5. Re-test the hero on a mid-tier mobile device. The scene should still mount only after idle.

The same swap applies to `BlazeCanSVG` in `src/components/blaze/BlazeShowcase.tsx` if you have a hi-res still rendered from the new asset.

---

## 4. Adding a future product

When a second product is ready to announce:

1. Open Sanity Studio → Future Products schema.
2. Add a new card. Pick a silhouette type from the dropdown (`can`, `shot`, `gummy`, `next`, or upload a custom silhouette SVG).
3. Set status: `Concept`, `In Dev`, `Coming Soon`, or `Live`.
4. Set target year.
5. Publish. The Future Products section reorders automatically by status.

When the product fully launches and gets a dedicated section (like BLAZE has the Showcase), spin up a new component under `src/components/<product>/` following BlazeShowcase as the template. Add an anchor to `Nav.tsx`. Reorder `page.tsx`.

---

## 5. Tracking & analytics

### Where events fire

| Event | Source | When |
| --- | --- | --- |
| `hero_cta_click` | `HeroCTAs.tsx` | Either hero CTA clicked |
| `signup_started` | `SignupForm.tsx` | First focus on email field |
| `signup_completed` | `SignupForm.tsx` | API returned ok |
| `ig_follow_click` | `InstagramFeed.tsx`, `SignupForm.tsx` success state | Any IG link clicked |

Events go to Plausible + Meta Pixel via the single `track()` function in `src/lib/analytics.ts`. The `utm_source` cookie is included as a custom property.

### Adding a new event

1. Add the event constant to `src/lib/analytics.ts` (the union type at the top).
2. Call `track('your_event', { optional_props })` from the component.
3. In Plausible, add the goal in the dashboard. In Meta Pixel, set up a standard or custom event.

---

## 6. Forms & email

### How a signup flows

1. User submits → client `useTransition` wraps the fetch (keeps INP < 200ms)
2. `POST /api/signup` → Zod validation → honeypot check → rate-limit check (5/min/IP)
3. ESP adapter (`src/lib/esp.ts`) calls ConvertKit or Resend
4. Double opt-in email sent (ConvertKit native, or Resend with `src/lib/esp.ts` template)
5. Success returned. Client shows aria-live success state.
6. `signup_completed` event fires.

### Switching ESP

Edit `src/lib/esp.ts`. The adapter pattern means the route doesn't change. Add a third provider by adding another `if (process.env.NEW_PROVIDER_KEY)` branch.

---

## 7. Performance regression catches

Before any release, the GitHub Action (when wired) runs Lighthouse CI against the home route. Thresholds:

- Performance ≥ 90 mobile
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95
- LCP < 2500ms
- CLS < 0.1
- TBT < 200ms

If a deploy fails these, the PR check goes red. Fix or override (only with founder approval).

---

## 8. Common operations cheat-sheet

| Task | Command |
| --- | --- |
| Local dev | `pnpm dev` |
| Production build | `pnpm build && pnpm start` |
| Type check | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Lighthouse against local | `pnpm dlx lighthouse http://localhost:3000 --view` |
| Refresh IG cache | Hit `/api/instagram?revalidate=1` (or wait 60min) |
| Bypass rate limit (dev only) | Set `NODE_ENV=development` — rate-limit module returns true |
| Generate sitemap manually | `pnpm build` does this; check `out/sitemap.xml` |

---

## 9. Troubleshooting

**The hero is showing a gradient instead of the can.**
The AVIF poster is missing. Drop one at `public/hero-poster.avif` (1920×1080 recommended).

**3D scene never appears.**
Check the browser console — likely WebGL is disabled, or `prefers-reduced-motion` is on. This is by design.

**Signup form returns 500.**
Check Vercel logs. Most likely cause: ESP env var missing. Confirm one of `CONVERTKIT_API_KEY` or `RESEND_API_KEY` is set in production.

**IG feed shows placeholders in production.**
`INSTAGRAM_ACCESS_TOKEN` expired (they last 60 days). Refresh via Graph API or your token-management service.

**Studio at `/studio` returns 404.**
`SANITY_PROJECT_ID` is not set. Add it and redeploy.

**OG image looks broken on share.**
Hit `/api/og` directly in a browser. If it errors, check that the fonts referenced inside `route.tsx` exist in `public/fonts/`. The route falls back to system fonts if not.

---

## 10. Who owns what

| Domain | Owner |
| --- | --- |
| Codebase | Engineering |
| Sanity content | Marketing |
| Brand assets (logos, photography, video) | Brand / Creative |
| 3D can asset | 3D vendor / in-house 3D |
| ESP account, Meta Pixel, Plausible | Growth |
| Domain DNS, Vercel project, KV | Engineering |
