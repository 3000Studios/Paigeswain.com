# Paigeswain.com

Paige’s Sunflower Sanctuary now has a full production-ready scaffold:

## Architecture

| Layer | Tech |
| --- | --- |
| Public site | Vite + React + Tailwind + Framer Motion |
| API & cron | Cloudflare Worker (TypeScript) with D1, R2, KV, Cron |
| Media | R2 bucket for recipe uploads; static intro video hosted via CDN placeholder |
| Auth | Cookie + KV sessions with roles (Dad, Paige, Jerica, Jadon) |

## Features

1. **Intro + Homepage** – Cinematic video intro, animated hero with rotating quotes, bird/flower motifs, and auto-populated blogs (mental health + healthy food).
2. **Paige Admin** – Kitchen & Shorts editors that write directly to D1; image uploads go to R2 and propagate to the homepage.
3. **Blog engine** – Worker cron seeds weekly mental/healthy posts; frontend fetches `/api/blog?category=…`.
4. **Family portal** – Login, Family Zone with leaderboard, prize wheel eligibility, message board, warp tunnel; Reaction game posts scores to Worker.
5. **Auto infrastructure** – `schema.sql` defines recipes, journals, blog posts, sessions, scores, weekly totals, and message boards; `wrangler.toml` wires D1/KV/R2 + cron schedules.

## Getting started

1. `npm install` from the repo root (has workspace-aware scripts).
2. `npm --prefix frontend run dev` to preview the React site (set `VITE_API_BASE` via `.env.local`).
3. `npm --prefix worker run build` to compile the Worker; use `wrangler` to deploy once `wrangler.toml` fields are updated.

## Deployment

1. **Cloudflare Worker** – configure `wrangler.toml` (`account_id`, D1 & KV IDs, R2 bucket, `R2_PUBLIC_BASE`, cron triggers). Run `npm run worker:deploy`.
2. **Cloudflare Pages** – point to `frontend/` directory, build command `npm run build`, output `dist`. Set `VITE_API_BASE` to your Worker endpoint (e.g., `https://api.paigeswain.com`).
3. **Database migration** – run `npx wrangler d1 execute paigeswain-db --file=schema.sql`.
4. **Sessions & Cron** – ensure KV for `SESSION_KV` and Cron triggers are synchronised with the Worker.

## Notes

- Keep only one branch (main) for production-ready work—do not create feature branches unless directed.
- Real deployment requires Cloudflare credentials; the CLI cannot push automatically from this environment.
- Replace the placeholder intro video with the final cinematic clip when available.
