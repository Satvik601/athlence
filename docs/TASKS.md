# TASKS — ATHLENCE Build Punch-List

> Use this file as the working backlog when you open the repo in Claude Code. Tasks are ordered by priority. Tick items as you complete them.
>
> All tasks reference sections of `docs/ARCHITECTURE.md` and the original `ATHLENCE_Website_Developer_Brief.docx`. Keep both open while you work.

---

## P0 — Boot the project (do these first, in order)

- [ ] Install dependencies: `pnpm install` (or `npm install`)
- [ ] Copy `.env.example` → `.env.local`. Set `SITE_URL=http://localhost:3000` at minimum.
- [ ] Run `pnpm dev` and confirm the homepage renders without errors. **Every integration degrades gracefully — you should see the full design with zero env vars set.**
- [ ] Run `pnpm typecheck` and `pnpm lint` to confirm a clean baseline.
- [ ] Read `docs/ARCHITECTURE.md` end-to-end before changing any code.

## P0 — Code review pass (verify what's already built)

The previous build session wrote most of the codebase. Before adding anything new, spot-check that the following are intact and behave as the architecture doc describes:

- [ ] `src/app/layout.tsx` — root metadata, fonts, skip link, providers, scripts
- [ ] `src/app/page.tsx` — composes 9 sections in brief §5 order
- [ ] `src/components/hero/Hero.tsx` — static AVIF poster is the LCP, R3F scene is dynamic
- [ ] `src/components/hero/BlazeCanScene.tsx` — R3F Canvas, procedural can geometry, postprocessing
- [ ] `src/components/blaze/BlazeShowcase.tsx` — sticky scrub on desktop, disabled on mobile
- [ ] `src/components/community/SignupForm.tsx` — honeypot, Zod, `useTransition`, analytics events
- [ ] `src/app/api/signup/route.ts` — edge runtime, Zod parse, rate-limit, ESP adapter call
- [ ] `src/lib/motion.ts` — `shouldAnimate()` respects reduced-motion + save-data + iOS Safari
- [ ] `src/lib/sanity.ts` — fetchers return hardcoded defaults when no project configured
- [ ] `src/lib/instagram.ts` — three-tier fallback (live → KV → placeholders)

If anything is missing or empty, regenerate it from the architecture doc.

---

## P1 — Critical content & assets (block production launch)

- [ ] Drop a real AVIF poster for the hero into `public/hero-poster.avif`. Width 1920, height 1080 recommended. The current build expects this exact path (referenced from `src/app/layout.tsx` preload + `src/components/hero/Hero.tsx`). Until it lands, the hero will render without the LCP image (R3F scene + gradient will fill it).
- [ ] Drop the OG fallback image into `public/og-default.png` (1200×630). `/api/og` generates one dynamically, but this static file is the safe fallback.
- [ ] Generate favicons. Drop into `public/`: `favicon.ico`, `icon.png` (512×512), `apple-icon.png` (180×180). Next.js App Router auto-wires them.
- [ ] Replace the placeholder Founder reel. Put `public/videos/founder-reel.mp4` (≤ 3MB, 720p, muted, looping) — or wire a real Mux/Cloudflare Stream URL into Sanity.
- [ ] If you have licences for Druk Wide Bold and Söhne, drop `.woff2` files into `public/fonts/` and uncomment the `@font-face` blocks at the top of `src/styles/globals.css`.

## P1 — 3D asset swap

- [ ] When the final BLAZE can `.glb` is delivered, follow the procedure in `docs/HANDOVER.md` → "3D asset swap". The procedural placeholder in `BlazeCanScene.tsx` includes a swap comment showing the exact path.
- [ ] Compress geometry with Draco. Compress textures with KTX2.
- [ ] Verify the canvas still mounts only after idle and only on visible.

---

## P1 — CMS wiring

- [ ] Create a Sanity project (free tier is fine for launch). `pnpm dlx sanity@latest init` if you want to bootstrap from scratch, otherwise reuse the schemas in `sanity/schemas/`.
- [ ] Set `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` in `.env.local`.
- [ ] Mount Studio at `/studio` — already wired in `src/app/studio/[[...index]]/page.tsx`.
- [ ] Populate the launch content: hero phrases, vision manifesto, culture marquees, founder note, future products.
- [ ] Give marketing access. Confirm preview environment works.

## P1 — Integrations

- [ ] **Instagram** — create a long-lived access token via Facebook Graph API. Set `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_USER_ID`. Confirm `/api/instagram` returns real tiles.
- [ ] **Email (ESP)** — pick one of:
  - ConvertKit: set `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID`. Native double opt-in.
  - Resend: set `RESEND_API_KEY`, `RESEND_FROM`. Confirmation email template in `src/lib/esp.ts`.
- [ ] **Analytics** — set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `META_PIXEL_ID`. Verify the four events fire from a real browser session.
- [ ] **Rate limit storage** — set `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` (Vercel KV). In-memory fallback works for dev; do not ship to prod without KV.

---

## P2 — Polish & QA

- [ ] Run Lighthouse on mobile profile. Target 90/95/95/95. Profile with WebPageTest on a real mid-tier Android over 4G.
- [ ] Run `axe` accessibility audit. Confirm zero violations.
- [ ] Cross-browser QA: latest Safari (iOS + macOS), Chrome (Android + desktop), Firefox, Edge.
- [ ] Test `prefers-reduced-motion`: marquees freeze, 3D swaps to poster, rotating headline stops.
- [ ] Test `Save-Data` header: 3D never mounts, IG images use lowest-quality.
- [ ] Test keyboard-only nav: skip link works, focus order is logical, mobile menu traps focus while open and restores on close.
- [ ] Verify schema.org with Google Rich Results Test.
- [ ] Verify OG card renders correctly on Facebook Sharing Debugger, Twitter Card Validator, LinkedIn Post Inspector.
- [ ] Smoke-test signup flow: real email, real ESP, confirm double opt-in lands in inbox.
- [ ] Confirm sticky early-access CTA appears after hero scrolls out AND disappears when community section enters viewport.

---

## P2 — Deployment

- [ ] Import the repo into Vercel. Production branch `main` → `athlence.com`.
- [ ] Add all env vars to Vercel project settings (Production + Preview + Development).
- [ ] Set up `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` for preview branches. Confirm `middleware.ts` gates them.
- [ ] Verify production deploy: clean Lighthouse, real signup test, real IG feed, real OG.
- [ ] Set up Vercel KV in the project. Connect to env vars.
- [ ] Set up domain DNS + SSL.

## P3 — Stretch (nice-to-have, post-launch)

- [ ] Real run-club photography to replace gradient culture strips
- [ ] Real athlete reels in culture section
- [ ] More sophisticated 3D — animated bloom particles, condensation droplets
- [ ] Reduced-motion variant of the BLAZE Showcase that uses static stills instead of scroll-scrub
- [ ] A/B test rotating-headline phrases (engineer the experiment via Sanity boolean flags + Plausible custom props)
- [ ] Lightweight athlete-of-the-week module (Sanity schema + section between Culture and Community)

---

## Hard rules to keep in mind while building

1. **ATHLENCE on top, BLAZE underneath.** Visible in nav, hero, vision, showcase, future, footer.
2. **Never an e-commerce page.** No grid of features. No ingredient list. No "Add to cart".
3. **Mobile-first.** 390px is your baseline.
4. **Motion budget.** If an animation doesn't earn its frames, kill it.
5. **No fake packaging.** Future products are silhouettes.
6. **No hard-coded copy in components.** Everything flows through `lib/sanity.ts`.

---

## What to ask Claude Code when you open the project

Good first prompts to give Claude Code:

```
Read docs/ARCHITECTURE.md and docs/TASKS.md. Confirm what's built and what's missing.
```

```
The hero is showing a gradient instead of the AVIF poster. Diagnose and fix.
```

```
Wire up Sanity Studio at /studio. My project ID is X. Use the schemas in sanity/schemas/.
```

```
Add a Lighthouse CI step to .github/workflows/ that runs on every PR.
```

```
Generate the OG image at /api/og. Match the design in docs/ARCHITECTURE.md §12.
```
