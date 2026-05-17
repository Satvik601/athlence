# CLAUDE.md — Bootstrap for Claude Code

> This file is read automatically by Claude Code when the project opens. It tells Claude what this project is, where the source of truth lives, and the rules to obey.

---

## What this project is

The marketing site for **ATHLENCE** — a Gen Z performance-culture brand — and the launch destination for **BLAZE**, its first product (an energy drink). Built as a single long-form homepage plus four supporting pages.

The site is **not** an e-commerce build. It's a cinematic culture piece that happens to capture early-access signups.

## Read these first, in order

1. **`ATHLENCE_Website_Developer_Brief.docx`** at the repo root — the original brief from the founder. Single source of truth.
2. **`docs/ARCHITECTURE.md`** — every brief requirement mapped to a concrete implementation decision. Has a final audit table at the bottom.
3. **`docs/TASKS.md`** — prioritised punch-list. Pick from here.
4. **`docs/HANDOVER.md`** — deploy, content edits, 3D asset swap, troubleshooting.

If anything in code contradicts these docs, **the docs win**. Fix the code, or update the doc — never let them drift.

---

## The hard rules

These are not stylistic preferences. They're product requirements.

1. **ATHLENCE on top, BLAZE underneath.** The brand hierarchy must be visible in every section: nav, hero eyebrow, vision, footer strip, schema.org. ATHLENCE is the movement. BLAZE is the first product powering it.
2. **Never an e-commerce page.** No grid of features. No ingredient list. No "Add to cart". The BLAZE Showcase is a film, not a catalogue page. If a change makes the site feel like Shopify or a SaaS landing page, the change is wrong.
3. **Mobile-first.** 390px is the baseline. Every component is designed at 390 first, then scales up.
4. **Motion is a budget.** If an animation doesn't justify its frame cost, kill it. All motion respects `prefers-reduced-motion`. iOS Safari opts out of Lenis smooth-scroll to preserve native momentum and pull-to-refresh.
5. **No fake packaging.** Future products are silhouettes only (per brief §5.8). No mockups of products that don't exist yet.
6. **No hard-coded copy in components.** Every editable string flows through `src/lib/sanity.ts`. The Sanity fetchers have hardcoded launch defaults so the site renders without a Sanity project configured.
7. **Graceful degradation.** Zero env vars must still produce a complete-looking site. Integrations unlock real functionality, not visual completeness.

---

## Stack at a glance

- **Next.js 14** App Router, RSC by default, edge runtime on API routes
- **Tailwind** with CSS-variable design tokens (see `src/styles/globals.css`)
- **GSAP + ScrollTrigger** for scroll-tied sequences
- **Framer Motion** for component-level interactions
- **Lenis** for smooth scroll (opted out on iOS Safari)
- **React Three Fiber + drei + postprocessing** for the BLAZE can (dynamic-imported, idle-only mount)
- **Sanity** for CMS (optional)
- **Resend or ConvertKit** for email
- **Plausible + Meta Pixel** for analytics
- **Vercel KV** for rate-limiting and IG fallback cache

## Project structure

```
src/
├── app/             Next.js App Router (routes, layouts, API)
├── components/      Sections (one folder per section), layout, UI primitives
├── lib/             env, motion, analytics, sanity, instagram, esp, rateLimit
├── styles/          globals.css (tokens, themes, base elements, scoped paper theme)
└── middleware.ts    Security headers, preview-env basic auth

sanity/
├── sanity.config.ts
└── schemas/         6 content models (siteSettings, hero, vision, culture, founder, future)

public/              Static assets (see public/README.md)
docs/                ARCHITECTURE, TASKS, HANDOVER
```

## Key behavioural contracts

- `shouldAnimate()` in `src/lib/motion.ts` — the universal gate. Every animation entrypoint calls this first. It checks reduced-motion, Save-Data, iOS Safari, idle status, viewport visibility.
- `track(event, props)` in `src/lib/analytics.ts` — single dispatcher to Plausible + Meta Pixel. The four canonical events are `hero_cta_click`, `signup_started`, `signup_completed`, `ig_follow_click`.
- `getHeroContent()` / `getVisionContent()` / etc in `src/lib/sanity.ts` — all return hardcoded launch defaults when Sanity isn't configured. Never throw.
- `getInstagramFeed(n)` in `src/lib/instagram.ts` — three-tier fallback: live Graph API → KV cache → placeholder tiles.
- `subscribe(email, props)` in `src/lib/esp.ts` — picks ConvertKit or Resend based on which env vars are set. Adapter pattern.
- `src/app/api/signup/route.ts` — Zod parse → honeypot → rate-limit (5/min/IP) → ESP adapter. Edge runtime.

## Performance budget (brief §8)

- LCP < 2.5s on mid-tier Android over 4G
- CLS < 0.1
- INP < 200ms
- JS payload < 200KB gzipped on the homepage
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

If a change pushes any of these out of bounds, the change needs to be rethought.

## How to test changes

```bash
pnpm dev              # local dev, port 3000
pnpm build            # production build (catches more issues than dev)
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint with next/core-web-vitals
pnpm dlx lighthouse http://localhost:3000 --view --form-factor=mobile --throttling-method=simulate
```

## Things to never do

- Add a "shop" or "cart" route. Out of scope per brief §15.
- Add user accounts / login. Out of scope per brief §15.
- Reproduce the brief copy verbatim in components — it goes through Sanity (or the defaults in `src/lib/sanity.ts`).
- Add reCAPTCHA v2 to the signup form. Explicitly forbidden in brief §12 — it kills the aesthetic. Cloudflare Turnstile or hCaptcha invisible only if anti-spam becomes an actual problem.
- Ship the BLAZE can as a finished render in the Future Products section. Silhouettes only.
- Drop in autoplay video with sound on the hero. Brief §5.1 — no autoplay with sound.

## When asked to "build the site"

1. Read `docs/ARCHITECTURE.md` end-to-end.
2. Open `docs/TASKS.md` and work top-down through the P0/P1/P2 list.
3. For each change: read the relevant brief section, read the relevant component, make the change, type-check, lint.
4. After a meaningful chunk, run `pnpm build` to catch regressions early.
5. Update the relevant doc if you've changed a behavioural contract.

---

> Reminder: ATHLENCE is the movement. BLAZE is the first product powering it. Every architectural decision, animation, and line of copy reinforces that hierarchy.
