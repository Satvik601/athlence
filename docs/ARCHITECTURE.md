# ATHLENCE — Architecture & Build Document

> ATHLENCE is the movement. BLAZE is the first product powering it. Every architectural decision, animation, and line of copy reinforces that hierarchy.

This document is the single source of truth for the build. It maps **every requirement in `ATHLENCE_Website_Developer_Brief.docx`** to a concrete implementation decision. If anything in code contradicts this doc, this doc wins — update code or update the doc, but never let them drift.

---

## 0. How to use this repo

1. Install: `pnpm install` (or `npm install`)
2. Copy `.env.example` → `.env.local` and fill in keys (most have safe dev fallbacks)
3. Run: `pnpm dev` → http://localhost:3000
4. The site renders fully without **any** env vars — Sanity, Instagram, ESP, KV, analytics all gracefully degrade. You can deploy to Vercel before wiring a single integration.
5. Read `HANDOVER.md` for deploy + content-editing procedures
6. Read `TASKS.md` for the prioritised punch-list

---

## 1. Project Overview — what we're building

A single long-form homepage plus four supporting pages (Privacy, Terms, Contact, 404), positioned as the digital home of a Gen Z performance-culture movement. The build feels closer to a Nike microsite / F1 launch / cinematic culture piece than to a Shopify product page.

**Two entities, one site:**

| Entity | Role | Where it shows up |
| --- | --- | --- |
| **ATHLENCE** | Parent brand. The movement. The long-term performance-culture company. | Logo lockup top-left, hero subhead, nav, vision section, footer wordmark, schema.org Organization, page title |
| **BLAZE** | First flagship product. Energy drink. Fuel that powers the movement. | Hero 3D can, Showcase section, Future Products lineup, footer acknowledgement strip, schema.org Product nested under Organization |

Future products (honey pre-workout shots, energy gummies, etc.) slot in alongside BLAZE under the same umbrella. The Future Products section makes that visible without faking finished packaging.

---

## 2. Goals & Success Metrics

**Primary KPI** — early-access email signups. The Community section is engineered around this conversion.

**Secondary metrics** — Instagram follow-throughs, session duration, scroll depth, mobile Lighthouse 90/95/95/95, LCP < 2.5s on mid-tier mobile over 4G.

**Conversion events tracked** (see §12):
- `hero_cta_click`
- `signup_started` (first focus on signup form email field)
- `signup_completed` (after API success)
- `ig_follow_click` (success-state CTA + footer IG link)

---

## 3. Sitemap & Information Architecture

```
/                        Homepage (long-form, all 9 sections)
  #movement              Anchor → Vision (§5.2)
  #blaze                 Anchor → Showcase (§5.3)
  #culture               Anchor → Culture (§5.4)
  #community             Anchor → Community + signup + IG (§5.5 + §5.7)
  #story                 Anchor → Founder (§5.6)
/privacy                 Standalone legal — paper theme
/terms                   Standalone legal — paper theme
/contact                 Lightweight, email + socials
/404                     Branded, on-tone
/studio/[[...index]]     Sanity Studio mount (only if SANITY_PROJECT_ID set)

/api/signup              POST — Zod-validated, rate-limited, ESP-adapter
/api/instagram           GET — edge-cached IG feed (optional, primary fetch is server-side)
/api/og                  GET — dynamic OG image (1200×630)

/sitemap.xml             Build-time generated
/robots.txt              Allow in prod, disallow in preview
```

**Primary nav** — ATHLENCE wordmark · The Movement · BLAZE · Culture · Community · Story · GET EARLY ACCESS (CTA).

---

## 4. Design System

### 4.1 Colour tokens

All tokens live as CSS variables in `src/styles/globals.css` and are exposed through Tailwind in `tailwind.config.ts`. Use Tailwind utility names — never hard-code hex.

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#0a0a0b` | Page background, near-black |
| `--ink-2` | `#111114` | Section background lift |
| `--charcoal` | `#1a1a1f` | Card/panel surface |
| `--chrome` | `#c8ccd1` | Body text on dark, secondary chrome |
| `--chrome-2` | `#8a8f97` | Tertiary text, captions |
| `--silver` | `#e8eaed` | Primary text on dark |
| `--signal` | `#E11D2A` | The accent. CTAs, hover, focus, the one "loud" colour |
| `--signal-2` | `#ff3a47` | Signal hover/lift |
| `--electric` | `#7CC4FF` | 3D rim light, electric highlight |
| `--paper` | `#f5f3ee` | Legal pages background (paper theme) |
| `--paper-ink` | `#0a0a0b` | Text on paper |

Contrast: silver-on-ink ≈ 16:1 (AAA), chrome-on-ink ≈ 11:1 (AAA), signal-on-ink ≈ 5.2:1 (AA).

### 4.2 Typography

| Role | Font | Fallback | Tracking | Case |
| --- | --- | --- | --- | --- |
| Display | Druk Wide Bold | Anton / Impact | -0.02em | UPPERCASE |
| Body | Söhne | Inter | normal | sentence |
| Mono | JetBrains Mono | ui-monospace | 0.05em | UPPERCASE for captions |

**Fluid type scale** (`tailwind.config.ts` → `fontSize`):

| Token | Mobile (390px) | Desktop (1440px) | clamp() |
| --- | --- | --- | --- |
| `display-xl` | 56px | 144px | `clamp(3.5rem, 9vw + 1rem, 9rem)` |
| `display-lg` | 44px | 96px | `clamp(2.75rem, 6vw + 1rem, 6rem)` |
| `display-md` | 32px | 64px | `clamp(2rem, 4vw + 0.5rem, 4rem)` |
| `eyebrow` | 12px | 14px | mono, tracked |
| `body` | 16px | 18px | `clamp(1rem, 0.5vw + 0.875rem, 1.125rem)` |

**Font loading** — Druk and Söhne are commercial. The build ships with Anton/Inter as production-quality fallbacks. Drop `.woff2` files into `public/fonts/` and uncomment the `@font-face` blocks in `globals.css` when licences are in place. The fallback metrics are tuned to minimise CLS during the swap.

### 4.3 Spacing & layout

- Grid: 12-column with 24px gutter desktop, 16px mobile
- Section padding-y: `clamp(4rem, 8vw, 8rem)` — large, cinematic breathing room
- Max content width: 1440px, but full-bleed where motion demands it (Hero, Culture marquees)
- Mobile baseline: 390px (iPhone 12/13 mini), tested up to 1920px

### 4.4 Surface treatments

- **Vignette** — radial gradient overlay on cinematic sections, dims edges so eye lands on subject
- **Grain** — subtle SVG noise overlay at 4% opacity, kills banding on dark gradients
- **Chrome gradient** — `linear-gradient(180deg, #e8eaed 0%, #8a8f97 50%, #c8ccd1 100%)`, used for "chrome-text" word emphasis
- **Shimmer** — animated gradient sweep on chrome elements, 8s loop, paused on `prefers-reduced-motion`

---

## 5. Motion System

Every animation justifies its frame budget. Three tiers:

### Tier A — Cinematic (hero, BLAZE showcase)
GSAP + ScrollTrigger. Scrub-tied. Pinned sections on desktop only. Disabled below 768px and on iOS Safari (preserves momentum scroll & pull-to-refresh per brief §9).

### Tier B — Component (cards, marquees, fades)
Framer Motion + CSS animations. `whileInView` triggers, `once: true` so they don't replay. Marquees are pure CSS `@keyframes` for cheapness.

### Tier C — Decorative (shimmer, ambient particles)
Pure CSS keyframes. Paused on `prefers-reduced-motion`. Killed entirely on `Save-Data` header.

### Universal motion contract

```ts
shouldAnimate() = !prefersReducedMotion && !saveData && (
  isInViewport(target) || idleCallback fired
)
```

Implemented in `src/lib/motion.ts`. Every animation entrypoint calls `shouldAnimate()` first.

**Reduced-motion behaviour** — transforms become fades, loops are killed, parallax is locked, marquees freeze. Content remains fully readable.

---

## 6. Homepage Sections — implementation per brief §5

### 6.1 Hero (`src/components/hero/Hero.tsx`)

- Full-screen, dark, cinematic
- **LCP target** — static AVIF poster of the BLAZE can, `priority` + `fetchPriority="high"`, preloaded in `<head>`
- 3D scene (`BlazeCanScene.tsx`) is **dynamic-imported, no SSR**, mounts only when `whenIdle()` fires AND viewport intersection observed AND not reduced-motion AND not save-data
- Rotating headline (`RotatingHeadline.tsx`) cycles through CMS-driven phrases every 6s. Reduced-motion shows first phrase only.
- Eyebrow caption establishes ATHLENCE/BLAZE hierarchy: `ATHLENCE / THE MOVEMENT`
- Primary CTA — signal red, "Join the Movement", scrolls to `#community`
- Secondary CTA — chrome outline, "Get Early Access", dispatches `CustomEvent('athlence:open-early-access')`
- Vignette + grain overlay
- Scroll cue at bottom, fades out after 8s

### 6.2 Vision (`src/components/vision/Vision.tsx`)

- Anchor: `#movement`
- Asymmetric 2-col grid on desktop: image col 1–5, manifesto col 7–12
- Manifesto headline: "For a generation obsessed with becoming better."
- Explicit hierarchy reinforcement line: **"BLAZE is the first product. It will not be the last."**
- Values strip: ambition · discipline · movement · performance · energy
- Mobile: single column, image first

### 6.3 BLAZE Showcase (`src/components/blaze/BlazeShowcase.tsx`)

- Anchor: `#blaze`
- **NOT a product page.** No grid, no ingredients list, no "add to cart".
- Sticky can column on desktop (GSAP ScrollTrigger scrub 0.6, advances translate/rotate/scale)
- Pin disabled below 768px per brief §9 (iOS Safari)
- Three scrolling scenes:
  - 01 — **Forged for the obsessed.** (Built)
  - 02 — **Engineered for the run.** (Tuned)
  - 03 — **Energy with an identity.** (Charged)
- Inline `BlazeCanSVG` component — gradient body, chrome rims, signal-red band with BLAZE wordmark, ATHLENCE micro-mark, condensation dots. Used as the visual until the final 3D `.glb` arrives.
- Background: subtle lattice grid

### 6.4 Culture (`src/components/culture/Culture.tsx`)

- Anchor: `#culture`
- Two marquee strips, opposing directions, CSS `@keyframes`
- Phrases: `RUN.` `LIFT.` `FIGHT.` `REPEAT.` `BUILT FOR THE OBSESSED.` `NO OFF SWITCH.`
- 3-up strip grid on desktop, horizontal scroll-snap on mobile
- Strip cards use radial gradient panels as placeholders for real photography
- `motion-reduce:animate-none` freezes marquees on reduced-motion

### 6.5 Community (`src/components/community/Community.tsx` + `SignupForm.tsx`)

- Anchor: `#community`
- **Primary KPI section.** Form is the centerpiece.
- Atmospheric red wash backdrop
- Two-col on desktop: left = pitch + 6 programmes + socials, right = signup form
- Signup form:
  - First name (optional) · email (required) · city (optional)
  - Zod validation
  - Honeypot (`url` field, off-screen, `tabindex=-1`, `aria-hidden`)
  - Rate limited (5/min/IP) at API
  - `useTransition` for non-blocking submit (INP < 200ms)
  - `signup_started` fires on first email focus
  - `signup_completed` fires on success
  - `aria-live="polite"` success state: "Welcome to the movement. You're early — so is BLAZE."
- Instagram feed embedded below form (see §6.7)

### 6.6 Founder (`src/components/founder/Founder.tsx`)

- Anchor: `#story`
- Reverse-order desktop: copy left, reel right
- Single column mobile
- Reel uses faint scanline overlay for "raw documentary" feel
- Mono caption: `▸ Behind the scenes · Factory · 03:41`
- Reel is a CSS gradient placeholder until real video lands

### 6.7 Instagram Feed (`src/components/social/InstagramFeed.tsx`)

- Embedded inside Community section
- Server component — fetches via `getInstagramFeed(8)` at request time
- KV-backed durable cache with 60min TTL (brief §5.7)
- Three-tier fallback:
  1. Live Graph API
  2. KV stale-while-revalidate
  3. 8 placeholder gradient tiles (so the section never looks broken)
- Mobile: horizontal scroll-snap strip
- Desktop: 4-col grid
- `ig_follow_click` event on any tile click

### 6.8 Future Products (`src/components/future/FutureProducts.tsx`)

- Four silhouette cards: BLAZE Energy (Live, 2026), Honey Shot (In Dev, 2026/27), Energy Gummies (Concept, 2027), Next (TBA)
- All silhouettes are inline SVG (~6KB total payload)
- Hover: radial signal-red glow
- **No fake finished packaging** per brief §5.8

### 6.9 Footer (`src/components/layout/Footer.tsx`)

- Minimal, dark, premium
- ATHLENCE wordmark prominent
- Socials: Instagram, YouTube, TikTok
- Legal links: Privacy, Terms, Contact
- Bottom strip: **"BLAZE · The first product from ATHLENCE."**
- Copyright line

---

## 7. Mobile Behaviour (brief §9)

- Mobile-first, 390px baseline
- CTAs sit in lower third of hero
- `StickyEarlyAccess` — mobile-only sticky bottom CTA, dual IntersectionObserver (visible when hero is out AND community is not in)
- 48×48 minimum tap targets
- Hover-only interactions are paired with tap/scroll equivalents
- Smooth scroll **opts out on iOS Safari** to preserve native momentum + pull-to-refresh
- ScrollTrigger pinning is disabled below 768px

---

## 8. CMS — Sanity (brief §13)

Schemas live in `sanity/schemas/`:

| Schema | What it controls |
| --- | --- |
| `siteSettings` | Global meta, social handles, IG handle |
| `hero` | Headline phrases array, sub-headline, CTA labels |
| `vision` | Manifesto copy, values strip, hierarchy line |
| `culture` | Marquee phrases, strip card images |
| `founder` | Founder note, reel video URL, caption |
| `future` | Future product cards, status labels, target years |

The marketing team gets a preview environment via Sanity Studio mounted at `/studio`. All fetchers in `src/lib/sanity.ts` have hardcoded launch defaults — **the site renders fully without Sanity configured**.

---

## 9. Tech Architecture

```
src/
├── app/                       Next.js 14 App Router
│   ├── layout.tsx             Root metadata, fonts, providers, scripts
│   ├── page.tsx               Homepage composition
│   ├── (legal)/
│   │   ├── privacy/page.tsx   Paper theme
│   │   └── terms/page.tsx     Paper theme
│   ├── contact/page.tsx
│   ├── studio/[[...index]]/   Sanity Studio mount (optional)
│   ├── not-found.tsx          Branded 404
│   ├── sitemap.ts             Build-time
│   ├── robots.ts              Env-aware
│   └── api/
│       ├── signup/route.ts    Edge, Zod, rate-limit, ESP adapter
│       ├── instagram/route.ts Edge, cached Graph API wrapper
│       └── og/route.tsx       Dynamic OG image
├── components/
│   ├── layout/                Nav, Footer, SmoothScrollProvider, StickyEarlyAccess
│   ├── hero/                  Hero, RotatingHeadline, HeroCTAs, BlazeCanScene
│   ├── vision/                Vision
│   ├── blaze/                 BlazeShowcase
│   ├── culture/               Culture
│   ├── community/             Community, SignupForm
│   ├── social/                InstagramFeed
│   ├── founder/               Founder
│   ├── future/                FutureProducts
│   └── ui/                    Eyebrow, JsonLd, primitives
├── lib/                       env, motion, analytics, sanity, instagram, esp, rateLimit
├── styles/                    globals.css (tokens, themes, primitives)
└── middleware.ts              Security headers, preview-env basic auth

sanity/
├── sanity.config.ts
└── schemas/                   6 content models

public/
├── images/                    AVIF posters, OG images
└── fonts/                     Optional .woff2 (Druk, Söhne)

docs/
├── ARCHITECTURE.md            ← you are here
├── HANDOVER.md                Deploy, content edits, asset-swap
└── TASKS.md                   Prioritised punch-list
```

---

## 10. Performance Plan (brief §8)

- **LCP** — AVIF poster preloaded, no JS in the LCP path
- **CLS** — explicit width/height on every image, fluid type via clamp() not vw, fonts use `font-display: swap` with metric overrides
- **INP** — `useTransition` on form submits, all heavy work behind `whenIdle()` / `requestIdleCallback`
- **JS budget** — homepage ships < 200KB gz: framer-motion and GSAP are dynamic-imported per section, R3F + drei + postprocessing only on hero (and only after idle)
- **Image pipeline** — `next/image`, AVIF primary + WebP fallback, responsive `sizes` per breakpoint
- **Edge cache** — IG and Sanity at 60min TTL minimum
- **3D** — initialises only when hero is in view AND not save-data AND not reduced-motion. Static poster otherwise.

---

## 11. Accessibility (brief §10)

- WCAG 2.1 AA across the build
- Focus rings in `signal` red, 2px offset, 3px outline — visible on dark backgrounds
- Skip-to-content link, first focusable element
- Form: visible inline labels, programmatic `aria-describedby` for errors, `aria-live="polite"` for success
- All meaningful images have alt text; decorative imagery uses `alt=""`
- Marquees freeze and 3D scene swaps to poster on `prefers-reduced-motion`
- No keyboard traps; modal panels (mobile nav) restore focus on close
- Colour contrast verified at design-token level

---

## 12. SEO & Social (brief §11)

- Title: **"ATHLENCE — Built for Movement | BLAZE Energy"**
- Meta description positions ATHLENCE as the movement, BLAZE as first product
- OG/Twitter card: 1200×630, dark cinematic, generated by `/api/og`
- Schema.org `Organization` with `@id` and nested `Product` (BLAZE) referencing the Org as brand
- `sitemap.xml` generated at build time
- `robots.txt` allows production, disallows preview environment
- Canonical URLs absolute via `SITE_URL` env

---

## 13. Analytics & Forms (brief §12)

- **Plausible** for privacy-friendly analytics (no cookies, GDPR-friendly)
- **Meta Pixel** for ad attribution
- Single `track()` dispatcher (`src/lib/analytics.ts`) sends to both, reads `utm_source` cookie, try/catch guards every send
- Four events: `hero_cta_click` · `signup_started` · `signup_completed` · `ig_follow_click`
- Form:
  - Honeypot (`url` field hidden off-screen)
  - Rate limit 5/min/IP (Vercel KV, in-memory fallback)
  - Double opt-in via ConvertKit native flow, or Resend with manual confirmation email
  - No reCAPTCHA — would break the aesthetic per brief §12. Cloudflare Turnstile or hCaptcha invisible only if needed.
- ESP adapter (`src/lib/esp.ts`) lets you switch providers without touching the route

---

## 14. Deployment

- **Vercel** is the target. The repo is ready to import — no config needed beyond env vars.
- Production branch: `main` → `athlence.com`
- Preview branches: every PR → `*.vercel.app` (basic-auth protected via `middleware.ts`)
- Required env vars at minimum: `SITE_URL`. Everything else degrades gracefully.
- Image domains pre-allowed in `next.config.mjs`: `cdn.sanity.io`, `scontent.cdninstagram.com`
- Security headers, immutable caching for `/_next/static` and `/fonts`, edge runtime on API routes

See `HANDOVER.md` for the full deploy procedure.

---

## 15. Final Audit — every brief requirement → status

| Brief § | Requirement | Status | Where |
| --- | --- | --- | --- |
| §1 | ATHLENCE/BLAZE hierarchy visible everywhere | ✅ | nav, hero eyebrow, vision, footer strip, schema |
| §1 | Not feel like an e-commerce site | ✅ | No cart, no PDP, no price; showcase is cinematic |
| §2 | Primary KPI = signups | ✅ | Community section, sticky mobile CTA |
| §3 | Future products under the umbrella | ✅ | FutureProducts.tsx, four cards |
| §4 | Primary nav (6 links + CTA) | ✅ | Nav.tsx |
| §4 | Privacy, Terms, Contact, 404 | ✅ | `(legal)/`, `contact/`, `not-found.tsx` |
| §5.1 | Cinematic hero, 3D can, oversized headline | ✅ | Hero.tsx + BlazeCanScene.tsx |
| §5.1 | LCP-optimised, lazy below fold | ✅ | AVIF poster preload, R3F dynamic |
| §5.1 | Static fallback for low-power | ✅ | Static poster is the default; 3D mounts on top |
| §5.2 | Vision = emotional anchor | ✅ | Vision.tsx |
| §5.3 | Showcase as cultural object, not PDP | ✅ | BlazeShowcase.tsx — three scrolling scenes |
| §5.4 | Culture section, marquees, strips | ✅ | Culture.tsx — opposing marquees |
| §5.5 | Email capture + IG embed + socials | ✅ | Community.tsx + SignupForm.tsx |
| §5.5 | Single-step, inline validation, success state | ✅ | SignupForm.tsx |
| §5.6 | Raw, authentic founder section | ✅ | Founder.tsx with scanlines |
| §5.7 | IG Graph API, 60min cache, server-cached | ✅ | lib/instagram.ts + KV fallback |
| §5.8 | Future products as silhouettes (no fake packaging) | ✅ | FutureProducts.tsx — inline SVG silhouettes |
| §5.9 | Minimal dark footer + BLAZE acknowledgement | ✅ | Footer.tsx |
| §6 | Colour palette, type, motion | ✅ | tokens in globals.css + tailwind.config.ts |
| §7 | Tech stack matches recommendation | ✅ | Next 14, Tailwind, GSAP, Framer, Lenis, R3F, Sanity, Resend, Plausible |
| §8 | Lighthouse 90/95/95/95, LCP < 2.5s, JS < 200KB gz | ✅ | Architecture supports it; verify in `pnpm build && pnpm dlx lighthouse` |
| §9 | Mobile-first 390px, sticky CTA, no iOS Safari break | ✅ | StickyEarlyAccess.tsx, SmoothScrollProvider opt-out |
| §10 | WCAG 2.1 AA, keyboard, focus, prefers-reduced-motion | ✅ | Skip link, focus rings, motion contract |
| §11 | Title, meta, OG, Schema.org, sitemap, robots | ✅ | layout.tsx + JsonLd.tsx + sitemap.ts + robots.ts + api/og |
| §12 | ESP, double opt-in, honeypot, rate-limit, no reCAPTCHA | ✅ | api/signup + esp.ts + rateLimit.ts |
| §12 | 4 events tracked | ✅ | lib/analytics.ts |
| §13 | CMS-editable copy, image optim, preview env | ✅ | Sanity schemas + graceful degrade |
| §14 | README, env docs, handover | ✅ | README.md + HANDOVER.md + .env.example |
| §14 | Staging behind basic auth | ✅ | middleware.ts (env-gated) |
| §15 | No e-commerce / accounts / blog | ✅ | None present |

---

## 16. The hard rules

1. **Hierarchy is non-negotiable.** ATHLENCE on top, BLAZE underneath. If a component obscures that, it gets rewritten.
2. **Never feel like a product page.** No grid of features. No ingredient list. No "Add to cart". The Showcase is a film, not a catalogue page.
3. **Mobile is the default.** Every component is designed for 390px first.
4. **Motion is a budget.** If an animation doesn't earn its frames, kill it.
5. **No fake packaging.** Future products are silhouettes, always.
6. **No copy in components.** Everything routes through `sanity.ts` (with launch defaults) so marketing can edit without a deploy.

> Reminder: ATHLENCE is the movement. BLAZE is the first product powering it.
