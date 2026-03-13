# Paige's Corner
This repo holds the monolithic version of the Paige’s Corner experience: a Vite/React front end, a Tiny Express API, and a Cloudflare Worker that serves the built site in production.

## Structure
- `public/` — static assets that ship with the front end.
- `src/` — React entry points, pages, components, and shared styles.
- `server/` — Express API plus MongoDB bootstrap logic.
- `database/schema/` — schema artifacts you can keep in sync with your Mongo instance.
- `worker/` — Cloudflare Worker entrypoint referenced by `wrangler.toml`.

## Getting started
1. `npm install` from the repo root (generates `package-lock.json`).
2. `npm start` to run the local Express API on `http://localhost:5000`.
3. `npm run dev` to launch the Vite dev server with `/api` proxied to the local API.
4. `wrangler deploy` once you have a valid Cloudflare account configured and a fresh `dist/` build ready.

## Configuration
- Copy `.env.example` to `.env` and set `MONGO_URI`, `PORT`, and any API secrets you need for the Express backend.
- Worker deploys via the root `wrangler.toml` file and serves the built `dist/` assets with SPA fallback routing; update `compatibility_date` and credentials via the Cloudflare CLI login flow.
- For local Worker-style auth, copy `.dev.vars.example` to `.dev.vars` and set a strong `SESSION_SECRET`.
- For live Cloudflare auth sessions, store `SESSION_SECRET` with `wrangler secret put SESSION_SECRET`.

## Future work
- Hook the Express routes to real models, authentication, and Socket.IO events.
- Swap the current in-memory public content rails for MongoDB + R2 persistence once the family content models are ready.
- Expand the Worker with real APIs or move the richer `worker/src/` implementation into the active deploy path once the portal is ready.

## Current shipped slice
- Public home, blog, gallery, and message board now load from shared API-backed content rails instead of hardcoded page copy.
- Paige and Dad can publish homepage highlights and blog posts from the private dashboard studio.
- Guest message board posts flow into an admin moderation queue before appearing publicly.
- Family memory cards are currently staged through the dashboard using image URLs as a temporary bridge until the full upload pipeline lands.
- The private dashboard now includes live family productivity boards for chores, dinner voting, groceries, requests, schedule snapshots, rewards, and activity feed updates.
- The private dashboard now also includes a family communication hub for private messages, parent announcements, compliments, and a daily digest rail.

## Planning docs
- `docs/CHATGPT_BUILD_PLAYBOOK.md` — repo-native product and engineering rules for AI-assisted development.
- `docs/IMPLEMENTATION_ROADMAP.md` — phased delivery guide for bringing the full Swain Family Portal online without destabilizing production.
