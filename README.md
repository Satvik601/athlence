# ATHLENCE

Cinematic Gen Z performance-culture site. Parent brand: **ATHLENCE**. First product: **BLAZE Energy Drink**.

Built with Next.js 14 (App Router), Tailwind, GSAP + Lenis + Framer Motion, React Three Fiber, Sanity, and a graceful-degradation philosophy: every integration is optional, the site looks complete with zero env vars.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

→ http://localhost:3000

## Read first

| Doc | What it's for |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | The complete build spec — every brief requirement mapped to implementation. **Start here.** |
| [`docs/TASKS.md`](docs/TASKS.md) | Prioritised punch-list. Open this in Claude Code. |
| [`docs/HANDOVER.md`](docs/HANDOVER.md) | Deploy, content editing, 3D asset swap, troubleshooting. |
| [`ATHLENCE_Website_Developer_Brief.docx`](./ATHLENCE_Website_Developer_Brief.docx) | The original brief from the founder. Single source of truth. |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Local dev server, port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Run production build locally |
| `pnpm typecheck` | TypeScript without emitting |
| `pnpm lint` | ESLint |
| `pnpm dlx lighthouse http://localhost:3000 --view` | Lighthouse against local |

## Stack

- **Framework** — Next.js 14, App Router, Edge runtime on API routes
- **Styling** — Tailwind CSS + CSS variables for design tokens
- **Motion** — GSAP + ScrollTrigger (scroll sequences), Framer Motion (component-level), Lenis (smooth scroll, opt-out on iOS Safari)
- **3D** — React Three Fiber + drei + postprocessing. Dynamic-imported, mounts only after idle and only when visible.
- **CMS** — Sanity (optional — site renders with launch defaults if no project configured)
- **Email** — ConvertKit or Resend (adapter pattern, switch via env)
- **Analytics** — Plausible + Meta Pixel
- **Hosting** — Vercel (KV for rate-limit + IG cache)

## Project structure

```
src/
├── app/             Next.js App Router (routes, layouts, API)
├── components/      Section components, layout, UI primitives
├── lib/             env, motion, analytics, sanity, instagram, esp, rateLimit
├── styles/          globals.css (tokens, themes, base elements)
└── middleware.ts    Security headers, preview-env basic auth

sanity/
├── sanity.config.ts
└── schemas/         6 content models

public/
├── images/          AVIF posters, OG fallback
└── fonts/           Optional .woff2 (Druk Wide, Söhne)

docs/                ← ARCHITECTURE, TASKS, HANDOVER
```

## The rule

> ATHLENCE is the movement. BLAZE is the first product powering it. Every architectural decision, animation, and line of copy reinforces that hierarchy.

If something in this codebase contradicts that, fix the code.

## License

Proprietary. © ATHLENCE 2026.
